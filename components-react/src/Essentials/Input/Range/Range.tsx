import { type CSSProperties, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import {
    InteractionTrackerUtils,
    RANGE_DEFAULTS,
    type RangeRenderProps,
    RangeStyles,
    RangeUtils,
} from "@thewaver/ss-components";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { InteractionTrackerReactUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerReact.utils";
import { NavigatorReactUtils } from "../../../Abstracts/Navigator/NavigatorReact.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { useLatest } from "../../../Utils/refUtils";
import { FormFieldReactUtils } from "../FormField/FormFieldReact.utils";
import { LabelReactUtils } from "../Label/LabelReact.utils";
import type { RangeElementProps, RangeProps } from "./Range.types";

const readFocusVisibleThumb = (element: HTMLElement, index: number) =>
    InteractionTrackerUtils.computeIsFocusVisible(element) ? index : undefined;

const RangeElement = (props: RangeElementProps) => {
    const ariaLabel = LabelReactUtils.useAriaLabel(props.ariaLabel);
    const ariaDescribedBy = FormFieldReactUtils.useAriaDescribedBy();

    const firstRef = useRef<HTMLInputElement | null>(null);
    const elementsRef = useRef<(HTMLInputElement | undefined)[]>([]);

    const [elements, setElements] = useState<(HTMLInputElement | undefined)[]>([]);
    const [activeThumb, setActiveThumb] = useState(0);

    const direction = NavigatorReactUtils.useDirection(firstRef);

    const isDisabled = props.flags.isDisabled ?? false;
    const count = props.values.length;

    const latest = useLatest({ props, direction, isDisabled });

    const [thumbs] = useState(() =>
        RangeUtils.createThumbs({
            getValues: () => latest.current.props.values,
            getScale: () => ({
                orientation: latest.current.props.orientation,
                direction: latest.current.direction,
                min: latest.current.props.min,
                max: latest.current.props.max,
                step: latest.current.props.step,
                thumbSize: latest.current.props.thumbSize,
            }),
            getIsDisabled: () => latest.current.isDisabled,
            getComputeValueAtPoint: () => latest.current.props.computeValueAtPoint,
            getElement: (index) => elementsRef.current[index],
            setValue: (index, value) => latest.current.props.setValue(index, value),
            setActiveThumb,
            onChangeEnd: (values) => latest.current.props.onChangeEnd?.(values),
        }),
    );

    const refSetters = useMemo(
        () =>
            Array.from({ length: count }, (_, index) => (element: HTMLInputElement | null) => {
                elementsRef.current[index] = element ?? undefined;

                if (index === 0) {
                    firstRef.current = element;
                    latest.current.props.ref?.(element);
                }

                setElements((previous) => {
                    if (previous[index] === (element ?? undefined)) return previous;

                    const next = [...previous];

                    next[index] = element ?? undefined;

                    return next;
                });
            }),
        [count, latest],
    );

    useLayoutEffect(() => {
        elementsRef.current.forEach((element, index) => {
            if (element) thumbs.syncElement(element, index);
        });
    });

    useEffect(() => {
        const stops = elements.flatMap((element) => {
            if (!element) return [];

            const handleChange = () => thumbs.handleChange();

            element.addEventListener("change", handleChange);

            return [() => element.removeEventListener("change", handleChange)];
        });

        return () => {
            for (const stop of stops) stop();
        };
    }, [elements, thumbs]);

    FormFieldReactUtils.useRegisterControl(firstRef);

    InteractionTrackerReactUtils.useExtraControls(elements.slice(1, count), isDisabled, {
        isTabbable: props.isTabbable,
    });

    const className = [
        RangeStyles.rangeElement,
        RangeStyles.rangeOrientationVariants[props.orientation],
        props.computeValueAtPoint ? RangeStyles.rangeElementTracked : "",
    ].join(" ");

    return (
        <>
            {props.renderContent(props.flags)}

            {props.values.map((value, index) => {
                const bounds = RangeUtils.computeThumbBounds(props.values, index, props.min, props.max);

                return (
                    <input
                        key={index}
                        id={RangeUtils.suffixForThumb(props.id, index, count)}
                        ref={refSetters[index]}
                        type="range"
                        name={RangeUtils.suffixForThumb(props.name, index, count)}
                        className={className}
                        style={
                            {
                                ...assignInlineVars({ [RangeStyles.thumbSizeVar]: `${props.thumbSize}px` }),
                                zIndex: index === activeThumb ? 1 : undefined,
                            } as CSSProperties
                        }
                        min={bounds.min}
                        max={bounds.max}
                        step={props.step}
                        aria-label={props.thumbLabels?.[index] ?? ariaLabel}
                        aria-valuetext={props.computeValueText?.(value, index)}
                        aria-describedby={ariaDescribedBy}
                        aria-orientation={props.orientation === "vertical" ? "vertical" : undefined}
                        aria-disabled={isDisabled || undefined}
                        aria-required={props.isRequired || undefined}
                        aria-invalid={props.flags.hasError || undefined}
                        onPointerDown={(e) => thumbs.handlePointerDown(e.nativeEvent, e.currentTarget)}
                        onPointerMove={(e) => thumbs.handlePointerMove(e.nativeEvent, e.currentTarget)}
                        onPointerUp={(e) => thumbs.handlePointerEnd(e.nativeEvent)}
                        onPointerCancel={(e) => thumbs.handlePointerEnd(e.nativeEvent)}
                        onLostPointerCapture={(e) => thumbs.handlePointerEnd(e.nativeEvent)}
                        onFocus={(e) => props.setFocusVisibleThumb(readFocusVisibleThumb(e.currentTarget, index))}
                        onKeyDown={(e) => {
                            thumbs.handleKeyDown();
                            props.setFocusVisibleThumb(readFocusVisibleThumb(e.currentTarget, index));
                        }}
                        onBlur={() => props.setFocusVisibleThumb(undefined)}
                        onInput={(e) => thumbs.handleInput(e.currentTarget, index)}
                        onMouseEnter={(e) => {
                            if (isDisabled) return;

                            props.onMouseEnter?.(e);
                        }}
                        onMouseLeave={(e) => {
                            if (isDisabled) return;

                            props.onMouseLeave?.(e);
                        }}
                    />
                );
            })}
        </>
    );
};

export const Range = (props: RangeProps) => {
    const hasSingle = props.valueState !== undefined;
    const hasPair = props.rangeState !== undefined;

    useEffect(
        () => RangeUtils.warnIfAmbiguous(hasSingle, hasPair, { single: "valueState", pair: "rangeState" }),
        [hasSingle, hasPair],
    );

    const [focusVisibleThumb, setFocusVisibleThumb] = useState<number>();

    const orientation = props.orientation ?? RANGE_DEFAULTS.orientation;
    const min = props.min ?? RANGE_DEFAULTS.min;
    const max = props.max ?? RANGE_DEFAULTS.max;
    const step = props.step ?? RANGE_DEFAULTS.step;
    const thumbSize = props.thumbSize ?? RANGE_DEFAULTS.thumbSize;

    const range = props.rangeState?.[0];
    const values = RangeUtils.computeValues(range, props.valueState?.[0], min);
    const ratios = RangeUtils.computeRatios(values, min, max);

    const extraFlags: RangeRenderProps = {
        orientation,
        values,
        ratios,
        fill: RangeUtils.computeFill(ratios),
        focusVisibleThumb,
    };

    const setValue = (index: number, value: number) => {
        const next = values.map((held, at) => (at === index ? value : held));

        if (range) {
            props.rangeState?.[1](RangeUtils.computeMovedRange(range, index, value));
        } else {
            props.valueState?.[1](value);
        }

        props.onInput?.(next);
    };

    return (
        <InteractionWrapper<RangeRenderProps>
            {...props}
            extraFlags={extraFlags}
            renderControl={(setElementRef, flags) => (
                <RangeElement
                    ref={setElementRef}
                    id={props.id}
                    name={props.name}
                    ariaLabel={props.ariaLabel}
                    thumbLabels={props.thumbLabels}
                    isRequired={props.isRequired}
                    orientation={orientation}
                    min={min}
                    max={max}
                    step={step}
                    thumbSize={thumbSize}
                    flags={flags}
                    values={values}
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
