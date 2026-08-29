import { Show, createMemo } from "solid-js";

import type { ToastState, ToastsDir } from "@thewaver/ss-components";
import { Button, access } from "@thewaver/ss-components";

import { PageButtonContent } from "../ButtonContent/ButtonContent";
import type { ToastContentProps } from "./ToastContent.types";

import * as styles from "./ToastContent.css";

const POSITION_OFFSET = 1;
const PILE_PEEK = 14;
const PILE_SCALE_STEP = 0.04;
const PILE_MIN_SCALE = 0.8;

const computePileShift = (state: ToastState, dir: ToastsDir, gap: number) => {
    const isColumn = dir === "column" || dir === "column-reverse";
    const sign = dir === "column-reverse" || dir === "row-reverse" ? -1 : 1;
    const extents = state.sizes.map((size) => (isColumn ? size.height : size.width));

    const computeFlowStart = (index: number) =>
        extents.slice(0, index).reduce((start, extent) => start + extent + gap, 0);

    const depth = state.count - POSITION_OFFSET - state.index;

    return {
        isColumn,
        shift:
            sign *
            (computeFlowStart(state.count - POSITION_OFFSET) - computeFlowStart(state.index) - PILE_PEEK * depth),
        scale: Math.max(1 - PILE_SCALE_STEP * depth, PILE_MIN_SCALE),
    };
};

export const PageToastContent = (props: ToastContentProps) => {
    const getPile = createMemo(() =>
        access(props.stacking) === "pile"
            ? computePileShift(access(props.state), access(props.dir), access(props.gap))
            : undefined,
    );

    return (
        <div
            style={{
                "transition": `transform ${access(props.transitionDurationMs)}ms`,
                "transform": getPile()
                    ? `translate${getPile()!.isColumn ? "Y" : "X"}(${getPile()!.shift}px) scale(${getPile()!.scale})`
                    : undefined,
                "transform-origin": "center",
            }}
        >
            <div
                class={[
                    styles.toastCard,
                    styles.toastKindVariants[access(props.toast).value.kind],
                    access(props.visibilityTarget) === 1
                        ? styles.toastAnimationOn
                        : styles.toastAnimationOffVariants[access(props.animation)],
                ].join(" ")}
                style={{
                    transition: `transform ${access(props.transitionDurationMs)}ms, opacity ${access(props.transitionDurationMs)}ms`,
                }}
            >
                <div class={styles.toastBody}>
                    <div class={styles.toastMessage}>{access(props.toast).value.message}</div>

                    <div class={styles.toastMeta} aria-hidden="true">
                        {access(props.state).index + POSITION_OFFSET} of {access(props.state).count}
                        {access(props.toast).durationMs === undefined && " · stays until dismissed"}
                        {access(props.state).isPaused && " · paused"}
                    </div>
                </div>

                <Button
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Close</PageButtonContent>}
                    onClick={props.onDismiss}
                />

                <Show when={access(props.toast).durationMs}>
                    {(getDurationMs) => (
                        <div
                            class={styles.toastCountdown}
                            data-countdown
                            style={{
                                "animation-duration": `${getDurationMs()}ms`,
                                "animation-play-state": access(props.state).isPaused ? "paused" : "running",
                            }}
                        />
                    )}
                </Show>
            </div>
        </div>
    );
};
