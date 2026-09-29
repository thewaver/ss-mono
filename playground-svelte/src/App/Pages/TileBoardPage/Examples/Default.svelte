<script lang="ts">
    import { TileBoard, TileBoardUtils } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/TileBoardPage/TileBoardPage.css";
    import { Index2d, Index2dString } from "@thewaver/ss-utils";

    import PageTileBoardMeeple from "../../../StyledComponents/TileBoardContent/PageTileBoardMeeple.svelte";
    import PageTileBoardTile from "../../../StyledComponents/TileBoardContent/PageTileBoardTile.svelte";
    import type { TileBoardExampleProps } from "../TileBoardPage.types";

    type Props = TileBoardExampleProps;

    let { shape, marked, ...otherProps }: Props = $props();

    const layout = $derived(
        TileBoardUtils.getLayout(
            shape,
            otherProps.tileCount,
            otherProps.tileSize,
            otherProps.hasShortFirstRow,
            otherProps.taper,
        ),
    );
</script>

<div class={styles.meepleHost}>
    <TileBoard
        {...otherProps}
        tileShape={shape}
        computeTileAriaLabel={(tile) => `Row ${tile.row + 1}, tile ${tile.col + 1}`}
    >
        {#snippet renderTile(tile, renderProps)}
            <PageTileBoardTile {renderProps} isMarked={marked.includes(Index2d.toString(tile))} />
        {/snippet}
    </TileBoard>

    {#each marked as key (key)}
        <PageTileBoardMeeple
            center={TileBoardUtils.getTileCenter(Index2dString.fromString(key), layout)}
            scale={TileBoardUtils.getTileScale(Index2dString.fromString(key), layout)}
            tileSize={otherProps.tileSize}
        />
    {/each}
</div>
