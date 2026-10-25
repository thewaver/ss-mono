<script lang="ts">
    import { MultiListbox } from "@thewaver/ss-components-svelte";

    import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageListboxSurface from "../../../StyledComponents/ListboxSurface/ListboxSurface.svelte";
    import PageSelectGroupContent from "../../../StyledComponents/SelectGroupContent/SelectGroupContent.svelte";
    import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import { GROUPED_COUNTRIES } from "../../SelectPage/SelectPage.const.svelte";

    let countries = $state<string[]>(["Denmark"]);
</script>

<PageListboxSurface>
    <MultiListbox
        id={"shippingCountries"}
        renderHighlightFloater={renderPageHighlightFloater}
        bind:values={countries}
        options={GROUPED_COUNTRIES}
        ariaLabel={"Countries to ship to"}
    >
        {#snippet renderGroupHeader(group, flags)}
            <PageSelectGroupContent {flags}>{group.label}</PageSelectGroupContent>
        {/snippet}

        {#snippet renderOption(option, flags)}
            <PageSelectOptionContent isGliding {flags}>{option.value}</PageSelectOptionContent>
        {/snippet}
    </MultiListbox>
</PageListboxSurface>
