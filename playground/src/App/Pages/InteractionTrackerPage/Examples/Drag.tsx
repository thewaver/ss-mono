import { createSignal } from "solid-js";

import { InteractionTracker } from "@thewaver/ss-components";

import type { InteractionDragExampleProps } from "../InteractionTrackerPage.types";

import * as styles from "../InteractionTrackerPage.css";

const CENTRE_RATIO = 0.5;
const PERCENT = 100;

type Props = InteractionDragExampleProps;

export const DragExample = (props: Props) => {
    const [getRef, setRef] = createSignal<HTMLElement>();
    const [getRatio, setRatio] = createSignal({ x: CENTRE_RATIO, y: CENTRE_RATIO });

    InteractionTracker.trackDrag(getRef, props.isDisabled, {
        onDrag: (ratio) => {
            setRatio(ratio);
            props.onDrag(ratio);
        },
        onDragEnd: props.onDragEnd,
    });

    return (
        <div ref={setRef} class={styles.dragPad}>
            <div
                class={styles.dragMarker}
                style={{ left: `${getRatio().x * PERCENT}%`, top: `${getRatio().y * PERCENT}%` }}
            />
        </div>
    );
};
