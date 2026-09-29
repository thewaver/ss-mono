import {
    type SlotsType,
    computed,
    defineComponent,
    onBeforeUnmount,
    onMounted,
    onUpdated,
    shallowRef,
    watch,
} from "vue";

import type { MosaicItemState } from "@thewaver/ss-components";
import { MOSAIC_DEFAULTS, MosaicStyles, MosaicUtils, NavigatorUtils } from "@thewaver/ss-components";
import type { Rect } from "@thewaver/ss-utils";

import { ElementObserverVueUtils } from "../../Abstracts/ElementObserver/ElementObserverVue.utils";
import { MediaQueryMonitorVueUtils } from "../../Abstracts/MediaQueryMonitor/MediaQueryMonitorVue.utils";
import { watchAfterRender } from "../../Utils/effectUtils";
import { callSlot, declareProps } from "../../Utils/propUtils";
import { toElement, useStableList } from "../../Utils/refUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { MosaicProps, MosaicSlots } from "./Mosaic.types";

const EMPTY_RECT: Rect = { x: 0, y: 0, width: 0, height: 0 };
const NOT_PLACED = -1;
const NO_TRANSITION_MS = 0;

type MosaicTileProps = Pick<MosaicProps, "isItemSized"> & {
    slot: object;
    index: number;
    readingIndex: number;
    itemCount: number;
    rect: Rect | undefined;
    isWalked: boolean;
    isTabStop: boolean;
    isRepack: boolean;
    glideDurationMs: number;
    setButtonRef: (slot: object, element: HTMLElement | null) => void;
    onFocusSlot: (slot: object) => void;
    onActivate: (index: number) => void;
};

const MosaicTile = defineComponent(
    (props: MosaicTileProps, { slots }: SlotsContext<MosaicSlots>) => {
        const tileRef = shallowRef<HTMLDivElement>();
        const isFocusVisible = shallowRef(false);

        let glide: Animation | undefined;
        let shownRect: Rect | undefined;

        watchAfterRender(
            [
                () => props.rect !== undefined,
                () => props.rect?.x,
                () => props.rect?.y,
                () => props.rect?.width,
                () => props.rect?.height,
            ],
            ([isPlaced]) => {
                const from = shownRect;
                const tile = tileRef.value;
                const rect = props.rect ?? EMPTY_RECT;

                shownRect = isPlaced ? rect : undefined;

                if (!tile) return;

                if (from === undefined || !isPlaced) {
                    glide?.cancel();
                    glide = undefined;

                    return;
                }

                glide = MosaicUtils.glideTile({
                    element: tile,
                    glide,
                    from,
                    to: rect,
                    isSized: props.isItemSized,
                    durationMs: props.glideDurationMs,
                    isRepack: props.isRepack,
                });
            },
        );

        onBeforeUnmount(() => glide?.cancel());

        return () => {
            const isPlaced = props.rect !== undefined;
            const rect = props.rect ?? EMPTY_RECT;

            const state: MosaicItemState = {
                index: props.index,
                readingIndex: props.readingIndex,
                itemCount: props.itemCount,
                rect,
                isFocusVisible: isFocusVisible.value,
            };

            const content = callSlot(slots.renderItem, { index: props.index, state });

            return (
                <div
                    ref={tileRef}
                    class={[MosaicStyles.mosaicItem, props.isItemSized ? MosaicStyles.mosaicSizedItem : ""]}
                    style={MosaicUtils.computeTileStyle(rect, isPlaced, props.isItemSized)}
                    role={props.isWalked ? "listitem" : undefined}
                >
                    {props.isWalked ? (
                        <div
                            ref={(target) => props.setButtonRef(props.slot, toElement(target) ?? null)}
                            class={MosaicStyles.mosaicTileButton}
                            role="button"
                            tabindex={props.isTabStop ? 0 : -1}
                            onFocus={(e) => {
                                props.onFocusSlot(props.slot);
                                isFocusVisible.value = (e.currentTarget as HTMLElement).matches(":focus-visible");
                            }}
                            onKeydown={(e) => {
                                isFocusVisible.value = (e.currentTarget as HTMLElement).matches(":focus-visible");
                            }}
                            onBlur={() => {
                                isFocusVisible.value = false;
                            }}
                            onClick={() => {
                                props.onFocusSlot(props.slot);
                                props.onActivate(props.index);
                            }}
                        >
                            {content}
                        </div>
                    ) : (
                        content
                    )}
                </div>
            );
        };
    },
    {
        name: "MosaicTile",
        props: declareProps<MosaicTileProps>({
            isItemSized: Boolean,
            slot: null,
            index: null,
            readingIndex: null,
            itemCount: null,
            rect: null,
            isWalked: Boolean,
            isTabStop: Boolean,
            isRepack: Boolean,
            glideDurationMs: null,
            setButtonRef: null,
            onFocusSlot: null,
            onActivate: null,
        }),
    },
);

export const Mosaic = defineComponent(
    (props: MosaicProps, { slots }: SlotsContext<MosaicSlots>) => {
        const getSizeAnchor = () => props.sizeAnchor ?? MOSAIC_DEFAULTS.sizeAnchor;
        const getTransitionDurationMs = () => props.transitionDurationMs ?? MOSAIC_DEFAULTS.transitionDurationMs;
        const getIsWalked = () => props.onActivate !== undefined;

        const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion(
            () => getTransitionDurationMs() <= NO_TRANSITION_MS,
        );

        const rootRef = shallowRef<HTMLDivElement>();
        const buttonRefs = new Map<object, HTMLElement>();
        const slotIds = new WeakMap<object, number>();
        const assignSlots = MosaicUtils.createSlotKeeper();
        const focusedSlot = shallowRef<object>();

        let nextSlotId = 0;
        let refocusTarget: HTMLElement | undefined;
        let lastAnchoredExtent: number | undefined;

        const rootSize = ElementObserverVueUtils.useBorderBoxSize(rootRef);

        const layout = computed(() =>
            MosaicUtils.computeLayout({
                sizes: props.sizes,
                anchoredExtent: getSizeAnchor() === "width" ? rootSize.value.width : rootSize.value.height,
                sizeAnchor: getSizeAnchor(),
                gap: props.gap ?? MOSAIC_DEFAULTS.gap,
                computePlacements: props.computePlacements,
            }),
        );

        const rememberAnchoredExtent = () => {
            lastAnchoredExtent = layout.value.anchoredExtent;
        };

        onMounted(rememberAnchoredExtent);

        onUpdated(rememberAnchoredExtent);

        const rectByIndex = computed(
            () => new Map(layout.value.placements.map((placement) => [placement.index, placement as Rect])),
        );

        const tileSlots = useStableList(() => assignSlots(props.keys ?? props.sizes.map((_, index) => index)));

        const indexBySlot = computed(() => new Map(tileSlots.value.map((slot, index) => [slot, index])));

        const slotOrder = useStableList(() =>
            MosaicUtils.computeOrder(layout.value.placements, props.sizes.length).flatMap(
                (index) => tileSlots.value[index] ?? [],
            ),
        );

        watch(slotOrder, () => {
            const active = document.activeElement;

            refocusTarget = active instanceof HTMLElement && rootRef.value?.contains(active) ? active : undefined;
        });

        watch(
            slotOrder,
            () => {
                const target = refocusTarget;

                refocusTarget = undefined;

                if (target?.isConnected && document.activeElement !== target) target.focus({ preventScroll: true });
            },
            { flush: "post" },
        );

        const rovingIndex = computed(() => {
            const focusedIndex = focusedSlot.value === undefined ? undefined : indexBySlot.value.get(focusedSlot.value);

            return focusedIndex !== undefined && rectByIndex.value.has(focusedIndex)
                ? focusedIndex
                : layout.value.placements[0]?.index;
        });

        const getSlotId = (slot: object) => {
            const known = slotIds.get(slot);

            if (known !== undefined) return known;

            const id = nextSlotId++;

            slotIds.set(slot, id);

            return id;
        };

        const setButtonRef = (slot: object, element: HTMLElement | null) => {
            if (element) {
                buttonRefs.set(slot, element);
            } else {
                buttonRefs.delete(slot);
            }
        };

        const setFocusedSlot = (slot: object) => {
            focusedSlot.value = slot;
        };

        const focusIndex = (index: number) => {
            const slot = tileSlots.value[index];

            if (slot === undefined) return;

            setFocusedSlot(slot);
            buttonRefs.get(slot)?.focus();
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            const current = rovingIndex.value;

            if (!getIsWalked() || current === undefined) return;

            if (NavigatorUtils.getIsActivationKey(e.key)) {
                e.preventDefault();
                props.onActivate?.(current);

                return;
            }

            const step = MosaicUtils.getStepForKey(e.key);

            if (step === undefined) return;

            const next = MosaicUtils.computeStepIndex(step, current, layout.value.placements);

            if (next === undefined) return;

            e.preventDefault();
            focusIndex(next);
        };

        return () => {
            const isWalked = getIsWalked();
            const isRepack = lastAnchoredExtent === layout.value.anchoredExtent;
            const glideDurationMs = prefersReducedMotion.value ? NO_TRANSITION_MS : getTransitionDurationMs();

            return (
                <div
                    ref={rootRef}
                    class={MosaicStyles.mosaicRoot}
                    style={MosaicUtils.computeRootSize(getSizeAnchor(), layout.value.freeExtent)}
                    role={isWalked ? "list" : undefined}
                    aria-label={isWalked ? props.ariaLabel : undefined}
                    onKeydown={handleKeyDown}
                >
                    {slotOrder.value.map((slot, readingIndex) => {
                        const index = indexBySlot.value.get(slot) ?? NOT_PLACED;

                        return (
                            <MosaicTile
                                key={getSlotId(slot)}
                                slot={slot}
                                index={index}
                                readingIndex={readingIndex}
                                itemCount={props.sizes.length}
                                rect={rectByIndex.value.get(index)}
                                isItemSized={props.isItemSized}
                                isWalked={isWalked}
                                isTabStop={index === rovingIndex.value}
                                isRepack={isRepack}
                                glideDurationMs={glideDurationMs}
                                setButtonRef={setButtonRef}
                                onFocusSlot={setFocusedSlot}
                                onActivate={(activated) => props.onActivate?.(activated)}
                            >
                                {{ renderItem: slots.renderItem }}
                            </MosaicTile>
                        );
                    })}
                </div>
            );
        };
    },
    {
        name: "Mosaic",
        slots: Object as SlotsType<MosaicSlots>,
        props: declareProps<MosaicProps>({
            sizeAnchor: null,
            gap: null,
            transitionDurationMs: null,
            isItemSized: Boolean,
            sizes: null,
            computePlacements: null,
            keys: null,
            ariaLabel: null,
            onActivate: null,
        }),
    },
);
