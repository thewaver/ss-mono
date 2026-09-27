import { Index, createEffect, createMemo, createSignal, createUniqueId, onCleanup } from "solid-js";

import {
    TILE_BOARD_DEFAULTS,
    type TileBoardRenderProps,
    TileBoardUtils,
    TileBoardStyles as styles,
} from "@thewaver/ss-components";
import { Index2d } from "@thewaver/ss-utils";

import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import { access } from "../../Utils/propUtils";
import type { TileBoardProps, TileBoardTileProps } from "./TileBoardSolid.types";

const FIRST_ARIA_INDEX = 1;

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

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getHighlighted, setHighlighted] = createSignal<Index2d>(TileBoardUtils.getFirstTile());

    const getGap = createMemo(() => access(props.gap) ?? TILE_BOARD_DEFAULTS.gap);

    const getPitchSize = createMemo(() => access(props.tileSize));

    const getTileSize = createMemo(() => TileBoardUtils.getTileBoxSize(getPitchSize(), getGap()));

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

    const getClipPath = createMemo(() => TileBoardUtils.getClipPath(getPoints()));

    const getFlippedClipPath = createMemo(() => TileBoardUtils.getClipPath(getFlippedPoints()));

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

    const sweeper = TileBoardUtils.createSweeper({
        getIsSweepable,
        getIsTileDisabled,
        onSweep: (tile) => props.onTileSweep?.(tile),
    });

    createEffect(() => {
        const root = getRootRef();

        if (!root) return;

        root.addEventListener("click", sweeper.swallowClick, true);

        onCleanup(() => {
            root.removeEventListener("click", sweeper.swallowClick, true);
        });
    });

    onCleanup(sweeper.stop);

    createEffect(() => {
        const tile = getRovingTile();
        const root = getRootRef();

        if (!root?.contains(document.activeElement) || root === document.activeElement) return;

        tileRefs.get(Index2d.toString(tile))?.focus();
    });

    const handleKeyDown = (e: KeyboardEvent) => {
        const roving = getRovingTile();
        const action = TileBoardUtils.computeKeyAction(e.key, e.ctrlKey || e.metaKey, roving, getLayout());

        if (action === undefined) return;

        e.preventDefault();

        if (action.kind === "activate") activateTile(roving);
        else moveTo(action.tile);
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
            onCleanup(sweeper.addHitLayer(element, tile));
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
            onPointerDown={(e) => sweeper.press(e)}
        >
            <div class={styles.tileBoardPlane} style={{ transform: TileBoardUtils.getTaperTransform(getLayout()) }}>
                <Index each={Array.from({ length: Math.max(getLayout().count.row, 0) })}>
                    {(_, rowIndex) => (
                        <div
                            class={styles.tileBoardRow}
                            role="row"
                            aria-rowindex={rowIndex + FIRST_ARIA_INDEX}
                            style={{
                                left: `${TileBoardUtils.getRowOrigin(rowIndex, getLayout(), getGap()).x}px`,
                                top: `${TileBoardUtils.getRowOrigin(rowIndex, getLayout(), getGap()).y}px`,
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
