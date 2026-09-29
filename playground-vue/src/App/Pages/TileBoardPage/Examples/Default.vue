<script setup lang="ts">
import { computed } from "vue";

import { TileBoard, TileBoardUtils } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/TileBoardPage/TileBoardPage.css";
import { Index2d, Index2dString } from "@thewaver/ss-utils";

import PageTileBoardMeeple from "../../../StyledComponents/TileBoardContent/PageTileBoardMeeple.vue";
import PageTileBoardTile from "../../../StyledComponents/TileBoardContent/PageTileBoardTile.vue";
import type { TileBoardExampleProps } from "../TileBoardPage.types";

type Props = TileBoardExampleProps;

const props = defineProps<Props>();

const layout = computed(() =>
    TileBoardUtils.getLayout(props.shape, props.tileCount, props.tileSize, props.hasShortFirstRow, props.taper),
);

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

        <PageTileBoardMeeple
            v-for="key in marked"
            :key="key"
            :center="TileBoardUtils.getTileCenter(Index2dString.fromString(key), layout)"
            :scale="TileBoardUtils.getTileScale(Index2dString.fromString(key), layout)"
            :tile-size="tileSize"
        />
    </div>
</template>
