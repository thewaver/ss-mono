<script lang="ts">
    import { TileBoard } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/TileBoardPage/TileBoardPage.css";
    import { Index2d } from "@thewaver/ss-utils";

    import PageTileBoardTile from "../../../StyledComponents/TileBoardContent/PageTileBoardTile.svelte";
    import type { TileBoardExampleProps } from "../TileBoardPage.types";

    type Props = TileBoardExampleProps;

    let { shape, marked, ...otherProps }: Props = $props();
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
</div>
