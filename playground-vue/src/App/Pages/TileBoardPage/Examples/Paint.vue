<script setup lang="ts">
import { TileBoard } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/TileBoardPage/TileBoardPage.css";
import { Index2d } from "@thewaver/ss-utils";

import PageTileBoardTile from "../../../StyledComponents/TileBoardContent/PageTileBoardTile.vue";
import type { TileBoardExampleProps } from "../TileBoardPage.types";

type Props = TileBoardExampleProps;

const props = defineProps<Props>();

const computeTileAriaLabel = (tile: Index2d) => `Row ${tile.row + 1}, tile ${tile.col + 1}`;
</script>

<template>
    <div :class="styles.meepleHost">
        <TileBoard
            :ariaLabel="ariaLabel"
            :tile-count="tileCount"
            :tile-size="tileSize"
            :gap="gap"
            :has-short-first-row="hasShortFirstRow"
            :taper="taper"
            :is-disabled="isDisabled"
            :compute-is-tile-disabled="computeIsTileDisabled"
            :tile-shape="shape"
            :compute-tile-aria-label="computeTileAriaLabel"
            @tile-activate="props.onTileActivate"
            @tile-sweep="props.onTileSweep"
        >
            <template #renderTile="{ tile, flags }">
                <PageTileBoardTile :render-props="flags" :is-marked="marked.includes(Index2d.toString(tile))" />
            </template>
        </TileBoard>
    </div>
</template>
