생각중...

필요한 거

- Slot에 키값 설정해 줄 수 있다
  - 이 키값은 type-safe해서 컴포넌트 안에 지정된 값만 사용할 수 있음
  - 컴포넌트 안에서 이 키값을 사용해서 각 Slot이 어디에 렌더링될지 정할 수 있음

## 1

Slot 컴포넌트를 사용하는 방법. Slot 컴포넌트의 name prop에 slotConfig 키값을 적으면, 키에 해당되는 값을 Slot 컴포넌트 자리에 치환해서 보여줌

```tsx
// Card.tsx
const slotConfig = {
    header: CardHeader,
    rightTop: CardRightTop,
}

export const Card = ({ children }: Props) => {
    const slots = useSlots(slotConfig);
    return <div>
        {slots.header}
        <hr />
        {slots.rightTop}
    </div>
};

// page.tsx
export const Page = () => {
    return <div>
        <Card>
            <Slot name={'header'} >카드 헤더</Slot>
            <Slot name={'rightTop'}>
                <Icon name={'heart'} />
            </Slot>
        </Card>
    </div>
}
```

이러면 실제 페이지는 이렇게 치환됨

```tsx
<div>
    <CardHeader>
        카드 헤더
    </CardHeader>
    <hr />
    <CardRightTop>
        <Icon name={'heart'} />
    </CardRightTop>
</div>
```

만약에 name이 header나 rightTop인 Slot을 하나도 넘기지 않았다면, CardHeader나 CardRightTop은 아예 렌더링되지 않음. Card 컴포넌트 안에서 조건부 렌더링을 하지 않아도 된다는 장점. 근데 각 슬롯의 레이아웃이 SlotConfig로 빠지게 되니 코드 흐름이 왔다갔다하게 되는 단점.

## 2

slotConfig에 받은 element를 슬롯 체크용으로 사용하는 버전

```tsx
const slotConfig = {
    header: CardHeader,
    rightTop: CardRightTop,
}

export const Card = ({ children }: Props) => {
    const slots = useSlots(slotConfig);
    return <div>
        {slots.header && ( 
            <div className={'header'}>
                {slots.header}
            </div>
        )}
        {slots.rightTop && (
            <div className={'rightTop'}>
                {slots.rightTop}
            </div>
        )}
    </div>
};

// page.tsx
export const Page = () => {
    return <div>
        <Card>
            <CardHeader>카드 헤더</CardHeader>
            <CardRightTop>
                <Icon name={'heart'} />
            </CardRightTop>
        </Card>
    </div>
}
```

useSlots 내부적으로 어느 슬롯에 컴포넌트를 넣을지 판단할 때 element의 타입을 체크한다. 즉, Card의 children 중에 CardHeader 컴포넌트는 slots.header 자리에 들어가게 됨

이거 특징(장점?)은 CompoundPattern처럼 `Card.CardHeader = CardHeader` 같은 할당을 하지 않아도 된다는 점, 각 컴포넌트의 자리를 지정해 줄 수 있다는 점

## 3

renderProps 방식으로 할 수도 있음

```tsx
// page.tsx
import {ReactElement} from "react";

export const Page = () => {
    return <div>
        <Card>
            {({Slot}) => (
                <>
                    <Slot name={'header'}>카드 헤더</Slot>
                    <Slot name={'rightTop'}>
                        <Icon name={'heart'}/>
                    </Slot>
                </>
            )}
        </Card>
    </div>
}

// card.tsx
type CardProps = {
    children: (props: { Slot: ReactElement<{ name: keyof typeof slotConfig }> }) => ReactNode;
}
```

1번 방식이랑 비슷한데, 이렇게 하면 좋은 점은 Context나 Compound 방식 없이도 Slot을 type-safe하게 사용할 수 있음 (아마도)
