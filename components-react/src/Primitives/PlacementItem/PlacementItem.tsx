import { type CSSProperties, useLayoutEffect, useRef, useState } from "react";

import { PLACEMENT_ITEM_DEFAULTS, PlacementItemStyles, PlacementItemUtils } from "@thewaver/ss-components";

import { useElement } from "../../Utils/refUtils";
import { usePlacementBoxContext } from "../PlacementBox/PlacementBox.context";
import type { PlacementItemProps } from "./PlacementItem.types";

const NO_TRANSITION_MS = 0;

export const PlacementItem = (props: PlacementItemProps) => {
    const context = usePlacementBoxContext();

    const itemRef = useRef<HTMLDivElement | null>(null);
    const element = useElement(itemRef);

    const [glideWatcher] = useState(PlacementItemUtils.createGlideWatcher);
    const [isGliding, setIsGliding] = useState(false);
    const [previousPlacement, setPreviousPlacement] = useState(props.placement);

    const placement = props.placement;
    const transitionDelayMs = props.transitionDelayMs ?? PLACEMENT_ITEM_DEFAULTS.transitionDelayMs;

    if (placement !== previousPlacement) {
        setPreviousPlacement(placement);
        setIsGliding(context.getTransitionDurationMs() > NO_TRANSITION_MS);
    }

    useLayoutEffect(() => {
        if (!element || !isGliding) return;

        glideWatcher.watch(element, () => setIsGliding(false));
    }, [element, isGliding, placement, glideWatcher]);

    const effect = PlacementItemUtils.computeEffectStyle(placement, context);

    const transition = isGliding
        ? PlacementItemUtils.toTransition(context.getTransitionDurationMs(), transitionDelayMs)
        : undefined;

    const style: CSSProperties = PlacementItemUtils.computeStyleValues(placement, props.stackAt, effect, transition);

    return (
        <div ref={itemRef} className={PlacementItemStyles.placementItem} style={style} role="presentation">
            {props.children}
        </div>
    );
};
