<script lang="ts">
    import { Listbox } from "@thewaver/ss-components-svelte";

    import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageListboxSurface from "../../../StyledComponents/ListboxSurface/ListboxSurface.svelte";
    import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import { COUNTRIES_WITH_REACHABLE } from "../../SelectPage/SelectPage.const.svelte";
    import type { ListboxBasicDocsExampleProps } from "../ListboxPageSvelte.types";

    type Props = ListboxBasicDocsExampleProps;

    let props: Props = $props();

    let country = $state<string | undefined>("Portugal");
</script>

<PageListboxSurface>
    <Listbox
        id={"shippingCountry"}
        renderHighlightFloater={renderPageHighlightFloater}
        bind:value={country}
        options={COUNTRIES_WITH_REACHABLE}
        isDisabled={props.isDisabled}
        ariaLabel={"Shipping country"}
    >
        {#snippet renderOption(option, flags)}
            <PageSelectOptionContent isGliding {flags}>{option.value}</PageSelectOptionContent>
        {/snippet}
    </Listbox>
</PageListboxSurface>
