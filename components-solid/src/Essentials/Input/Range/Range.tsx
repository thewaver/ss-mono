import { Index, createMemo, createRenderEffect, createSignal } from "solid-js";

import {
    InteractionTrackerUtils,
    RANGE_DEFAULTS,
    type RangeRenderProps,
    RangeUtils,
    RangeStyles as styles,
} from "@thewaver/ss-components";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { InteractionTrackerSolidUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerSolid.utils";
import { NavigatorSolidUtils } from "../../../Abstracts/Navigator/NavigatorSolid.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { access } from "../../../Utils/propUtils";
import { FormFieldSolidUtils } from "../FormField/FormFieldSolid.utils";
import { LabelSolidUtils } from "../Label/LabelSolid.utils";
import type { RangeElementProps, RangeProps } from "./RangeSolid.types";

const readFocusVisibleThumb = (element: HTMLElement, index: number) =>
    InteractionTrackerUtils.computeIsFocusVisible(element) ? index : undefined;

const RangeElement = (props: RangeElementProps) => {
    const getAriaLabel = LabelSolidUtils.resolveAriaLabel(
        props.ariaLabel === undefined ? undefined : () => access(props.ariaLabel)!,
    );
    const getAriaDescribedBy = FormFieldSolidUtils.resolveAriaDescribedBy();

    const [getActiveThumb, setActiveThumb] = createSignal(0);
    const [getElementRefs, setElementRefs] = createSignal<HTMLInputElement[]>([]);

    const getDirection = NavigatorSolidUtils.createDirectionSignal(() => getElementRefs()[0]);

    const getIsDisabled = () => access(props.flags).isDisabled ?? false;

    const getThumbBounds = (index: number) =>
        RangeUtils.computeThumbBounds(access(props.values), index, access(props.min), access(props.max));

    const thumbs = RangeUtils.createThumbs({
        getValues: () => access(props.values),
        getScale: () => ({
            orientation: access(props.orientation),
            direction: getDirection(),
            min: access(props.min),
            max: access(props.max),
            step: access(props.step),
            thumbSize: access(props.thumbSize),
        }),
        getIsDisabled,
        getComputeValueAtPoint: () => props.computeValueAtPoint,
        getElement: (index) => getElementRefs()[index],
        setValue: (index, value) => props.setValue(index, value),
        setActiveThumb,
        onChangeEnd: (values) => void props.onChangeEnd?.(values),
    });

    createRenderEffect(() => {
        getElementRefs().forEach(thumbs.syncElement);
    });

    FormFieldSolidUtils.registerControl(() => getElementRefs()[0]);

    InteractionTrackerSolidUtils.wrapExtraControls(() => getElementRefs().slice(1), getIsDisabled, {
        getIsTabbable: props.isTabbable === undefined ? undefined : () => access(props.isTabbable)!,
    });

    return (
        <>
            {props.renderContent(() => access(props.flags))}

            <Index each={access(props.values)}>
                {(_getValue, index) => (
                    <input
                        id={RangeUtils.suffixForThumb(access(props.id), index, access(props.values).length)}
                        ref={(element) => {
                            setElementRefs((refs) => {
                                const next = [...refs];

                                next[index] = element;

                                return next;
                            });

                            if (index === 0) props.ref?.(element);
                        }}
                        type="range"
                        name={RangeUtils.suffixForThumb(access(props.name), index, access(props.values).length)}
                        class={[
                            styles.rangeElement,
                            styles.rangeOrientationVariants[access(props.orientation)],
                            props.computeValueAtPoint ? styles.rangeElementTracked : "",
                        ].join(" ")}
                        style={{
                            ...assignInlineVars({ [styles.thumbSizeVar]: `${access(props.thumbSize)}px` }),
                            "z-index": index === getActiveThumb() ? 1 : undefined,
                        }}
                        min={getThumbBounds(index).min}
                        max={getThumbBounds(index).max}
                        step={access(props.step)}
                        aria-label={access(props.thumbLabels)?.[index] ?? getAriaLabel()}
                        aria-valuetext={props.computeValueText?.(access(props.values)[index], index)}
                        aria-describedby={getAriaDescribedBy()}
                        aria-orientation={access(props.orientation) === "vertical" ? "vertical" : undefined}
                        aria-disabled={getIsDisabled() || undefined}
                        aria-required={access(props.isRequired) || undefined}
                        aria-invalid={access(props.flags).hasError || undefined}
                        onPointerDown={(e) => thumbs.handlePointerDown(e, e.currentTarget)}
                        onPointerMove={(e) => thumbs.handlePointerMove(e, e.currentTarget)}
                        onPointerUp={thumbs.handlePointerEnd}
                        onPointerCancel={thumbs.handlePointerEnd}
                        onLostPointerCapture={thumbs.handlePointerEnd}
                        onFocus={(e) => props.setFocusVisibleThumb(readFocusVisibleThumb(e.currentTarget, index))}
                        onKeyDown={(e) => {
                            thumbs.handleKeyDown();
                            props.setFocusVisibleThumb(readFocusVisibleThumb(e.currentTarget, index));
                        }}
                        onBlur={() => props.setFocusVisibleThumb(undefined)}
                        onInput={(e) => thumbs.handleInput(e.currentTarget, index)}
                        onChange={() => thumbs.handleChange()}
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

    RangeUtils.warnIfAmbiguous(hasSingle, hasPair, { single: "valueSignal", pair: "rangeSignal" });

    const [getFocusVisibleThumb, setFocusVisibleThumb] = createSignal<number>();

    const getOrientation = createMemo(() => access(props.orientation) ?? RANGE_DEFAULTS.orientation);

    const getMin = createMemo(() => access(props.min) ?? RANGE_DEFAULTS.min);

    const getMax = createMemo(() => access(props.max) ?? RANGE_DEFAULTS.max);

    const getStep = createMemo(() => access(props.step) ?? RANGE_DEFAULTS.step);

    const getThumbSize = createMemo(() => access(props.thumbSize) ?? RANGE_DEFAULTS.thumbSize);

    const getValues = createMemo(() =>
        RangeUtils.computeValues(props.rangeSignal?.[0](), props.valueSignal?.[0](), getMin()),
    );

    const getRatios = createMemo(() => RangeUtils.computeRatios(getValues(), getMin(), getMax()));

    const getFill = createMemo(() => RangeUtils.computeFill(getRatios()));

    const setValue = (index: number, value: number) => {
        const range = props.rangeSignal?.[0]();

        if (range) {
            props.rangeSignal?.[1](RangeUtils.computeMovedRange(range, index, value));
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
