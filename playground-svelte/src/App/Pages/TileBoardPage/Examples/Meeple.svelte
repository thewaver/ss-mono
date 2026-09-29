<script lang="ts">
    import { TileBoard, TileBoardUtils } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/TileBoardPage/TileBoardPage.css";
    import { Index2d } from "@thewaver/ss-utils";

    import PageTileBoardMeeple from "../../../StyledComponents/TileBoardContent/PageTileBoardMeeple.svelte";
    import PageTileBoardTile from "../../../StyledComponents/TileBoardContent/PageTileBoardTile.svelte";
    import type { TileBoardMeepleExampleProps } from "../TileBoardPage.types";

    type Props = TileBoardMeepleExampleProps;

    let { shape, piece, marked, ...otherProps }: Props = $props();

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
            <PageTileBoardTile
                {renderProps}
                isMarked={Index2d.isSame(tile, piece) || (marked ?? []).includes(Index2d.toString(tile))}
            />
        {/snippet}
    </TileBoard>

    <PageTileBoardMeeple
        center={TileBoardUtils.getTileCenter(piece, layout)}
        scale={TileBoardUtils.getTileScale(piece, layout)}
        tileSize={otherProps.tileSize}
    />
</div>
