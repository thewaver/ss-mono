import { useCallback, useEffect, useRef } from "react";

import {
    INTERACTION_WRAPPER_DEFAULTS,
    type InteractionFlags,
    InteractionTrackerUtils,
    InteractionWrapperStyles,
} from "@thewaver/ss-components";
import { InteractionWrapperConst } from "@thewaver/ss-components/internal";

import { InteractionTrackerReactUtils } from "../../Abstracts/InteractionTracker/InteractionTrackerReact.utils";
import { useSharedTooltipContext } from "../../Essentials/Overlays/SharedTooltip/SharedTooltip.context";
import { Tooltip } from "../../Essentials/Overlays/Tooltip/Tooltip";
import type { TooltipProps } from "../../Essentials/Overlays/Tooltip/Tooltip.types";
import { useElement, useLatest } from "../../Utils/refUtils";
import type { InteractionWrapperProps } from "./InteractionWrapper.types";

export const InteractionWrapper = <TExtra extends object = {}>(props: InteractionWrapperProps<TExtra>) => {
    const elementRef = useRef<HTMLElement | null>(null);
    const element = useElement(elementRef);
    const latestRef = useLatest(props.ref);

    const sizing = props.sizing ?? INTERACTION_WRAPPER_DEFAULTS.sizing;
    const isDisabled = props.isDisabled ?? false;

    const isReachable = InteractionTrackerUtils.computeIsReachable(
        isDisabled,
        props.isReachableWhenDisabled ?? false,
        props.isFocusableWhenDisabled ?? false,
    );

    const internalFlags = InteractionTrackerReactUtils.useElementFlags(elementRef, isDisabled, {
        isReachable,
        isTabbable: props.isTabbable,
    });

    InteractionTrackerReactUtils.useActivation(
        elementRef,
        isDisabled || props.onActivation === undefined,
        (activation) => props.onActivation?.(activation),
    );

    const flags: InteractionFlags<TExtra> = {
        ...internalFlags,
        isDisabled,
        isPressed: props.isPressed,
        hasError: props.hasError,
        ...((props.extraFlags ?? InteractionWrapperConst.NO_EXTRA_FLAGS) as TExtra),
    };

    const setElementRef = useCallback(
        (next: HTMLElement | null) => {
            elementRef.current = next;
            latestRef.current?.(next);
        },
        [latestRef],
    );

    const className = [
        InteractionWrapperStyles.interactionRoot,
        InteractionWrapperStyles.interactionSizingVariants[sizing],
        isDisabled && InteractionWrapperStyles.interactionDisabled,
        props.hasError && InteractionWrapperStyles.interactionError,
        props.isPressed && InteractionWrapperStyles.interactionPressed,
    ]
        .filter(Boolean)
        .join(" ");

    const tooltipDefs = isDisabled && !isReachable ? undefined : props.tooltipDefs;

    const tooltipProps: Omit<TooltipProps, "anchorRef"> | undefined = tooltipDefs && {
        ...tooltipDefs,
        renderContent: (visibilityTarget, transitionDurationMs, placement, arrowAim) =>
            tooltipDefs.renderContent(visibilityTarget, transitionDurationMs, placement, flags, arrowAim),
    };

    const lastTooltipPropsRef = useRef(tooltipProps);

    if (tooltipProps) lastTooltipPropsRef.current = tooltipProps;

    const shownTooltipProps = tooltipProps ?? lastTooltipPropsRef.current;

    const sharedTooltip = useSharedTooltipContext();
    const latestTooltipPropsRef = useLatest(tooltipProps);

    useEffect(() => {
        if (sharedTooltip && element) sharedTooltip.update({ anchorRef: element, tooltipProps });
    });

    useEffect(() => {
        if (!sharedTooltip || !element) return;

        const claim = () => {
            const latestTooltipProps = latestTooltipPropsRef.current;

            if (latestTooltipProps) sharedTooltip.claim({ anchorRef: element, tooltipProps: latestTooltipProps });
        };

        element.addEventListener("mouseenter", claim);
        element.addEventListener("focus", claim);

        return () => {
            element.removeEventListener("mouseenter", claim);
            element.removeEventListener("focus", claim);
            sharedTooltip.release(element);
        };
    }, [sharedTooltip, element, latestTooltipPropsRef]);

    return (
        <div
            className={className}
            role={props.role ?? INTERACTION_WRAPPER_DEFAULTS.role}
            style={{
                minWidth: props.minWidth ? `${props.minWidth}px` : undefined,
                minHeight: props.minHeight ? `${props.minHeight}px` : undefined,
            }}
        >
            {props.renderControl(setElementRef, flags)}

            {props.renderDecoration && (
                <div className={InteractionWrapperStyles.interactionDecorationWrapper}>
                    {props.renderDecoration(flags)}
                </div>
            )}

            {!sharedTooltip && shownTooltipProps && (
                <Tooltip {...shownTooltipProps} anchorRef={tooltipProps ? element : undefined} />
            )}
        </div>
    );
};
