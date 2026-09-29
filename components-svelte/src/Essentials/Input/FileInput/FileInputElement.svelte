<script lang="ts">
    import { untrack } from "svelte";

    import { FILE_INPUT_DEFAULTS, FileInputUtils, FileInputStyles as styles } from "@thewaver/ss-components";

    import { FormFieldSvelteUtils } from "../FormField/FormFieldSvelte.utils.svelte.js";
    import { LabelSvelteUtils } from "../Label/LabelSvelte.utils.svelte.js";
    import type { FileInputElementProps } from "./FileInput.types.js";

    let props: FileInputElementProps = $props();

    const getAriaLabel = LabelSvelteUtils.resolveAriaLabel(() => props.ariaLabel);
    const getAriaDescribedBy = FormFieldSvelteUtils.resolveAriaDescribedBy();

    let element = $state<HTMLInputElement>();
    let changeCount = $state(0);

    FormFieldSvelteUtils.registerControl(() => element ?? undefined);

    const isDisabled = $derived(props.flags.isDisabled ?? false);

    $effect(() => {
        const input = element;
        const files = props.files;

        changeCount;

        if (!input) return;

        untrack(() => FileInputUtils.syncElement(input, files));
    });
</script>

{@render props.renderContent(props.flags)}

<input
    bind:this={element}
    {@attach props.attachElement}
    id={props.id}
    type="file"
    name={props.name}
    class={styles.fileInputElement}
    accept={props.accept}
    multiple={props.isMultiple ?? FILE_INPUT_DEFAULTS.isMultiple}
    aria-label={getAriaLabel()}
    aria-describedby={getAriaDescribedBy()}
    aria-disabled={isDisabled || undefined}
    aria-invalid={props.flags.hasError || undefined}
    onclick={(e) => {
        if (isDisabled) e.preventDefault();
    }}
    onchange={(e) => {
        if (isDisabled) return;

        props.onChange?.(Array.from(e.currentTarget.files ?? []));

        changeCount += 1;
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
