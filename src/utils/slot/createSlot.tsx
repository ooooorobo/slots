import {
  Children,
  createContext,
  createElement,
  ElementType,
  isValidElement,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useMemo,
  useRef,
} from 'react';

type SlotConfig = { [key: string]: ElementType | string | Array<ReactElement | string> | null };

type SlotElements<T extends SlotConfig> = {
  [K in keyof T]: ReactNode[];
};

export const createSlot = <T extends SlotConfig>(slotConfig: T) => {
  const SlotContext = createContext<SlotConfig | null>(null);
  const SlotProvider = ({ children }: PropsWithChildren) => {
    return <SlotContext.Provider value={slotConfig}>{children}</SlotContext.Provider>;
  };

  const Slot = ({ name, children }: PropsWithChildren<{ name: keyof typeof slotConfig }>) => {
    const container = slotConfig[name];

    if (!container) return <>{children}</>;
    return createElement(container, {}, children);
  };

  const useSlots = (children: ReactNode): SlotElements<T> => {
    // hot reload 발생하면 createSlot이 다시 호출되면서 Slot이 다시 생성됨
    // 따라서 hot reload 이후 child.type !== Slot <== 이렇게 비교하면 false가 됨
    const slotRef = useRef(Slot);

    return useMemo(() => {
      const configKeys = Array.from(Object.keys(slotConfig)) as (keyof typeof slotConfig)[];

      const slots = configKeys.reduce((acc, key) => {
        acc[key] = null;
        return acc;
      }, {}) as SlotElements<typeof slotConfig>;

      const rest = [] as ReactNode[];

      Children.forEach(children, (child) => {
        if (!isValidElement(child) || child.type !== slotRef.current) {
          rest.push(child);
          return;
        }

        const name = child.props.name;
        if (!configKeys.includes(name)) {
          rest.push(child);
          return;
        }

        if (slots[name]) {
          console.error(slots, `${name} 슬롯이 중복으로 사용되었습니다.`);
        }

        slots[name] = child;
      });

      if (rest.length) {
        console.log(`등록되지 않은 키로 추가된 슬롯이 있습니다`, rest, slotConfig);
      }

      return slots;
    }, [children]);
  };

  return { SlotProvider, Slot, useSlots };
};

export const withSlot = <T extends PropsWithChildren, K extends SlotConfig>(
  slotConfig: K,
  view: (props: T & { slots: SlotElements<K> }) => JSX.Element,
) => {
  const { SlotProvider, Slot, useSlots } = createSlot(slotConfig);

  const WithSlot = (props: T) => {
    const slots = useSlots(props.children);
    return <SlotProvider>{view({ ...props, slots, Slot })}</SlotProvider>;
  };

  WithSlot.Slot = Slot;

  return WithSlot;
};
