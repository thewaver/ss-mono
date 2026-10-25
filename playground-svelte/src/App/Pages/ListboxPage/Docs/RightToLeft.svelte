<script lang="ts">
    import { Listbox } from "@thewaver/ss-components-svelte";
    import { SIZES } from "@thewaver/ss-playground/App/Pages/ListboxPage/ListboxPage.const";

    import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageListboxSurface from "../../../StyledComponents/ListboxSurface/ListboxSurface.svelte";
    import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import type { ListboxRightToLeftDocsExampleProps } from "../ListboxPageSvelte.types";

    type Props = ListboxRightToLeftDocsExampleProps;

    let props: Props = $props();

    let size = $state<string | undefined>();
</script>

<div dir="rtl">
    <PageListboxSurface isWide={props.orientation === "horizontal"}>
        <Listbox
            id={"size"}
            renderHighlightFloater={renderPageHighlightFloater}
            bind:value={size}
            options={SIZES}
            orientation={props.orientation}
            ariaLabel={"Size"}
        >
            {#snippet renderOption(option, flags)}
                <PageSelectOptionContent isGliding {flags}>{option.value}</PageSelectOptionContent>
            {/snippet}
        </Listbox>
    </PageListboxSurface>
</div>
