<script lang="ts">
    import { ElementMosaic } from "@thewaver/ss-components-svelte";
    import { PICKED_GROWTH } from "@thewaver/ss-playground/App/Pages/Mosaics/Mosaics.const";

    import PageMosaicTile from "../../../../StyledComponents/MosaicContent/PageMosaicTile.svelte";
    import type { WalkedExampleProps } from "../ElementMosaicPage.types";

    type Props = WalkedExampleProps;

    let props: Props = $props();

    const getGrowth = (name: string) => (props.pickedNames.includes(name) ? PICKED_GROWTH : 1);
</script>

<ElementMosaic
    items={props.items}
    gap={props.gap}
    sizeAnchor={props.sizeAnchor}
    transitionDurationMs={props.transitionDurationMs}
    ariaLabel={"Tiles"}
    onActivate={props.onActivate}
>
    {#snippet renderItem(item, state)}
        <PageMosaicTile {state} width={item.width * getGrowth(item.name)} height={item.height * getGrowth(item.name)}>
            {item.name}
        </PageMosaicTile>
    {/snippet}
</ElementMosaic>
