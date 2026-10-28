import { useMemo, useRef } from "react";

import { ElementObserverReactUtils, InfiniteCorridor } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.css";

import { useSpinDegrees } from "../InfiniteCorridorPage.utils";
import type { InfiniteCorridorScrolledExampleProps } from "../InfiniteCorridorPageReact.types";
import { Room } from "./Room";

type Props = InfiniteCorridorScrolledExampleProps;

export const ScrolledExample = (props: Props) => {
    const boxRef = useRef<HTMLDivElement | null>(null);
    const runwayRef = useRef<HTMLDivElement | null>(null);

    const progress = ElementObserverReactUtils.useScrollContainerProgress(runwayRef, boxRef);

    const scrollTo = (value: number) => {
        const box = boxRef.current;

        if (box) box.scrollTop = value * (box.scrollHeight - box.clientHeight);
    };

    const spinDegrees = useSpinDegrees(props.spinDegreesPerSecond, true);

    const layout = useMemo(() => props.toLayout(spinDegrees), [props.toLayout, spinDegrees]);

    return (
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
                style={{ height: `${props.scrollLength * styles.CORRIDOR_HEIGHT}px` }}
            />
        </div>
    );
};
