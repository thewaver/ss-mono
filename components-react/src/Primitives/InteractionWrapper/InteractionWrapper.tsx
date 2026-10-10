import { useCallback, useRef } from "react";

import {
    INTERACTION_WRAPPER_DEFAULTS,
    type InteractionFlags,
    InteractionTrackerUtils,
    InteractionWrapperStyles,
} from "@thewaver/ss-components";

import { InteractionTrackerReactUtils } from "../../Abstracts/InteractionTracker/InteractionTrackerReact.utils";
import { Tooltip } from "../../Essentials/Overlays/Tooltip/Tooltip";
import { useElement, useLatest } from "../../Utils/refUtils";
import type { InteractionWrapperProps } from "./InteractionWrapper.types";

const NO_EXTRA_FLAGS = {};

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
        ...((props.extraFlags ?? NO_EXTRA_FLAGS) as TExtra),
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

    const tooltipDefs = props.tooltipDefs;

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

            {tooltipDefs && (
                <Tooltip
                    {...tooltipDefs}
                    anchorRef={element}
                    renderContent={(visibilityTarget, transitionDurationMs, placement, arrowAim) =>
                        tooltipDefs.renderContent(visibilityTarget, transitionDurationMs, placement, flags, arrowAim)
                    }
                />
            )}
        </div>
    );
};
