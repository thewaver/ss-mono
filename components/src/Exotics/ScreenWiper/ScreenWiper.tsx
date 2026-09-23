import { For, Show, createEffect, createMemo, createSignal, on, onCleanup, untrack } from "solid-js";
import { Portal } from "solid-js/web";

import { MathUtils } from "@thewaver/ss-utils";

import { useViewportContext } from "../../Abstracts/Viewport/Viewport.context";
import { access } from "../../Utils/propUtils";
import { SCREEN_WIPER_DEFAULTS } from "./ScreenWiper.const";
import type { ScreenWiperDirection, ScreenWiperProps } from "./ScreenWiper.types";

import * as styles from "./ScreenWiper.css";

const TRANSITION_STAGGER_FACTOR = 0.05;

const getTargetFromDirection = (direction: ScreenWiperDirection) => (direction === "in" ? 1 : 0);

export const ScreenWiper = (props: ScreenWiperProps) => {
    const viewportContext = useViewportContext();

    const [getTarget, setTarget] = createSignal(getTargetFromDirection(access(props.initialWipeDirection)));
    const [getHasFinished, setHasFinished] = createSignal(true);

    const getCellSize = createMemo(() => access(props.cellSize) ?? SCREEN_WIPER_DEFAULTS.cellSize);

    const getTransitionDurationMs = createMemo(
        () => access(props.transitionDurationMs) ?? SCREEN_WIPER_DEFAULTS.transitionDurationMs,
    );

    const getCols = createMemo(() => {
        const count = Math.ceil(viewportContext.getSize().width / getCellSize());

        return {
            odd: Array.from({ length: count }, (_, index) => index),
            even: Array.from({ length: count + 1 }, (_, index) => index),
        };
    });

    const getRows = createMemo(() =>
        Array.from({ length: Math.ceil((viewportContext.getSize().height * 2) / getCellSize()) + 1 }, (_, i) => i),
    );

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();

    let targetDeferralTimeout: ReturnType<typeof setTimeout> | undefined;

    onCleanup(() => {
        clearTimeout(targetDeferralTimeout);
    });

    const getShape = createMemo(() => access(props.shape) ?? SCREEN_WIPER_DEFAULTS.shape);

    createEffect(() => {
        const direction = access(props.wipeDirection);

        untrack(() => {
            const newTarget = getTargetFromDirection(direction);

            if (newTarget === getTarget()) return;

            setHasFinished(false);
            clearTimeout(targetDeferralTimeout);
            targetDeferralTimeout = setTimeout(() => {
                setTarget(newTarget);
            }, 0);
        });
    });

    createEffect(
        on(
            getTarget,
            () => {
                const rootRef = getRootRef();

                if (!rootRef) return;

                const direction = access(props.wipeDirection);

                void rootRef.offsetHeight;

                const animations = rootRef.getAnimations({ subtree: true });

                let isCanceled = false;

                onCleanup(() => {
                    isCanceled = true;
                });

                void Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
                    if (isCanceled) return;

                    setHasFinished(true);
                    props.onTransitionEnd?.(direction);
                });
            },
            { defer: true },
        ),
    );

    return (
        <Show when={getTarget() === 1 || !getHasFinished()}>
            <Portal mount={viewportContext.getPortalRef()}>
                <div ref={setRootRef} class={styles.screenWiperRoot}>
                    <For each={getRows()}>
                        {(row) => {
                            const isRowEven = MathUtils.isEven(row);
                            const getRowCols = () => (isRowEven ? getCols().even : getCols().odd);

                            return (
                                <div
                                    class={styles.screenWiperRow}
                                    style={{
                                        transform: `translate(${isRowEven ? getCellSize() * -0.5 : 0}px, ${(row + 1) * getCellSize() * -0.5}px)`,
                                    }}
                                >
                                    <For each={getRowCols()}>
                                        {(col) => (
                                            <div
                                                class={styles.screenWiperCellShapes[getShape()]}
                                                aria-hidden="true"
                                                style={{
                                                    width: `${getCellSize()}px`,
                                                    height: `${getCellSize()}px`,
                                                    transition: `transform ${getTransitionDurationMs()}ms ease ${getTransitionDurationMs() * TRANSITION_STAGGER_FACTOR * (col + row)}ms`,
                                                    transform: `scale(${getTarget()})`,
                                                }}
                                            />
                                        )}
                                    </For>
                                </div>
                            );
                        }}
                    </For>
                </div>
            </Portal>
        </Show>
    );
};
