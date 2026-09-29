import type { Accessor } from "solid-js";
import { createEffect, createMemo, createSignal, onCleanup } from "solid-js";
import { Dynamic } from "solid-js/web";

import {
    ElementObserverUtils,
    TEXT_FIELD_DEFAULTS,
    TextFieldUtils,
    type TextSyncElement,
    TextFieldStyles as styles,
} from "@thewaver/ss-components";
import { CSSUtils, StringUtils } from "@thewaver/ss-utils";

import { TextSyncSolidUtils } from "../../Abstracts/TextSync/TextSyncSolid.utils";
import { FormFieldSolidUtils } from "../../Essentials/Input/FormField/FormFieldSolid.utils";
import { LabelSolidUtils } from "../../Essentials/Input/Label/LabelSolid.utils";
import { access } from "../../Utils/propUtils";
import { InteractionWrapper } from "../InteractionWrapper/InteractionWrapper";
import type { TextFieldElementProps, TextFieldProps } from "./TextFieldSolid.types";

const createAdornmentWidth = (getRef: Accessor<HTMLElement | undefined>) => {
    const [getWidth, setWidth] = createSignal(0);

    createEffect(() => {
        const ref = getRef();

        if (!ref) {
            setWidth(0);
            return;
        }

        onCleanup(ElementObserverUtils.observeBorderBoxSize(ref, (size) => setWidth(size.width)));
    });

    return getWidth;
};

const createAutoHeight = (
    getRef: Accessor<HTMLElement | undefined>,
    getIsDisabled: Accessor<boolean>,
    getMinRows: Accessor<number>,
    getMaxRows: Accessor<number | undefined>,
    getValue: Accessor<string>,
) => {
    const [getHeight, setHeight] = createSignal(0);

    const measure = (element: HTMLElement) => {
        setHeight(TextFieldUtils.measureContentHeight(element, getMinRows(), getMaxRows()));
    };

    createEffect(() => {
        const ref = getRef();

        if (!ref || getIsDisabled()) {
            setHeight(0);
            return;
        }

        getValue();
        getMinRows();
        getMaxRows();

        measure(ref);
    });

    createEffect(() => {
        const ref = getRef();

        if (!ref || getIsDisabled()) return;

        onCleanup(TextFieldUtils.observeWidthChange(ref, () => measure(ref)));
    });

    return getHeight;
};

const TextFieldElement = (props: TextFieldElementProps) => {
    const getAriaLabel = LabelSolidUtils.resolveAriaLabel(
        props.ariaLabel === undefined ? undefined : () => access(props.ariaLabel)!,
    );
    const getAriaDescribedBy = FormFieldSolidUtils.resolveAriaDescribedBy();

    const [getElementRef, setElementRef] = createSignal<TextSyncElement>();

    FormFieldSolidUtils.registerControl(getElementRef);

    const getIsDisabled = () => access(props.flags).isDisabled ?? false;

    const getIsReadOnly = () => access(props.flags).isReadOnly;

    const getIsTextArea = () => access(props.element) === "textarea";

    const getIsAutoSizing = () => TextFieldUtils.computeIsAutoSizing(access(props.element), access(props.isAutoSizing));

    const getType = () => TextFieldUtils.computeType(access(props.element), access(props.type));

    const getIsSpinButton = () => access(props.isSpinButton) ?? false;

    const getValueNow = () => TextFieldUtils.computeSpinValue(access(props.value), props.computeSpinValue);

    const getOverflowY = () =>
        TextFieldUtils.computeOverflowY(access(props.element), getIsAutoSizing(), access(props.maxRows));

    const { handleInput, handleCompositionStart, handleCompositionEnd } = TextSyncSolidUtils.createValueSync(
        getElementRef,
        () => access(props.value),
        {
            onInput: (value) => {
                void props.onInput?.(value);
            },
            computeMaskedText: props.computeMaskedText,
        },
    );

    return (
        <>
            {props.renderContent(() => access(props.flags))}

            {props.renderPlaceholder && (
                <div class={styles.textFieldPlaceholder} style={access(props.textInset)}>
                    {props.renderPlaceholder(() => access(props.flags), access(props.placeholderHint))}
                </div>
            )}

            <Dynamic
                component={access(props.element)}
                id={access(props.id)}
                ref={(element: TextSyncElement) => {
                    setElementRef(element);
                    props.ref?.(element);
                }}
                type={getType()}
                rows={getIsAutoSizing() ? 1 : undefined}
                name={access(props.name)}
                class={styles.textFieldElement}
                classList={{
                    [styles.textFieldTextArea]: getIsTextArea(),
                    [styles.textFieldConcealed]: access(props.isConcealed) ?? false,
                }}
                style={{
                    ...access(props.textInset),
                    ...props.computeTextStyle?.(() => access(props.flags)),
                    "overflow-y": getOverflowY(),
                }}
                autocomplete={access(props.autoComplete)}
                inputMode={access(props.inputMode)}
                min={getType() === "number" ? access(props.min) : undefined}
                max={getType() === "number" ? access(props.max) : undefined}
                step={getType() === "number" ? access(props.step) : undefined}
                readOnly={getIsDisabled() || getIsReadOnly()}
                role={getIsSpinButton() ? "spinbutton" : undefined}
                aria-label={getAriaLabel()}
                aria-describedby={getAriaDescribedBy()}
                aria-valuenow={getIsSpinButton() ? getValueNow() : undefined}
                aria-valuemin={getIsSpinButton() ? access(props.min) : undefined}
                aria-valuemax={getIsSpinButton() ? access(props.max) : undefined}
                aria-disabled={getIsDisabled() || undefined}
                aria-readonly={getIsReadOnly() || undefined}
                aria-required={access(props.isRequired) || undefined}
                aria-invalid={access(props.flags).hasError || undefined}
                {...access(props.ariaAttributes)}
                onInput={(e: InputEvent & { currentTarget: TextSyncElement }) => handleInput(e.currentTarget)}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={(e: CompositionEvent & { currentTarget: TextSyncElement }) =>
                    handleCompositionEnd(e.currentTarget)
                }
                onKeyDown={(e: KeyboardEvent) => {
                    if (getIsDisabled()) return;

                    void props.onKeyDown?.(e);
                }}
                onBlur={() => {
                    if (getIsDisabled()) return;

                    void props.onBlur?.();
                }}
                onMouseEnter={(e: MouseEvent) => {
                    if (getIsDisabled()) return;

                    void props.onMouseEnter?.(e);
                }}
                onMouseLeave={(e: MouseEvent) => {
                    if (getIsDisabled()) return;

                    void props.onMouseLeave?.(e);
                }}
            />

            {props.renderLeading && (
                <div
                    ref={props.setLeadingRef}
                    class={styles.textFieldAdornment}
                    style={{ left: `${access(props.spreadPadding).paddingLeft}px` }}
                >
                    {props.renderLeading(() => access(props.flags))}
                </div>
            )}

            {props.renderTrailing && (
                <div
                    ref={props.setTrailingRef}
                    class={styles.textFieldAdornment}
                    style={{ right: `${access(props.spreadPadding).paddingRight}px` }}
                >
                    {props.renderTrailing(() => access(props.flags))}
                </div>
            )}
        </>
    );
};

export const TextField = (props: TextFieldProps) => {
    const [getControlRef, setControlRef] = createSignal<HTMLElement>();
    const [getLeadingRef, setLeadingRef] = createSignal<HTMLElement>();
    const [getTrailingRef, setTrailingRef] = createSignal<HTMLElement>();

    const getLeadingWidth = createAdornmentWidth(getLeadingRef);
    const getTrailingWidth = createAdornmentWidth(getTrailingRef);

    const getIsAutoSizing = createMemo(() =>
        TextFieldUtils.computeIsAutoSizing(access(props.element), access(props.isAutoSizing)),
    );

    const getMinRows = () => access(props.minRows) ?? TEXT_FIELD_DEFAULTS.minRows;

    const getMaxRows = () => access(props.maxRows);

    const getMinHeight = createAutoHeight(
        getControlRef,
        () => !getIsAutoSizing(),
        getMinRows,
        getMaxRows,
        () => props.value[0](),
    );

    const getSpreadPadding = createMemo(() =>
        TextFieldUtils.resolvePadding(access(props.padding) ?? TEXT_FIELD_DEFAULTS.padding),
    );

    const getGap = () => access(props.gap) ?? TEXT_FIELD_DEFAULTS.gap;

    const getLeadingInset = createMemo(() =>
        TextFieldUtils.computeInset(getSpreadPadding().paddingLeft, getLeadingWidth(), getGap()),
    );

    const getTrailingInset = createMemo(() =>
        TextFieldUtils.computeInset(getSpreadPadding().paddingRight, getTrailingWidth(), getGap()),
    );

    const getTextInset = createMemo(() =>
        CSSUtils.spreadableToStyle(
            { ...getSpreadPadding(), paddingLeft: getLeadingInset(), paddingRight: getTrailingInset() },
            StringUtils.camelToKebabCase,
        ),
    );

    return (
        <InteractionWrapper
            {...props}
            extraFlags={() => ({
                isEmpty: props.value[0]() === "",
                isReadOnly: access(props.isReadOnly) ?? false,
            })}
            minWidth={() => getLeadingInset() + getTrailingInset()}
            minHeight={getMinHeight}
            renderControl={(setElementRef, getFlags) => (
                <TextFieldElement
                    ref={(element) => {
                        setElementRef(element);
                        setControlRef(element);
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
                    isAutoSizing={getIsAutoSizing}
                    minRows={getMinRows}
                    maxRows={props.maxRows}
                    isConcealed={props.isConcealed}
                    flags={getFlags}
                    value={() => props.value[0]()}
                    textInset={getTextInset}
                    spreadPadding={getSpreadPadding}
                    setLeadingRef={setLeadingRef}
                    setTrailingRef={setTrailingRef}
                    computeTextStyle={props.computeTextStyle}
                    renderContent={props.renderContent}
                    renderPlaceholder={props.renderPlaceholder}
                    renderLeading={props.renderLeading}
                    renderTrailing={props.renderTrailing}
                    ariaAttributes={props.ariaAttributes}
                    onInput={(value) => {
                        props.value[1](value);

                        void props.onInput?.(value);
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
