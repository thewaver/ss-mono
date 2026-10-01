import { type ComponentPublicInstance, type SlotsType, defineComponent, shallowRef } from "vue";

import {
    INTERACTION_WRAPPER_DEFAULTS,
    type InteractionFlags,
    InteractionTrackerUtils,
    InteractionWrapperStyles,
} from "@thewaver/ss-components";

import { InteractionTrackerVueUtils } from "../../Abstracts/InteractionTracker/InteractionTrackerVue.utils";
import { Tooltip } from "../../Essentials/Overlays/Tooltip/Tooltip";
import type { TooltipSlots } from "../../Essentials/Overlays/Tooltip/Tooltip.types";
import { callSlot, declareProps } from "../../Utils/propUtils";
import { exposeElement, toElement } from "../../Utils/refUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { InteractionWrapperProps, InteractionWrapperSlots } from "./InteractionWrapper.types";

const NO_EXTRA_FLAGS = {};

export const InteractionWrapper = defineComponent(
    <TExtra extends object = {}>(
        props: InteractionWrapperProps<TExtra>,
        { slots, expose }: SlotsContext<InteractionWrapperSlots<TExtra>>,
    ) => {
        const element = shallowRef<HTMLElement>();

        exposeElement(expose, () => element.value);

        const getIsDisabled = () => props.isDisabled ?? false;

        const internalFlags = InteractionTrackerVueUtils.useElementFlags(element, getIsDisabled, {
            isReachable: () =>
                InteractionTrackerUtils.computeIsReachable(
                    getIsDisabled(),
                    props.isReachableWhenDisabled ?? false,
                    props.isFocusableWhenDisabled ?? false,
                ),
            isTabbable: () => props.isTabbable,
        });

        InteractionTrackerVueUtils.useActivation(
            element,
            () => getIsDisabled() || props.onActivation === undefined,
            (activation) => props.onActivation?.(activation),
        );

        const setElementRef = (target: Element | ComponentPublicInstance | null) => {
            element.value = toElement(target);
        };

        return () => {
            const sizing = props.sizing ?? INTERACTION_WRAPPER_DEFAULTS.sizing;
            const isDisabled = getIsDisabled();

            const flags: InteractionFlags<TExtra> = {
                ...internalFlags.value,
                isDisabled,
                isPressed: props.isPressed,
                hasError: props.hasError,
                ...((props.extraFlags ?? NO_EXTRA_FLAGS) as TExtra),
            };

            const tooltipDefs = props.tooltipDefs;

            return (
                <div
                    class={[
                        InteractionWrapperStyles.interactionRoot,
                        InteractionWrapperStyles.interactionSizingVariants[sizing],
                        isDisabled && InteractionWrapperStyles.interactionDisabled,
                        props.hasError && InteractionWrapperStyles.interactionError,
                        props.isPressed && InteractionWrapperStyles.interactionPressed,
                    ]}
                    role={props.role ?? INTERACTION_WRAPPER_DEFAULTS.role}
                    style={{
                        minWidth: props.minWidth ? `${props.minWidth}px` : undefined,
                        minHeight: props.minHeight ? `${props.minHeight}px` : undefined,
                    }}
                >
                    {callSlot(slots.renderControl, { setElementRef, flags })}

                    {slots.renderDecoration && (
                        <div class={InteractionWrapperStyles.interactionDecorationWrapper}>
                            {callSlot(slots.renderDecoration, flags)}
                        </div>
                    )}

                    {tooltipDefs &&
                        (() => {
                            const { renderContent, ...tooltipProps } = tooltipDefs;

                            return (
                                <Tooltip {...tooltipProps} anchorRef={element.value}>
                                    {
                                        {
                                            renderContent: (value) => renderContent({ ...value, flags }),
                                        } satisfies TooltipSlots
                                    }
                                </Tooltip>
                            );
                        })()}
                </div>
            );
        };
    },
    {
        name: "InteractionWrapper",
        slots: Object as SlotsType<InteractionWrapperSlots<any>>,
        props: declareProps<InteractionWrapperProps>({
            isDisabled: Boolean,
            isPressed: Boolean,
            hasError: Boolean,
            role: null,
            sizing: null,
            minWidth: null,
            minHeight: null,
            isReachableWhenDisabled: Boolean,
            isFocusableWhenDisabled: Boolean,
            isTabbable: Boolean,
            extraFlags: null,
            onActivation: null,
            tooltipDefs: null,
        }),
    },
);
