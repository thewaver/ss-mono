import { For, Show, createMemo, createSignal } from "solid-js";

import { Button, Corners, ElementObserverUtils, MediaQueryMonitorUtils, access } from "@thewaver/ss-components";
import type { Rect } from "@thewaver/ss-utils";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { CornersExampleProps } from "../CornersPage.types";

import * as styles from "../CornersPage.css";

type Props = CornersExampleProps;

const TRANSPARENT = "transparent";
const BOX_PADDING_PX = 8;
const CONTROLS = ["Open", "Save", "Share", "Delete"];

export const FocusFollowExample = (props: Props) => {
    const getPrefersReducedMotion = MediaQueryMonitorUtils.createReducedMotion();

    const [getStageRef, setStageRef] = createSignal<HTMLElement>();
    const [getHovered, setHovered] = createSignal<HTMLElement>();
    const [getFocused, setFocused] = createSignal<HTMLElement>();
    const [getStageRect, setStageRect] = createSignal<Rect>();
    const [getTargetRect, setTargetRect] = createSignal<Rect>();

    const getTarget = createMemo(() => getHovered() ?? getFocused());

    ElementObserverUtils.createViewportRectObserver(getStageRef, () => true, { setElementRect: setStageRect });
    ElementObserverUtils.createViewportRectObserver(getTarget, () => getTarget() !== undefined, {
        setElementRect: setTargetRect,
        getPadding: () => BOX_PADDING_PX,
    });

    const getBoxRect = createMemo<Rect | undefined>((previous) => {
        const stageRect = getStageRect();
        const targetRect = getTargetRect();

        if (!stageRect || !targetRect || !getTarget()) return previous;

        return {
            x: targetRect.x - stageRect.x,
            y: targetRect.y - stageRect.y,
            width: targetRect.width,
            height: targetRect.height,
        };
    });

    const getGlideMs = () => (getPrefersReducedMotion() ? 0 : access(props.transitionDurationMs));

    return (
        <div ref={setStageRef} class={styles.followStage}>
            <For each={CONTROLS}>
                {(label) => (
                    <div
                        class={styles.followSlot}
                        onPointerEnter={(e) => setHovered(e.currentTarget)}
                        onPointerLeave={() => setHovered(undefined)}
                        onFocusIn={(e) => {
                            if ((e.target as HTMLElement).matches(":focus-visible")) setFocused(e.currentTarget);
                        }}
                        onFocusOut={() => setFocused(undefined)}
                    >
                        <Button
                            renderContent={(getFlags) => (
                                <PageButtonContent flags={getFlags}>{label}</PageButtonContent>
                            )}
                        />
                    </div>
                )}
            </For>

            <Show when={getBoxRect()}>
                {(getRect) => (
                    <div
                        class={styles.followBox}
                        style={{
                            "left": `${getRect().x}px`,
                            "top": `${getRect().y}px`,
                            "width": `${getRect().width}px`,
                            "height": `${getRect().height}px`,
                            "transition-duration": `${getGlideMs()}ms`,
                        }}
                    >
                        <Corners
                            color={() => (getTarget() ? access(props.color) : TRANSPARENT)}
                            cornerLength={props.cornerLength}
                            strokeThickness={props.strokeThickness}
                            transitionDurationMs={props.transitionDurationMs}
                            visibleCorners={props.visibleCorners}
                        />
                    </div>
                )}
            </Show>
        </div>
    );
};
