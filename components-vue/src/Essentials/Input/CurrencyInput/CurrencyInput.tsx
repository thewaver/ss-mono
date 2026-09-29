import { type SlotsType, computed, defineComponent, shallowRef } from "vue";

import { CURRENCY_INPUT_DEFAULTS, CurrencyInputUtils, TextSyncUtils } from "@thewaver/ss-components";

import { MaskedFieldVueUtils } from "../../../Abstracts/MaskedField/MaskedFieldVue.utils";
import { TextField } from "../../../Primitives/TextField/TextField";
import type { TextFieldSlots } from "../../../Primitives/TextField/TextField.types";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { declareProps, forwardProps, useTwoWay } from "../../../Utils/propUtils";
import { exposeElement, toElement } from "../../../Utils/refUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { CurrencyInputProps } from "./CurrencyInput.types";

const EMPTY_TEXT = "";

export const CurrencyInput = defineComponent(
    (props: CurrencyInputProps, { slots, expose }: SlotsContext<TextFieldSlots>) => {
        const value = useTwoWay(props, "value");

        const controlRef = shallowRef<HTMLElement>();

        exposeElement(expose, () => controlRef.value);

        const getDecimals = () => props.decimals ?? CURRENCY_INPUT_DEFAULTS.decimals;
        const getHasSign = () => props.hasSign ?? false;

        const groupDefs = computed(() =>
            CurrencyInputUtils.computeGroupDefs({
                locale: props.locale,
                groupSizes: props.groupSizes,
                decimals: getDecimals(),
                hasSign: getHasSign(),
            }),
        );

        const field = MaskedFieldVueUtils.useMaskedField<number>({
            ...CurrencyInputUtils.createFieldRules({
                getGroupDefs: () => groupDefs.value,
                getDecimals,
                getHasSign,
                getMin: () => props.min,
                getMax: () => props.max,
            }),
            getValue: () => value.value,
            setValue: (next) => {
                value.value = next;
            },
        });

        watchAfterRender([() => props.locale, () => props.groupSizes?.join(","), getDecimals, getHasSign], () => {
            const spelling = value.value === undefined ? EMPTY_TEXT : field.formatValue(value.value);

            if (spelling === field.text.value) return;

            field.text.value = spelling;
        });

        return () => (
            <TextField
                {...{
                    ...forwardProps(props, TextField),
                    "value": field.text.value,
                    "onUpdate:value": (next: string) => {
                        field.text.value = next;
                    },
                }}
                ref={(target) => {
                    controlRef.value = toElement(target);
                }}
                element={"input"}
                inputMode={"decimal"}
                computeMaskedText={(previous, next, caret) =>
                    TextSyncUtils.applyGroupedMask(groupDefs.value, previous, next, caret)
                }
                placeholderHint={CurrencyInputUtils.computeHint(groupDefs.value)}
                hasError={(props.hasError ?? false) || field.hasIssue.value}
                onInput={field.onInput}
                onBlur={field.onBlur}
            >
                {
                    {
                        renderContent: slots.renderContent,
                        renderPlaceholder: slots.renderPlaceholder,
                        renderLeading: slots.renderLeading,
                        renderTrailing: slots.renderTrailing,
                        renderDecoration: slots.renderDecoration,
                    } satisfies Partial<TextFieldSlots>
                }
            </TextField>
        );
    },
    {
        name: "CurrencyInput",
        slots: Object as SlotsType<TextFieldSlots>,
        props: declareProps<CurrencyInputProps>({
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
            "computeTextStyle": null,
            "onKeyDown": null,
            "onMouseEnter": null,
            "onMouseLeave": null,
            "id": null,
            "name": null,
            "ariaLabel": null,
            "isReadOnly": Boolean,
            "isRequired": Boolean,
            "autoComplete": null,
            "min": null,
            "max": null,
            "isConcealed": Boolean,
            "padding": null,
            "gap": null,
            "ariaAttributes": null,
            "decimals": null,
            "locale": null,
            "hasSign": Boolean,
            "groupSizes": null,
            "value": null,
            "onUpdate:value": null,
        }),
    },
);
