<script lang="ts">
    import { CURRENCY_INPUT_DEFAULTS, CurrencyInputUtils, TextSyncUtils } from "@thewaver/ss-components";

    import { MaskedFieldSvelteUtils } from "../../../Abstracts/MaskedField/MaskedFieldSvelte.utils.svelte.js";
    import TextField from "../../../Primitives/TextField/TextField.svelte";
    import type { CurrencyInputProps } from "./CurrencyInput.types.js";

    let { value = $bindable(), ref = $bindable(), ...props }: CurrencyInputProps = $props();

    const decimals = $derived(props.decimals ?? CURRENCY_INPUT_DEFAULTS.decimals);
    const hasSign = $derived(props.hasSign ?? false);

    const groupDefs = $derived(
        CurrencyInputUtils.computeGroupDefs({
            locale: props.locale,
            groupSizes: props.groupSizes,
            decimals,
            hasSign,
        }),
    );

    const field = MaskedFieldSvelteUtils.createField<number>({
        getValue: () => value,
        setValue: (next) => {
            value = next;
        },
        ...CurrencyInputUtils.createFieldRules({
            getGroupDefs: () => groupDefs,
            getDecimals: () => decimals,
            getHasSign: () => hasSign,
            getMin: () => props.min,
            getMax: () => props.max,
        }),
    });

    const [getText, setText] = field.text;
</script>

<TextField
    {...props}
    bind:value={getText, setText}
    bind:ref
    element="input"
    inputMode="decimal"
    computeMaskedText={(previous, next, caret) => TextSyncUtils.applyGroupedMask(groupDefs, previous, next, caret)}
    placeholderHint={CurrencyInputUtils.computeHint(groupDefs)}
    hasError={(props.hasError ?? false) || field.getHasIssue()}
    onInput={field.onInput}
    onBlur={field.onBlur}
/>
