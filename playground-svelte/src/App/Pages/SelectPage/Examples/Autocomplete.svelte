<script lang="ts">
    import { Select } from "@thewaver/ss-components-svelte";
    import type { SelectOption } from "@thewaver/ss-components-svelte";
    import * as popupStyles from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

    import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PagePopoverSurface from "../../../StyledComponents/PopoverSurface/PopoverSurface.svelte";
    import PageSelectContent, {
        computePageSelectTextStyle,
    } from "../../../StyledComponents/SelectContent/SelectContent.svelte";
    import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import { PLACEHOLDER, QUERY_PADDING } from "../SelectPage.const.svelte";
    import type { Airport } from "../SelectPage.types";

    type Props = {
        value: Airport | undefined;
        query: string;
        options: SelectOption<Airport>[];
    };

    let { value = $bindable(), query = $bindable(), ...props }: Props = $props();
</script>

<Select
    renderHighlightFloater={renderPageHighlightFloater}
    bind:value
    bind:query
    options={props.options}
    ariaLabel={"Airport"}
    padding={QUERY_PADDING}
    computeTextStyle={computePageSelectTextStyle}
>
    {#snippet renderContent(selectedOption, flags)}
        <PageSelectContent {flags}>{selectedOption?.value.city ?? PLACEHOLDER}</PageSelectContent>
    {/snippet}

    {#snippet renderOption(option, flags)}
        <PageSelectOptionContent isGliding {flags}>
            {option.value.city} ({option.value.code})
        </PageSelectOptionContent>
    {/snippet}

    {#snippet renderPopup(renderOptions, visibilityTarget, transitionDurationMs, placement)}
        <PagePopoverSurface {visibilityTarget} {transitionDurationMs} {placement}>
            {#if props.options.length}
                {@render renderOptions()}
            {:else}
                <div class={popupStyles.popoverSurfaceEmpty}>No airport matches that</div>
            {/if}
        </PagePopoverSurface>
    {/snippet}
</Select>
