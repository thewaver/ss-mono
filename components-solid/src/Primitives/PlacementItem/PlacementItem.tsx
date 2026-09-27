import { createComputed, createEffect, createMemo, createSignal, on } from "solid-js";

import { PLACEMENT_ITEM_DEFAULTS, PlacementItemUtils, PlacementItemStyles as styles } from "@thewaver/ss-components";

import { access } from "../../Utils/propUtils";
import { usePlacementBoxContext } from "../PlacementBox/PlacementBox.context";
import type { PlacementItemProps } from "./PlacementItemSolid.types";

const NO_TRANSITION_MS = 0;

const toBoxStyle = (values: ReturnType<typeof PlacementItemUtils.computeStyleValues>) => ({
    "left": values.left,
    "top": values.top,
    "width": values.width,
    "height": values.height,
    "rotate": values.rotate,
    "transform": values.transform,
    "filter": values.filter,
    "z-index": values.zIndex,
    "clip-path": values.clipPath,
    "transition": values.transition,
});

export const PlacementItem = (props: PlacementItemProps) => {
    const context = usePlacementBoxContext();

    const [getItemRef, setItemRef] = createSignal<HTMLElement>();
    const [getIsGliding, setIsGliding] = createSignal(false);

    const glideWatcher = PlacementItemUtils.createGlideWatcher();

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

        glideWatcher.watch(element, () => setIsGliding(false));
    });

    const getEffect = createMemo(() => PlacementItemUtils.computeEffectStyle(access(props.placement), context));

    const getTransition = createMemo(() =>
        getIsGliding()
            ? PlacementItemUtils.toTransition(context.getTransitionDurationMs(), getTransitionDelayMs())
            : undefined,
    );

    const getStyle = createMemo(() =>
        toBoxStyle(
            PlacementItemUtils.computeStyleValues(
                access(props.placement),
                access(props.stackAt),
                getEffect(),
                getTransition(),
            ),
        ),
    );

    return (
        <div ref={setItemRef} class={styles.placementItem} style={getStyle()} role="presentation">
            {props.children}
        </div>
    );
};
