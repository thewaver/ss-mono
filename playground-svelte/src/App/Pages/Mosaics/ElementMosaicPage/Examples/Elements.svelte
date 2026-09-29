<script lang="ts">
    import { ElementMosaic } from "@thewaver/ss-components-svelte";

    import PageMosaicTile from "../../../../StyledComponents/MosaicContent/PageMosaicTile.svelte";
    import type { ElementsExampleProps } from "../ElementMosaicPage.types";

    type Props = ElementsExampleProps;

    let props: Props = $props();
</script>

<ElementMosaic
    items={props.items}
    gap={props.gap}
    sizeAnchor={props.sizeAnchor}
    transitionDurationMs={props.transitionDurationMs}
>
    {#snippet renderItem(item, state)}
        <PageMosaicTile {state} width={item.width} height={item.height}>
            {item.name}
        </PageMosaicTile>
    {/snippet}
</ElementMosaic>
