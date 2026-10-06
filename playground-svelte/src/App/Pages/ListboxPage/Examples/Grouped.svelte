<script lang="ts">
    import { MultiListbox } from "@thewaver/ss-components-svelte";

    import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageListboxSurface from "../../../StyledComponents/ListboxSurface/ListboxSurface.svelte";
    import PageSelectGroupContent from "../../../StyledComponents/SelectGroupContent/SelectGroupContent.svelte";
    import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import { GROUPED_COUNTRIES } from "../../SelectPage/SelectPage.const.svelte";
    import type { MultiListboxExampleProps } from "../ListboxPage.types";

    type Props = MultiListboxExampleProps;

    let { values = $bindable() }: Props = $props();
</script>

<PageListboxSurface>
    <MultiListbox
        renderHighlightFloater={renderPageHighlightFloater}
        bind:values
        options={GROUPED_COUNTRIES}
        ariaLabel={"Countries to ship to"}
    >
        {#snippet renderGroup(group, flags)}
            <PageSelectGroupContent {flags}>{group.label}</PageSelectGroupContent>
        {/snippet}

        {#snippet renderOption(option, flags)}
            <PageSelectOptionContent isGliding {flags}>{option.value}</PageSelectOptionContent>
        {/snippet}
    </MultiListbox>
</PageListboxSurface>
