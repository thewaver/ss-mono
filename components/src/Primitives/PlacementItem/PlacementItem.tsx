import { createComputed, createEffect, createMemo, createSignal, on } from "solid-js";

import { type CSSAnimationStyle, CSSUtils } from "@thewaver/ss-utils";

import type { PlacementRect } from "../../Abstracts/Placement/Placement.types";
import { PlacementUtils } from "../../Abstracts/Placement/Placement.utils";
import { ProximityUtils } from "../../Abstracts/Proximity/Proximity.utils";
import { access } from "../../Utils/propUtils";
import { usePlacementBoxContext } from "../PlacementBox/PlacementBox.context";
import { PLACEMENT_ITEM_DEFAULTS } from "./PlacementItem.const";
import type { PlacementItemProps } from "./PlacementItem.types";

import * as styles from "./PlacementItem.css";

const NO_ANGLE = 0;
const NO_TRANSITION_MS = 0;
const GLIDING_PROPERTIES = ["left", "top", "width", "height", "rotate"];

const toTransition = (durationMs: number, delayMs: number) =>
    GLIDING_PROPERTIES.map((property) => `${property} ${durationMs}ms ease ${delayMs}ms`).join(", ");

const toBoxStyle = (
    rect: PlacementRect,
    stackAt: number | undefined,
    effect: CSSAnimationStyle | undefined,
    transition: string | undefined,
) => ({
    "left": PlacementUtils.toContainerWidth(rect.left),
    "top": PlacementUtils.toContainerWidth(rect.top),
    "width": PlacementUtils.toContainerWidth(rect.width),
    "height": PlacementUtils.toContainerWidth(rect.height),
    "rotate": `${rect.angle ?? NO_ANGLE}deg`,
    "transform": effect?.transform || undefined,
    "filter": effect?.filter || undefined,
    "z-index": rect.depth ?? stackAt,
    "clip-path": rect.clipPath,
    "transition": transition,
});

export const PlacementItem = (props: PlacementItemProps) => {
    const context = usePlacementBoxContext();

    const [getItemRef, setItemRef] = createSignal<HTMLElement>();
    const [getIsGliding, setIsGliding] = createSignal(false);

    let glideCount = 0;

    const getTransitionDelayMs = createMemo(
        () => access(props.transitionDelayMs) ?? PLACEMENT_ITEM_DEFAULTS.transitionDelayMs,
    );

    createComputed(
        on(
            () => access(props.placement),
            () => setIsGliding(context.getTransitionDurationMs() > NO_TRANSITION_MS),
            { defer: true },
        ),
    );

    createEffect(() => {
        const element = getItemRef();

        if (!element || !getIsGliding()) return;

        access(props.placement);

        glideCount += 1;

        const glide = glideCount;

        void Promise.allSettled(element.getAnimations().map((animation) => animation.finished)).then(() => {
            if (glide === glideCount) setIsGliding(false);
        });
    });

    const getEffect = createMemo(() => {
        const computeEffect = context.getComputeEffect();

        if (computeEffect === undefined) return undefined;

        const placement = access(props.placement);
        const point = context.getPointerPoint();
        const defs =
            point === undefined
                ? ProximityUtils.toRestingEffectDefs(
                      placement,
                      context.getArrangement(),
                      context.getPrefersReducedMotion(),
                      placement,
                  )
                : ProximityUtils.toEffectDefs(
                      placement,
                      point,
                      context.getArrangement(),
                      context.getPrefersReducedMotion(),
                      placement,
                      context.getOverreach(),
                  );

        return CSSUtils.toAnimationStyle(computeEffect(defs));
    });

    const getTransition = createMemo(() =>
        getIsGliding() ? toTransition(context.getTransitionDurationMs(), getTransitionDelayMs()) : undefined,
    );

    const getStyle = createMemo(() =>
        toBoxStyle(access(props.placement), access(props.stackAt), getEffect(), getTransition()),
    );

    return (
        <div ref={setItemRef} class={styles.placementItem} style={getStyle()} role="presentation">
            {props.children}
        </div>
    );
};
