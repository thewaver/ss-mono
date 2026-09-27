import { type ReactNode, useState } from "react";

import {
    type InteractionFlags,
    TILE_BOARD_DEFAULTS,
    type TileBoardLayout,
    type TileBoardRenderProps,
    TileBoardUtils,
} from "@thewaver/ss-components";
import { Index2d, Index2dString, type ShapeConst, type Size2d } from "@thewaver/ss-utils";

import { TileBoard } from "../../src";

type BoardProps = {
    shape?: ShapeConst.DefaultShape;
    hasShortFirstRow?: boolean;
    taper?: number;
    reach?: number;
};

const TILE_COUNT: Index2d = { row: 5, col: 5 };
const TILE_SIZE: Size2d = { width: 72, height: 72 };
const MEEPLE_WIDTH_RATIO = 0.56;
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

const labelTile = (tile: Index2d) => `Row ${tile.row + 1}, tile ${tile.col + 1}`;

const computeIsRock = (tile: Index2d) => ROCKS.some((rock) => Index2d.isSame(rock, tile));

const toggle = (list: Index2dString[], tile: Index2d) => {
    const key = Index2d.toString(tile);

    return list.includes(key) ? list.filter((entry) => entry !== key) : [...list, key];
};

const useLayout = ({ shape, hasShortFirstRow, taper }: BoardProps) =>
    TileBoardUtils.getLayout(
        shape ?? TILE_BOARD_DEFAULTS.tileShape,
        TILE_COUNT,
        TILE_SIZE,
        hasShortFirstRow ?? false,
        taper ?? TILE_BOARD_DEFAULTS.taper,
    );

const Tile = (props: { flags: InteractionFlags<TileBoardRenderProps>; isMarked: boolean }) => {
    const { flags } = props;
    const outline = flags.points.map((point) => `${point.x},${point.y}`).join(" ");

    return (
        <div
            data-marked={props.isMarked || undefined}
            data-focus-visible={flags.isFocusVisible || undefined}
            style={{ position: "relative", width: "100%", height: "100%" }}
        >
            <svg
                width={flags.size.width}
                height={flags.size.height}
                style={{ position: "absolute", overflow: "visible" }}
            >
                <polygon
                    points={outline}
                    fill={props.isMarked ? "#88f" : flags.isDisabled ? "#ccc" : "#eee"}
                    stroke={flags.isFocusVisible ? "black" : "#88a"}
                    strokeWidth={flags.isFocusVisible ? 3 : 1}
                />
            </svg>
            <span style={{ position: "absolute", bottom: 4, width: "100%", textAlign: "center", fontSize: 10 }}>
                {`${flags.tile.row}:${flags.tile.col}`}
            </span>
        </div>
    );
};

const Meeple = (props: { tile: Index2d; layout: TileBoardLayout }) => {
    const center = TileBoardUtils.getTileCenter(props.tile, props.layout);
    const scale = TileBoardUtils.getTileScale(props.tile, props.layout);

    return (
        <div
            data-meeple
            aria-hidden="true"
            style={{
                position: "absolute",
                left: `${center.x}px`,
                top: `${center.y}px`,
                width: `${TILE_SIZE.width * MEEPLE_WIDTH_RATIO * scale}px`,
                aspectRatio: "1",
                transform: "translate(-50%, -100%)",
                borderRadius: "50%",
                background: "orange",
                pointerEvents: "none",
            }}
        />
    );
};

const Host = (props: { testId: string; children: ReactNode }) => (
    <div data-testid={props.testId} style={{ position: "relative", width: "fit-content", margin: 40 }}>
        {props.children}
    </div>
);

export const Marked = (props: BoardProps & { isDisabled?: boolean }) => {
    const [marked, setMarked] = useState(NO_MARKS);
    const layout = useLayout(props);

    return (
        <>
            <Host testId="board">
                <TileBoard
                    ariaLabel="Marked board"
                    tileCount={TILE_COUNT}
                    tileSize={TILE_SIZE}
                    tileShape={props.shape}
                    hasShortFirstRow={props.hasShortFirstRow}
                    taper={props.taper}
                    isDisabled={props.isDisabled}
                    computeTileAriaLabel={labelTile}
                    renderTile={(tile, flags) => (
                        <Tile flags={flags} isMarked={marked.includes(Index2d.toString(tile))} />
                    )}
                    onTileActivate={(tile) => setMarked((previous) => toggle(previous, tile))}
                />

                {marked.map((key) => (
                    <Meeple key={key} tile={Index2dString.fromString(key)} layout={layout} />
                ))}
            </Host>
            <output data-readout="board">
                {marked.length === 0 ? "nothing marked" : `marked: ${marked.join(", ")}`}
            </output>
        </>
    );
};

export const Piece = (props: BoardProps) => {
    const [piece, setPiece] = useState(STARTING_PIECE);
    const layout = useLayout(props);
    const reachable = TileBoardUtils.getTilesWithin(piece, props.reach ?? 1, layout);

    return (
        <>
            <Host testId="board">
                <TileBoard
                    ariaLabel="Board with a piece on it"
                    tileCount={TILE_COUNT}
                    tileSize={TILE_SIZE}
                    tileShape={props.shape}
                    hasShortFirstRow={props.hasShortFirstRow}
                    taper={props.taper}
                    computeTileAriaLabel={labelTile}
                    computeIsTileDisabled={(tile) => !reachable.some((entry) => Index2d.isSame(entry, tile))}
                    renderTile={(tile, flags) => <Tile flags={flags} isMarked={Index2d.isSame(tile, piece)} />}
                    onTileActivate={setPiece}
                />

                <Meeple tile={piece} layout={layout} />
            </Host>
            <output data-readout="board">{`standing on ${describeTile(piece)}`}</output>
        </>
    );
};

export const Route = (props: BoardProps) => {
    const [destination, setDestination] = useState<Index2d>();
    const layout = useLayout(props);
    const route = destination
        ? TileBoardUtils.getShortestRoute(ROUTE_START, destination, layout, computeIsRock)
        : undefined;
    const lit = (route ?? []).map(Index2d.toString);

    return (
        <>
            <Host testId="board">
                <TileBoard
                    ariaLabel="Board with rocks on it"
                    tileCount={TILE_COUNT}
                    tileSize={TILE_SIZE}
                    tileShape={props.shape}
                    computeTileAriaLabel={labelTile}
                    computeIsTileDisabled={computeIsRock}
                    renderTile={(tile, flags) => (
                        <Tile
                            flags={flags}
                            isMarked={Index2d.isSame(tile, ROUTE_START) || lit.includes(Index2d.toString(tile))}
                        />
                    )}
                    onTileActivate={setDestination}
                />
            </Host>
            <output data-readout="board">{route ? `${route.length - 1} steps` : "no route"}</output>
        </>
    );
};

export const Paint = (props: BoardProps) => {
    const [painted, setPainted] = useState(NO_MARKS);

    return (
        <>
            <Host testId="board">
                <TileBoard
                    ariaLabel="Board to paint"
                    tileCount={TILE_COUNT}
                    tileSize={TILE_SIZE}
                    tileShape={props.shape}
                    computeTileAriaLabel={labelTile}
                    renderTile={(tile, flags) => (
                        <Tile flags={flags} isMarked={painted.includes(Index2d.toString(tile))} />
                    )}
                    onTileActivate={(tile) => setPainted((previous) => toggle(previous, tile))}
                    onTileSweep={(tile) =>
                        setPainted((previous) =>
                            previous.includes(Index2d.toString(tile))
                                ? previous
                                : [...previous, Index2d.toString(tile)],
                        )
                    }
                />
            </Host>
            <output data-readout="board">{`${painted.length} painted`}</output>
        </>
    );
};
