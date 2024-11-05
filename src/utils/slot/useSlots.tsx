// SlotConfig 타입 정의
import { Children, createContext, ElementType, isValidElement, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

type SlotConfig = { [key: string]: ElementType | string | Array<ElementType | string> | null };

type SlotElements<T extends SlotConfig> = {
  [K in keyof T]: ReactNode[];
};

// SlotContext를 제네릭하게 만들고 초기값으로 null 사용
const SlotContext = createContext<SlotElements<any> | null>(null);

// Slot 컴포넌트, name을 useSlots의 slotConfig에서 추론한 키만 받도록 설정
type SlotProps = {
  name: string;
  children: ReactNode;
};

const Slot = ({ name, children }: SlotProps) => {
  const slots = useContext(SlotContext);
  if (!slots) {
    throw new Error('Slot must be used within a SlotContext provider');
  }

  useEffect(() => {
    // 타입 단언 추가하여 slots[name]이 ReactNode[]로 간주되도록 설정
    (slots[name as keyof typeof slots] as ReactNode[]).push(children);
  }, [name, children, slots]);

  return null;
};

function useSlots<T extends SlotConfig>(children: ReactNode, slotConfig: T) {
  const createSlotMap = useCallback(() => {
    const initialSlots: Partial<SlotElements<T>> = {};
    Object.keys(slotConfig).forEach((key) => {
      initialSlots[key as keyof T] = [];
    });
    return initialSlots as SlotElements<T>;
  }, [slotConfig]);

  const [slots, setSlots] = useState<SlotElements<T>>(createSlotMap);

  const setSlot = (name: keyof T, content: ReactNode) => {
    setSlots((prevSlots) => ({
      ...prevSlots,
      [name]: content ? [content] : [],
    }));
  };

  useEffect(() => {
    const newSlots = createSlotMap();
    Children.forEach(children, (child) => {
      if (!isValidElement(child)) return;

      let slotFound = false;

      for (const [slotName, slotType] of Object.entries(slotConfig)) {
        if (slotType === null || (Array.isArray(slotType) && slotType.includes(child.type)) || child.type === slotType || child.type === slotName) {
          newSlots[slotName as keyof T].push(child);
          slotFound = true;
          break;
        }
      }

      if (!slotFound && slotConfig.additionalContent !== undefined) {
        newSlots.additionalContent.push(child);
      }
    });

    setSlots(newSlots);
  }, [children, createSlotMap, slotConfig]);

  return [slots, setSlot];
}

export { useSlots, SlotContext, Slot };
