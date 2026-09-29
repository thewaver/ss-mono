import { type SlotsType, computed, defineComponent, shallowRef } from "vue";

import {
    DATE_INPUT_DEFAULTS,
    DateInputUtils,
    type DateValue,
    DateValueUtils,
    TextSyncUtils,
} from "@thewaver/ss-components";

import { MaskedFieldVueUtils } from "../../../Abstracts/MaskedField/MaskedFieldVue.utils";
import { TextField } from "../../../Primitives/TextField/TextField";
import type { TextFieldSlots } from "../../../Primitives/TextField/TextField.types";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { callSlot, declareProps, forwardProps, useTwoWay } from "../../../Utils/propUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { DateInputEra, DateInputProps, DateInputSlots } from "./DateInput.types";

export const DateInput = defineComponent(
    (props: DateInputProps, { slots }: SlotsContext<DateInputSlots>) => {
        const value = useTwoWay(props, "value");

        const getFormat = () => props.format ?? DATE_INPUT_DEFAULTS.format;
        const getCalendar = () => props.calendar ?? DATE_INPUT_DEFAULTS.calendar;

        const mask = computed(() => DateInputUtils.computeMask(getFormat()));

        const fieldValue = computed(() =>
            value.value ? DateValueUtils.withCalendar(value.value, getCalendar()) : undefined,
        );

        const anchor = computed<DateValue>((previous) => {
            const next = fieldValue.value ?? DateValueUtils.fromDate(new Date(), getCalendar());

            return previous && DateInputUtils.getIsSameAnchor(previous, next) ? previous : next;
        });

        const bounds = computed(() => DateInputUtils.computeBounds(anchor.value));
        const eraOptions = computed(() => DateValueUtils.getEras(anchor.value, props.locale));

        const era = shallowRef(DateInputUtils.getInitialEra(fieldValue.value, eraOptions.value));

        const field = MaskedFieldVueUtils.useMaskedField<DateValue>({
            getValue: () => fieldValue.value,
            setValue: (next) => {
                value.value = next;
            },
            formatDigits: (digits) => TextSyncUtils.formatWithMask(mask.value, digits),
            getDigitCount: () => DateInputUtils.DIGIT_COUNT,
            toDigits: (next) => DateInputUtils.toDigits(next, getFormat()),
            fromDigits: (digits) =>
                DateInputUtils.parseDigits(digits, {
                    format: getFormat(),
                    calendar: getCalendar(),
                    era: fieldValue.value?.era ?? era.value,
                    minValue: props.minValue,
                    maxValue: props.maxValue,
                }),
            getHasImpossibleDigits: (digits) => DateInputUtils.getHasImpossiblePart(digits, getFormat(), bounds.value),
            getIsSame: DateValueUtils.isSame,
        });

        watchAfterRender([fieldValue], ([next]) => {
            if (next) era.value = next.era;
        });

        watchAfterRender([getFormat, getCalendar], () => {
            field.refresh();
        });

        return () => {
            const eraControl: DateInputEra = {
                value: era.value,
                options: eraOptions.value,
                set: (next) => {
                    era.value = next;

                    if (!fieldValue.value) return;

                    field.commit(DateInputUtils.withEra(fieldValue.value, next, props.minValue, props.maxValue));
                },
            };

            const forwarded = {
                ...forwardProps(props, TextField),
                "value": field.text.value,
                "onUpdate:value": (text: string) => {
                    field.text.value = text;
                },
            };

            return (
                <TextField
                    {...forwarded}
                    element={"input"}
                    inputMode={"numeric"}
                    computeMaskedText={(previous, next, caret) =>
                        TextSyncUtils.applyMask(mask.value, previous, next, caret)
                    }
                    placeholderHint={DateInputUtils.computeHint(getFormat(), props.partHints)}
                    hasError={(props.hasError ?? false) || field.hasIssue.value}
                    onInput={field.onInput}
                    onBlur={field.onBlur}
                >
                    {
                        {
                            renderContent: slots.renderContent,
                            renderPlaceholder: slots.renderPlaceholder,
                            renderTrailing: slots.renderTrailing,
                            renderDecoration: slots.renderDecoration,
                            renderLeading:
                                slots.renderLeading &&
                                ((flags) => callSlot(slots.renderLeading, { flags, era: eraControl })),
                        } satisfies Partial<TextFieldSlots>
                    }
                </TextField>
            );
        };
    },
    {
        name: "DateInput",
        slots: Object as SlotsType<DateInputSlots>,
        props: declareProps<DateInputProps>({
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
            "isConcealed": Boolean,
            "padding": null,
            "gap": null,
            "ariaAttributes": null,
            "minValue": null,
            "maxValue": null,
            "format": null,
            "calendar": null,
            "locale": null,
            "partHints": null,
            "value": null,
            "onUpdate:value": null,
        }),
    },
);
