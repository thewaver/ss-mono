<script lang="ts">
    import { Listbox } from "@thewaver/ss-components-svelte";

    import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageListboxSurface from "../../../StyledComponents/ListboxSurface/ListboxSurface.svelte";
    import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import { SIZES } from "../ListboxPage.const";
    import type { ListboxExampleProps } from "../ListboxPage.types";

    type Props = ListboxExampleProps;

    let { value = $bindable() }: Props = $props();
</script>

<div dir="rtl">
    <PageListboxSurface isWide={true}>
        <Listbox
            renderHighlightFloater={renderPageHighlightFloater}
            bind:value
            options={SIZES}
            orientation={"horizontal"}
            ariaLabel={"Size"}
        >
            {#snippet renderOption(option, flags)}
                <PageSelectOptionContent isGliding {flags}>{option.value}</PageSelectOptionContent>
            {/snippet}
        </Listbox>
    </PageListboxSurface>
</div>
