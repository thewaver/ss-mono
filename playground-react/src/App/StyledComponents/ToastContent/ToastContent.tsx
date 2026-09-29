import type { ToastState, ToastsDir } from "@thewaver/ss-components-react";
import { Button } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ToastContent/ToastContent.css";

import { PageLayer } from "../../PageComponents/Layer/Layer";
import { PageButtonContent } from "../ButtonContent/ButtonContent";
import type { ToastContentProps } from "./ToastContent.types";

const POSITION_OFFSET = 1;
const PILE_PEEK = 14;
const PILE_SCALE_STEP = 0.04;
const PILE_MIN_SCALE = 0.8;
const PERCENT = 100;

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

const computeSwipeShift = (state: ToastState) => {
    const direction = state.swipeDirection;

    if (direction === undefined || state.swipeOffsetRatio === 0) return undefined;

    const distance = state.swipeOffsetRatio * PERCENT * (direction === "left" || direction === "up" ? -1 : 1);

    return direction === "left" || direction === "right" ? `translateX(${distance}%)` : `translateY(${distance}%)`;
};

const computeTransform = (props: ToastContentProps) => {
    const pile = props.stacking === "pile" ? computePileShift(props.state, props.dir, props.gap) : undefined;
    const transforms = [
        computeSwipeShift(props.state),
        pile && `translate${pile.isColumn ? "Y" : "X"}(${pile.shift}px) scale(${pile.scale})`,
    ].filter(Boolean);

    return transforms.length > 0 ? transforms.join(" ") : undefined;
};

export const PageToastContent = (props: ToastContentProps) => {
    return (
        <PageLayer level={2}>
            <div
                style={{
                    transition: `transform ${props.state.isSwiping ? 0 : props.transitionDurationMs}ms`,
                    transform: computeTransform(props),
                    transformOrigin: "center",
                }}
            >
                <div
                    className={[
                        styles.toastCard,
                        styles.toastKindVariants[props.toast.value.kind],
                        props.visibilityTarget === 1
                            ? styles.toastAnimationOn
                            : styles.toastAnimationOffVariants[props.animation],
                    ].join(" ")}
                    style={{
                        transition: `transform ${props.transitionDurationMs}ms, opacity ${props.transitionDurationMs}ms`,
                    }}
                >
                    <div className={styles.toastBody}>
                        <div className={styles.toastMessage}>{props.toast.value.message}</div>

                        <div className={styles.toastMeta} aria-hidden="true">
                            {props.state.index + POSITION_OFFSET} of {props.state.count}
                            {props.toast.durationMs === undefined && " · stays until dismissed"}
                            {props.state.isPaused && " · paused"}
                        </div>
                    </div>

                    <Button
                        renderContent={(flags) => <PageButtonContent flags={flags}>Close</PageButtonContent>}
                        onClick={props.onDismiss}
                    />

                    {props.toast.durationMs ? (
                        <div
                            className={styles.toastCountdown}
                            data-countdown=""
                            style={{
                                animationDuration: `${props.toast.durationMs}ms`,
                                animationPlayState: props.state.isPaused ? "paused" : "running",
                            }}
                        />
                    ) : null}
                </div>
            </div>
        </PageLayer>
    );
};
