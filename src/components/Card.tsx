import { PropsWithChildren, ReactNode } from "react";
import { SlotContext, useSlots } from "@/utils/slot/useSlots";

const CardHeader = ({ children }: PropsWithChildren) => (
  <div style={{ background: "white" }}>{children}</div>
);
const CardRightTop = ({ children }: PropsWithChildren) => (
  <div style={{ position: "absolute", top: 0, right: 0 }}>{children}</div>
);

const config = {
  header: CardHeader,
  rightTop: CardRightTop,
  description: "p",
  actions: ["button", "a"],
  additionalContent: null,
};

export const Card = ({ children }: { children: ReactNode }) => {
  const [slots] = useSlots(children, config);

  return (
    <SlotContext.Provider value={slots}>
      <div style={{ position: "relative" }}>
        <div>{slots.header}</div>
        {slots.rightTop}
        <div className="card-description">{slots.description}</div>
        <div>{slots.additionalContent}</div>
        <div className="card-actions">{slots.actions}</div>
      </div>
    </SlotContext.Provider>
  );
};
