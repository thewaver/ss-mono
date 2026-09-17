import { createMemo } from "solid-js";

import { type CSSAnimationStyle, CSSUtils } from "@thewaver/ss-utils";

import type { PlacementRect } from "../../Abstracts/Placement/Placement.types";
import { PlacementUtils } from "../../Abstracts/Placement/Placement.utils";
import { ProximityUtils } from "../../Abstracts/Proximity/Proximity.utils";
import { access } from "../../Utils/propUtils";
import { usePlacementBoxContext } from "../PlacementBox/PlacementBox.context";
import type { PlacementItemProps } from "./PlacementItem.types";

import * as styles from "./PlacementItem.css";

const NO_ANGLE = 0;

const toBoxStyle = (rect: PlacementRect, stackAt: number | undefined, effect: CSSAnimationStyle | undefined) => ({
    "left": PlacementUtils.toContainerWidth(rect.left),
    "top": PlacementUtils.toContainerWidth(rect.top),
    "width": PlacementUtils.toContainerWidth(rect.width),
    "height": PlacementUtils.toContainerWidth(rect.height),
    "transform": `translate(-50%, -50%) rotate(${rect.angle ?? NO_ANGLE}deg)${effect?.transform ? ` ${effect.transform}` : ""}`,
    "filter": effect?.filter || undefined,
    "z-index": rect.depth ?? stackAt,
    "clip-path": rect.clipPath,
});

export const PlacementItem = (props: PlacementItemProps) => {
    const context = usePlacementBoxContext();

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

    const getStyle = createMemo(() => toBoxStyle(access(props.placement), access(props.stackAt), getEffect()));

    return (
        <div class={styles.placementItem} style={getStyle()} role="presentation">
            {props.children}
        </div>
    );
};
