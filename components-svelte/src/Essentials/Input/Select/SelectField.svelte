<script lang="ts">
    import { ListboxUtils, SelectStyles as styles } from "@thewaver/ss-components";

    import { TextSyncSvelteUtils } from "../../../Abstracts/TextSync/TextSyncSvelte.utils.svelte.js";
    import { toStyle } from "../../../Utils/styleUtils.js";
    import { FormFieldSvelteUtils } from "../FormField/FormFieldSvelte.utils.svelte.js";
    import { LabelSvelteUtils } from "../Label/LabelSvelte.utils.svelte.js";
    import type { SelectFieldProps } from "./Select.types.js";

    let props: SelectFieldProps = $props();

    const getAriaLabel = LabelSvelteUtils.resolveAriaLabel(() => props.ariaLabel);
    const getAriaDescribedBy = FormFieldSvelteUtils.resolveAriaDescribedBy();

    let input = $state<HTMLInputElement>();

    const isDisabled = $derived(props.flags.isDisabled ?? false);

    const { handleInput, handleCompositionStart, handleCompositionEnd } = TextSyncSvelteUtils.createValueSync(
        () => input ?? undefined,
        () => props.query,
        { onInput: (query) => props.onQueryInput(query) },
    );

    const { role, ...comboboxAttributes } = $derived(
        ListboxUtils.computeComboboxAttributes({
            isOpen: props.flags.isOpen,
            listboxId: props.listboxId,
            activeOptionId: props.activeOptionId,
            isEditable: props.isFilterable,
        }),
    );

    const handleClick = () => {
        if (isDisabled) return;

        props.onToggle();
    };
</script>

{#if !props.isFilterable}
    <button
        {@attach props.attachElement}
        id={props.id}
        type="button"
        class={styles.selectField}
        {role}
        aria-describedby={getAriaDescribedBy()}
        aria-label={getAriaLabel()}
        aria-disabled={isDisabled || undefined}
        aria-required={props.isRequired || undefined}
        aria-invalid={props.flags.hasError || undefined}
        {...comboboxAttributes}
        onkeydown={(e) => props.onKeyDown(e)}
        onclick={handleClick}
    >
        {@render props.renderContent(props.flags)}
    </button>
{:else}
    {@render props.renderContent(props.flags)}

    <input
        bind:this={input}
        {@attach props.attachElement}
        id={props.id}
        type="text"
        class={styles.selectFilterField}
        style={[props.textInset, toStyle(props.computeTextStyle?.(props.flags))].join("; ")}
        autocomplete="off"
        readonly={isDisabled}
        {role}
        aria-describedby={getAriaDescribedBy()}
        aria-label={getAriaLabel()}
        aria-disabled={isDisabled || undefined}
        aria-required={props.isRequired || undefined}
        aria-invalid={props.flags.hasError || undefined}
        {...comboboxAttributes}
        onkeydown={(e) => props.onKeyDown(e)}
        onclick={handleClick}
        oninput={(e) => handleInput(e.currentTarget)}
        oncompositionstart={handleCompositionStart}
        oncompositionend={(e) => handleCompositionEnd(e.currentTarget)}
    />
{/if}
