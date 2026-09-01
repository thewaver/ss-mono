import { Index, createEffect, createMemo, createSignal, createUniqueId, onCleanup } from "solid-js";

import { Index2d, type Point2d, ShapeConst, type Size2d } from "@thewaver/ss-utils";

import { InteractionWrapper } from "../../Fundamentals/InteractionWrapper/InteractionWrapper";
import { access } from "../../Utils/propUtils";
import type { TileBoardProps, TileBoardRenderProps, TileBoardTileProps } from "./TileBoard.types";
import { TileBoardUtils } from "./TileBoard.utils";

import * as styles from "./TileBoard.css";

const DEFAULT_TILE_SHAPE: ShapeConst.DefaultShape = "hexagon-pointy-top";
const DEFAULT_GAP = 0;
const FIRST_ARIA_INDEX = 1;
const HALF = 0.5;
const MIN_CLIP_POINTS = 3;
const NO_CLIP = "none";
const SELECT_KEYS = ["Enter", " "];
const EDGE_KEYS = ["Home", "End"];

const toClipPath = (points: Point2d[]) => {
    if (points.length < MIN_CLIP_POINTS) return NO_CLIP;

    return `polygon(${points.map((point) => `${point.x}px ${point.y}px`).join(", ")})`;
};

const TileBoardTile = (props: TileBoardTileProps) => {
    const getIsDisabled = () => access(props.flags).isDisabled ?? false;

    return (
        <div
            id={access(props.id)}
            ref={(element) => props.ref?.(element)}
            class={styles.tileBoardTile}
            role="gridcell"
            aria-colindex={access(props.colIndex)}
            aria-label={access(props.ariaLabel)}
            aria-disabled={getIsDisabled() || undefined}
            style={{
                width: `${access(props.size).width}px`,
                height: `${access(props.size).height}px`,
            }}
            onClick={() => {
                if (getIsDisabled()) return;

                props.onActivate();
            }}
        >
            <div class={styles.tileBoardPaint}>{props.renderContent(() => access(props.flags))}</div>

            <div class={styles.tileBoardHit} style={{ "clip-path": access(props.clipPath) }} aria-hidden={"true"} />
        </div>
    );
};

export const TileBoard = (props: TileBoardProps) => {
    const boardId = createUniqueId();

    const tileRefs = new Map<string, HTMLElement>();

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getHighlighted, setHighlighted] = createSignal<Index2d>(TileBoardUtils.getFirstTile());

    const getGap = createMemo(() => access(props.gap) ?? DEFAULT_GAP);

    const getPitchSize = createMemo(() => access(props.tileSize));

    const getTileSize = createMemo((): Size2d => ({
        width: Math.max(getPitchSize().width - getGap(), 0),
        height: Math.max(getPitchSize().height - getGap(), 0),
    }));

    const getLayout = createMemo(() =>
        TileBoardUtils.getLayout(
            access(props.tileShape) ?? DEFAULT_TILE_SHAPE,
            access(props.tileCount),
            getPitchSize(),
            access(props.hasShortFirstRow) ?? false,
        ),
    );

    const getBoardSize = createMemo(() => TileBoardUtils.getBoardSize(getLayout()));

    const getPoints = createMemo(() => TileBoardUtils.getTilePoints(getLayout().shape, getTileSize(), false));

    const getFlippedPoints = createMemo(() => TileBoardUtils.getTilePoints(getLayout().shape, getTileSize(), true));

    const getClipPath = createMemo(() => toClipPath(getPoints()));

    const getFlippedClipPath = createMemo(() => toClipPath(getFlippedPoints()));

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getIsTileDisabled = (tile: Index2d) => getIsDisabled() || (props.computeIsTileDisabled?.(tile) ?? false);

    const getRovingTile = createMemo(() => TileBoardUtils.clampTile(getHighlighted(), getLayout()));

    const moveTo = (tile: Index2d) => {
        setHighlighted(() => TileBoardUtils.clampTile(tile, getLayout()));
    };

    const activateTile = (tile: Index2d) => {
        if (getIsTileDisabled(tile)) return;

        moveTo(tile);
        props.onTileActivate(tile);
    };

    createEffect(() => {
        const tile = getRovingTile();
        const root = getRootRef();

        if (!root?.contains(document.activeElement) || root === document.activeElement) return;

        tileRefs.get(Index2d.toString(tile))?.focus();
    });

    const handleKeyDown = (e: KeyboardEvent) => {
        const roving = getRovingTile();

        if (SELECT_KEYS.includes(e.key)) {
            e.preventDefault();
            activateTile(roving);

            return;
        }

        if ((e.ctrlKey || e.metaKey) && EDGE_KEYS.includes(e.key)) {
            e.preventDefault();
            moveTo(e.key === "Home" ? TileBoardUtils.getFirstTile() : TileBoardUtils.getLastTile(getLayout()));

            return;
        }

        const next = TileBoardUtils.computeNextTile(e.key, roving, getLayout());

        if (next === undefined) return;

        e.preventDefault();
        moveTo(next);
    };

    const renderTile = (row: number, col: number) => {
        const tile: Index2d = { row, col };
        const key = Index2d.toString(tile);
        const getTile = () => tile;
        const getIsFlipped = () => TileBoardUtils.getIsFlippedTile(tile, getLayout());

        onCleanup(() => {
            tileRefs.delete(key);
        });

        return (
            <div
                class={styles.tileBoardCell}
                role="presentation"
                style={{ left: `${col * getLayout().pitch.width}px` }}
            >
                <InteractionWrapper
                    isDisabled={() => getIsTileDisabled(tile)}
                    isFocusableWhenDisabled={() => !getIsDisabled()}
                    isTabbable={() => Index2d.isSame(tile, getRovingTile())}
                    extraFlags={(): TileBoardRenderProps => ({
                        tile,
                        size: getTileSize(),
                        points: getIsFlipped() ? getFlippedPoints() : getPoints(),
                        isFlipped: getIsFlipped(),
                        isHighlighted: Index2d.isSame(tile, getRovingTile()),
                    })}
                    ref={(element) => tileRefs.set(key, element)}
                    renderControl={(setElementRef, getRenderProps) => (
                        <TileBoardTile
                            ref={setElementRef}
                            id={`${boardId}-tile-${key}`}
                            flags={getRenderProps}
                            ariaLabel={
                                props.computeTileAriaLabel === undefined
                                    ? undefined
                                    : () => props.computeTileAriaLabel!(tile)
                            }
                            colIndex={col + FIRST_ARIA_INDEX}
                            size={getTileSize}
                            clipPath={() => (getIsFlipped() ? getFlippedClipPath() : getClipPath())}
                            renderContent={(getFlags) => props.renderTile(getTile, getFlags)}
                            onActivate={() => activateTile(tile)}
                        />
                    )}
                />
            </div>
        );
    };

    return (
        <div
            ref={setRootRef}
            id={boardId}
            class={styles.tileBoardRoot}
            role="grid"
            aria-label={access(props.ariaLabel)}
            aria-rowcount={getLayout().count.row}
            aria-colcount={getLayout().count.col}
            aria-disabled={getIsDisabled() || undefined}
            style={{ width: `${getBoardSize().width}px`, height: `${getBoardSize().height}px` }}
            onKeyDown={handleKeyDown}
        >
            <Index each={Array.from({ length: Math.max(getLayout().count.row, 0) })}>
                {(_, rowIndex) => (
                    <div
                        class={styles.tileBoardRow}
                        role="row"
                        aria-rowindex={rowIndex + FIRST_ARIA_INDEX}
                        style={{
                            left: `${TileBoardUtils.getRowOffset(rowIndex, getLayout()) + getGap() * HALF}px`,
                            top: `${TileBoardUtils.getRowTop(rowIndex, getLayout()) + getGap() * HALF}px`,
                        }}
                    >
                        <Index each={Array.from({ length: TileBoardUtils.getRowLength(rowIndex, getLayout()) })}>
                            {(_, colIndex) => renderTile(rowIndex, colIndex)}
                        </Index>
                    </div>
                )}
            </Index>
        </div>
    );
};
