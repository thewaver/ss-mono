import { createMemo, createSignal } from "solid-js";

import { ElementObserverSolidUtils, InfiniteCorridor, access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.css";

import { createSpinDegrees } from "../InfiniteCorridorPage.utils";
import type { InfiniteCorridorScrolledExampleProps } from "../InfiniteCorridorPageSolid.types";
import { Room } from "./Room";

type Props = InfiniteCorridorScrolledExampleProps;

export const ScrolledExample = (props: Props) => {
    const [getBoxRef, setBoxRef] = createSignal<HTMLElement>();
    const [getRunwayRef, setRunwayRef] = createSignal<HTMLElement>();

    const getProgress = ElementObserverSolidUtils.createScrollContainerProgressObserver(getRunwayRef, getBoxRef);

    const scrollTo = (progress: number) => {
        const box = getBoxRef();

        if (box) box.scrollTop = progress * (box.scrollHeight - box.clientHeight);
    };

    const getSpinDegrees = createSpinDegrees(
        () => access(props.spinDegreesPerSecond),
        () => true,
    );

    const getLayout = createMemo(() => props.toLayout(getSpinDegrees()));

    return (
        <div ref={setBoxRef} class={styles.scrollBox}>
            <div class={styles.scrollPinned}>
                <InfiniteCorridor
                    items={props.items}
                    layout={getLayout()}
                    progress={[getProgress, scrollTo]}
                    glideDurationMs={props.glideDurationMs}
                    ariaLabel={"Scrolled corridor"}
                    renderItem={(getName, getState) => <Room name={getName} state={getState} />}
                />
            </div>

            <div
                ref={setRunwayRef}
                class={styles.scrollRunway}
                style={{ height: `${access(props.scrollLength) * styles.CORRIDOR_HEIGHT}px` }}
            />
        </div>
    );
};
