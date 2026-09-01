import { createMemo, createSignal } from "solid-js";

import { type TileBoardLayout, TileBoardUtils } from "@thewaver/ss-components";
import { Count2d, type Count2dString, ShapeConst } from "@thewaver/ss-utils";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageCheckField, PageNumberField, PageSelectField } from "../../StyledComponents/Field/Field";
import { DefaultExample } from "./Examples/Default";
import { MeepleExample } from "./Examples/Meeple";

const EXAMPLES_ROOT = "/src/App/Pages/TileBoardPage/Examples";

const MIN_ROWS = 1;
const MAX_ROWS = 9;
const MIN_COLS = 1;
const MAX_COLS = 9;
const MIN_TILE_SIZE = 24;
const MAX_TILE_SIZE = 120;
const MIN_REACH = 1;
const MAX_REACH = 4;
const MIN_GAP = 0;
const MAX_GAP = 16;
const SIZE_STEP = 2;
const COUNT_STEP = 1;
const FIELD_WIDTH = 130;

const STARTING_ROWS = 5;
const STARTING_COLS = 5;
const STARTING_TILE_WIDTH = 72;
const STARTING_TILE_HEIGHT = 72;
const STARTING_GAP = 4;
const STARTING_REACH = 1;
const STARTING_SHAPE: ShapeConst.DefaultShape = "hexagon-pointy-top";
const STARTING_PIECE: Count2d = { row: 2, col: 2 };

const NO_MARKS: Count2dString[] = [];

const describeTile = (tile: Count2d) => `row ${tile.row + 1}, tile ${tile.col + 1}`;

const computeTilesWithin = (from: Count2d, reach: number, layout: TileBoardLayout) => {
    const seen = new Set([Count2d.toString(from)]);
    const within: Count2d[] = [];

    let edge = [from];

    for (let step = 0; step < reach; step += 1) {
        const next: Count2d[] = [];

        for (const tile of edge) {
            for (const neighbour of TileBoardUtils.getNeighbourTiles(tile, layout)) {
                if (seen.has(Count2d.toString(neighbour))) continue;

                seen.add(Count2d.toString(neighbour));
                next.push(neighbour);
                within.push(neighbour);
            }
        }

        edge = next;
    }

    return within;
};

export const TileBoardPage = () => {
    const [getRows, setRows] = createSignal(STARTING_ROWS);
    const [getCols, setCols] = createSignal(STARTING_COLS);
    const [getTileWidth, setTileWidth] = createSignal(STARTING_TILE_WIDTH);
    const [getTileHeight, setTileHeight] = createSignal(STARTING_TILE_HEIGHT);
    const [getGap, setGap] = createSignal(STARTING_GAP);
    const [getShape, setShape] = createSignal<ShapeConst.DefaultShape>(STARTING_SHAPE);
    const [getHasShortFirstRow, setHasShortFirstRow] = createSignal(false);
    const [getReach, setReach] = createSignal(STARTING_REACH);

    const [getMarked, setMarked] = createSignal<Count2dString[]>(NO_MARKS);
    const [getPiece, setPiece] = createSignal<Count2d>(STARTING_PIECE);

    const getTileCount = createMemo((): Count2d => ({ row: getRows(), col: getCols() }));

    const getTileSize = createMemo(() => ({ width: getTileWidth(), height: getTileHeight() }));

    const getLayout = createMemo(() =>
        TileBoardUtils.getLayout(getShape(), getTileCount(), getTileSize(), getHasShortFirstRow()),
    );

    const getReachable = createMemo(() => computeTilesWithin(getPiece(), getReach(), getLayout()));

    const toggleMark = (tile: Count2d) => {
        const key = Count2d.toString(tile);

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
                                !getReachable().some((reachable) => Count2d.isSame(reachable, tile))
                            }
                            onTileActivate={(tile) => setPiece(() => tile)}
                        />

                        <PagePropsPanel scope={"local"}>
                            <PageProp key={"reach"} label={"Reach"}>
                                <PageNumberField
                                    value={getReach}
                                    min={() => MIN_REACH}
                                    max={() => MAX_REACH}
                                    step={() => COUNT_STEP}
                                    width={() => FIELD_WIDTH}
                                    ariaLabel={"Reach"}
                                    onInput={setReach}
                                />
                            </PageProp>
                        </PagePropsPanel>
                    </>
                ),
                path: `${EXAMPLES_ROOT}/Meeple.tsx`,
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
                <PageProp key={"rows"} label={"Rows"}>
                    <PageNumberField
                        value={getRows}
                        min={() => MIN_ROWS}
                        max={() => MAX_ROWS}
                        step={() => COUNT_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Rows"}
                        onInput={setRows}
                    />
                </PageProp>

                <PageProp key={"cols"} label={"Columns"}>
                    <PageNumberField
                        value={getCols}
                        min={() => MIN_COLS}
                        max={() => MAX_COLS}
                        step={() => COUNT_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Columns"}
                        onInput={setCols}
                    />
                </PageProp>

                <PageProp key={"tileWidth"} label={"Tile width"}>
                    <PageNumberField
                        value={getTileWidth}
                        min={() => MIN_TILE_SIZE}
                        max={() => MAX_TILE_SIZE}
                        step={() => SIZE_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Tile width"}
                        onInput={setTileWidth}
                    />
                </PageProp>

                <PageProp key={"tileHeight"} label={"Tile height"}>
                    <PageNumberField
                        value={getTileHeight}
                        min={() => MIN_TILE_SIZE}
                        max={() => MAX_TILE_SIZE}
                        step={() => SIZE_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Tile height"}
                        onInput={setTileHeight}
                    />
                </PageProp>

                <PageProp key={"gap"} label={"Gap"}>
                    <PageNumberField
                        value={getGap}
                        min={() => MIN_GAP}
                        max={() => MAX_GAP}
                        step={() => COUNT_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Gap"}
                        onInput={setGap}
                    />
                </PageProp>

                <PageProp key={"shape"} label={"Tile shape"}>
                    <PageSelectField
                        value={getShape}
                        values={() => ShapeConst.DEFAULT_SHAPES}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Tile shape"}
                        onChange={(shape) => setShape(() => shape)}
                    />
                </PageProp>

                <PageProp key={"hasShortFirstRow"} label={"Start on the short row"}>
                    <PageCheckField
                        value={getHasShortFirstRow}
                        ariaLabel={"Start on the short row"}
                        onChange={setHasShortFirstRow}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};
