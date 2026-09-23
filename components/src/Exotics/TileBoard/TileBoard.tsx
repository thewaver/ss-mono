import { Index, createEffect, createMemo, createSignal, createUniqueId, onCleanup } from "solid-js";

import { Index2d, type Point2d, type Size2d } from "@thewaver/ss-utils";

import { NavigatorUtils } from "../../Abstracts/Navigator/Navigator.utils";
import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import { access } from "../../Utils/propUtils";
import { TILE_BOARD_DEFAULTS } from "./TileBoard.const";
import type { TileBoardProps, TileBoardRenderProps, TileBoardTileProps } from "./TileBoard.types";
import { TileBoardUtils } from "./TileBoard.utils";

import * as styles from "./TileBoard.css";

const FIRST_ARIA_INDEX = 1;
const HALF = 0.5;
const MIN_CLIP_POINTS = 3;
const NO_CLIP = "none";
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

            <div
                ref={(element) => props.hitRef?.(element)}
                class={styles.tileBoardHit}
                style={{ "clip-path": access(props.clipPath) }}
                aria-hidden="true"
            />
        </div>
    );
};

export const TileBoard = (props: TileBoardProps) => {
    const boardId = createUniqueId();

    const tileRefs = new Map<string, HTMLElement>();
    const hitTiles = new Map<Element, Index2d>();

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getHighlighted, setHighlighted] = createSignal<Index2d>(TileBoardUtils.getFirstTile());

    const getGap = createMemo(() => access(props.gap) ?? TILE_BOARD_DEFAULTS.gap);

    const getPitchSize = createMemo(() => access(props.tileSize));

    const getTileSize = createMemo((): Size2d => ({
        width: Math.max(getPitchSize().width - getGap(), 0),
        height: Math.max(getPitchSize().height - getGap(), 0),
    }));

    const getLayout = createMemo(() =>
        TileBoardUtils.getLayout(
            access(props.tileShape) ?? TILE_BOARD_DEFAULTS.tileShape,
            access(props.tileCount),
            getPitchSize(),
            access(props.hasShortFirstRow) ?? false,
            access(props.taper) ?? TILE_BOARD_DEFAULTS.taper,
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

    const getIsSweepable = createMemo(() => props.onTileSweep !== undefined && !getIsDisabled());

    let sweep: { pointerId: number; from: Index2d; entered: Set<string>; hasLeft: boolean } | undefined;
    let isClickSwallowed = false;

    const sweepInto = (tile: Index2d) => {
        if (getIsTileDisabled(tile)) return;

        props.onTileSweep?.(tile);
    };

    const handleSweepMove = (e: PointerEvent) => {
        if (!sweep || e.pointerId !== sweep.pointerId) return;

        if (e.buttons === 0) {
            endSweep();

            return;
        }

        const element = document.elementFromPoint(e.clientX, e.clientY);
        const tile = element ? hitTiles.get(element) : undefined;

        if (!tile) return;

        const key = Index2d.toString(tile);

        if (sweep.entered.has(key)) return;

        sweep.entered.add(key);

        if (!sweep.hasLeft) {
            sweep.hasLeft = true;
            sweepInto(sweep.from);
        }

        sweepInto(tile);
    };

    const handleSweepEnd = (e: PointerEvent) => {
        if (!sweep || e.pointerId !== sweep.pointerId) return;

        isClickSwallowed = sweep.hasLeft;

        endSweep();
    };

    const endSweep = () => {
        sweep = undefined;

        document.removeEventListener("pointermove", handleSweepMove);
        document.removeEventListener("pointerup", handleSweepEnd);
        document.removeEventListener("pointercancel", handleSweepEnd);
    };

    const handlePointerDown = (e: PointerEvent) => {
        isClickSwallowed = false;

        if (sweep || e.button !== 0 || !getIsSweepable()) return;

        const from = hitTiles.get(e.target as Element);

        if (!from) return;

        sweep = { pointerId: e.pointerId, from, entered: new Set([Index2d.toString(from)]), hasLeft: false };

        document.addEventListener("pointermove", handleSweepMove);
        document.addEventListener("pointerup", handleSweepEnd);
        document.addEventListener("pointercancel", handleSweepEnd);
    };

    const handleClickCapture = (e: MouseEvent) => {
        if (!isClickSwallowed) return;

        isClickSwallowed = false;

        e.preventDefault();
        e.stopPropagation();
    };

    createEffect(() => {
        const root = getRootRef();

        if (!root) return;

        root.addEventListener("click", handleClickCapture, true);

        onCleanup(() => {
            root.removeEventListener("click", handleClickCapture, true);
        });
    });

    onCleanup(endSweep);

    createEffect(() => {
        const tile = getRovingTile();
        const root = getRootRef();

        if (!root?.contains(document.activeElement) || root === document.activeElement) return;

        tileRefs.get(Index2d.toString(tile))?.focus();
    });

    const handleKeyDown = (e: KeyboardEvent) => {
        const roving = getRovingTile();

        if (NavigatorUtils.getIsActivationKey(e.key)) {
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

        const setHitRef = (element: HTMLElement) => {
            hitTiles.set(element, tile);

            onCleanup(() => {
                hitTiles.delete(element);
            });
        };

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
                            hitRef={setHitRef}
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
            classList={{ [styles.tileBoardIsSweepable]: getIsSweepable() }}
            role="grid"
            aria-label={access(props.ariaLabel)}
            aria-rowcount={getLayout().count.row}
            aria-colcount={getLayout().count.col}
            aria-disabled={getIsDisabled() || undefined}
            style={{ width: `${getBoardSize().width}px`, height: `${getBoardSize().height}px` }}
            onKeyDown={handleKeyDown}
            onPointerDown={handlePointerDown}
        >
            <div class={styles.tileBoardPlane} style={{ transform: TileBoardUtils.getTaperTransform(getLayout()) }}>
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
        </div>
    );
};
