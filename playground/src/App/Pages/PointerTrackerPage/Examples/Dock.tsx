import { For, createMemo, createSignal } from "solid-js";

import { MediaQueryMonitor, PointerTracker } from "@thewaver/ss-components";
import { MathUtils } from "@thewaver/ss-utils";

import * as styles from "../PointerTrackerPage.css";

const LABELS = ["A", "B", "C", "D", "E", "F", "G"];
const ITEM_SIZE = 24;
const ITEM_GAP = 6;
const MAX_GROWTH = 1.1;
const REACH_PX = 68;
const LABEL_RATIO = 0.4;
const RESTING_SCALE = 1;
const HALF = 0.5;

const ROW_WIDTH = LABELS.length * ITEM_SIZE + (LABELS.length - 1) * ITEM_GAP;
const ROW_HEIGHT = ITEM_SIZE * (RESTING_SCALE + MAX_GROWTH);

export const DockExample = () => {
    const [getRef, setRef] = createSignal<HTMLElement>();

    const { getReading, getIsPointerPresent } = PointerTracker.create(getRef);

    const getPrefersReducedMotion = MediaQueryMonitor.createReducedMotion();

    const getScales = createMemo(() => {
        if (getPrefersReducedMotion() || !getIsPointerPresent()) return LABELS.map(() => RESTING_SCALE);

        const pointerX = getReading().boxRatio.x * ROW_WIDTH;

        return LABELS.map((_unused, index) => {
            const restingCentre = index * (ITEM_SIZE + ITEM_GAP) + ITEM_SIZE * HALF;
            const nearness = MathUtils.clamp01(Math.abs(pointerX - restingCentre) / REACH_PX);

            return RESTING_SCALE + MAX_GROWTH * (1 - nearness * nearness);
        });
    });

    const getPlacements = createMemo(() => {
        const sizes = getScales().map((scale) => ITEM_SIZE * scale);
        const spread = sizes.reduce((total, size) => total + size, 0) + ITEM_GAP * (LABELS.length - 1);

        let left = (ROW_WIDTH - spread) * HALF;

        return sizes.map((size) => {
            const placement = { left, size };

            left += size + ITEM_GAP;

            return placement;
        });
    });

    return (
        <div class={styles.dockStage}>
            <div ref={setRef} class={styles.dockRow} style={{ width: `${ROW_WIDTH}px`, height: `${ROW_HEIGHT}px` }}>
                <For each={LABELS}>
                    {(label, getIndex) => {
                        const getPlacement = () => getPlacements()[getIndex()];

                        return (
                            <div
                                class={styles.dockItem}
                                style={{
                                    "left": `${getPlacement().left}px`,
                                    "width": `${getPlacement().size}px`,
                                    "height": `${getPlacement().size}px`,
                                    "font-size": `${getPlacement().size * LABEL_RATIO}px`,
                                }}
                            >
                                {label}
                            </div>
                        );
                    }}
                </For>
            </div>
        </div>
    );
};
