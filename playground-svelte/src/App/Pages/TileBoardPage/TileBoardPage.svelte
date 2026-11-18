<script lang="ts">
    import { TILE_BOARD_DEFAULTS, TileBoardUtils } from "@thewaver/ss-components-svelte";
    import { TileBoardKnobs } from "@thewaver/ss-playground/App/Knobs/TileBoards.const";
    import { Index2d, type Index2dString } from "@thewaver/ss-utils";

    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import DefaultExample from "./Examples/Default.svelte";
    import MeepleExample from "./Examples/Meeple.svelte";
    import PaintExample from "./Examples/Paint.svelte";
    import {
    EXAMPLE_NAMES,
    EXAMPLES_ROOT,
    FIELD_WIDTH,
    NO_MARKS,
    ROUTE_START,
    STARTING_PIECE,
} from "@thewaver/ss-playground/App/Pages/TileBoardPage/TileBoardPage.const";

    const ROCKS: Index2d[] = [
        { row: 1, col: 0 },
        { row: 1, col: 1 },
        { row: 2, col: 2 },
        { row: 3, col: 1 },
        { row: 3, col: 2 },
    ];

    const describeTile = (tile: Index2d) => `row ${tile.row + 1}, tile ${tile.col + 1}`;

    const computeIsRock = (tile: Index2d) => ROCKS.some((rock) => Index2d.isSame(rock, tile));

    let rows = $state(TileBoardKnobs.STARTING_ROWS);
    let cols = $state(TileBoardKnobs.STARTING_COLS);
    let tileWidth = $state(TileBoardKnobs.STARTING_TILE_WIDTH);
    let tileHeight = $state(TileBoardKnobs.STARTING_TILE_HEIGHT);
    let gap = $state(TILE_BOARD_DEFAULTS.gap);
    let shape = $state(TILE_BOARD_DEFAULTS.tiling);
    let hasShortFirstRow = $state(TileBoardKnobs.STARTING_HAS_SHORT_FIRST_ROW);
    let taper = $state(TILE_BOARD_DEFAULTS.taper);
    let reach = $state(TileBoardKnobs.STARTING_REACH);

    let marked = $state.raw<Index2dString[]>(NO_MARKS);
    let piece = $state.raw<Index2d>(STARTING_PIECE);
    let destination = $state.raw<Index2d>();
    let painted = $state.raw<Index2dString[]>(NO_MARKS);

    const tileCount = $derived<Index2d>({ row: rows, col: cols });

    const tileSize = $derived({ width: tileWidth, height: tileHeight });

    const layout = $derived(TileBoardUtils.getLayout(shape, tileCount, tileSize, hasShortFirstRow, taper));

    const reachable = $derived(TileBoardUtils.getTilesWithin(piece, reach, layout));

    const route = $derived.by(() => {
        if (!destination) return;

        return TileBoardUtils.getShortestRoute(ROUTE_START, destination, layout, computeIsRock);
    });

    const paint = (tile: Index2d) => {
        const key = Index2d.toString(tile);

        painted = painted.includes(key) ? painted : [...painted, key];
    };

    const togglePaint = (tile: Index2d) => {
        const key = Index2d.toString(tile);

        painted = painted.includes(key) ? painted.filter((painted) => painted !== key) : [...painted, key];
    };

    const describeRoute = () => {
        if (!destination) return "press a tile to trace the shortest way there from the piece, around the rocks";
        if (!route) return `no way round the rocks to ${describeTile(destination)}`;

        return `${route.length - 1} steps to ${describeTile(destination)}, going round the faded rocks`;
    };

    const toggleMark = (tile: Index2d) => {
        const key = Index2d.toString(tile);

        marked = marked.includes(key) ? marked.filter((marked) => marked !== key) : [...marked, key];
    };

    const commonProps = $derived({
        tileCount,
        tileSize,
        gap,
        shape,
        hasShortFirstRow,
        taper,
    });

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: EXAMPLE_NAMES.default,
            readout: () =>
                marked.length === 0
                    ? "nothing marked — click a tile, or tab into the board and press Enter"
                    : `marked: ${marked.join(", ")}`,
            component: defaultExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "meeple",
            name: EXAMPLE_NAMES.meeple,
            readout: () =>
                `standing on ${describeTile(piece)} — the ${reachable.length} tiles within ${reach} of it take it, the rest are refused but still walked`,
            component: meepleExample,
            path: `${EXAMPLES_ROOT}/Meeple.svelte`,
        },
        {
            key: "route",
            name: EXAMPLE_NAMES.route,
            readout: describeRoute,
            component: routeExample,
            path: `${EXAMPLES_ROOT}/Meeple.svelte`,
        },
        {
            key: "paint",
            name: EXAMPLE_NAMES.paint,
            readout: () =>
                `${painted.length} painted — drag across tiles to paint them, or press one to paint or clear it`,
            component: paintExample,
            path: `${EXAMPLES_ROOT}/Paint.svelte`,
        },
        {
            key: "disabled",
            name: EXAMPLE_NAMES.disabled,
            readout: () => "nothing responds, by pointer or by key",
            component: disabledExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
    ];
</script>

{#snippet defaultExample()}
    <DefaultExample
        {...commonProps}
        ariaLabel={"Marked board"}
        isDisabled={false}
        {marked}
        onTileActivate={toggleMark}
    />
{/snippet}

{#snippet meepleExample()}
    <MeepleExample
        {...commonProps}
        ariaLabel={"Board with a piece on it"}
        isDisabled={false}
        {piece}
        computeIsTileDisabled={(tile) => !reachable.some((reachable) => Index2d.isSame(reachable, tile))}
        onTileActivate={(tile) => {
            piece = tile;
        }}
    />

    <PageExampleKnobs>
        <PageProp
            itemKey={"reach"}
            {...TileBoardKnobs.REACH_TEXT}
        >
            <PageNumberField
                value={reach}
                min={TileBoardKnobs.MIN_REACH}
                max={TileBoardKnobs.MAX_REACH}
                step={TileBoardKnobs.COUNT_STEP}
                width={FIELD_WIDTH}
                ariaLabel={"Reach"}
                onInput={(value) => {
                    reach = value;
                }}
            />
        </PageProp>
    </PageExampleKnobs>
{/snippet}

{#snippet routeExample()}
    <MeepleExample
        {...commonProps}
        ariaLabel={"Board with rocks on it"}
        isDisabled={false}
        piece={ROUTE_START}
        marked={(route ?? []).map(Index2d.toString)}
        computeIsTileDisabled={computeIsRock}
        onTileActivate={(tile) => {
            destination = tile;
        }}
    />
{/snippet}

{#snippet paintExample()}
    <PaintExample
        {...commonProps}
        ariaLabel={"Board to paint"}
        isDisabled={false}
        marked={painted}
        onTileActivate={togglePaint}
        onTileSweep={paint}
    />
{/snippet}

{#snippet disabledExample()}
    <DefaultExample
        {...commonProps}
        ariaLabel={"Disabled board"}
        isDisabled={true}
        marked={NO_MARKS}
        onTileActivate={toggleMark}
    />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp itemKey={"rows"} {...TileBoardKnobs.ROWS_TEXT}>
        <PageNumberField
            value={rows}
            min={TileBoardKnobs.MIN_ROWS}
            max={TileBoardKnobs.MAX_ROWS}
            step={TileBoardKnobs.COUNT_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Rows"}
            onInput={(value) => {
                rows = value;
            }}
        />
    </PageProp>

    <PageProp itemKey={"cols"} {...TileBoardKnobs.COLS_TEXT}>
        <PageNumberField
            value={cols}
            min={TileBoardKnobs.MIN_COLS}
            max={TileBoardKnobs.MAX_COLS}
            step={TileBoardKnobs.COUNT_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Columns"}
            onInput={(value) => {
                cols = value;
            }}
        />
    </PageProp>

    <PageProp itemKey={"tileWidth"} {...TileBoardKnobs.TILE_WIDTH_TEXT}>
        <PageNumberField
            value={tileWidth}
            min={TileBoardKnobs.MIN_TILE_SIZE}
            max={TileBoardKnobs.MAX_TILE_SIZE}
            step={TileBoardKnobs.SIZE_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Tile width"}
            onInput={(value) => {
                tileWidth = value;
            }}
        />
    </PageProp>

    <PageProp itemKey={"tileHeight"} {...TileBoardKnobs.TILE_HEIGHT_TEXT}>
        <PageNumberField
            value={tileHeight}
            min={TileBoardKnobs.MIN_TILE_SIZE}
            max={TileBoardKnobs.MAX_TILE_SIZE}
            step={TileBoardKnobs.SIZE_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Tile height"}
            onInput={(value) => {
                tileHeight = value;
            }}
        />
    </PageProp>

    <PageProp itemKey={"gap"} {...TileBoardKnobs.GAP_TEXT}>
        <PageNumberField
            value={gap}
            min={TileBoardKnobs.MIN_GAP}
            max={TileBoardKnobs.MAX_GAP}
            step={TileBoardKnobs.COUNT_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Gap"}
            onInput={(value) => {
                gap = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"tiling"}
        {...TileBoardKnobs.TILING_TEXT}
    >
        <PageSelectField
            value={shape}
            values={TileBoardKnobs.TILINGS}
            width={FIELD_WIDTH}
            ariaLabel={"Tiling"}
            onChange={(value) => {
                shape = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"hasShortFirstRow"}
        {...TileBoardKnobs.HAS_SHORT_FIRST_ROW_TEXT}
    >
        <PageCheckField
            value={hasShortFirstRow}
            ariaLabel={"Start on the short row"}
            onChange={(value) => {
                hasShortFirstRow = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"taper"}
        {...TileBoardKnobs.TAPER_TEXT}
    >
        <PageNumberField
            value={taper}
            min={TileBoardKnobs.MIN_TAPER}
            max={TileBoardKnobs.MAX_TAPER}
            step={TileBoardKnobs.TAPER_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Taper"}
            onInput={(value) => {
                taper = value;
            }}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} layout={"flow"} />
