import {
    type CSSProperties,
    type ComponentPublicInstance,
    type MaybeRefOrGetter,
    type SlotsType,
    defineComponent,
    shallowRef,
    toValue,
} from "vue";

import {
    TEXT_FIELD_DEFAULTS,
    type TextFieldFlags,
    TextFieldStyles,
    TextFieldUtils,
    type TextSyncElement,
} from "@thewaver/ss-components";
import { CSSUtils } from "@thewaver/ss-utils";

import { ElementObserverVueUtils } from "../../Abstracts/ElementObserver/ElementObserverVue.utils";
import { TextSyncVueUtils } from "../../Abstracts/TextSync/TextSyncVue.utils";
import { FormFieldVueUtils } from "../../Essentials/Input/FormField/FormFieldVue.utils";
import { LabelVueUtils } from "../../Essentials/Input/Label/LabelVue.utils";
import { watchAfterRender } from "../../Utils/effectUtils";
import { callSlot, declareProps, forwardProps, useTwoWay } from "../../Utils/propUtils";
import { exposeElement, toElement } from "../../Utils/refUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import { InteractionWrapper } from "../InteractionWrapper/InteractionWrapper";
import type { InteractionWrapperSlots } from "../InteractionWrapper/InteractionWrapper.types";
import type {
    TextFieldElementProps,
    TextFieldElementSlots,
    TextFieldProps,
    TextFieldSlots,
} from "./TextField.types";

const useAutoHeight = (
    ref: MaybeRefOrGetter<HTMLElement | undefined>,
    isDisabled: MaybeRefOrGetter<boolean>,
    minRows: MaybeRefOrGetter<number>,
    maxRows: MaybeRefOrGetter<number | undefined>,
    value: MaybeRefOrGetter<string>,
) => {
    const height = shallowRef(0);

    watchAfterRender(
        [
            () => toValue(ref),
            () => toValue(isDisabled),
            () => toValue(minRows),
            () => toValue(maxRows),
            () => toValue(value),
        ],
        ([element, isOff, min, max]) => {
            if (!element || isOff) {
                height.value = 0;
                return;
            }

            height.value = TextFieldUtils.measureContentHeight(element, min, max);
        },
    );

    watchAfterRender([() => toValue(ref), () => toValue(isDisabled)], ([element, isOff]) => {
        if (!element || isOff) return;

        return TextFieldUtils.observeWidthChange(element, () => {
            height.value = TextFieldUtils.measureContentHeight(element, toValue(minRows), toValue(maxRows));
        });
    });

    return height;
};

const TextFieldElement = defineComponent(
    (props: TextFieldElementProps, { slots, expose }: SlotsContext<TextFieldElementSlots>) => {
        const ariaLabel = LabelVueUtils.useAriaLabel(() => props.ariaLabel);
        const ariaDescribedBy = FormFieldVueUtils.useAriaDescribedBy();

        const elementRef = shallowRef<TextSyncElement>();

        exposeElement(expose, () => elementRef.value);

        FormFieldVueUtils.useRegisterControl(elementRef);

        const { handleInput, handleCompositionStart, handleCompositionEnd } = TextSyncVueUtils.useValueSync(
            elementRef,
            () => props.value,
            {
                onInput: (value) => props.onInput?.(value),
                getComputeMaskedText: () => props.computeMaskedText,
            },
        );

        return () => {
            const isDisabled = props.flags.isDisabled ?? false;
            const isReadOnly = props.flags.isReadOnly;
            const isTextArea = props.element === "textarea";
            const isAutoSizing = TextFieldUtils.computeIsAutoSizing(props.element, props.isAutoSizing);
            const type = TextFieldUtils.computeType(props.element, props.type);
            const isNumber = type === "number";
            const isSpinButton = props.isSpinButton ?? false;
            const valueNow = isSpinButton
                ? TextFieldUtils.computeSpinValue(props.value, props.computeSpinValue)
                : undefined;

            const attributes = {
                "id": props.id,
                "ref": (target: Element | ComponentPublicInstance | null) => {
                    elementRef.value = toElement<TextSyncElement>(target);
                },
                "type": type,
                "rows": isAutoSizing ? 1 : undefined,
                "name": props.name,
                "class": [
                    TextFieldStyles.textFieldElement,
                    isTextArea && TextFieldStyles.textFieldTextArea,
                    (props.isConcealed ?? false) && TextFieldStyles.textFieldConcealed,
                ],
                "style": [
                    props.textInset,
                    props.computeTextStyle?.(props.flags),
                    {
                        overflowY: TextFieldUtils.computeOverflowY(
                            props.element,
                            isAutoSizing,
                            props.maxRows,
                        ) as CSSProperties["overflowY"],
                    },
                ],
                "autocomplete": props.autoComplete,
                "inputmode": props.inputMode,
                "min": isNumber ? props.min : undefined,
                "max": isNumber ? props.max : undefined,
                "step": isNumber ? props.step : undefined,
                "readonly": isDisabled || isReadOnly,
                "role": isSpinButton ? "spinbutton" : undefined,
                "aria-label": ariaLabel.value,
                "aria-describedby": ariaDescribedBy.value,
                "aria-valuenow": valueNow,
                "aria-valuemin": isSpinButton ? props.min : undefined,
                "aria-valuemax": isSpinButton ? props.max : undefined,
                "aria-disabled": isDisabled || undefined,
                "aria-readonly": isReadOnly || undefined,
                "aria-required": props.isRequired || undefined,
                "aria-invalid": props.flags.hasError || undefined,
                ...props.ariaAttributes,
                "onInput": (e: Event) => handleInput(e.currentTarget as TextSyncElement),
                "onCompositionstart": () => handleCompositionStart(),
                "onCompositionend": (e: CompositionEvent) => handleCompositionEnd(e.currentTarget as TextSyncElement),
                "onKeydown": (e: KeyboardEvent) => {
                    if (isDisabled) return;

                    props.onKeyDown?.(e);
                },
                "onBlur": () => {
                    if (isDisabled) return;

                    props.onBlur?.();
                },
                "onMouseenter": (e: MouseEvent) => {
                    if (isDisabled) return;

                    props.onMouseEnter?.(e);
                },
                "onMouseleave": (e: MouseEvent) => {
                    if (isDisabled) return;

                    props.onMouseLeave?.(e);
                },
            };

            return (
                <>
                    {callSlot(slots.renderContent, props.flags)}

                    {slots.renderPlaceholder && (
                        <div class={TextFieldStyles.textFieldPlaceholder} style={props.textInset}>
                            {callSlot(slots.renderPlaceholder, { flags: props.flags, hint: props.placeholderHint })}
                        </div>
                    )}

                    {isTextArea ? <textarea {...attributes} /> : <input {...attributes} />}

                    {slots.renderLeading && (
                        <div
                            ref={(target) => props.setLeadingRef(toElement(target))}
                            class={TextFieldStyles.textFieldAdornment}
                            style={{ left: `${props.spreadPadding.paddingLeft}px` }}
                        >
                            {callSlot(slots.renderLeading, props.flags)}
                        </div>
                    )}

                    {slots.renderTrailing && (
                        <div
                            ref={(target) => props.setTrailingRef(toElement(target))}
                            class={TextFieldStyles.textFieldAdornment}
                            style={{ right: `${props.spreadPadding.paddingRight}px` }}
                        >
                            {callSlot(slots.renderTrailing, props.flags)}
                        </div>
                    )}
                </>
            );
        };
    },
    {
        name: "TextFieldElement",
        props: declareProps<TextFieldElementProps>({
            computeMaskedText: null,
            computeTextStyle: null,
            computeSpinValue: null,
            onInput: null,
            onKeyDown: null,
            onBlur: null,
            onMouseEnter: null,
            onMouseLeave: null,
            id: null,
            ariaLabel: null,
            flags: null,
            element: null,
            type: null,
            name: null,
            isReadOnly: Boolean,
            isRequired: Boolean,
            isSpinButton: Boolean,
            autoComplete: null,
            inputMode: null,
            placeholderHint: null,
            min: null,
            max: null,
            step: null,
            isAutoSizing: Boolean,
            minRows: null,
            maxRows: null,
            isConcealed: Boolean,
            value: null,
            textInset: null,
            spreadPadding: null,
            setLeadingRef: null,
            setTrailingRef: null,
            ariaAttributes: null,
        }),
    },
);

export const TextField = defineComponent(
    (props: TextFieldProps, { slots, expose }: SlotsContext<TextFieldSlots>) => {
        const value = useTwoWay(props, "value", "");

        const controlRef = shallowRef<HTMLElement>();
        const leadingRef = shallowRef<HTMLElement>();
        const trailingRef = shallowRef<HTMLElement>();

        exposeElement(expose, () => controlRef.value);

        const leadingSize = ElementObserverVueUtils.useBorderBoxSize(leadingRef, () => !slots.renderLeading);
        const trailingSize = ElementObserverVueUtils.useBorderBoxSize(trailingRef, () => !slots.renderTrailing);

        const getIsAutoSizing = () => TextFieldUtils.computeIsAutoSizing(props.element, props.isAutoSizing);
        const getMinRows = () => props.minRows ?? TEXT_FIELD_DEFAULTS.minRows;

        const minHeight = useAutoHeight(controlRef, () => !getIsAutoSizing(), getMinRows, () => props.maxRows, value);

        const setLeadingRef = (element: HTMLElement | undefined) => {
            leadingRef.value = element;
        };

        const setTrailingRef = (element: HTMLElement | undefined) => {
            trailingRef.value = element;
        };

        return () => {
            const spreadPadding = TextFieldUtils.resolvePadding(props.padding ?? TEXT_FIELD_DEFAULTS.padding);
            const gap = props.gap ?? TEXT_FIELD_DEFAULTS.gap;

            const leadingInset = TextFieldUtils.computeInset(
                spreadPadding.paddingLeft,
                slots.renderLeading ? leadingSize.value.width : 0,
                gap,
            );
            const trailingInset = TextFieldUtils.computeInset(
                spreadPadding.paddingRight,
                slots.renderTrailing ? trailingSize.value.width : 0,
                gap,
            );

            const textInset = CSSUtils.spreadableToStyle(
                { ...spreadPadding, paddingLeft: leadingInset, paddingRight: trailingInset },
                String,
            );

            const extraFlags: TextFieldFlags = { isEmpty: value.value === "", isReadOnly: props.isReadOnly ?? false };

            return (
                <InteractionWrapper
                    {...forwardProps(props, InteractionWrapper)}
                    extraFlags={extraFlags}
                    minWidth={leadingInset + trailingInset}
                    minHeight={minHeight.value}
                >
                    {
                        {
                            renderControl: ({ setElementRef, flags }) => (
                                <TextFieldElement
                                    ref={(target) => {
                                        setElementRef(target);
                                        controlRef.value = toElement(target);
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
                                    isAutoSizing={getIsAutoSizing()}
                                    minRows={getMinRows()}
                                    maxRows={props.maxRows}
                                    isConcealed={props.isConcealed}
                                    flags={flags}
                                    value={value.value}
                                    textInset={textInset}
                                    spreadPadding={spreadPadding}
                                    setLeadingRef={setLeadingRef}
                                    setTrailingRef={setTrailingRef}
                                    computeTextStyle={props.computeTextStyle}
                                    ariaAttributes={props.ariaAttributes}
                                    onInput={(next) => {
                                        value.value = next;

                                        props.onInput?.(next);
                                    }}
                                    onKeyDown={props.onKeyDown}
                                    onBlur={props.onBlur}
                                    onMouseEnter={props.onMouseEnter}
                                    onMouseLeave={props.onMouseLeave}
                                >
                                    {
                                        {
                                            renderContent: slots.renderContent,
                                            renderPlaceholder: slots.renderPlaceholder,
                                            renderLeading: slots.renderLeading,
                                            renderTrailing: slots.renderTrailing,
                                        } satisfies Partial<TextFieldElementSlots>
                                    }
                                </TextFieldElement>
                            ),
                            renderDecoration: slots.renderDecoration,
                        } satisfies Partial<InteractionWrapperSlots<TextFieldFlags>>
                    }
                </InteractionWrapper>
            );
        };
    },
    {
        name: "TextField",
        slots: Object as SlotsType<TextFieldSlots>,
        props: declareProps<TextFieldProps>({
            "isDisabled": Boolean,
            "isPressed": Boolean,
            "hasError": Boolean,
            "role": null,
            "sizing": null,
            "isReachableWhenDisabled": Boolean,
            "isFocusableWhenDisabled": Boolean,
            "isTabbable": Boolean,
            "onActivation": null,
            "tooltipDefs": null,
            "computeMaskedText": null,
            "computeTextStyle": null,
            "computeSpinValue": null,
            "onInput": null,
            "onKeyDown": null,
            "onBlur": null,
            "onMouseEnter": null,
            "onMouseLeave": null,
            "id": null,
            "element": null,
            "type": null,
            "name": null,
            "ariaLabel": null,
            "isReadOnly": Boolean,
            "isRequired": Boolean,
            "isSpinButton": Boolean,
            "autoComplete": null,
            "inputMode": null,
            "placeholderHint": null,
            "min": null,
            "max": null,
            "step": null,
            "isAutoSizing": Boolean,
            "minRows": null,
            "maxRows": null,
            "isConcealed": Boolean,
            "padding": null,
            "gap": null,
            "value": null,
            "onUpdate:value": null,
            "ariaAttributes": null,
        }),
    },
);
