<script lang="ts">
    import { untrack } from "svelte";

    import {
        type InteractionFlags,
        NUMBER_INPUT_DEFAULTS,
        type NumberInputStepDefs,
        type NumberInputStepper,
        NumberInputUtils,
        type TextFieldFlags,
    } from "@thewaver/ss-components";
    import { DecimalUtils } from "@thewaver/ss-utils";

    import TextField from "../../../Primitives/TextField/TextField.svelte";
    import type { NumberInputProps } from "./NumberInput.types.js";

    let { value = $bindable(), ref = $bindable(), ...props }: NumberInputProps = $props();

    const separators = $derived(DecimalUtils.getSeparators(props.locale));

    let text = $state(untrack(() => NumberInputUtils.formatValue(value, separators)));

    const stepDefs: NumberInputStepDefs = $derived({
        min: props.min,
        max: props.max,
        step: props.step ?? NUMBER_INPUT_DEFAULTS.step,
    });

    const pageStep = $derived(NumberInputUtils.computePageStep(props.pageStep, stepDefs.step));
    const isWritable = $derived(!(props.isDisabled ?? false) && !(props.isReadOnly ?? false));
    const typedValue = $derived(NumberInputUtils.parseValue(text, separators));

    const reportValue = (next: number | undefined) => {
        value = next;

        props.onInput?.(next);
    };

    const applyValue = (next: number | undefined) => {
        text = NumberInputUtils.formatValue(next, separators);

        if (untrack(() => value) === next) return;

        reportValue(next);
    };

    const stepValue = (direction: 1 | -1, distance?: number) => {
        if (!isWritable) return false;

        const current = typedValue;
        const next = NumberInputUtils.computeStep(current, direction, stepDefs, distance);

        applyValue(next);

        return next !== current;
    };

    const repeater = NumberInputUtils.createStepRepeater({
        getDelayMs: () => props.repeatDelayMs ?? NUMBER_INPUT_DEFAULTS.repeatDelayMs,
        getIntervalMs: () => props.repeatIntervalMs ?? NUMBER_INPUT_DEFAULTS.repeatIntervalMs,
    });

    $effect(() => () => void repeater.stop());

    $effect(() => {
        const next = value;
        const current = separators;

        untrack(() => {
            if (NumberInputUtils.parseValue(text, current) === next) return;

            text = NumberInputUtils.formatValue(next, current);
        });
    });

    const stepper: NumberInputStepper = {
        getIsAtMin: () => NumberInputUtils.getIsAtMin(typedValue, stepDefs),
        getIsAtMax: () => NumberInputUtils.getIsAtMax(typedValue, stepDefs),
        stepUp: () => stepValue(1),
        stepDown: () => stepValue(-1),
        startSteppingUp: () => repeater.start(() => stepValue(1)),
        startSteppingDown: () => repeater.start(() => stepValue(-1)),
        stopStepping: repeater.stop,
    };
</script>

{#snippet trailing(flags: InteractionFlags<TextFieldFlags>)}
    {@render props.renderTrailing?.(flags, stepper)}
{/snippet}

<TextField
    {...props}
    bind:value={text}
    bind:ref
    element="input"
    type="text"
    inputMode={props.inputMode ?? NUMBER_INPUT_DEFAULTS.inputMode}
    isSpinButton={true}
    computeSpinValue={(next) => NumberInputUtils.parseValue(next, separators)}
    hasError={(props.hasError ?? false) || NumberInputUtils.getHasRangeIssue(typedValue, stepDefs)}
    renderTrailing={props.renderTrailing && trailing}
    onInput={(next) => {
        const sanitized = NumberInputUtils.sanitizeText(next, separators);

        text = sanitized;

        const parsed = NumberInputUtils.parseValue(sanitized, separators);

        if (NumberInputUtils.getHasRangeIssue(parsed, stepDefs)) return;

        reportValue(parsed);
    }}
    onKeyDown={(e) => {
        if (!isWritable) return;

        const move = NumberInputUtils.computeKeyMove(e.key, stepDefs, pageStep);

        if (!move) return;

        e.preventDefault();

        if ("value" in move) applyValue(move.value);
        else stepValue(move.direction, move.distance);
    }}
    onBlur={() => applyValue(NumberInputUtils.computeSettledValue(typedValue, stepDefs))}
/>
