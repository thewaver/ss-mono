<script lang="ts">
    import { untrack } from "svelte";

    import {
        type InteractionFlags,
        type TextFieldFlags,
        type TextSyncElement,
        TextSyncUtils,
        TimeInputUtils,
    } from "@thewaver/ss-components";
    import { TimeUtils, type TimeValue, type TimeValueMeridiem } from "@thewaver/ss-utils";

    import { MaskedFieldSvelteUtils } from "../../../Abstracts/MaskedField/MaskedFieldSvelte.utils.svelte.js";
    import FormValue from "../../../Primitives/FormValue/FormValue.svelte";
    import TextField from "../../../Primitives/TextField/TextField.svelte";
    import type { TimeInputMeridiem, TimeInputProps } from "./TimeInput.types.js";

    const EMPTY_FORM_VALUE = "";

    let { value = $bindable(), ref = $bindable(), ...props }: TimeInputProps = $props();

    const isTwelveHour = $derived(props.isTwelveHour ?? false);
    const segmentCount = $derived(TimeInputUtils.getSegmentCount(props.hasSeconds ?? false));
    const mask = $derived(TimeInputUtils.computeMask(segmentCount));
    const isWritable = $derived(!(props.isDisabled ?? false) && !(props.isReadOnly ?? false));

    let meridiem = $state<TimeValueMeridiem>(untrack(() => TimeInputUtils.getInitialMeridiem(value)));

    const field = MaskedFieldSvelteUtils.createField<TimeValue>({
        getValue: () => value,
        setValue: (next) => {
            value = next;
        },
        formatDigits: (digits) => TextSyncUtils.formatWithMask(mask, digits),
        getDigitCount: () => segmentCount * TimeInputUtils.SEGMENT_DIGITS,
        toDigits: (next) => TimeInputUtils.toDigits(next, isTwelveHour),
        fromDigits: (digits) =>
            TimeInputUtils.parseDigits(digits, {
                segmentCount,
                isTwelveHour,
                meridiem,
            }),
        getHasImpossibleDigits: (digits) => TimeInputUtils.getHasImpossibleSegment(digits, segmentCount, isTwelveHour),
        getIsSame: TimeUtils.isSame,
        settleValue: (value) => TimeUtils.clamp(value, props.minValue, props.maxValue),
    });

    $effect(() => {
        const next = value;

        if (next) meridiem = TimeUtils.getMeridiem(next);
    });

    const setFieldMeridiem = (next: TimeValueMeridiem) => {
        if (!isWritable) return;

        meridiem = next;

        const current = untrack(() => value);

        if (!current) return;

        field.commit(TimeInputUtils.withMeridiem(current, next, props.minValue, props.maxValue));
    };

    const meridiemControl: TimeInputMeridiem = $derived({
        value: meridiem,
        set: setFieldMeridiem,
        toggle: () => setFieldMeridiem(TimeInputUtils.toggleMeridiem(meridiem)),
    });

    const handleKeyDown = (e: KeyboardEvent) => {
        if (!isWritable) return;

        const element = e.currentTarget as TextSyncElement;
        const step = TimeInputUtils.computeStep(
            e.key,
            value,
            element.selectionStart ?? 0,
            props.minValue,
            props.maxValue,
        );

        if (!step) return;

        e.preventDefault();

        value = step.time;
        element.setSelectionRange(step.selectionStart, step.selectionEnd);
    };
</script>

{#snippet trailing(flags: InteractionFlags<TextFieldFlags>)}
    {@render props.renderTrailing?.(flags, meridiemControl)}
{/snippet}

<TextField
    {...props}
    name={undefined}
    bind:value={() => field.text[0](), (next) => field.text[1](next)}
    bind:ref
    element={"input"}
    inputMode={"numeric"}
    computeMaskedText={(previous, next, caret) => TextSyncUtils.applyMask(mask, previous, next, caret)}
    placeholderHint={TimeInputUtils.computeHint(segmentCount, props.segmentHints)}
    hasError={(props.hasError ?? false) || field.getHasIssue()}
    renderTrailing={props.renderTrailing ? trailing : undefined}
    onInput={field.onInput}
    onKeyDown={handleKeyDown}
    onBlur={field.onBlur}
/>

<FormValue name={props.name} values={[value ? TimeUtils.toIso(value) : EMPTY_FORM_VALUE]} />
