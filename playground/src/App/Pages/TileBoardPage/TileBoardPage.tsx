import { createMemo, createSignal } from "solid-js";

import { TILE_BOARD_DEFAULTS, TileBoardUtils } from "@thewaver/ss-components";
import { Index2d, type Index2dString, ShapeConst } from "@thewaver/ss-utils";

import { TileBoardKnobs } from "../../Knobs/TileBoards.const";
import { PageExampleKnobs } from "../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageCheckField, PageNumberField, PageSelectField } from "../../StyledComponents/Field/Field";
import { DefaultExample } from "./Examples/Default";
import { MeepleExample } from "./Examples/Meeple";
import { PaintExample } from "./Examples/Paint";

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

export const TileBoardPage = () => {
    const [getRows, setRows] = createSignal(TileBoardKnobs.STARTING_ROWS);
    const [getCols, setCols] = createSignal(TileBoardKnobs.STARTING_COLS);
    const [getTileWidth, setTileWidth] = createSignal(TileBoardKnobs.STARTING_TILE_WIDTH);
    const [getTileHeight, setTileHeight] = createSignal(TileBoardKnobs.STARTING_TILE_HEIGHT);
    const [getGap, setGap] = createSignal(TILE_BOARD_DEFAULTS.gap);
    const [getShape, setShape] = createSignal<ShapeConst.DefaultShape>(TILE_BOARD_DEFAULTS.tileShape);
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
        TileBoardUtils.getLayout(getShape(), getTileCount(), getTileSize(), getHasShortFirstRow(), getTaper()),
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
            shape: getShape,
            hasShortFirstRow: getHasShortFirstRow,
            taper: getTaper,
        };

        return [
            {
                key: "default",
                name: "A board you can mark",
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
                name: "A piece that lives above the board",
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
                            >
                                <PageNumberField
                                    value={getReach}
                                    min={() => TileBoardKnobs.MIN_REACH}
                                    max={() => TileBoardKnobs.MAX_REACH}
                                    step={() => TileBoardKnobs.COUNT_STEP}
                                    width={() => FIELD_WIDTH}
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
                name: "The shortest way round",
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
                name: "Paint by sweeping",
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
                name: "Disabled",
                readout: () => "nothing responds, by pointer or by key",
                component: () => (
                    <DefaultExample
                        {...commonProps}
                        ariaLabel={"Disabled board"}
                        isDisabled={true}
                        marked={() => NO_MARKS}
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
                <PageProp key={"rows"} label={"Rows"} hint={"How many rows of tiles the board has."}>
                    <PageNumberField
                        value={getRows}
                        min={() => TileBoardKnobs.MIN_ROWS}
                        max={() => TileBoardKnobs.MAX_ROWS}
                        step={() => TileBoardKnobs.COUNT_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Rows"}
                        onInput={setRows}
                    />
                </PageProp>

                <PageProp key={"cols"} label={"Columns"} hint={"How many tiles sit in a row."}>
                    <PageNumberField
                        value={getCols}
                        min={() => TileBoardKnobs.MIN_COLS}
                        max={() => TileBoardKnobs.MAX_COLS}
                        step={() => TileBoardKnobs.COUNT_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Columns"}
                        onInput={setCols}
                    />
                </PageProp>

                <PageProp key={"tileWidth"} label={"Tile width"} hint={"How wide one tile is."}>
                    <PageNumberField
                        value={getTileWidth}
                        min={() => TileBoardKnobs.MIN_TILE_SIZE}
                        max={() => TileBoardKnobs.MAX_TILE_SIZE}
                        step={() => TileBoardKnobs.SIZE_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Tile width"}
                        onInput={setTileWidth}
                    />
                </PageProp>

                <PageProp key={"tileHeight"} label={"Tile height"} hint={"How tall one tile is."}>
                    <PageNumberField
                        value={getTileHeight}
                        min={() => TileBoardKnobs.MIN_TILE_SIZE}
                        max={() => TileBoardKnobs.MAX_TILE_SIZE}
                        step={() => TileBoardKnobs.SIZE_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Tile height"}
                        onInput={setTileHeight}
                    />
                </PageProp>

                <PageProp key={"gap"} label={"Gap"} hint={"The space left between tiles."}>
                    <PageNumberField
                        value={getGap}
                        min={() => TileBoardKnobs.MIN_GAP}
                        max={() => TileBoardKnobs.MAX_GAP}
                        step={() => TileBoardKnobs.COUNT_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Gap"}
                        onInput={setGap}
                    />
                </PageProp>

                <PageProp
                    key={"shape"}
                    label={"Tile shape"}
                    hint={"The outline each tile is cut to. A hexagon offsets alternate rows; a square does not."}
                >
                    <PageSelectField
                        value={getShape}
                        values={() => ShapeConst.DEFAULT_SHAPES}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Tile shape"}
                        onChange={(shape) => setShape(() => shape)}
                    />
                </PageProp>

                <PageProp
                    key={"hasShortFirstRow"}
                    label={"Start on the short row"}
                    hint={"Starts the offset rows at the top instead of the second row, for shapes that stagger."}
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
                >
                    <PageNumberField
                        value={getTaper}
                        min={() => TileBoardKnobs.MIN_TAPER}
                        max={() => TileBoardKnobs.MAX_TAPER}
                        step={() => TileBoardKnobs.TAPER_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Taper"}
                        onInput={setTaper}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};
