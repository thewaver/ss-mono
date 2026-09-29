<script lang="ts">
    import { ColorInputStyles as styles } from "@thewaver/ss-components";

    import { FormFieldSvelteUtils } from "../FormField/FormFieldSvelte.utils.svelte.js";
    import { LabelSvelteUtils } from "../Label/LabelSvelte.utils.svelte.js";
    import type { ColorInputFieldProps } from "./ColorInput.types.js";

    let props: ColorInputFieldProps = $props();

    const getAriaLabel = LabelSvelteUtils.resolveAriaLabel(() => props.ariaLabel);
    const getAriaDescribedBy = FormFieldSvelteUtils.resolveAriaDescribedBy();

    let element = $state<HTMLButtonElement>();

    FormFieldSvelteUtils.registerControl(() => element ?? undefined);

    const isDisabled = $derived(props.flags.isDisabled ?? false);
</script>

<button
    bind:this={element}
    {@attach props.attachElement}
    id={props.id}
    type="button"
    class={styles.colorInputField}
    aria-label={getAriaLabel()}
    aria-describedby={getAriaDescribedBy()}
    aria-haspopup="dialog"
    aria-expanded={props.isOpen}
    aria-controls={props.isOpen ? props.popupId : undefined}
    aria-disabled={isDisabled || undefined}
    aria-invalid={props.flags.hasError || undefined}
    onclick={() => {
        if (isDisabled) return;

        props.onToggle();
    }}
    onmouseenter={(e) => {
        if (isDisabled) return;

        props.onMouseEnter?.(e);
    }}
    onmouseleave={(e) => {
        if (isDisabled) return;

        props.onMouseLeave?.(e);
    }}
>
    {@render props.renderContent(props.flags)}
</button>
