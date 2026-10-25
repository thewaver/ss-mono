<script lang="ts">
    import { Listbox } from "@thewaver/ss-components-svelte";

    import {
        renderPageHighlightFloater,
        renderPageSelectionFloater,
    } from "../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageListboxSurface from "../../../StyledComponents/ListboxSurface/ListboxSurface.svelte";
    import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import { COUNTRIES_WITH_REACHABLE } from "../../SelectPage/SelectPage.const.svelte";
    import type { ListboxGlideDocsExampleProps } from "../ListboxPageSvelte.types";

    type Props = ListboxGlideDocsExampleProps;

    let props: Props = $props();

    let country = $state<string | undefined>("Portugal");
</script>

<PageListboxSurface>
    <Listbox
        id={"glidingCountry"}
        renderSelectionFloater={props.isGliding ? renderPageSelectionFloater : undefined}
        renderHighlightFloater={props.isGliding ? renderPageHighlightFloater : undefined}
        bind:value={country}
        options={COUNTRIES_WITH_REACHABLE}
        ariaLabel={"Shipping country, gliding"}
    >
        {#snippet renderOption(option, flags)}
            <PageSelectOptionContent isGliding={props.isGliding} {flags}>{option.value}</PageSelectOptionContent>
        {/snippet}
    </Listbox>
</PageListboxSurface>
