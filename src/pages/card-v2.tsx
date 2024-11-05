import { Card } from "@/components/Cardv2";
import { useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount((prev) => prev + 1)}>{count}</button>
      <Card>
        <Card.Slot name={"header"}>
          <p>hi</p>
        </Card.Slot>
        <Card.Slot name={"rightTop"}>
          <p>righttop</p>
        </Card.Slot>
      </Card>
    </>
  );
}
