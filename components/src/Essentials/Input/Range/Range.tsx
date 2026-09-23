import { Index, createMemo, createRenderEffect, createSignal } from "solid-js";

import { MathUtils } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { InteractionTrackerUtils } from "../../../Abstracts/InteractionTracker/InteractionTracker.utils";
import { NavigatorUtils } from "../../../Abstracts/Navigator/Navigator.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { access } from "../../../Utils/propUtils";
import { FormFieldUtils } from "../FormField/FormField.utils";
import { LabelUtils } from "../Label/Label.utils";
import { RANGE_DEFAULTS } from "./Range.const";
import type { RangeElementProps, RangeProps, RangeRenderProps, RangeSpan } from "./Range.types";
import { RangeUtils } from "./Range.utils";

import * as styles from "./Range.css";

const readFocusVisibleThumb = (element: HTMLElement, index: number) =>
    InteractionTrackerUtils.computeIsFocusVisible(element) ? index : undefined;

const MIN_TRACK_TRAVEL_PX = 1;

const RangeElement = (props: RangeElementProps) => {
    const getAriaLabel = LabelUtils.resolveAriaLabel(
        props.ariaLabel === undefined ? undefined : () => access(props.ariaLabel)!,
    );
    const getAriaDescribedBy = FormFieldUtils.resolveAriaDescribedBy();

    const [getActiveThumb, setActiveThumb] = createSignal(0);
    const [getElementRefs, setElementRefs] = createSignal<HTMLInputElement[]>([]);

    const getDirection = NavigatorUtils.createDirectionSignal(() => getElementRefs()[0]);

    const getIsDisabled = () => access(props.flags).isDisabled ?? false;

    const getThumbMin = (index: number) => (index === 0 ? access(props.min) : access(props.values)[index - 1]);

    const getThumbMax = (index: number) =>
        index === access(props.values).length - 1 ? access(props.max) : access(props.values)[index + 1];

    const suffixForThumb = (base: string | undefined, index: number) => {
        if (!base || access(props.values).length < 2) return base;

        return `${base}-${index === 0 ? "start" : "end"}`;
    };

    let valuesAtChangeStart: number[] | undefined;

    const markChangeStart = () => {
        valuesAtChangeStart = access(props.values);
    };

    const reportChangeEnd = () => {
        const values = access(props.values);
        const startValues = valuesAtChangeStart;

        valuesAtChangeStart = undefined;

        if (getIsDisabled()) return;

        if (startValues && startValues.every((value, index) => value === values[index])) return;

        void props.onChangeEnd?.(values);
    };

    const syncElement = (element: HTMLInputElement, index: number) => {
        element.value = `${access(props.values)[index]}`;
    };

    const readPointerValue = (e: PointerEvent, element: HTMLInputElement) => {
        const isVertical = access(props.orientation) === "vertical";
        const rect = element.getBoundingClientRect();
        const span = isVertical ? rect.height : rect.width;
        const horizontalOffset = getDirection() === "rtl" ? rect.right - e.clientX : e.clientX - rect.left;
        const offset = isVertical ? rect.bottom - e.clientY : horizontalOffset;
        const travel = Math.max(span - access(props.thumbSize), MIN_TRACK_TRAVEL_PX);
        const ratio = MathUtils.clamp01((offset - access(props.thumbSize) * 0.5) / travel);

        return access(props.min) + ratio * (access(props.max) - access(props.min));
    };

    const computeNearestThumb = (pointerValue: number) => {
        const values = access(props.values);
        const distances = values.map((value) => Math.abs(value - pointerValue));
        const shortest = Math.min(...distances);
        const isTied = distances.filter((distance) => distance === shortest).length > 1;

        if (isTied) return pointerValue > values[0] ? values.length - 1 : 0;

        return distances.indexOf(shortest);
    };

    const raiseNearestThumb = (e: PointerEvent, element: HTMLInputElement) => {
        if (access(props.values).length < 2) return;

        setActiveThumb(computeNearestThumb(readPointerValue(e, element)));
    };

    let trackedPointerId: number | undefined;
    let trackedThumb = 0;

    const readTrackedValue = (e: PointerEvent, element: HTMLInputElement) =>
        props.computeValueAtPoint?.({ x: e.clientX, y: e.clientY }, element.getBoundingClientRect()) ??
        access(props.values)[trackedThumb];

    const writeTrackedValue = (rawValue: number) => {
        if (getIsDisabled()) return;

        const value = MathUtils.clamp(
            RangeUtils.computeSteppedValue(rawValue, {
                min: access(props.min),
                max: access(props.max),
                step: access(props.step),
            }),
            getThumbMin(trackedThumb),
            getThumbMax(trackedThumb),
        );

        if (value !== access(props.values)[trackedThumb]) props.setValue(trackedThumb, value);
    };

    const startTracking = (e: PointerEvent, element: HTMLInputElement) => {
        if (e.button !== 0 || getIsDisabled()) return;

        e.preventDefault();

        const rawValue = readTrackedValue(e, element);

        trackedThumb = computeNearestThumb(rawValue);
        trackedPointerId = e.pointerId;

        setActiveThumb(trackedThumb);
        element.setPointerCapture(e.pointerId);
        getElementRefs()[trackedThumb]?.focus({ preventScroll: true });
        writeTrackedValue(rawValue);
    };

    const stopTracking = (e: PointerEvent) => {
        if (trackedPointerId !== e.pointerId) return;

        trackedPointerId = undefined;
        reportChangeEnd();
    };

    createRenderEffect(() => {
        getElementRefs().forEach(syncElement);
    });

    FormFieldUtils.registerControl(() => getElementRefs()[0]);

    InteractionTrackerUtils.wrapExtraControls(() => getElementRefs().slice(1), getIsDisabled, {
        getIsTabbable: props.isTabbable === undefined ? undefined : () => access(props.isTabbable)!,
    });

    return (
        <>
            {props.renderContent(() => access(props.flags))}

            <Index each={access(props.values)}>
                {(_getValue, index) => (
                    <input
                        id={suffixForThumb(access(props.id), index)}
                        ref={(element) => {
                            setElementRefs((refs) => {
                                const next = [...refs];

                                next[index] = element;

                                return next;
                            });

                            if (index === 0) props.ref?.(element);
                        }}
                        type="range"
                        name={suffixForThumb(access(props.name), index)}
                        class={[
                            styles.rangeElement,
                            styles.rangeOrientationVariants[access(props.orientation)],
                            props.computeValueAtPoint ? styles.rangeElementTracked : "",
                        ].join(" ")}
                        style={{
                            ...assignInlineVars({ [styles.thumbSizeVar]: `${access(props.thumbSize)}px` }),
                            "z-index": index === getActiveThumb() ? 1 : undefined,
                        }}
                        min={getThumbMin(index)}
                        max={getThumbMax(index)}
                        step={access(props.step)}
                        aria-label={access(props.thumbLabels)?.[index] ?? getAriaLabel()}
                        aria-valuetext={props.computeValueText?.(access(props.values)[index], index)}
                        aria-describedby={getAriaDescribedBy()}
                        aria-orientation={access(props.orientation) === "vertical" ? "vertical" : undefined}
                        aria-disabled={getIsDisabled() || undefined}
                        aria-required={access(props.isRequired) || undefined}
                        aria-invalid={access(props.flags).hasError || undefined}
                        onPointerDown={(e) => {
                            markChangeStart();

                            if (props.computeValueAtPoint) startTracking(e, e.currentTarget);
                            else raiseNearestThumb(e, e.currentTarget);
                        }}
                        onPointerMove={(e) => {
                            const element = e.currentTarget;

                            if (trackedPointerId === e.pointerId) writeTrackedValue(readTrackedValue(e, element));
                            else if (e.buttons === 0 && !props.computeValueAtPoint) raiseNearestThumb(e, element);
                        }}
                        onPointerUp={stopTracking}
                        onPointerCancel={stopTracking}
                        onLostPointerCapture={stopTracking}
                        onFocus={(e) => props.setFocusVisibleThumb(readFocusVisibleThumb(e.currentTarget, index))}
                        onKeyDown={(e) => {
                            markChangeStart();
                            props.setFocusVisibleThumb(readFocusVisibleThumb(e.currentTarget, index));
                        }}
                        onBlur={() => props.setFocusVisibleThumb(undefined)}
                        onInput={(e) => {
                            const element = e.currentTarget;

                            if (!getIsDisabled() && trackedPointerId === undefined) {
                                props.setValue(index, element.valueAsNumber);
                            }

                            syncElement(element, index);
                        }}
                        onChange={() => {
                            if (props.computeValueAtPoint && valuesAtChangeStart === undefined) return;

                            reportChangeEnd();
                        }}
                        onMouseEnter={(e) => {
                            if (getIsDisabled()) return;

                            void props.onMouseEnter?.(e);
                        }}
                        onMouseLeave={(e) => {
                            if (getIsDisabled()) return;

                            void props.onMouseLeave?.(e);
                        }}
                    />
                )}
            </Index>
        </>
    );
};

export const Range = (props: RangeProps) => {
    const hasSingle = props.valueSignal !== undefined;
    const hasPair = props.rangeSignal !== undefined;

    if (hasSingle === hasPair) {
        console.warn(
            "Range: give exactly one of valueSignal and rangeSignal — valueSignal drives a single thumb, rangeSignal drives a pair.",
        );
    }

    const [getFocusVisibleThumb, setFocusVisibleThumb] = createSignal<number>();

    const getOrientation = createMemo(() => access(props.orientation) ?? RANGE_DEFAULTS.orientation);

    const getMin = createMemo(() => access(props.min) ?? RANGE_DEFAULTS.min);

    const getMax = createMemo(() => access(props.max) ?? RANGE_DEFAULTS.max);

    const getStep = createMemo(() => access(props.step) ?? RANGE_DEFAULTS.step);

    const getThumbSize = createMemo(() => access(props.thumbSize) ?? RANGE_DEFAULTS.thumbSize);

    const getValues = createMemo(() => {
        const range = props.rangeSignal?.[0]();

        return range ? [range.start, range.end] : [props.valueSignal?.[0]() ?? getMin()];
    });

    const getRatios = createMemo(() => {
        return getValues().map((value) => MathUtils.clamp01(MathUtils.normalize(value, getMin(), getMax())));
    });

    const getFill = createMemo((): RangeSpan => {
        const ratios = getRatios();

        return ratios.length > 1 ? { start: ratios[0], end: ratios[ratios.length - 1] } : { start: 0, end: ratios[0] };
    });

    const setValue = (index: number, value: number) => {
        const range = props.rangeSignal?.[0]();

        if (range) {
            props.rangeSignal?.[1](index === 0 ? { ...range, start: value } : { ...range, end: value });
        } else {
            props.valueSignal?.[1](value);
        }

        void props.onInput?.(getValues());
    };

    return (
        <InteractionWrapper
            {...props}
            extraFlags={(): RangeRenderProps => ({
                orientation: getOrientation(),
                values: getValues(),
                ratios: getRatios(),
                fill: getFill(),
                focusVisibleThumb: getFocusVisibleThumb(),
            })}
            renderControl={(setElementRef, getRenderProps) => (
                <RangeElement
                    ref={setElementRef}
                    id={props.id}
                    name={props.name}
                    ariaLabel={props.ariaLabel}
                    thumbLabels={props.thumbLabels}
                    isRequired={props.isRequired}
                    orientation={getOrientation}
                    min={getMin}
                    max={getMax}
                    step={getStep}
                    thumbSize={getThumbSize}
                    flags={getRenderProps}
                    values={getValues}
                    isTabbable={props.isTabbable}
                    setValue={setValue}
                    setFocusVisibleThumb={setFocusVisibleThumb}
                    renderContent={props.renderContent}
                    computeValueText={props.computeValueText}
                    computeValueAtPoint={props.computeValueAtPoint}
                    onChangeEnd={props.onChangeEnd}
                    onMouseEnter={props.onMouseEnter}
                    onMouseLeave={props.onMouseLeave}
                />
            )}
        />
    );
};
