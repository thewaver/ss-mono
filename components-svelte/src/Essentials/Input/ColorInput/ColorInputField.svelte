<script lang="ts">
    import { COLOR_INPUT_DEFAULTS, ColorInputStyles as styles } from "@thewaver/ss-components";

    import { FormFieldSvelteUtils } from "../FormField/FormFieldSvelte.utils.svelte.js";
    import type { ColorInputFieldProps } from "./ColorInput.types.js";

    let props: ColorInputFieldProps = $props();

    const { getAriaLabel, getAriaLabelledBy } = FormFieldSvelteUtils.resolveAriaName(() => props.ariaLabel);
    const getFieldDescribedBy = FormFieldSvelteUtils.resolveAriaDescribedBy();
    const descriptionId = $props.id();

    const valueText = $derived(
        props.flags.value ? (props.computeValueText ?? COLOR_INPUT_DEFAULTS.computeValueText)(props.flags.value, props.flags.hsv) : "",
    );

    const ariaDescribedBy = $derived(
        [getFieldDescribedBy(), valueText ? descriptionId : undefined].filter(Boolean).join(" ") || undefined,
    );

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
    aria-labelledby={getAriaLabelledBy()}
    aria-describedby={ariaDescribedBy}
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

{#if valueText}
    <span id={descriptionId} class={styles.colorInputDescription} aria-hidden="true">{valueText}</span>
{/if}
