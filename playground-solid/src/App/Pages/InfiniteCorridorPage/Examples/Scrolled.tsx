import { createSignal } from "solid-js";

import { ElementObserverSolidUtils, InfiniteCorridor } from "@thewaver/ss-components-solid";
import { InfiniteCorridorKnobs } from "@thewaver/ss-playground/App/Knobs/InfiniteCorridors.const";
import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.css";

import { PageExampleKnobs } from "../../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageNumberField } from "../../../PageComponents/Field/Field";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import type { InfiniteCorridorExampleProps } from "../InfiniteCorridorPageSolid.types";
import { Room } from "./Room";

type Props = InfiniteCorridorExampleProps;

export const ScrolledExample = (props: Props) => {
    const [getBoxRef, setBoxRef] = createSignal<HTMLElement>();
    const [getRunwayRef, setRunwayRef] = createSignal<HTMLElement>();
    const [getScrollLength, setScrollLength] = createSignal(InfiniteCorridorKnobs.STARTING_SCROLL_LENGTH);

    const getProgress = ElementObserverSolidUtils.createScrollContainerProgressObserver(getRunwayRef, getBoxRef);

    const scrollTo = (progress: number) => {
        const box = getBoxRef();

        if (box) box.scrollTop = progress * (box.scrollHeight - box.clientHeight);
    };

    return (
        <>
            <div ref={setBoxRef} class={styles.scrollBox}>
                <div class={styles.scrollPinned}>
                    <InfiniteCorridor
                        items={props.items}
                        layout={props.layout}
                        progress={[getProgress, scrollTo]}
                        glideDurationMs={props.glideDurationMs}
                        ariaLabel={"Scrolled corridor"}
                        renderItem={(getName, getState) => <Room name={getName} state={getState} />}
                    />
                </div>

                <div
                    ref={setRunwayRef}
                    class={styles.scrollRunway}
                    style={{ height: `${getScrollLength() * styles.CORRIDOR_HEIGHT}px` }}
                />
            </div>

            <PageExampleKnobs>
                <PageProp
                    key={"scrollLength"}
                    label={"Scroll length"}
                    hint={
                        "How far the box scrolls to walk one lap of the corridor, in heights of the box. Longer is slower."
                    }
                >
                    <PageNumberField
                        value={getScrollLength}
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
