import { Card } from "@/components/Card";
import { useState } from "react";
import { Slot } from "@/utils/slot/useSlots";

export default function Home() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount((prev) => prev + 1)}>{count}</button>
      <Card>
        <Slot name={"header"}>head</Slot>
        <Slot name={"rightTop"}>rightTop</Slot>
      </Card>
    </>
  );
}
