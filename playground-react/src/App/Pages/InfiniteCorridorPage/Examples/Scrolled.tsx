import { useMemo, useRef, useState } from "react";

import { ElementObserverReactUtils, InfiniteCorridor } from "@thewaver/ss-components-react";
import { InfiniteCorridorKnobs } from "@thewaver/ss-playground/App/Knobs/InfiniteCorridors.const";
import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.css";

import { PageExampleKnobs } from "../../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageNumberField } from "../../../PageComponents/Field/Field";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { useSpinDegrees } from "../InfiniteCorridorPage.utils";
import type { InfiniteCorridorExampleProps } from "../InfiniteCorridorPageReact.types";
import { Room } from "./Room";

type Props = InfiniteCorridorExampleProps;

export const ScrolledExample = (props: Props) => {
    const boxRef = useRef<HTMLDivElement | null>(null);
    const runwayRef = useRef<HTMLDivElement | null>(null);
    const [scrollLength, setScrollLength] = useState(InfiniteCorridorKnobs.STARTING_SCROLL_LENGTH);

    const progress = ElementObserverReactUtils.useScrollContainerProgress(runwayRef, boxRef);

    const scrollTo = (value: number) => {
        const box = boxRef.current;

        if (box) box.scrollTop = value * (box.scrollHeight - box.clientHeight);
    };

    const spinDegrees = useSpinDegrees(props.spinDegreesPerSecond, true);

    const layout = useMemo(() => props.toLayout(spinDegrees), [props.toLayout, spinDegrees]);

    return (
        <>
            <div ref={boxRef} className={styles.scrollBox}>
                <div className={styles.scrollPinned}>
                    <InfiniteCorridor
                        items={props.items}
                        layout={layout}
                        progress={[progress, scrollTo]}
                        glideDurationMs={props.glideDurationMs}
                        ariaLabel={"Scrolled corridor"}
                        renderItem={(name, state) => <Room name={name} state={state} />}
                    />
                </div>

                <div
                    ref={runwayRef}
                    className={styles.scrollRunway}
                    style={{ height: `${scrollLength * styles.CORRIDOR_HEIGHT}px` }}
                />
            </div>

            <PageExampleKnobs>
                <PageProp
                    itemKey={"scrollLength"}
                    label={"Scroll length"}
                    hint={
                        "How far the box scrolls to walk one lap of the corridor, in heights of the box. Longer is slower."
                    }
                >
                    <PageNumberField
                        value={scrollLength}
                        min={InfiniteCorridorKnobs.MIN_SCROLL_LENGTH}
                        max={InfiniteCorridorKnobs.MAX_SCROLL_LENGTH}
                        step={InfiniteCorridorKnobs.SCROLL_LENGTH_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Scroll length in box heights"}
                        onInput={setScrollLength}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};
