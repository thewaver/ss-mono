<script lang="ts" generics="T">
    import type { Snippet } from "svelte";

    import type { AnchorPlacement } from "@thewaver/ss-components-svelte";
    import { Select } from "@thewaver/ss-components-svelte";

    import { renderPageHighlightFloater } from "../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PagePopoverSurface from "../../StyledComponents/PopoverSurface/PopoverSurface.svelte";
    import PageSelectContent from "../../StyledComponents/SelectContent/SelectContent.svelte";
    import PageSelectOptionContent from "../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import { useFieldReset } from "./Field.context";
    import type { PageSelectFieldProps } from "./Field.types";

    const DEFAULT_SELECT_FIELD_WIDTH = 150;
    const EMPTY_TEXT = "";

    let props: PageSelectFieldProps<T> = $props();

    useFieldReset(
        () => props.value,
        (value) => props.onChange(value),
    );

    const options = $derived(props.values.map((value) => ({ value })));

    const setValue = (value: T | undefined) => {
        if (value === undefined) return;

        props.onChange(value);
    };
</script>

<Select
    id={props.id}
    renderHighlightFloater={renderPageHighlightFloater}
    bind:value={() => props.value, setValue}
    {options}
    isDisabled={props.isDisabled}
    ariaLabel={props.ariaLabel}
    renderPopup={renderFieldPopup}
>
    {#snippet renderContent(selectedOption, flags)}
        <PageSelectContent {flags} width={props.width ?? DEFAULT_SELECT_FIELD_WIDTH}>
            {selectedOption !== undefined
                ? (props.computeLabel?.(selectedOption.value) ?? String(selectedOption.value))
                : EMPTY_TEXT}
        </PageSelectContent>
    {/snippet}

    {#snippet renderOption(option, flags)}
        <PageSelectOptionContent isGliding {flags}>
            {props.computeLabel?.(option.value) ?? String(option.value)}
        </PageSelectOptionContent>
    {/snippet}
</Select>

{#snippet renderFieldPopup(
    renderOptions: Snippet,
    visibilityTarget: 0 | 1,
    transitionDurationMs: number,
    placement: AnchorPlacement,
)}
    <PagePopoverSurface {visibilityTarget} {transitionDurationMs} {placement}>
        {@render renderOptions()}
    </PagePopoverSurface>
{/snippet}
