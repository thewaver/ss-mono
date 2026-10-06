<script lang="ts">
    import { Listbox } from "@thewaver/ss-components-svelte";

    import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.svelte";
    import PageGlideLabel from "../../../StyledComponents/GlideFloater/PageGlideLabel.svelte";
    import PageListboxSurface from "../../../StyledComponents/ListboxSurface/ListboxSurface.svelte";
    import { COUNTRIES_WITH_REACHABLE } from "../../SelectPage/SelectPage.const.svelte";
    import type { ListboxExampleProps } from "../ListboxPage.types";

    type Props = ListboxExampleProps;

    let { value = $bindable() }: Props = $props();
</script>

<PageListboxSurface>
    <Listbox bind:value options={COUNTRIES_WITH_REACHABLE} ariaLabel={"Shipping country, gliding"}>
        {#snippet renderOption(option, flags)}
            <PageGlideLabel isSelected={flags.isSelected} isDisabled={flags.isDisabled ?? false}>
                {option.value}
            </PageGlideLabel>
        {/snippet}

        {#snippet renderSelectionFloater(visibilityTarget, transitionDurationMs)}
            <PageGlideFloater kind={"selection"} {visibilityTarget} {transitionDurationMs} />
        {/snippet}

        {#snippet renderHighlightFloater(visibilityTarget, transitionDurationMs)}
            <PageGlideFloater kind={"highlight"} {visibilityTarget} {transitionDurationMs} />
        {/snippet}
    </Listbox>
</PageListboxSurface>
