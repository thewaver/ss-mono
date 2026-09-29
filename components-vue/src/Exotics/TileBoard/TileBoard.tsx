import {
    type ComponentPublicInstance,
    type SlotsType,
    computed,
    defineComponent,
    onScopeDispose,
    shallowRef,
    useId,
} from "vue";

import {
    TILE_BOARD_DEFAULTS,
    type TileBoardRenderProps,
    TileBoardStyles,
    TileBoardUtils,
} from "@thewaver/ss-components";
import { Index2d } from "@thewaver/ss-utils";

import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import type {
    InteractionControlSlots,
    InteractionWrapperSlots,
} from "../../Primitives/InteractionWrapper/InteractionWrapper.types";
import { watchAfterRender } from "../../Utils/effectUtils";
import { callSlot, declareProps } from "../../Utils/propUtils";
import { toElement } from "../../Utils/refUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { TileBoardProps, TileBoardSlots, TileBoardTileProps } from "./TileBoard.types";

const FIRST_ARIA_INDEX = 1;

const TileBoardTile = defineComponent(
    (props: TileBoardTileProps, { slots }: SlotsContext<InteractionControlSlots<TileBoardRenderProps>>) => {
        let hitElement: HTMLElement | undefined;
        let removeHitLayer: (() => void) | undefined;

        const setHitRef = (target: Element | ComponentPublicInstance | null) => {
            const element = toElement(target);

            if (element === hitElement) return;

            removeHitLayer?.();

            hitElement = element;
            removeHitLayer = element && props.hitRef ? props.hitRef(element) : undefined;
        };

        onScopeDispose(() => removeHitLayer?.());

        return () => {
            const isDisabled = props.flags.isDisabled ?? false;

            return (
                <div
                    id={props.id}
                    class={TileBoardStyles.tileBoardTile}
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
                    <div class={TileBoardStyles.tileBoardPaint}>{callSlot(slots.renderContent, props.flags)}</div>

                    <div
                        ref={setHitRef}
                        class={TileBoardStyles.tileBoardHit}
                        style={{ clipPath: props.clipPath }}
                        aria-hidden="true"
                    />
                </div>
            );
        };
    },
    {
        name: "TileBoardTile",
        slots: Object as SlotsType<InteractionControlSlots<TileBoardRenderProps>>,
        props: declareProps<TileBoardTileProps>({
            id: null,
            ariaLabel: null,
            flags: null,
            colIndex: null,
            clipPath: null,
            size: null,
            onActivate: null,
            hitRef: null,
        }),
    },
);

export const TileBoard = defineComponent(
    (props: TileBoardProps, { slots }: SlotsContext<TileBoardSlots>) => {
        const boardId = useId();

        const rootRef = shallowRef<HTMLDivElement>();
        const tileRefs = new Map<string, HTMLElement>();

        const highlighted = shallowRef<Index2d>(TileBoardUtils.getFirstTile());

        const getGap = () => props.gap ?? TILE_BOARD_DEFAULTS.gap;
        const getIsDisabled = () => props.isDisabled ?? false;

        const tileSize = computed(() =>
            TileBoardUtils.getTileBoxSize({ width: props.tileSize.width, height: props.tileSize.height }, getGap()),
        );

        const layout = computed(() =>
            TileBoardUtils.getLayout(
                props.tileShape ?? TILE_BOARD_DEFAULTS.tileShape,
                { row: props.tileCount.row, col: props.tileCount.col },
                { width: props.tileSize.width, height: props.tileSize.height },
                props.hasShortFirstRow ?? false,
                props.taper ?? TILE_BOARD_DEFAULTS.taper,
            ),
        );

        const points = computed(() => TileBoardUtils.getTilePoints(layout.value.shape, tileSize.value, false));

        const flippedPoints = computed(() => TileBoardUtils.getTilePoints(layout.value.shape, tileSize.value, true));

        const getIsTileDisabled = (tile: Index2d) => getIsDisabled() || (props.computeIsTileDisabled?.(tile) ?? false);

        const rovingTile = computed(() => TileBoardUtils.clampTile(highlighted.value, layout.value));
        const rovingKey = computed(() => Index2d.toString(rovingTile.value));

        const getIsSweepable = () => props.onTileSweep !== undefined && !getIsDisabled();

        const sweeper = TileBoardUtils.createSweeper({
            getIsSweepable,
            getIsTileDisabled,
            onSweep: (tile) => props.onTileSweep?.(tile),
        });

        watchAfterRender([], () => {
            const root = rootRef.value;

            if (!root) return;

            root.addEventListener("click", sweeper.swallowClick, true);

            return () => {
                root.removeEventListener("click", sweeper.swallowClick, true);
                sweeper.stop();
            };
        });

        watchAfterRender([rovingKey], ([key]) => {
            const root = rootRef.value;

            if (!root?.contains(document.activeElement) || root === document.activeElement) return;

            tileRefs.get(key)?.focus();
        });

        const moveTo = (tile: Index2d) => {
            highlighted.value = TileBoardUtils.clampTile(tile, layout.value);
        };

        const activateTile = (tile: Index2d) => {
            if (getIsTileDisabled(tile)) return;

            moveTo(tile);
            props.onTileActivate(tile);
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            const action = TileBoardUtils.computeKeyAction(
                e.key,
                e.ctrlKey || e.metaKey,
                rovingTile.value,
                layout.value,
            );

            if (action === undefined) return;

            e.preventDefault();

            if (action.kind === "activate") activateTile(rovingTile.value);
            else moveTo(action.tile);
        };

        const renderTile = (row: number, col: number) => {
            const tile: Index2d = { row, col };
            const key = Index2d.toString(tile);
            const isFlipped = TileBoardUtils.getIsFlippedTile(tile, layout.value);
            const isRoving = Index2d.isSame(tile, rovingTile.value);
            const clipPath = TileBoardUtils.getClipPath(isFlipped ? flippedPoints.value : points.value);

            return (
                <div
                    key={key}
                    class={TileBoardStyles.tileBoardCell}
                    role="presentation"
                    style={{ left: `${col * layout.value.pitch.width}px` }}
                >
                    <InteractionWrapper
                        isDisabled={getIsTileDisabled(tile)}
                        isFocusableWhenDisabled={!getIsDisabled()}
                        isTabbable={isRoving}
                        extraFlags={{
                            tile,
                            size: tileSize.value,
                            points: isFlipped ? flippedPoints.value : points.value,
                            isFlipped,
                            isHighlighted: isRoving,
                        }}
                    >
                        {
                            {
                                renderControl: ({ setElementRef, flags }) => (
                                    <TileBoardTile
                                        ref={(target: Element | ComponentPublicInstance | null) => {
                                            const element = toElement(target);

                                            if (element) tileRefs.set(key, element);
                                            else tileRefs.delete(key);

                                            setElementRef(target);
                                        }}
                                        id={`${boardId}-tile-${key}`}
                                        flags={flags}
                                        ariaLabel={props.computeTileAriaLabel?.(tile)}
                                        colIndex={col + FIRST_ARIA_INDEX}
                                        size={tileSize.value}
                                        clipPath={clipPath}
                                        onActivate={() => activateTile(tile)}
                                        hitRef={(element) => sweeper.addHitLayer(element, tile)}
                                    >
                                        {
                                            {
                                                renderContent: (tileFlags) =>
                                                    callSlot(slots.renderTile, { tile, flags: tileFlags }),
                                            } satisfies InteractionControlSlots<TileBoardRenderProps>
                                        }
                                    </TileBoardTile>
                                ),
                            } satisfies InteractionWrapperSlots<TileBoardRenderProps>
                        }
                    </InteractionWrapper>
                </div>
            );
        };

        return () => {
            const currentLayout = layout.value;
            const boardSize = TileBoardUtils.getBoardSize(currentLayout);
            const gap = getGap();
            const isDisabled = getIsDisabled();

            return (
                <div
                    ref={rootRef}
                    id={boardId}
                    class={[TileBoardStyles.tileBoardRoot, getIsSweepable() && TileBoardStyles.tileBoardIsSweepable]}
                    role="grid"
                    aria-label={props.ariaLabel}
                    aria-rowcount={currentLayout.count.row}
                    aria-colcount={currentLayout.count.col}
                    aria-disabled={isDisabled || undefined}
                    style={{ width: `${boardSize.width}px`, height: `${boardSize.height}px` }}
                    onKeydown={handleKeyDown}
                    onPointerdown={(e) => sweeper.press(e)}
                >
                    <div
                        class={TileBoardStyles.tileBoardPlane}
                        style={{ transform: TileBoardUtils.getTaperTransform(currentLayout) }}
                    >
                        {Array.from({ length: Math.max(currentLayout.count.row, 0) }, (_unused, rowIndex) => {
                            const origin = TileBoardUtils.getRowOrigin(rowIndex, currentLayout, gap);

                            return (
                                <div
                                    key={rowIndex}
                                    class={TileBoardStyles.tileBoardRow}
                                    role="row"
                                    aria-rowindex={rowIndex + FIRST_ARIA_INDEX}
                                    style={{ left: `${origin.x}px`, top: `${origin.y}px` }}
                                >
                                    {Array.from(
                                        { length: TileBoardUtils.getRowLength(rowIndex, currentLayout) },
                                        (_unusedCol, colIndex) => renderTile(rowIndex, colIndex),
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        };
    },
    {
        name: "TileBoard",
        slots: Object as SlotsType<TileBoardSlots>,
        props: declareProps<TileBoardProps>({
            ariaLabel: null,
            tileCount: null,
            tileSize: null,
            tileShape: null,
            gap: null,
            hasShortFirstRow: Boolean,
            taper: null,
            isDisabled: Boolean,
            computeIsTileDisabled: null,
            computeTileAriaLabel: null,
            onTileActivate: null,
            onTileSweep: null,
        }),
    },
);
