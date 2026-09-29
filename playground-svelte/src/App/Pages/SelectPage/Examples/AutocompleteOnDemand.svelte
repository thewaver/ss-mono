<script lang="ts">
    import { Select } from "@thewaver/ss-components-svelte";
    import type { SelectOption } from "@thewaver/ss-components-svelte";
    import * as popupStyles from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

    import PagePopoverSurface from "../../../StyledComponents/PopoverSurface/PopoverSurface.svelte";
    import PageSelectContent, {
        computePageSelectTextStyle,
    } from "../../../StyledComponents/SelectContent/SelectContent.svelte";
    import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import { PLACEHOLDER, QUERY_PADDING } from "../SelectPage.const.svelte";
    import type { Delivery } from "../SelectPage.types";

    type Props = {
        value: Delivery | undefined;
        query: string;
        options: SelectOption<Delivery>[];
        hasMore: boolean;
        isSearching: boolean;
        total: number;
        onReachEnd: () => void;
    };

    let { value = $bindable(), query = $bindable(), ...props }: Props = $props();
</script>

<Select
    bind:value
    bind:query
    options={props.options}
    hasMoreOptions={props.hasMore}
    ariaLabel={"Route"}
    padding={QUERY_PADDING}
    computeTextStyle={computePageSelectTextStyle}
    onReachEnd={props.onReachEnd}
>
    {#snippet renderContent(selectedOption, flags)}
        <PageSelectContent {flags}>{selectedOption?.value.name ?? PLACEHOLDER}</PageSelectContent>
    {/snippet}

    {#snippet renderOption(option, flags)}
        <PageSelectOptionContent {flags} description={option.value.description}>
            {option.value.name}
        </PageSelectOptionContent>
    {/snippet}

    {#snippet renderPopup(renderOptions, visibilityTarget, transitionDurationMs, placement)}
        <PagePopoverSurface {visibilityTarget} {transitionDurationMs} {placement}>
            {@render renderOptions()}

            {#if props.isSearching}
                <div class={popupStyles.popoverSurfaceEmpty}>Searching…</div>
            {/if}

            {#if !props.isSearching && props.total < 1}
                <div class={popupStyles.popoverSurfaceEmpty}>No route matches that</div>
            {/if}
        </PagePopoverSurface>
    {/snippet}
</Select>
