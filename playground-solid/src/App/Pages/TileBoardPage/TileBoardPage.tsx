import { createMemo, createSignal } from "solid-js";

import { TILE_BOARD_DEFAULTS, TileBoardUtils } from "@thewaver/ss-components-solid";
import { TileBoardKnobs } from "@thewaver/ss-playground/App/Knobs/TileBoards.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
    NO_MARKS,
    ROCKS,
    ROUTE_START,
    STARTING_PIECE,
} from "@thewaver/ss-playground/App/Pages/TileBoardPage/TileBoardPage.const";
import { Index2d, type Index2dString } from "@thewaver/ss-utils";

import { PageExampleKnobs } from "../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageCheckField, PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { DefaultExample } from "./Examples/Default";
import { MeepleExample } from "./Examples/Meeple";
import { PaintExample } from "./Examples/Paint";

const describeTile = (tile: Index2d) => `row ${tile.row + 1}, tile ${tile.col + 1}`;

const computeIsRock = (tile: Index2d) => ROCKS.some((rock) => Index2d.isSame(rock, tile));

export const TileBoardPage = () => {
    const [getRows, setRows] = createSignal(TileBoardKnobs.STARTING_ROWS);
    const [getCols, setCols] = createSignal(TileBoardKnobs.STARTING_COLS);
    const [getTileWidth, setTileWidth] = createSignal(TileBoardKnobs.STARTING_TILE_WIDTH);
    const [getTileHeight, setTileHeight] = createSignal(TileBoardKnobs.STARTING_TILE_HEIGHT);
    const [getGap, setGap] = createSignal(TILE_BOARD_DEFAULTS.gap);
    const [getTiling, setTiling] = createSignal(TILE_BOARD_DEFAULTS.tiling);
    const [getHasShortFirstRow, setHasShortFirstRow] = createSignal(TileBoardKnobs.STARTING_HAS_SHORT_FIRST_ROW);
    const [getTaper, setTaper] = createSignal(TILE_BOARD_DEFAULTS.taper);
    const [getReach, setReach] = createSignal(TileBoardKnobs.STARTING_REACH);

    const [getMarked, setMarked] = createSignal<Index2dString[]>(NO_MARKS);
    const [getPiece, setPiece] = createSignal<Index2d>(STARTING_PIECE);
    const [getDestination, setDestination] = createSignal<Index2d>();
    const [getPainted, setPainted] = createSignal<Index2dString[]>(NO_MARKS);

    const getTileCount = createMemo((): Index2d => ({ row: getRows(), col: getCols() }));

    const getTileSize = createMemo(() => ({ width: getTileWidth(), height: getTileHeight() }));

    const getLayout = createMemo(() =>
        TileBoardUtils.getLayout(getTiling(), getTileCount(), getTileSize(), getHasShortFirstRow(), getTaper()),
    );

    const getReachable = createMemo(() => TileBoardUtils.getTilesWithin(getPiece(), getReach(), getLayout()));

    const getRoute = createMemo(() => {
        const destination = getDestination();

        if (!destination) return;

        return TileBoardUtils.getShortestRoute(ROUTE_START, destination, getLayout(), computeIsRock);
    });

    const paint = (tile: Index2d) => {
        const key = Index2d.toString(tile);

        setPainted((previous) => (previous.includes(key) ? previous : [...previous, key]));
    };

    const togglePaint = (tile: Index2d) => {
        const key = Index2d.toString(tile);

        setPainted((previous) =>
            previous.includes(key) ? previous.filter((painted) => painted !== key) : [...previous, key],
        );
    };

    const describeRoute = () => {
        const destination = getDestination();
        const route = getRoute();

        if (!destination) return "press a tile to trace the shortest way there from the piece, around the rocks";
        if (!route) return `no way round the rocks to ${describeTile(destination)}`;

        return `${route.length - 1} steps to ${describeTile(destination)}, going round the faded rocks`;
    };

    const toggleMark = (tile: Index2d) => {
        const key = Index2d.toString(tile);

        setMarked((previous) =>
            previous.includes(key) ? previous.filter((marked) => marked !== key) : [...previous, key],
        );
    };

    const getExamples = createMemo(() => {
        const commonProps = {
            tileCount: getTileCount,
            tileSize: getTileSize,
            gap: getGap,
            tiling: getTiling,
            hasShortFirstRow: getHasShortFirstRow,
            taper: getTaper,
        };

        return [
            {
                key: "default",
                name: EXAMPLE_NAMES.default,
                readout: () =>
                    getMarked().length === 0
                        ? "nothing marked — click a tile, or tab into the board and press Enter"
                        : `marked: ${getMarked().join(", ")}`,
                component: () => (
                    <DefaultExample
                        {...commonProps}
                        ariaLabel={"Marked board"}
                        isDisabled={false}
                        marked={getMarked}
                        onTileActivate={toggleMark}
                    />
                ),
                path: `${EXAMPLES_ROOT}/Default.tsx`,
            },
            {
                key: "meeple",
                name: EXAMPLE_NAMES.meeple,
                readout: () =>
                    `standing on ${describeTile(getPiece())} — the ${getReachable().length} tiles within ${getReach()} of it take it, the rest are refused but still walked`,
                component: () => (
                    <>
                        <MeepleExample
                            {...commonProps}
                            ariaLabel={"Board with a piece on it"}
                            isDisabled={false}
                            piece={getPiece}
                            computeIsTileDisabled={(tile) =>
                                !getReachable().some((reachable) => Index2d.isSame(reachable, tile))
                            }
                            onTileActivate={(tile) => setPiece(() => tile)}
                        />

                        <PageExampleKnobs>
                            <PageProp
                                key={"reach"}
                                label={"Reach"}
                                hint={
                                    "How many tiles the piece may travel in one move. Tiles out of reach are shown as unavailable."
                                }
                                controls={
                                    "Sets how far the example lets the piece travel, sent to TileBoardProps.computeIsTileDisabled"
                                }
                            >
                                <PageNumberField
                                    value={getReach}
                                    min={TileBoardKnobs.MIN_REACH}
                                    max={TileBoardKnobs.MAX_REACH}
                                    step={TileBoardKnobs.COUNT_STEP}
                                    width={FIELD_WIDTH}
                                    ariaLabel={"Reach"}
                                    onInput={setReach}
                                />
                            </PageProp>
                        </PageExampleKnobs>
                    </>
                ),
                path: `${EXAMPLES_ROOT}/Meeple.tsx`,
            },
            {
                key: "route",
                name: EXAMPLE_NAMES.route,
                readout: describeRoute,
                component: () => (
                    <MeepleExample
                        {...commonProps}
                        ariaLabel={"Board with rocks on it"}
                        isDisabled={false}
                        piece={ROUTE_START}
                        marked={() => (getRoute() ?? []).map(Index2d.toString)}
                        computeIsTileDisabled={computeIsRock}
                        onTileActivate={(tile) => setDestination(() => tile)}
                    />
                ),
                path: `${EXAMPLES_ROOT}/Meeple.tsx`,
            },
            {
                key: "paint",
                name: EXAMPLE_NAMES.paint,
                readout: () =>
                    `${getPainted().length} painted — drag across tiles to paint them, or press one to paint or clear it`,
                component: () => (
                    <PaintExample
                        {...commonProps}
                        ariaLabel={"Board to paint"}
                        isDisabled={false}
                        marked={getPainted}
                        onTileActivate={togglePaint}
                        onTileSweep={paint}
                    />
                ),
                path: `${EXAMPLES_ROOT}/Paint.tsx`,
            },
            {
                key: "disabled",
                name: EXAMPLE_NAMES.disabled,
                readout: () => "nothing responds, by pointer or by key",
                component: () => (
                    <DefaultExample
                        {...commonProps}
                        ariaLabel={"Disabled board"}
                        isDisabled={true}
                        marked={NO_MARKS}
                        onTileActivate={toggleMark}
                    />
                ),
                path: `${EXAMPLES_ROOT}/Default.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"rows"}
                    label={"Rows"}
                    hint={"How many rows of tiles the board has."}
                    controls={"Sets TileBoardProps.tileCount.row"}
                >
                    <PageNumberField
                        value={getRows}
                        min={TileBoardKnobs.MIN_ROWS}
                        max={TileBoardKnobs.MAX_ROWS}
                        step={TileBoardKnobs.COUNT_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Rows"}
                        onInput={setRows}
                    />
                </PageProp>

                <PageProp
                    key={"cols"}
                    label={"Columns"}
                    hint={"How many tiles sit in a row."}
                    controls={"Sets TileBoardProps.tileCount.col"}
                >
                    <PageNumberField
                        value={getCols}
                        min={TileBoardKnobs.MIN_COLS}
                        max={TileBoardKnobs.MAX_COLS}
                        step={TileBoardKnobs.COUNT_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Columns"}
                        onInput={setCols}
                    />
                </PageProp>

                <PageProp
                    key={"tileWidth"}
                    label={"Tile width"}
                    hint={"How wide one tile is."}
                    controls={"Sets TileBoardProps.tileSize.width"}
                >
                    <PageNumberField
                        value={getTileWidth}
                        min={TileBoardKnobs.MIN_TILE_SIZE}
                        max={TileBoardKnobs.MAX_TILE_SIZE}
                        step={TileBoardKnobs.SIZE_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Tile width"}
                        onInput={setTileWidth}
                    />
                </PageProp>

                <PageProp
                    key={"tileHeight"}
                    label={"Tile height"}
                    hint={"How tall one tile is."}
                    controls={"Sets TileBoardProps.tileSize.height"}
                >
                    <PageNumberField
                        value={getTileHeight}
                        min={TileBoardKnobs.MIN_TILE_SIZE}
                        max={TileBoardKnobs.MAX_TILE_SIZE}
                        step={TileBoardKnobs.SIZE_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Tile height"}
                        onInput={setTileHeight}
                    />
                </PageProp>

                <PageProp
                    key={"gap"}
                    label={"Gap"}
                    hint={"The space left between tiles."}
                    controls={"Sets TileBoardProps.gap"}
                >
                    <PageNumberField
                        value={getGap}
                        min={TileBoardKnobs.MIN_GAP}
                        max={TileBoardKnobs.MAX_GAP}
                        step={TileBoardKnobs.COUNT_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Gap"}
                        onInput={setGap}
                    />
                </PageProp>

                <PageProp
                    key={"tiling"}
                    label={"Tiling"}
                    hint={
                        "How the board is tiled. A shape lays that shape whole; the two halves cut each box corner to corner, from the top left down or the top right down, and the two quarters cut a square or a lozenge into four."
                    }
                    controls={"Sets TileBoardProps.tiling"}
                >
                    <PageSelectField
                        value={getTiling}
                        values={TileBoardKnobs.TILINGS}
                        width={FIELD_WIDTH}
                        ariaLabel={"Tiling"}
                        onChange={(tiling) => setTiling(() => tiling)}
                    />
                </PageProp>

                <PageProp
                    key={"hasShortFirstRow"}
                    label={"Start on the short row"}
                    hint={"Starts the offset rows at the top instead of the second row, for shapes that stagger."}
                    controls={"Sets TileBoardProps.hasShortFirstRow"}
                >
                    <PageCheckField
                        value={getHasShortFirstRow}
                        ariaLabel={"Start on the short row"}
                        onChange={setHasShortFirstRow}
                    />
                </PageProp>

                <PageProp
                    key={"taper"}
                    label={"Taper"}
                    hint={
                        "How wide the top of the board is drawn, as a fraction of the bottom. Below 1 the board leans away, and a piece shrinks as it moves up it."
                    }
                    controls={"Sets TileBoardProps.taper"}
                >
                    <PageNumberField
                        value={getTaper}
                        min={TileBoardKnobs.MIN_TAPER}
                        max={TileBoardKnobs.MAX_TAPER}
                        step={TileBoardKnobs.TAPER_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Taper"}
                        onInput={setTaper}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};
