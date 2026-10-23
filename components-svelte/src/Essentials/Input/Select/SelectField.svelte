<script lang="ts">
    import { ListboxUtils, SelectUtils, SelectStyles as styles } from "@thewaver/ss-components";
    import { SelectConst } from "@thewaver/ss-components/internal";

    import { TextSyncSvelteUtils } from "../../../Abstracts/TextSync/TextSyncSvelte.utils.svelte.js";
    import { toStyle } from "../../../Utils/styleUtils.js";
    import { FormFieldSvelteUtils } from "../FormField/FormFieldSvelte.utils.svelte.js";
    import { LabelSvelteUtils } from "../Label/LabelSvelte.utils.svelte.js";
    import type { SelectFieldProps } from "./Select.types.js";

    let props: SelectFieldProps = $props();

    const getAriaLabel = LabelSvelteUtils.resolveAriaLabel(() => props.ariaLabel);
    const getAriaDescribedBy = FormFieldSvelteUtils.resolveAriaDescribedBy();

    let input = $state<HTMLInputElement>();
    let content = $state<HTMLElement>();
    let paintedText = $state(SelectConst.EMPTY_QUERY);

    const isDisabled = $derived(props.flags.isDisabled ?? false);

    $effect(() => {
        const element = content;
        const isFilterable = props.isFilterable;

        if (!element || !isFilterable) return;

        const read = () => {
            paintedText = SelectUtils.computePaintedText(element);
        };
        const observer = new MutationObserver(read);

        read();
        observer.observe(element, { childList: true, subtree: true, characterData: true });

        return () => observer.disconnect();
    });

    const getValueText = () =>
        props.flags.isEmpty ? SelectConst.EMPTY_QUERY : (props.valueText ?? paintedText);

    const { handleInput, handleCompositionStart, handleCompositionEnd } = TextSyncSvelteUtils.createValueSync(
        () => input ?? undefined,
        () => (props.isEditing ? props.query : getValueText()),
        { onInput: (query) => props.onQueryInput(query) },
    );

    const selectValueText = (element: HTMLInputElement) => {
        if (props.isEditing) return;

        element.select();
    };

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

    const handleInputClick = (e: MouseEvent & { currentTarget: HTMLInputElement }) => {
        if (isDisabled) return;

        selectValueText(e.currentTarget);
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
    <span bind:this={content} class={styles.selectFieldContent}>
        {@render props.renderContent(props.flags)}
    </span>

    <input
        bind:this={input}
        {@attach props.attachElement}
        id={props.id}
        type="text"
        class={[styles.selectFilterField, !props.isEditing && styles.selectFilterFieldShowsValue]}
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
        onfocus={(e) => selectValueText(e.currentTarget)}
        onclick={handleInputClick}
        oninput={(e) => handleInput(e.currentTarget)}
        oncompositionstart={handleCompositionStart}
        oncompositionend={(e) => handleCompositionEnd(e.currentTarget)}
    />
{/if}
