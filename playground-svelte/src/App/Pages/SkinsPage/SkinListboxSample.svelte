<script lang="ts">
    import { Listbox } from "@thewaver/ss-components-svelte";
    import {
        SKIN_SAMPLE_OPTIONS,
        SKIN_SAMPLE_SELECTED_OPTION,
    } from "@thewaver/ss-playground/App/Pages/SkinsPage/SkinsPage.const";

    import { renderPageHighlightFloater } from "../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageListboxSurface from "../../StyledComponents/ListboxSurface/ListboxSurface.svelte";
    import PageSelectOptionContent from "../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";

    let value = $state<string | undefined>(SKIN_SAMPLE_SELECTED_OPTION);
</script>

<PageListboxSurface>
    <Listbox
        renderHighlightFloater={renderPageHighlightFloater}
        bind:value
        options={SKIN_SAMPLE_OPTIONS}
        ariaLabel={"Listbox"}
    >
        {#snippet renderOption(option, flags)}
            <PageSelectOptionContent isGliding {flags}>{option.value}</PageSelectOptionContent>
        {/snippet}
    </Listbox>
</PageListboxSurface>
