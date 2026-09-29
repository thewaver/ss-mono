import { type SlotsType, computed, defineComponent, onScopeDispose, shallowRef } from "vue";

import {
    NUMBER_INPUT_DEFAULTS,
    type NumberInputStepDefs,
    type NumberInputStepper,
    NumberInputUtils,
} from "@thewaver/ss-components";
import { DecimalUtils } from "@thewaver/ss-utils";

import { TextField } from "../../../Primitives/TextField/TextField";
import type { TextFieldSlots } from "../../../Primitives/TextField/TextField.types";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { callSlot, declareProps, forwardProps, useTwoWay } from "../../../Utils/propUtils";
import { exposeElement, toElement } from "../../../Utils/refUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { NumberInputProps, NumberInputSlots } from "./NumberInput.types";

export const NumberInput = defineComponent(
    (props: NumberInputProps, { slots, expose }: SlotsContext<NumberInputSlots>) => {
        const value = useTwoWay(props, "value");

        const controlRef = shallowRef<HTMLElement>();

        exposeElement(expose, () => controlRef.value);

        const separators = computed(() => DecimalUtils.getSeparators(props.locale));

        const text = shallowRef(NumberInputUtils.formatValue(value.value, separators.value));

        const stepDefs = computed((): NumberInputStepDefs => ({
            min: props.min,
            max: props.max,
            step: props.step ?? NUMBER_INPUT_DEFAULTS.step,
        }));

        const typedValue = computed(() => NumberInputUtils.parseValue(text.value, separators.value));

        const getIsWritable = () => !(props.isDisabled ?? false) && !(props.isReadOnly ?? false);

        const reportValue = (next: number | undefined) => {
            value.value = next;

            props.onInput?.(next);
        };

        const applyValue = (next: number | undefined) => {
            text.value = NumberInputUtils.formatValue(next, separators.value);

            if (value.value === next) return;

            reportValue(next);
        };

        const stepValue = (direction: 1 | -1, distance?: number) => {
            if (!getIsWritable()) return false;

            const current = typedValue.value;
            const next = NumberInputUtils.computeStep(current, direction, stepDefs.value, distance);

            applyValue(next);

            return next !== current;
        };

        const repeater = NumberInputUtils.createStepRepeater({
            getDelayMs: () => props.repeatDelayMs ?? NUMBER_INPUT_DEFAULTS.repeatDelayMs,
            getIntervalMs: () => props.repeatIntervalMs ?? NUMBER_INPUT_DEFAULTS.repeatIntervalMs,
        });

        onScopeDispose(() => void repeater.stop());

        watchAfterRender([() => value.value, separators], ([current, spelling]) => {
            if (NumberInputUtils.parseValue(text.value, spelling) === current) return;

            text.value = NumberInputUtils.formatValue(current, spelling);
        });

        const stepper: NumberInputStepper = {
            getIsAtMin: () => NumberInputUtils.getIsAtMin(typedValue.value, stepDefs.value),
            getIsAtMax: () => NumberInputUtils.getIsAtMax(typedValue.value, stepDefs.value),
            stepUp: () => stepValue(1),
            stepDown: () => stepValue(-1),
            startSteppingUp: () => repeater.start(() => stepValue(1)),
            startSteppingDown: () => repeater.start(() => stepValue(-1)),
            stopStepping: repeater.stop,
        };

        return () => (
            <TextField
                {...{
                    ...forwardProps(props, TextField),
                    "value": text.value,
                    "onUpdate:value": (next: string) => {
                        text.value = next;
                    },
                    "onInput": (next: string) => {
                        const sanitized = NumberInputUtils.sanitizeText(next, separators.value);

                        text.value = sanitized;

                        const parsed = NumberInputUtils.parseValue(sanitized, separators.value);

                        if (NumberInputUtils.getHasRangeIssue(parsed, stepDefs.value)) return;

                        reportValue(parsed);
                    },
                }}
                ref={(target) => {
                    controlRef.value = toElement(target);
                }}
                element={"input"}
                type={"text"}
                inputMode={props.inputMode ?? NUMBER_INPUT_DEFAULTS.inputMode}
                isSpinButton={true}
                computeSpinValue={(next) => NumberInputUtils.parseValue(next, separators.value)}
                hasError={
                    (props.hasError ?? false) || NumberInputUtils.getHasRangeIssue(typedValue.value, stepDefs.value)
                }
                onKeyDown={(e) => {
                    if (!getIsWritable()) return;

                    const move = NumberInputUtils.computeKeyMove(
                        e.key,
                        stepDefs.value,
                        NumberInputUtils.computePageStep(props.pageStep, stepDefs.value.step),
                    );

                    if (!move) return;

                    e.preventDefault();

                    if ("value" in move) applyValue(move.value);
                    else stepValue(move.direction, move.distance);
                }}
                onBlur={() => applyValue(NumberInputUtils.computeSettledValue(typedValue.value, stepDefs.value))}
            >
                {
                    {
                        renderContent: slots.renderContent,
                        renderPlaceholder: slots.renderPlaceholder,
                        renderLeading: slots.renderLeading,
                        renderTrailing:
                            slots.renderTrailing && ((flags) => callSlot(slots.renderTrailing, { flags, stepper })),
                        renderDecoration: slots.renderDecoration,
                    } satisfies Partial<TextFieldSlots>
                }
            </TextField>
        );
    },
    {
        name: "NumberInput",
        slots: Object as SlotsType<NumberInputSlots>,
        props: declareProps<NumberInputProps>({
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
            "onMouseEnter": null,
            "onMouseLeave": null,
            "id": null,
            "name": null,
            "ariaLabel": null,
            "isReadOnly": Boolean,
            "isRequired": Boolean,
            "inputMode": null,
            "placeholderHint": null,
            "min": null,
            "max": null,
            "step": null,
            "padding": null,
            "gap": null,
            "pageStep": null,
            "locale": null,
            "repeatDelayMs": null,
            "repeatIntervalMs": null,
            "value": null,
            "onUpdate:value": null,
            "onInput": null,
        }),
    },
);
