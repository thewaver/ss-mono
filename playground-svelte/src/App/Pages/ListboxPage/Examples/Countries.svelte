<script lang="ts">
    import { Listbox } from "@thewaver/ss-components-svelte";

    import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageListboxSurface from "../../../StyledComponents/ListboxSurface/ListboxSurface.svelte";
    import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import { COUNTRIES_WITH_REACHABLE } from "../../SelectPage/SelectPage.const.svelte";
    import type { ListboxExampleProps } from "../ListboxPage.types";

    type Props = ListboxExampleProps;

    let { value = $bindable() }: Props = $props();
</script>

<PageListboxSurface>
    <Listbox
        renderHighlightFloater={renderPageHighlightFloater}
        bind:value
        options={COUNTRIES_WITH_REACHABLE}
        ariaLabel={"Shipping country"}
    >
        {#snippet renderOption(option, flags)}
            <PageSelectOptionContent isGliding {flags}>{option.value}</PageSelectOptionContent>
        {/snippet}
    </Listbox>
</PageListboxSurface>
