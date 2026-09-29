<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { TILE_BOARD_DEFAULTS, TileBoardUtils } from "@thewaver/ss-components-vue";
import { TileBoardKnobs } from "@thewaver/ss-playground/App/Knobs/TileBoards.const";
import { Index2d, type Index2dString, ShapeConst } from "@thewaver/ss-utils";

import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import DefaultExample from "./Examples/Default.vue";
import MeepleExample from "./Examples/Meeple.vue";
import PaintExample from "./Examples/Paint.vue";

const EXAMPLES_ROOT = "/src/App/Pages/TileBoardPage/Examples";

const FIELD_WIDTH = 130;

const STARTING_PIECE: Index2d = { row: 2, col: 2 };
const ROUTE_START: Index2d = { row: 0, col: 0 };
const ROCKS: Index2d[] = [
    { row: 1, col: 0 },
    { row: 1, col: 1 },
    { row: 2, col: 2 },
    { row: 3, col: 1 },
    { row: 3, col: 2 },
];

const NO_MARKS: Index2dString[] = [];

const describeTile = (tile: Index2d) => `row ${tile.row + 1}, tile ${tile.col + 1}`;

const computeIsRock = (tile: Index2d) => ROCKS.some((rock) => Index2d.isSame(rock, tile));

const rows = shallowRef(TileBoardKnobs.STARTING_ROWS);
const cols = shallowRef(TileBoardKnobs.STARTING_COLS);
const tileWidth = shallowRef(TileBoardKnobs.STARTING_TILE_WIDTH);
const tileHeight = shallowRef(TileBoardKnobs.STARTING_TILE_HEIGHT);
const gap = shallowRef(TILE_BOARD_DEFAULTS.gap);
const shape = shallowRef<ShapeConst.DefaultShape>(TILE_BOARD_DEFAULTS.tileShape);
const hasShortFirstRow = shallowRef(TileBoardKnobs.STARTING_HAS_SHORT_FIRST_ROW);
const taper = shallowRef(TILE_BOARD_DEFAULTS.taper);
const reach = shallowRef(TileBoardKnobs.STARTING_REACH);

const marked = shallowRef<Index2dString[]>(NO_MARKS);
const piece = shallowRef<Index2d>(STARTING_PIECE);
const destination = shallowRef<Index2d>();
const painted = shallowRef<Index2dString[]>(NO_MARKS);

const tileCount = computed((): Index2d => ({ row: rows.value, col: cols.value }));

const tileSize = computed(() => ({ width: tileWidth.value, height: tileHeight.value }));

const layout = computed(() =>
    TileBoardUtils.getLayout(shape.value, tileCount.value, tileSize.value, hasShortFirstRow.value, taper.value),
);

const reachable = computed(() => TileBoardUtils.getTilesWithin(piece.value, reach.value, layout.value));

const route = computed(() => {
    if (!destination.value) return;

    return TileBoardUtils.getShortestRoute(ROUTE_START, destination.value, layout.value, computeIsRock);
});

const routeMarks = computed(() => (route.value ?? []).map(Index2d.toString));

const paint = (tile: Index2d) => {
    const key = Index2d.toString(tile);

    if (!painted.value.includes(key)) painted.value = [...painted.value, key];
};

const togglePaint = (tile: Index2d) => {
    const key = Index2d.toString(tile);

    painted.value = painted.value.includes(key)
        ? painted.value.filter((entry) => entry !== key)
        : [...painted.value, key];
};

const describeRoute = () => {
    if (!destination.value) return "press a tile to trace the shortest way there from the piece, around the rocks";
    if (!route.value) return `no way round the rocks to ${describeTile(destination.value)}`;

    return `${route.value.length - 1} steps to ${describeTile(destination.value)}, going round the faded rocks`;
};

const toggleMark = (tile: Index2d) => {
    const key = Index2d.toString(tile);

    marked.value = marked.value.includes(key) ? marked.value.filter((entry) => entry !== key) : [...marked.value, key];
};

const computeIsOutOfReach = (tile: Index2d) => !reachable.value.some((candidate) => Index2d.isSame(candidate, tile));

const commonProps = computed(() => ({
    tileCount: tileCount.value,
    tileSize: tileSize.value,
    gap: gap.value,
    shape: shape.value,
    hasShortFirstRow: hasShortFirstRow.value,
    taper: taper.value,
}));

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: "A board you can mark",
        readout: () =>
            marked.value.length === 0
                ? "nothing marked — click a tile, or tab into the board and press Enter"
                : `marked: ${marked.value.join(", ")}`,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "meeple",
        name: "A piece that lives above the board",
        readout: () =>
            `standing on ${describeTile(piece.value)} — the ${reachable.value.length} tiles within ${reach.value} of it take it, the rest are refused but still walked`,
        path: `${EXAMPLES_ROOT}/Meeple.vue`,
    },
    {
        key: "route",
        name: "The shortest way round",
        readout: describeRoute,
        path: `${EXAMPLES_ROOT}/Meeple.vue`,
    },
    {
        key: "paint",
        name: "Paint by sweeping",
        readout: () =>
            `${painted.value.length} painted — drag across tiles to paint them, or press one to paint or clear it`,
        path: `${EXAMPLES_ROOT}/Paint.vue`,
    },
    {
        key: "disabled",
        name: "Disabled",
        readout: () => "nothing responds, by pointer or by key",
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp item-key="rows" label="Rows" hint="How many rows of tiles the board has.">
            <PageNumberField
                :value="rows"
                :min="TileBoardKnobs.MIN_ROWS"
                :max="TileBoardKnobs.MAX_ROWS"
                :step="TileBoardKnobs.COUNT_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Rows"
                @input="(value: number) => (rows = value)"
            />
        </PageProp>

        <PageProp item-key="cols" label="Columns" hint="How many tiles sit in a row.">
            <PageNumberField
                :value="cols"
                :min="TileBoardKnobs.MIN_COLS"
                :max="TileBoardKnobs.MAX_COLS"
                :step="TileBoardKnobs.COUNT_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Columns"
                @input="(value: number) => (cols = value)"
            />
        </PageProp>

        <PageProp item-key="tileWidth" label="Tile width" hint="How wide one tile is.">
            <PageNumberField
                :value="tileWidth"
                :min="TileBoardKnobs.MIN_TILE_SIZE"
                :max="TileBoardKnobs.MAX_TILE_SIZE"
                :step="TileBoardKnobs.SIZE_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Tile width"
                @input="(value: number) => (tileWidth = value)"
            />
        </PageProp>

        <PageProp item-key="tileHeight" label="Tile height" hint="How tall one tile is.">
            <PageNumberField
                :value="tileHeight"
                :min="TileBoardKnobs.MIN_TILE_SIZE"
                :max="TileBoardKnobs.MAX_TILE_SIZE"
                :step="TileBoardKnobs.SIZE_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Tile height"
                @input="(value: number) => (tileHeight = value)"
            />
        </PageProp>

        <PageProp item-key="gap" label="Gap" hint="The space left between tiles.">
            <PageNumberField
                :value="gap"
                :min="TileBoardKnobs.MIN_GAP"
                :max="TileBoardKnobs.MAX_GAP"
                :step="TileBoardKnobs.COUNT_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Gap"
                @input="(value: number) => (gap = value)"
            />
        </PageProp>

        <PageProp
            item-key="shape"
            label="Tile shape"
            hint="The outline each tile is cut to. A hexagon offsets alternate rows; a square does not."
        >
            <PageSelectField
                :value="shape"
                :values="ShapeConst.DEFAULT_SHAPES"
                :width="FIELD_WIDTH"
                ariaLabel="Tile shape"
                @change="(value: ShapeConst.DefaultShape) => (shape = value)"
            />
        </PageProp>

        <PageProp
            item-key="hasShortFirstRow"
            label="Start on the short row"
            hint="Starts the offset rows at the top instead of the second row, for shapes that stagger."
        >
            <PageCheckField
                :value="hasShortFirstRow"
                ariaLabel="Start on the short row"
                @change="(value: boolean) => (hasShortFirstRow = value)"
            />
        </PageProp>

        <PageProp
            item-key="taper"
            label="Taper"
            hint="How wide the top of the board is drawn, as a fraction of the bottom. Below 1 the board leans away, and a piece shrinks as it moves up it."
        >
            <PageNumberField
                :value="taper"
                :min="TileBoardKnobs.MIN_TAPER"
                :max="TileBoardKnobs.MAX_TAPER"
                :step="TileBoardKnobs.TAPER_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Taper"
                @input="(value: number) => (taper = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples" layout="flow">
        <template #default>
            <DefaultExample
                v-bind="commonProps"
                ariaLabel="Marked board"
                :is-disabled="false"
                :marked="marked"
                @tile-activate="toggleMark"
            />
        </template>

        <template #meeple>
            <MeepleExample
                v-bind="commonProps"
                ariaLabel="Board with a piece on it"
                :is-disabled="false"
                :piece="piece"
                :compute-is-tile-disabled="computeIsOutOfReach"
                @tile-activate="(tile: Index2d) => (piece = tile)"
            />

            <PageExampleKnobs>
                <PageProp
                    item-key="reach"
                    label="Reach"
                    hint="How many tiles the piece may travel in one move. Tiles out of reach are shown as unavailable."
                >
                    <PageNumberField
                        :value="reach"
                        :min="TileBoardKnobs.MIN_REACH"
                        :max="TileBoardKnobs.MAX_REACH"
                        :step="TileBoardKnobs.COUNT_STEP"
                        :width="FIELD_WIDTH"
                        ariaLabel="Reach"
                        @input="(value: number) => (reach = value)"
                    />
                </PageProp>
            </PageExampleKnobs>
        </template>

        <template #route>
            <MeepleExample
                v-bind="commonProps"
                ariaLabel="Board with rocks on it"
                :is-disabled="false"
                :piece="ROUTE_START"
                :marked="routeMarks"
                :compute-is-tile-disabled="computeIsRock"
                @tile-activate="(tile: Index2d) => (destination = tile)"
            />
        </template>

        <template #paint>
            <PaintExample
                v-bind="commonProps"
                ariaLabel="Board to paint"
                :is-disabled="false"
                :marked="painted"
                @tile-activate="togglePaint"
                @tile-sweep="paint"
            />
        </template>

        <template #disabled>
            <DefaultExample
                v-bind="commonProps"
                ariaLabel="Disabled board"
                is-disabled
                :marked="NO_MARKS"
                @tile-activate="toggleMark"
            />
        </template>
    </PageExamples>
</template>
