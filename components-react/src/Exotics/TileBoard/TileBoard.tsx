import { type KeyboardEvent, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";

import {
    TILE_BOARD_DEFAULTS,
    type TileBoardRenderProps,
    TileBoardStyles,
    TileBoardUtils,
} from "@thewaver/ss-components";
import { Index2d } from "@thewaver/ss-utils";

import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import { useLatest } from "../../Utils/refUtils";
import type { TileBoardProps, TileBoardTileProps } from "./TileBoard.types";

const FIRST_ARIA_INDEX = 1;

const TileBoardTile = (props: TileBoardTileProps) => {
    const isDisabled = props.flags.isDisabled ?? false;
    const hitRef = props.hitRef;

    return (
        <div
            id={props.id}
            ref={props.ref}
            className={TileBoardStyles.tileBoardTile}
            role="gridcell"
            aria-colindex={props.colIndex}
            aria-label={props.ariaLabel}
            aria-disabled={isDisabled || undefined}
            style={{ width: `${props.size.width}px`, height: `${props.size.height}px` }}
            onClick={() => {
                if (isDisabled) return;

                props.onActivate();
            }}
        >
            <div className={TileBoardStyles.tileBoardPaint}>{props.renderContent(props.flags)}</div>

            <div
                ref={(element) => (element && hitRef ? hitRef(element) : undefined)}
                className={TileBoardStyles.tileBoardHit}
                style={{ clipPath: props.clipPath }}
                aria-hidden="true"
            />
        </div>
    );
};

export const TileBoard = (props: TileBoardProps) => {
    const boardId = useId();

    const rootRef = useRef<HTMLDivElement | null>(null);
    const tileRefs = useRef(new Map<string, HTMLElement>());

    const [highlighted, setHighlighted] = useState<Index2d>(TileBoardUtils.getFirstTile);

    const gap = props.gap ?? TILE_BOARD_DEFAULTS.gap;
    const tileShape = props.tileShape ?? TILE_BOARD_DEFAULTS.tileShape;
    const hasShortFirstRow = props.hasShortFirstRow ?? false;
    const taper = props.taper ?? TILE_BOARD_DEFAULTS.taper;
    const isDisabled = props.isDisabled ?? false;

    const { width: pitchWidth, height: pitchHeight } = props.tileSize;
    const { row: rowCount, col: colCount } = props.tileCount;

    const tileSize = useMemo(
        () => TileBoardUtils.getTileBoxSize({ width: pitchWidth, height: pitchHeight }, gap),
        [pitchWidth, pitchHeight, gap],
    );

    const layout = useMemo(
        () =>
            TileBoardUtils.getLayout(
                tileShape,
                { row: rowCount, col: colCount },
                { width: pitchWidth, height: pitchHeight },
                hasShortFirstRow,
                taper,
            ),
        [tileShape, rowCount, colCount, pitchWidth, pitchHeight, hasShortFirstRow, taper],
    );

    const boardSize = TileBoardUtils.getBoardSize(layout);

    const points = useMemo(() => TileBoardUtils.getTilePoints(layout.shape, tileSize, false), [layout, tileSize]);

    const flippedPoints = useMemo(() => TileBoardUtils.getTilePoints(layout.shape, tileSize, true), [layout, tileSize]);

    const clipPath = TileBoardUtils.getClipPath(points);
    const flippedClipPath = TileBoardUtils.getClipPath(flippedPoints);

    const getIsTileDisabled = (tile: Index2d) => isDisabled || (props.computeIsTileDisabled?.(tile) ?? false);

    const rovingTile = TileBoardUtils.clampTile(highlighted, layout);
    const rovingKey = Index2d.toString(rovingTile);

    const isSweepable = props.onTileSweep !== undefined && !isDisabled;

    const latest = useLatest({ isSweepable, getIsTileDisabled, onTileSweep: props.onTileSweep });

    const [sweeper] = useState(() =>
        TileBoardUtils.createSweeper({
            getIsSweepable: () => latest.current.isSweepable,
            getIsTileDisabled: (tile) => latest.current.getIsTileDisabled(tile),
            onSweep: (tile) => latest.current.onTileSweep?.(tile),
        }),
    );

    useEffect(() => {
        const root = rootRef.current;

        if (!root) return;

        root.addEventListener("click", sweeper.swallowClick, true);

        return () => {
            root.removeEventListener("click", sweeper.swallowClick, true);
            sweeper.stop();
        };
    }, [sweeper]);

    useLayoutEffect(() => {
        const root = rootRef.current;

        if (!root?.contains(document.activeElement) || root === document.activeElement) return;

        tileRefs.current.get(rovingKey)?.focus();
    }, [rovingKey]);

    const moveTo = (tile: Index2d) => {
        setHighlighted(TileBoardUtils.clampTile(tile, layout));
    };

    const activateTile = (tile: Index2d) => {
        if (getIsTileDisabled(tile)) return;

        moveTo(tile);
        props.onTileActivate(tile);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        const action = TileBoardUtils.computeKeyAction(e.key, e.ctrlKey || e.metaKey, rovingTile, layout);

        if (action === undefined) return;

        e.preventDefault();

        if (action.kind === "activate") activateTile(rovingTile);
        else moveTo(action.tile);
    };

    const renderTile = (row: number, col: number) => {
        const tile: Index2d = { row, col };
        const key = Index2d.toString(tile);
        const isFlipped = TileBoardUtils.getIsFlippedTile(tile, layout);
        const isRoving = Index2d.isSame(tile, rovingTile);

        return (
            <div
                key={key}
                className={TileBoardStyles.tileBoardCell}
                role="presentation"
                style={{ left: `${col * layout.pitch.width}px` }}
            >
                <InteractionWrapper<TileBoardRenderProps>
                    isDisabled={getIsTileDisabled(tile)}
                    isFocusableWhenDisabled={!isDisabled}
                    isTabbable={isRoving}
                    extraFlags={{
                        tile,
                        size: tileSize,
                        points: isFlipped ? flippedPoints : points,
                        isFlipped,
                        isHighlighted: isRoving,
                    }}
                    ref={(element) => {
                        if (element) tileRefs.current.set(key, element);
                        else tileRefs.current.delete(key);
                    }}
                    renderControl={(setElementRef, flags) => (
                        <TileBoardTile
                            ref={setElementRef}
                            id={`${boardId}-tile-${key}`}
                            flags={flags}
                            ariaLabel={props.computeTileAriaLabel?.(tile)}
                            colIndex={col + FIRST_ARIA_INDEX}
                            size={tileSize}
                            clipPath={isFlipped ? flippedClipPath : clipPath}
                            renderContent={(tileFlags) => props.renderTile(tile, tileFlags)}
                            onActivate={() => activateTile(tile)}
                            hitRef={(element) => sweeper.addHitLayer(element, tile)}
                        />
                    )}
                />
            </div>
        );
    };

    const className = [TileBoardStyles.tileBoardRoot, isSweepable && TileBoardStyles.tileBoardIsSweepable]
        .filter(Boolean)
        .join(" ");

    return (
        <div
            ref={rootRef}
            id={boardId}
            className={className}
            role="grid"
            aria-label={props.ariaLabel}
            aria-rowcount={layout.count.row}
            aria-colcount={layout.count.col}
            aria-disabled={isDisabled || undefined}
            style={{ width: `${boardSize.width}px`, height: `${boardSize.height}px` }}
            onKeyDown={handleKeyDown}
            onPointerDown={(e) => sweeper.press(e.nativeEvent)}
        >
            <div
                className={TileBoardStyles.tileBoardPlane}
                style={{ transform: TileBoardUtils.getTaperTransform(layout) }}
            >
                {Array.from({ length: Math.max(layout.count.row, 0) }, (_unused, rowIndex) => {
                    const origin = TileBoardUtils.getRowOrigin(rowIndex, layout, gap);

                    return (
                        <div
                            key={rowIndex}
                            className={TileBoardStyles.tileBoardRow}
                            role="row"
                            aria-rowindex={rowIndex + FIRST_ARIA_INDEX}
                            style={{ left: `${origin.x}px`, top: `${origin.y}px` }}
                        >
                            {Array.from(
                                { length: TileBoardUtils.getRowLength(rowIndex, layout) },
                                (_unusedCol, colIndex) => renderTile(rowIndex, colIndex),
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
