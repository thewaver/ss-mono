<script lang="ts">
    import { Select } from "@thewaver/ss-components-svelte";
    import * as popupStyles from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

    import PagePopoverSurface from "../../../StyledComponents/PopoverSurface/PopoverSurface.svelte";
    import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.svelte";
    import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import { PLACEHOLDER } from "../SelectPage.const.svelte";
    import type { SelectRoutesExampleProps } from "../SelectPage.types";

    type Props = SelectRoutesExampleProps;

    let { value = $bindable(), ...props }: Props = $props();
</script>

<Select
    bind:value
    options={props.options}
    hasMoreOptions={props.hasMore}
    ariaLabel={"Route"}
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

            {#if props.isFetching}
                <div class={popupStyles.popoverSurfaceEmpty}>Fetching more routes…</div>
            {/if}
        </PagePopoverSurface>
    {/snippet}
</Select>
