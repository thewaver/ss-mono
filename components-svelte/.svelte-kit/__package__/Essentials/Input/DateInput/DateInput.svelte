<script lang="ts">
    import { untrack } from "svelte";

    import {
        DATE_INPUT_DEFAULTS,
        DateInputUtils,
        type DateValue,
        DateValueUtils,
        type InteractionFlags,
        type TextFieldFlags,
        TextSyncUtils,
    } from "@thewaver/ss-components";

    import { MaskedFieldSvelteUtils } from "../../../Abstracts/MaskedField/MaskedFieldSvelte.utils.svelte.js";
    import TextField from "../../../Primitives/TextField/TextField.svelte";
    import type { DateInputEra, DateInputProps } from "./DateInput.types.js";

    let { value = $bindable(), ref = $bindable(), ...props }: DateInputProps = $props();

    const format = $derived(props.format ?? DATE_INPUT_DEFAULTS.format);
    const calendar = $derived(props.calendar ?? DATE_INPUT_DEFAULTS.calendar);
    const mask = $derived(DateInputUtils.computeMask(format));

    const fieldValue = $derived(value ? DateValueUtils.withCalendar(value, calendar) : undefined);

    let heldAnchor: DateValue | undefined;

    const anchor = $derived.by(() => {
        const next = fieldValue ?? DateValueUtils.fromDate(new Date(), calendar);

        if (heldAnchor && DateInputUtils.getIsSameAnchor(heldAnchor, next)) return heldAnchor;

        heldAnchor = next;

        return next;
    });

    const bounds = $derived(DateInputUtils.computeBounds(anchor));
    const eraOptions = $derived(DateValueUtils.getEras(anchor, props.locale));

    let era = $state(untrack(() => DateInputUtils.getInitialEra(fieldValue, eraOptions)));

    const field = MaskedFieldSvelteUtils.createField<DateValue>({
        getValue: () => fieldValue,
        setValue: (next) => {
            value = next;
        },
        formatDigits: (digits) => TextSyncUtils.formatWithMask(mask, digits),
        getDigitCount: () => DateInputUtils.DIGIT_COUNT,
        toDigits: (next) => DateInputUtils.toDigits(next, format),
        fromDigits: (digits) =>
            DateInputUtils.parseDigits(digits, {
                format,
                calendar,
                era: fieldValue?.era ?? era,
                minValue: props.minValue,
                maxValue: props.maxValue,
            }),
        getHasImpossibleDigits: (digits) => DateInputUtils.getHasImpossiblePart(digits, format, bounds),
        getIsSame: DateValueUtils.isSame,
    });

    $effect(() => {
        const next = fieldValue;

        if (next) era = next.era;
    });

    const setEra = (next: string) => {
        era = next;

        const current = untrack(() => fieldValue);

        if (!current) return;

        field.commit(DateInputUtils.withEra(current, next, props.minValue, props.maxValue));
    };

    const eraControl: DateInputEra = $derived({ value: era, options: eraOptions, set: setEra });
</script>

{#snippet leading(flags: InteractionFlags<TextFieldFlags>)}
    {@render props.renderLeading?.(flags, eraControl)}
{/snippet}

<TextField
    {...props}
    bind:value={() => field.text[0](), (next) => field.text[1](next)}
    bind:ref
    element={"input"}
    inputMode={"numeric"}
    computeMaskedText={(previous, next, caret) => TextSyncUtils.applyMask(mask, previous, next, caret)}
    placeholderHint={DateInputUtils.computeHint(format, props.partHints)}
    hasError={(props.hasError ?? false) || field.getHasIssue()}
    renderLeading={props.renderLeading ? leading : undefined}
    onInput={field.onInput}
    onBlur={field.onBlur}
/>
