import { type SlotsType, computed, defineComponent, shallowRef } from "vue";

import { type TextSyncElement, TextSyncUtils, TimeInputUtils } from "@thewaver/ss-components";
import { TimeUtils, type TimeValue, type TimeValueMeridiem } from "@thewaver/ss-utils";

import { MaskedFieldVueUtils } from "../../../Abstracts/MaskedField/MaskedFieldVue.utils";
import { TextField } from "../../../Primitives/TextField/TextField";
import type { TextFieldSlots } from "../../../Primitives/TextField/TextField.types";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { callSlot, declareProps, forwardProps, useTwoWay } from "../../../Utils/propUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { TimeInputMeridiem, TimeInputProps, TimeInputSlots } from "./TimeInput.types";

export const TimeInput = defineComponent(
    (props: TimeInputProps, { slots }: SlotsContext<TimeInputSlots>) => {
        const value = useTwoWay(props, "value");

        const getIsTwelveHour = () => props.isTwelveHour ?? false;
        const getSegmentCount = () => TimeInputUtils.getSegmentCount(props.hasSeconds ?? false);
        const getIsWritable = () => !(props.isDisabled ?? false) && !(props.isReadOnly ?? false);

        const mask = computed(() => TimeInputUtils.computeMask(getSegmentCount()));

        const meridiem = shallowRef<TimeValueMeridiem>(TimeInputUtils.getInitialMeridiem(value.value));

        const field = MaskedFieldVueUtils.useMaskedField<TimeValue>({
            getValue: () => value.value,
            setValue: (next) => {
                value.value = next;
            },
            formatDigits: (digits) => TextSyncUtils.formatWithMask(mask.value, digits),
            getDigitCount: () => getSegmentCount() * TimeInputUtils.SEGMENT_DIGITS,
            toDigits: (next) => TimeInputUtils.toDigits(next, getIsTwelveHour()),
            fromDigits: (digits) =>
                TimeInputUtils.parseDigits(digits, {
                    segmentCount: getSegmentCount(),
                    isTwelveHour: getIsTwelveHour(),
                    meridiem: meridiem.value,
                    minValue: props.minValue,
                    maxValue: props.maxValue,
                }),
            getHasImpossibleDigits: (digits) =>
                TimeInputUtils.getHasImpossibleSegment(digits, getSegmentCount(), getIsTwelveHour()),
            getIsSame: TimeUtils.isSame,
        });

        watchAfterRender([value], ([next]) => {
            if (next) meridiem.value = TimeUtils.getMeridiem(next);
        });

        watchAfterRender([getIsTwelveHour, getSegmentCount], () => {
            field.refresh();
        });

        const setFieldMeridiem = (next: TimeValueMeridiem) => {
            if (!getIsWritable()) return;

            meridiem.value = next;

            if (!value.value) return;

            field.commit(TimeInputUtils.withMeridiem(value.value, next, props.minValue, props.maxValue));
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (!getIsWritable()) return;

            const element = e.currentTarget as TextSyncElement;
            const step = TimeInputUtils.computeStep(
                e.key,
                value.value,
                element.selectionStart ?? 0,
                props.minValue,
                props.maxValue,
            );

            if (!step) return;

            e.preventDefault();

            value.value = step.time;
            element.setSelectionRange(step.selectionStart, step.selectionEnd);
        };

        return () => {
            const meridiemControl: TimeInputMeridiem = {
                value: meridiem.value,
                set: setFieldMeridiem,
                toggle: () => setFieldMeridiem(TimeInputUtils.toggleMeridiem(meridiem.value)),
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
                    placeholderHint={TimeInputUtils.computeHint(getSegmentCount(), props.segmentHints)}
                    hasError={(props.hasError ?? false) || field.hasIssue.value}
                    onInput={field.onInput}
                    onKeyDown={handleKeyDown}
                    onBlur={field.onBlur}
                >
                    {
                        {
                            renderContent: slots.renderContent,
                            renderPlaceholder: slots.renderPlaceholder,
                            renderLeading: slots.renderLeading,
                            renderDecoration: slots.renderDecoration,
                            renderTrailing:
                                slots.renderTrailing &&
                                ((flags) => callSlot(slots.renderTrailing, { flags, meridiem: meridiemControl })),
                        } satisfies Partial<TextFieldSlots>
                    }
                </TextField>
            );
        };
    },
    {
        name: "TimeInput",
        slots: Object as SlotsType<TimeInputSlots>,
        props: declareProps<TimeInputProps>({
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
            "hasSeconds": Boolean,
            "isTwelveHour": Boolean,
            "segmentHints": null,
            "value": null,
            "onUpdate:value": null,
        }),
    },
);
