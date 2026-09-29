import { type SlotsType, defineComponent, onScopeDispose, shallowRef } from "vue";

import {
    SLIDE_BUTTON_DEFAULTS,
    type SlideButtonRenderProps,
    SlideButtonStyles,
    SlideButtonUtils,
} from "@thewaver/ss-components";

import { InteractionTrackerVueUtils } from "../../Abstracts/InteractionTracker/InteractionTrackerVue.utils";
import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import type {
    InteractionControlSlots,
    InteractionWrapperSlots,
} from "../../Primitives/InteractionWrapper/InteractionWrapper.types";
import { watchAfterRender } from "../../Utils/effectUtils";
import { callSlot, declareProps, forwardProps, useTwoWay } from "../../Utils/propUtils";
import { exposeElement, toElement } from "../../Utils/refUtils";
import { useStore } from "../../Utils/storeUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import { FormFieldVueUtils } from "../Input/FormField/FormFieldVue.utils";
import { LabelVueUtils } from "../Input/Label/LabelVue.utils";
import type { SlideButtonElementProps, SlideButtonProps, SlideButtonSlots } from "./SlideButton.types";

const RATIO_MIN = 0;

const SlideButtonElement = defineComponent(
    (props: SlideButtonElementProps, { slots }: SlotsContext<InteractionControlSlots<SlideButtonRenderProps>>) => {
        const ariaLabel = LabelVueUtils.useAriaLabel(() => props.ariaLabel);
        const ariaDescribedBy = FormFieldVueUtils.useAriaDescribedBy();

        const trackRef = shallowRef<HTMLButtonElement>();

        let progress = props.progressRatio;

        FormFieldVueUtils.useRegisterControl(trackRef);

        watchAfterRender([() => props.progressRatio], ([ratio]) => {
            progress = ratio;
        });

        const getIsDisabled = () => props.flags.isDisabled ?? false;

        const gesture = SlideButtonUtils.createGesture({
            getMode: () => props.mode,
            getThumbSize: () => props.thumbSize,
            getHoldDurationMs: () => props.holdDurationMs,
            getTrackWidth: () => trackRef.value?.clientWidth ?? 0,
            getProgressRatio: () => progress,
            setProgressRatio: (ratio) => {
                progress = ratio;
                props.setProgressRatio(ratio);
            },
            onActivate: () => props.onActivate?.(),
        });

        onScopeDispose(gesture.stopHold);

        const isHolding = useStore(gesture, (state) => state.isHolding);
        const isGrabbed = useStore(gesture, (state) => state.isGrabbed);

        const { isDragging } = InteractionTrackerVueUtils.useDrag(trackRef, getIsDisabled, {
            onDrag: (ratio) => gesture.drag(ratio.x),
            onDragEnd: (reason) => gesture.dragEnd(reason),
        });

        watchAfterRender([() => isDragging.value && isGrabbed.value], ([isSliding]) => props.setIsDragging(isSliding));

        watchAfterRender([isHolding], ([isHeld]) => props.setIsHolding(isHeld));

        watchAfterRender([getIsDisabled], ([isOff]) => {
            if (isOff) gesture.reset();
        });

        return () => {
            const isDisabled = getIsDisabled();

            return (
                <button
                    id={props.id}
                    ref={trackRef}
                    type="button"
                    class={SlideButtonStyles.slideButtonElement}
                    aria-label={ariaLabel.value}
                    aria-describedby={ariaDescribedBy.value}
                    aria-disabled={isDisabled || undefined}
                    onKeydown={(e) => {
                        if (isDisabled) return;

                        gesture.pressKey(e.key, e.repeat);
                    }}
                    onKeyup={(e) => gesture.releaseKey(e.key)}
                    onBlur={() => gesture.stopHold()}
                    onMouseenter={(e) => {
                        if (isDisabled) return;

                        props.onMouseEnter?.(e);
                    }}
                    onMouseleave={(e) => {
                        if (isDisabled) return;

                        props.onMouseLeave?.(e);
                    }}
                >
                    {callSlot(slots.renderContent, props.flags)}
                </button>
            );
        };
    },
    {
        name: "SlideButtonElement",
        props: declareProps<SlideButtonElementProps>({
            onActivate: null,
            onMouseEnter: null,
            onMouseLeave: null,
            id: null,
            ariaLabel: null,
            flags: null,
            thumbSize: null,
            holdDurationMs: null,
            mode: null,
            progressRatio: null,
            setProgressRatio: null,
            setIsDragging: null,
            setIsHolding: null,
        }),
    },
);

export const SlideButton = defineComponent(
    (props: SlideButtonProps, { slots, expose }: SlotsContext<SlideButtonSlots>) => {
        const progressRatio = useTwoWay(props, "progress", RATIO_MIN);

        const controlRef = shallowRef<HTMLElement>();
        const isDragging = shallowRef(false);
        const isHolding = shallowRef(false);

        exposeElement(expose, () => controlRef.value);

        return () => {
            const extraFlags: SlideButtonRenderProps = {
                progressRatio: progressRatio.value,
                isDragging: isDragging.value,
                isHolding: isHolding.value,
            };

            return (
                <InteractionWrapper {...forwardProps(props, InteractionWrapper)} extraFlags={extraFlags}>
                    {
                        {
                            renderControl: ({ setElementRef, flags }) => (
                                <SlideButtonElement
                                    ref={(target) => {
                                        setElementRef(target);
                                        controlRef.value = toElement(target);
                                    }}
                                    id={props.id}
                                    ariaLabel={props.ariaLabel}
                                    thumbSize={props.thumbSize ?? SLIDE_BUTTON_DEFAULTS.thumbSize}
                                    holdDurationMs={props.holdDurationMs ?? SLIDE_BUTTON_DEFAULTS.holdDurationMs}
                                    mode={props.mode ?? SLIDE_BUTTON_DEFAULTS.mode}
                                    flags={flags}
                                    progressRatio={progressRatio.value}
                                    setProgressRatio={(ratio) => {
                                        progressRatio.value = ratio;
                                    }}
                                    setIsDragging={(isSliding) => {
                                        isDragging.value = isSliding;
                                    }}
                                    setIsHolding={(isHeld) => {
                                        isHolding.value = isHeld;
                                    }}
                                    onActivate={props.onActivate}
                                    onMouseEnter={props.onMouseEnter}
                                    onMouseLeave={props.onMouseLeave}
                                >
                                    {{ renderContent: slots.renderContent }}
                                </SlideButtonElement>
                            ),
                            renderDecoration: slots.renderDecoration,
                        } satisfies Partial<InteractionWrapperSlots<SlideButtonRenderProps>>
                    }
                </InteractionWrapper>
            );
        };
    },
    {
        name: "SlideButton",
        slots: Object as SlotsType<SlideButtonSlots>,
        props: declareProps<SlideButtonProps>({
            "isDisabled": Boolean,
            "isPressed": Boolean,
            "hasError": Boolean,
            "role": null,
            "sizing": null,
            "minWidth": null,
            "minHeight": null,
            "isReachableWhenDisabled": Boolean,
            "isFocusableWhenDisabled": Boolean,
            "isTabbable": Boolean,
            "onActivation": null,
            "tooltipDefs": null,
            "onActivate": null,
            "onMouseEnter": null,
            "onMouseLeave": null,
            "id": null,
            "ariaLabel": null,
            "thumbSize": null,
            "holdDurationMs": null,
            "mode": null,
            "progress": null,
            "onUpdate:progress": null,
        }),
    },
);
