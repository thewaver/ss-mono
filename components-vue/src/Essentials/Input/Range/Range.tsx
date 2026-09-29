import { type SlotsType, computed, defineComponent, onMounted, onUpdated, shallowRef } from "vue";

import {
    InteractionTrackerUtils,
    RANGE_DEFAULTS,
    type RangeRenderProps,
    RangeStyles,
    RangeUtils,
} from "@thewaver/ss-components";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { InteractionTrackerVueUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerVue.utils";
import { NavigatorVueUtils } from "../../../Abstracts/Navigator/NavigatorVue.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import type {
    InteractionControlSlots,
    InteractionWrapperSlots,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { callSlot, declareProps, forwardProps, useTwoWay } from "../../../Utils/propUtils";
import { exposeElement, toElement } from "../../../Utils/refUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import { FormFieldVueUtils } from "../FormField/FormFieldVue.utils";
import { LabelVueUtils } from "../Label/LabelVue.utils";
import type { RangeElementProps, RangeProps, RangeSlots } from "./Range.types";

const readFocusVisibleThumb = (element: HTMLElement, index: number) =>
    InteractionTrackerUtils.computeIsFocusVisible(element) ? index : undefined;

const RangeElement = defineComponent(
    (props: RangeElementProps, { slots, expose }: SlotsContext<InteractionControlSlots<RangeRenderProps>>) => {
        const ariaLabel = LabelVueUtils.useAriaLabel(() => props.ariaLabel);
        const ariaDescribedBy = FormFieldVueUtils.useAriaDescribedBy();

        const elements = shallowRef<(HTMLInputElement | undefined)[]>([]);
        const activeThumb = shallowRef(0);

        const firstElement = computed(() => elements.value[0]);

        exposeElement(expose, () => firstElement.value);

        const direction = NavigatorVueUtils.useDirection(firstElement);

        const getIsDisabled = () => props.flags.isDisabled ?? false;

        const thumbs = RangeUtils.createThumbs({
            getValues: () => props.values,
            getScale: () => ({
                orientation: props.orientation,
                direction: direction.value,
                min: props.min,
                max: props.max,
                step: props.step,
                thumbSize: props.thumbSize,
            }),
            getIsDisabled,
            getComputeValueAtPoint: () => props.computeValueAtPoint,
            getElement: (index) => elements.value[index],
            setValue: (index, value) => props.setValue(index, value),
            setActiveThumb: (index) => {
                activeThumb.value = index;
            },
            onChangeEnd: (values) => props.onChangeEnd?.(values),
        });

        const setElement = (index: number, element: HTMLInputElement | undefined) => {
            if (elements.value[index] === element) return;

            const next = [...elements.value];

            next[index] = element;

            elements.value = next;
        };

        const syncElements = () => {
            elements.value.forEach((element, index) => {
                if (element) thumbs.syncElement(element, index);
            });
        };

        onMounted(syncElements);

        onUpdated(syncElements);

        FormFieldVueUtils.useRegisterControl(firstElement);

        InteractionTrackerVueUtils.useExtraControls(() => elements.value.slice(1, props.values.length), getIsDisabled, {
            isTabbable: () => props.isTabbable,
        });

        return () => {
            const isDisabled = getIsDisabled();
            const count = props.values.length;

            const className = [
                RangeStyles.rangeElement,
                RangeStyles.rangeOrientationVariants[props.orientation],
                props.computeValueAtPoint && RangeStyles.rangeElementTracked,
            ];

            return (
                <>
                    {callSlot(slots.renderContent, props.flags)}

                    {props.values.map((value, index) => {
                        const bounds = RangeUtils.computeThumbBounds(props.values, index, props.min, props.max);

                        return (
                            <input
                                key={index}
                                id={RangeUtils.suffixForThumb(props.id, index, count)}
                                ref={(target) => setElement(index, toElement<HTMLInputElement>(target))}
                                type="range"
                                name={RangeUtils.suffixForThumb(props.name, index, count)}
                                class={className}
                                style={[
                                    assignInlineVars({ [RangeStyles.thumbSizeVar]: `${props.thumbSize}px` }),
                                    { zIndex: index === activeThumb.value ? 1 : undefined },
                                ]}
                                min={bounds.min}
                                max={bounds.max}
                                step={props.step}
                                aria-label={props.thumbLabels?.[index] ?? ariaLabel.value}
                                aria-valuetext={props.computeValueText?.(value, index)}
                                aria-describedby={ariaDescribedBy.value}
                                aria-orientation={props.orientation === "vertical" ? "vertical" : undefined}
                                aria-disabled={isDisabled || undefined}
                                aria-required={props.isRequired || undefined}
                                aria-invalid={props.flags.hasError || undefined}
                                onPointerdown={(e) => thumbs.handlePointerDown(e, e.currentTarget as HTMLInputElement)}
                                onPointermove={(e) => thumbs.handlePointerMove(e, e.currentTarget as HTMLInputElement)}
                                onPointerup={(e) => thumbs.handlePointerEnd(e)}
                                onPointercancel={(e) => thumbs.handlePointerEnd(e)}
                                onLostpointercapture={(e) => thumbs.handlePointerEnd(e)}
                                onFocus={(e) =>
                                    props.setFocusVisibleThumb(
                                        readFocusVisibleThumb(e.currentTarget as HTMLElement, index),
                                    )
                                }
                                onKeydown={(e) => {
                                    thumbs.handleKeyDown();
                                    props.setFocusVisibleThumb(
                                        readFocusVisibleThumb(e.currentTarget as HTMLElement, index),
                                    );
                                }}
                                onBlur={() => props.setFocusVisibleThumb(undefined)}
                                onInput={(e) => thumbs.handleInput(e.currentTarget as HTMLInputElement, index)}
                                onChange={() => thumbs.handleChange()}
                                onMouseenter={(e) => {
                                    if (isDisabled) return;

                                    props.onMouseEnter?.(e);
                                }}
                                onMouseleave={(e) => {
                                    if (isDisabled) return;

                                    props.onMouseLeave?.(e);
                                }}
                            />
                        );
                    })}
                </>
            );
        };
    },
    {
        name: "RangeElement",
        props: declareProps<RangeElementProps>({
            onInput: null,
            onChangeEnd: null,
            onMouseEnter: null,
            onMouseLeave: null,
            id: null,
            ariaLabel: null,
            flags: null,
            orientation: null,
            min: null,
            max: null,
            step: null,
            thumbSize: null,
            name: null,
            thumbLabels: null,
            computeValueText: null,
            computeValueAtPoint: null,
            isRequired: Boolean,
            values: null,
            isTabbable: Boolean,
            setValue: null,
            setFocusVisibleThumb: null,
        }),
    },
);

export const Range = defineComponent(
    (props: RangeProps, { slots, expose }: SlotsContext<RangeSlots>) => {
        const value = useTwoWay(props, "value", undefined, { keepsOwnValue: false });
        const range = useTwoWay(props, "range", undefined, { keepsOwnValue: false });

        const controlRef = shallowRef<HTMLElement>();
        const focusVisibleThumb = shallowRef<number>();

        exposeElement(expose, () => controlRef.value);

        watchAfterRender([() => props.value !== undefined, () => props.range !== undefined], ([hasSingle, hasPair]) =>
            RangeUtils.warnIfAmbiguous(hasSingle, hasPair, { single: "value", pair: "range" }),
        );

        const getMin = () => props.min ?? RANGE_DEFAULTS.min;
        const getMax = () => props.max ?? RANGE_DEFAULTS.max;

        const values = computed(() => RangeUtils.computeValues(range.value, value.value, getMin()));

        const setValue = (index: number, next: number) => {
            const nextValues = values.value.map((held, at) => (at === index ? next : held));

            if (range.value) {
                range.value = RangeUtils.computeMovedRange(range.value, index, next);
            } else {
                value.value = next;
            }

            props.onInput?.(nextValues);
        };

        const setFocusVisibleThumb = (index?: number) => {
            focusVisibleThumb.value = index;
        };

        return () => {
            const orientation = props.orientation ?? RANGE_DEFAULTS.orientation;
            const ratios = RangeUtils.computeRatios(values.value, getMin(), getMax());

            const extraFlags: RangeRenderProps = {
                orientation,
                values: values.value,
                ratios,
                fill: RangeUtils.computeFill(ratios),
                focusVisibleThumb: focusVisibleThumb.value,
            };

            return (
                <InteractionWrapper {...forwardProps(props, InteractionWrapper)} extraFlags={extraFlags}>
                    {
                        {
                            renderControl: ({ setElementRef, flags }) => (
                                <RangeElement
                                    ref={(target) => {
                                        setElementRef(target);
                                        controlRef.value = toElement(target);
                                    }}
                                    id={props.id}
                                    name={props.name}
                                    ariaLabel={props.ariaLabel}
                                    thumbLabels={props.thumbLabels}
                                    isRequired={props.isRequired}
                                    orientation={orientation}
                                    min={getMin()}
                                    max={getMax()}
                                    step={props.step ?? RANGE_DEFAULTS.step}
                                    thumbSize={props.thumbSize ?? RANGE_DEFAULTS.thumbSize}
                                    flags={flags}
                                    values={values.value}
                                    isTabbable={props.isTabbable}
                                    setValue={setValue}
                                    setFocusVisibleThumb={setFocusVisibleThumb}
                                    computeValueText={props.computeValueText}
                                    computeValueAtPoint={props.computeValueAtPoint}
                                    onChangeEnd={props.onChangeEnd}
                                    onMouseEnter={props.onMouseEnter}
                                    onMouseLeave={props.onMouseLeave}
                                >
                                    {{ renderContent: slots.renderContent }}
                                </RangeElement>
                            ),
                            renderDecoration: slots.renderDecoration,
                        } satisfies Partial<InteractionWrapperSlots<RangeRenderProps>>
                    }
                </InteractionWrapper>
            );
        };
    },
    {
        name: "Range",
        slots: Object as SlotsType<RangeSlots>,
        props: declareProps<RangeProps>({
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
            "onInput": null,
            "onChangeEnd": null,
            "onMouseEnter": null,
            "onMouseLeave": null,
            "id": null,
            "name": null,
            "ariaLabel": null,
            "thumbLabels": null,
            "computeValueText": null,
            "computeValueAtPoint": null,
            "isRequired": Boolean,
            "orientation": null,
            "min": null,
            "max": null,
            "step": null,
            "thumbSize": null,
            "value": null,
            "onUpdate:value": null,
            "range": null,
            "onUpdate:range": null,
        }),
    },
);
