<script lang="ts">
    import { Listbox } from "@thewaver/ss-components-svelte";
    import {
        SKIN_SAMPLE_OPTIONS,
        SKIN_SAMPLE_SELECTED_OPTION,
    } from "@thewaver/ss-playground/App/Pages/AppearancePage/AppearancePage.const";

    import {
        renderPageHighlightFloater,
        renderPageSelectionFloater,
    } from "../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageListboxSurface from "../../StyledComponents/ListboxSurface/ListboxSurface.svelte";
    import PageSelectOptionContent from "../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import SkinHoveredOption from "./SkinHoveredOption.svelte";
    import type { SkinListboxSampleProps } from "./AppearancePage.types";

    let props: SkinListboxSampleProps = $props();

    let value = $state<string | undefined>(SKIN_SAMPLE_SELECTED_OPTION);
</script>

<PageListboxSurface>
    <Listbox
        renderSelectionFloater={props.isGliding ? renderPageSelectionFloater : undefined}
        renderHighlightFloater={props.isGliding ? renderPageHighlightFloater : undefined}
        bind:value
        options={SKIN_SAMPLE_OPTIONS}
        ariaLabel={props.isGliding ? "Listbox" : "Listbox without floater"}
    >
        {#snippet renderOption(option, flags)}
            <PageSelectOptionContent
                hasHoverFloater={props.isGliding}
                hasSelectionFloater={props.isGliding}
                {flags}>{option.value}</PageSelectOptionContent
            >
        {/snippet}
    </Listbox>

    <SkinHoveredOption isGliding={props.isGliding} />
</PageListboxSurface>
