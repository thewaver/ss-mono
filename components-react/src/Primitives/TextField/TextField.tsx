import { type CSSProperties, type RefObject, useCallback, useLayoutEffect, useRef, useState } from "react";

import {
    TEXT_FIELD_DEFAULTS,
    type TextFieldFlags,
    TextFieldStyles,
    TextFieldUtils,
    type TextSyncElement,
} from "@thewaver/ss-components";
import { CSSUtils } from "@thewaver/ss-utils";

import { ElementObserverReactUtils } from "../../Abstracts/ElementObserver/ElementObserverReact.utils";
import { TextSyncReactUtils } from "../../Abstracts/TextSync/TextSyncReact.utils";
import { FormFieldReactUtils } from "../../Essentials/Input/FormField/FormFieldReact.utils";
import { LabelReactUtils } from "../../Essentials/Input/Label/LabelReact.utils";
import { useElement, useLatest } from "../../Utils/refUtils";
import { InteractionWrapper } from "../InteractionWrapper/InteractionWrapper";
import type { TextFieldElementProps, TextFieldProps } from "./TextField.types";

const useAutoHeight = (
    ref: RefObject<HTMLElement | null>,
    isDisabled: boolean,
    minRows: number,
    maxRows: number | undefined,
    value: string,
) => {
    const element = useElement(ref);
    const [height, setHeight] = useState(0);
    const latest = useLatest({ minRows, maxRows });

    useLayoutEffect(() => {
        if (!element || isDisabled) {
            setHeight(0);
            return;
        }

        setHeight(TextFieldUtils.measureContentHeight(element, minRows, maxRows));
    }, [element, isDisabled, minRows, maxRows, value]);

    useLayoutEffect(() => {
        if (!element || isDisabled) return;

        return TextFieldUtils.observeWidthChange(element, () =>
            setHeight(TextFieldUtils.measureContentHeight(element, latest.current.minRows, latest.current.maxRows)),
        );
    }, [element, isDisabled, latest]);

    return height;
};

const TextFieldElement = (props: TextFieldElementProps) => {
    const ariaLabel = LabelReactUtils.useAriaLabel(props.ariaLabel);
    const ariaDescribedBy = FormFieldReactUtils.useAriaDescribedBy();

    const elementRef = useRef<TextSyncElement | null>(null);
    const latestRef = useLatest(props.ref);

    FormFieldReactUtils.useRegisterControl(elementRef);

    const isDisabled = props.flags.isDisabled ?? false;
    const isReadOnly = props.flags.isReadOnly;
    const isTextArea = props.element === "textarea";
    const isAutoSizing = TextFieldUtils.computeIsAutoSizing(props.element, props.isAutoSizing);
    const type = TextFieldUtils.computeType(props.element, props.type);
    const isNumber = type === "number";
    const isSpinButton = props.isSpinButton ?? false;
    const valueNow = isSpinButton ? TextFieldUtils.computeSpinValue(props.value, props.computeSpinValue) : undefined;

    const { handleInput, handleCompositionStart, handleCompositionEnd } = TextSyncReactUtils.useValueSync(
        elementRef,
        props.value,
        {
            onInput: (value) => props.onInput?.(value),
            computeMaskedText: props.computeMaskedText,
        },
    );

    const setRef = useCallback(
        (element: TextSyncElement | null) => {
            elementRef.current = element;
            latestRef.current?.(element);
        },
        [latestRef],
    );

    const Element = props.element;

    const className = [
        TextFieldStyles.textFieldElement,
        isTextArea && TextFieldStyles.textFieldTextArea,
        (props.isConcealed ?? false) && TextFieldStyles.textFieldConcealed,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <>
            {props.renderContent(props.flags)}

            {props.renderPlaceholder && (
                <div className={TextFieldStyles.textFieldPlaceholder} style={props.textInset}>
                    {props.renderPlaceholder(props.flags, props.placeholderHint)}
                </div>
            )}

            <Element
                id={props.id}
                ref={setRef}
                type={type}
                rows={isAutoSizing ? 1 : undefined}
                name={props.name}
                className={className}
                style={{
                    ...props.textInset,
                    ...props.computeTextStyle?.(props.flags),
                    overflowY: TextFieldUtils.computeOverflowY(props.element, isAutoSizing, props.maxRows),
                }}
                autoComplete={props.autoComplete}
                inputMode={props.inputMode}
                min={isNumber ? props.min : undefined}
                max={isNumber ? props.max : undefined}
                step={isNumber ? props.step : undefined}
                readOnly={isDisabled || isReadOnly}
                role={isSpinButton ? "spinbutton" : undefined}
                aria-label={ariaLabel}
                aria-describedby={ariaDescribedBy}
                aria-valuenow={valueNow}
                aria-valuemin={isSpinButton ? props.min : undefined}
                aria-valuemax={isSpinButton ? props.max : undefined}
                aria-disabled={isDisabled || undefined}
                aria-readonly={isReadOnly || undefined}
                aria-required={props.isRequired || undefined}
                aria-invalid={props.flags.hasError || undefined}
                {...props.ariaAttributes}
                onInput={(e) => handleInput(e.currentTarget)}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={(e) => handleCompositionEnd(e.currentTarget)}
                onKeyDown={(e) => {
                    if (isDisabled) return;

                    props.onKeyDown?.(e);
                }}
                onBlur={() => {
                    if (isDisabled) return;

                    props.onBlur?.();
                }}
                onMouseEnter={(e) => {
                    if (isDisabled) return;

                    props.onMouseEnter?.(e);
                }}
                onMouseLeave={(e) => {
                    if (isDisabled) return;

                    props.onMouseLeave?.(e);
                }}
            />

            {props.renderLeading && (
                <div
                    ref={props.setLeadingRef}
                    className={TextFieldStyles.textFieldAdornment}
                    style={{ left: `${props.spreadPadding.paddingLeft}px` }}
                >
                    {props.renderLeading(props.flags)}
                </div>
            )}

            {props.renderTrailing && (
                <div
                    ref={props.setTrailingRef}
                    className={TextFieldStyles.textFieldAdornment}
                    style={{ right: `${props.spreadPadding.paddingRight}px` }}
                >
                    {props.renderTrailing(props.flags)}
                </div>
            )}
        </>
    );
};

export const TextField = (props: TextFieldProps) => {
    const [value, setValue] = props.value;

    const controlRef = useRef<HTMLElement | null>(null);
    const leadingRef = useRef<HTMLDivElement | null>(null);
    const trailingRef = useRef<HTMLDivElement | null>(null);

    const leadingSize = ElementObserverReactUtils.useBorderBoxSize(leadingRef, !props.renderLeading);
    const trailingSize = ElementObserverReactUtils.useBorderBoxSize(trailingRef, !props.renderTrailing);

    const isAutoSizing = TextFieldUtils.computeIsAutoSizing(props.element, props.isAutoSizing);
    const minRows = props.minRows ?? TEXT_FIELD_DEFAULTS.minRows;

    const minHeight = useAutoHeight(controlRef, !isAutoSizing, minRows, props.maxRows, value);

    const spreadPadding = TextFieldUtils.resolvePadding(props.padding ?? TEXT_FIELD_DEFAULTS.padding);
    const gap = props.gap ?? TEXT_FIELD_DEFAULTS.gap;

    const leadingInset = TextFieldUtils.computeInset(
        spreadPadding.paddingLeft,
        props.renderLeading ? leadingSize.width : 0,
        gap,
    );
    const trailingInset = TextFieldUtils.computeInset(
        spreadPadding.paddingRight,
        props.renderTrailing ? trailingSize.width : 0,
        gap,
    );

    const textInset = CSSUtils.spreadableToStyle(
        { ...spreadPadding, paddingLeft: leadingInset, paddingRight: trailingInset },
        String,
    ) as CSSProperties;

    const extraFlags: TextFieldFlags = { isEmpty: value === "", isReadOnly: props.isReadOnly ?? false };

    const setLeadingRef = useCallback((element: HTMLDivElement | null) => {
        leadingRef.current = element;
    }, []);

    const setTrailingRef = useCallback((element: HTMLDivElement | null) => {
        trailingRef.current = element;
    }, []);

    return (
        <InteractionWrapper<TextFieldFlags>
            {...props}
            extraFlags={extraFlags}
            minWidth={leadingInset + trailingInset}
            minHeight={minHeight}
            renderControl={(setElementRef, flags) => (
                <TextFieldElement
                    ref={(element) => {
                        setElementRef(element);
                        controlRef.current = element;
                    }}
                    id={props.id}
                    element={props.element}
                    type={props.type}
                    name={props.name}
                    ariaLabel={props.ariaLabel}
                    isSpinButton={props.isSpinButton}
                    isRequired={props.isRequired}
                    autoComplete={props.autoComplete}
                    inputMode={props.inputMode}
                    computeMaskedText={props.computeMaskedText}
                    computeSpinValue={props.computeSpinValue}
                    placeholderHint={props.placeholderHint}
                    min={props.min}
                    max={props.max}
                    step={props.step}
                    isAutoSizing={isAutoSizing}
                    minRows={minRows}
                    maxRows={props.maxRows}
                    isConcealed={props.isConcealed}
                    flags={flags}
                    value={value}
                    textInset={textInset}
                    spreadPadding={spreadPadding}
                    setLeadingRef={setLeadingRef}
                    setTrailingRef={setTrailingRef}
                    computeTextStyle={props.computeTextStyle}
                    renderContent={props.renderContent}
                    renderPlaceholder={props.renderPlaceholder}
                    renderLeading={props.renderLeading}
                    renderTrailing={props.renderTrailing}
                    ariaAttributes={props.ariaAttributes}
                    onInput={(next) => {
                        setValue(next);

                        props.onInput?.(next);
                    }}
                    onKeyDown={props.onKeyDown}
                    onBlur={props.onBlur}
                    onMouseEnter={props.onMouseEnter}
                    onMouseLeave={props.onMouseLeave}
                />
            )}
        />
    );
};
