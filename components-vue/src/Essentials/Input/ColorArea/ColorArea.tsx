import { type SlotsType, defineComponent, onMounted, onUpdated, shallowRef } from "vue";

import {
    COLOR_AREA_DEFAULTS,
    type ColorAreaAxis,
    type ColorAreaRenderProps,
    ColorAreaStyles,
    ColorAreaUtils,
    InteractionTrackerUtils,
} from "@thewaver/ss-components";
import type { Color } from "@thewaver/ss-utils";

import { InteractionTrackerVueUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerVue.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import type {
    InteractionControlSlots,
    InteractionWrapperSlots,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { callSlot, declareProps, forwardProps, useTwoWay } from "../../../Utils/propUtils";
import { exposeElement, toElement } from "../../../Utils/refUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import { LabelVueUtils } from "../Label/LabelVue.utils";
import type { ColorAreaElementProps, ColorAreaProps, ColorAreaSlots } from "./ColorArea.types";

const readFocusVisibleAxis = (element: HTMLElement, axis: ColorAreaAxis) =>
    InteractionTrackerUtils.computeIsFocusVisible(element) ? axis : undefined;

const ColorAreaElement = defineComponent(
    (props: ColorAreaElementProps, { slots }: SlotsContext<InteractionControlSlots<ColorAreaRenderProps>>) => {
        const ariaLabel = LabelVueUtils.useAriaLabel(() => props.ariaLabel);

        const surfaceRef = shallowRef<HTMLDivElement>();
        const axisElements = shallowRef<Partial<Record<ColorAreaAxis, HTMLInputElement>>>({});

        let isPressed = false;

        const getIsDisabled = () => props.flags.isDisabled ?? false;

        const { isDragging } = InteractionTrackerVueUtils.useDrag(surfaceRef, getIsDisabled, {
            onDrag: (ratio) => {
                isPressed = true;
                props.setDragged(ratio);
                axisElements.value.saturation?.focus();
            },
            onDragEnd: () => {
                isPressed = false;
            },
        });

        watchAfterRender([isDragging], ([isHeld]) => {
            if (!isHeld) isPressed = false;

            props.setIsDragging(isHeld);
        });

        const syncAxes = () => {
            for (const axis of ColorAreaUtils.AXES) {
                const element = axisElements.value[axis];

                if (element) ColorAreaUtils.syncAxis(element, props.hsv, axis);
            }
        };

        onMounted(syncAxes);

        onUpdated(syncAxes);

        InteractionTrackerVueUtils.useExtraControls(
            () => ColorAreaUtils.AXES.map((axis) => axisElements.value[axis]),
            getIsDisabled,
            { isTabbable: () => props.isTabbable },
        );

        const setAxisElement = (axis: ColorAreaAxis, element: HTMLInputElement | undefined) => {
            if (axisElements.value[axis] === element) return;

            axisElements.value = { ...axisElements.value, [axis]: element };
        };

        return () => {
            const isDisabled = getIsDisabled();

            return (
                <div
                    ref={surfaceRef}
                    id={props.id}
                    class={ColorAreaStyles.colorAreaSurface}
                    role="group"
                    aria-label={ariaLabel.value}
                    aria-disabled={isDisabled || undefined}
                    aria-invalid={props.flags.hasError || undefined}
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

                    {ColorAreaUtils.AXES.map((axis) => (
                        <input
                            key={axis}
                            ref={(target) => setAxisElement(axis, toElement<HTMLInputElement>(target))}
                            type="range"
                            name={props.name && `${props.name}-${axis}`}
                            class={ColorAreaStyles.colorAreaAxis}
                            min={ColorAreaUtils.AXIS_MIN}
                            max={ColorAreaUtils.AXIS_MAX}
                            step={props.step}
                            aria-label={props.axisLabels[axis]}
                            aria-valuetext={ColorAreaUtils.computeValueText(props.hsv, axis)}
                            aria-disabled={isDisabled || undefined}
                            onInput={(e) => {
                                const element = e.currentTarget as HTMLInputElement;

                                if (!isDisabled) props.setAxis(axis, Number(element.value));

                                ColorAreaUtils.syncAxis(element, props.hsv, axis);
                            }}
                            onFocus={(e) =>
                                props.setFocusVisibleAxis(
                                    isPressed ? undefined : readFocusVisibleAxis(e.currentTarget as HTMLElement, axis),
                                )
                            }
                            onKeydown={(e) =>
                                props.setFocusVisibleAxis(readFocusVisibleAxis(e.currentTarget as HTMLElement, axis))
                            }
                            onBlur={() => props.setFocusVisibleAxis(undefined)}
                        />
                    ))}
                </div>
            );
        };
    },
    {
        name: "ColorAreaElement",
        props: declareProps<ColorAreaElementProps>({
            onInput: null,
            onMouseEnter: null,
            onMouseLeave: null,
            id: null,
            ariaLabel: null,
            flags: null,
            axisLabels: null,
            step: null,
            name: null,
            hsv: null,
            isTabbable: Boolean,
            setAxis: null,
            setDragged: null,
            setFocusVisibleAxis: null,
            setIsDragging: null,
        }),
    },
);

export const ColorArea = defineComponent(
    (props: ColorAreaProps, { slots, expose }: SlotsContext<ColorAreaSlots>) => {
        const hsv = useTwoWay(props, "hsv");

        const controlRef = shallowRef<HTMLElement>();
        const focusVisibleAxis = shallowRef<ColorAreaAxis>();
        const isDragging = shallowRef(false);

        exposeElement(expose, () => controlRef.value);

        const writeHsv = (next: Color.HSVA) => {
            hsv.value = next;

            props.onInput?.(next);
        };

        return () => {
            const extraFlags: ColorAreaRenderProps = {
                hsv: hsv.value,
                isDragging: isDragging.value,
                focusVisibleAxis: focusVisibleAxis.value,
            };

            return (
                <InteractionWrapper
                    {...forwardProps(props, InteractionWrapper)}
                    isTabbable={false}
                    extraFlags={extraFlags}
                >
                    {
                        {
                            renderControl: ({ setElementRef, flags }) => (
                                <ColorAreaElement
                                    ref={(target) => {
                                        setElementRef(target);
                                        controlRef.value = toElement(target);
                                    }}
                                    id={props.id}
                                    name={props.name}
                                    ariaLabel={props.ariaLabel}
                                    axisLabels={props.axisLabels}
                                    step={props.step ?? COLOR_AREA_DEFAULTS.step}
                                    flags={flags}
                                    hsv={hsv.value}
                                    isTabbable={props.isTabbable}
                                    setAxis={(axis, percent) =>
                                        writeHsv(ColorAreaUtils.computeAxisHsv(hsv.value, axis, percent))
                                    }
                                    setDragged={(ratio) => writeHsv(ColorAreaUtils.computeDraggedHsv(hsv.value, ratio))}
                                    setFocusVisibleAxis={(axis) => {
                                        focusVisibleAxis.value = axis;
                                    }}
                                    setIsDragging={(isHeld) => {
                                        isDragging.value = isHeld;
                                    }}
                                    onMouseEnter={props.onMouseEnter}
                                    onMouseLeave={props.onMouseLeave}
                                >
                                    {{ renderContent: slots.renderContent }}
                                </ColorAreaElement>
                            ),
                            renderDecoration: slots.renderDecoration,
                        } satisfies Partial<InteractionWrapperSlots<ColorAreaRenderProps>>
                    }
                </InteractionWrapper>
            );
        };
    },
    {
        name: "ColorArea",
        slots: Object as SlotsType<ColorAreaSlots>,
        props: declareProps<ColorAreaProps>({
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
            "onMouseEnter": null,
            "onMouseLeave": null,
            "id": null,
            "name": null,
            "ariaLabel": null,
            "axisLabels": null,
            "step": null,
            "hsv": null,
            "onUpdate:hsv": null,
        }),
    },
);
