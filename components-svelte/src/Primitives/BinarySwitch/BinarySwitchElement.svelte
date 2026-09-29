<script lang="ts">
    import { BinarySwitchUtils, BinarySwitchStyles as styles } from "@thewaver/ss-components";

    import { FormFieldSvelteUtils } from "../../Essentials/Input/FormField/FormFieldSvelte.utils.svelte.js";
    import { LabelSvelteUtils } from "../../Essentials/Input/Label/LabelSvelte.utils.svelte.js";
    import type { BinarySwitchElementProps } from "./BinarySwitch.types.js";

    let props: BinarySwitchElementProps = $props();

    const getAriaLabel = LabelSvelteUtils.resolveAriaLabel(() => props.ariaLabel);
    const getAriaDescribedBy = FormFieldSvelteUtils.resolveAriaDescribedBy();

    let element = $state<HTMLInputElement>();

    FormFieldSvelteUtils.registerControl(() => element ?? undefined);

    const isDisabled = $derived(props.flags.isDisabled ?? false);
    const isMixed = $derived(props.isMixed ?? false);

    $effect(() => {
        if (element) BinarySwitchUtils.syncElement(element, props.isChecked, isMixed);
    });
</script>

{@render props.renderContent(props.flags)}

<input
    bind:this={element}
    {@attach props.attachElement}
    id={props.id}
    type={props.type}
    name={props.name}
    role={BinarySwitchUtils.computeRole(props.isSwitch ?? false, isMixed)}
    class={styles.binarySwitchElement}
    aria-label={getAriaLabel()}
    aria-describedby={getAriaDescribedBy()}
    aria-disabled={isDisabled || undefined}
    aria-required={props.isRequired || undefined}
    aria-invalid={props.flags.hasError || undefined}
    onclick={(e) => {
        if (isDisabled) e.preventDefault();
    }}
    onchange={(e) => {
        const target = e.currentTarget;

        if (isDisabled) return;

        props.onChange?.(target.checked);

        BinarySwitchUtils.syncElement(target, props.isChecked, isMixed);
    }}
    onmouseenter={(e) => {
        if (isDisabled) return;

        props.onMouseEnter?.(e);
    }}
    onmouseleave={(e) => {
        if (isDisabled) return;

        props.onMouseLeave?.(e);
    }}
/>
