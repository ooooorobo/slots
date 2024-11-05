import { PropsWithChildren, ReactNode } from "react";
import { createSlot } from "@/utils/slot/createSlot";

const CardHeader = ({ children }: PropsWithChildren) => (
  <div style={{ fontSize: 40 }}>{children}</div>
);

const { SlotProvider, Slot, useSlots } = createSlot({
  header: CardHeader,
  rightTop: ({ children }: PropsWithChildren) => (
    <div style={{ position: "absolute", top: 0, right: 0 }}>{children}</div>
  ),
});

const Card = ({ children }: { children: ReactNode }) => {
  const slots = useSlots(children);

  return (
    <SlotProvider>
      <div className="card" style={{ position: "relative" }}>
        {slots.header}
        {slots.rightTop}
      </div>
    </SlotProvider>
  );
};

const CardNamespace = Object.assign(Card, {
  Slot,
});

export { CardNamespace as Card };
