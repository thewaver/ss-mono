import { type KeyboardEvent, useLayoutEffect, useMemo, useRef, useState } from "react";

import type { MosaicItemState } from "@thewaver/ss-components";
import { MOSAIC_DEFAULTS, MosaicStyles, MosaicUtils, NavigatorUtils } from "@thewaver/ss-components";
import type { Rect } from "@thewaver/ss-utils";

import { ElementObserverReactUtils } from "../../Abstracts/ElementObserver/ElementObserverReact.utils";
import { MediaQueryMonitorReactUtils } from "../../Abstracts/MediaQueryMonitor/MediaQueryMonitorReact.utils";
import { useStableList } from "../../Utils/refUtils";
import type { MosaicProps } from "./Mosaic.types";

const EMPTY_RECT: Rect = { x: 0, y: 0, width: 0, height: 0 };
const NOT_PLACED = -1;
const NO_TRANSITION_MS = 0;

type MosaicTileProps = Pick<MosaicProps, "isItemSized" | "renderItem"> & {
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

const MosaicTile = (props: MosaicTileProps) => {
    const tileRef = useRef<HTMLDivElement | null>(null);
    const glideRef = useRef<Animation | undefined>(undefined);
    const shownRectRef = useRef<Rect | undefined>(undefined);

    const [isFocusVisible, setIsFocusVisible] = useState(false);

    const isPlaced = props.rect !== undefined;
    const rect = props.rect ?? EMPTY_RECT;

    useLayoutEffect(() => {
        const from = shownRectRef.current;
        const tile = tileRef.current;

        shownRectRef.current = isPlaced ? rect : undefined;

        if (!tile) return;

        if (from === undefined || !isPlaced) {
            glideRef.current?.cancel();
            glideRef.current = undefined;

            return;
        }

        glideRef.current = MosaicUtils.glideTile({
            element: tile,
            glide: glideRef.current,
            from,
            to: rect,
            isSized: props.isItemSized,
            durationMs: props.glideDurationMs,
            isRepack: props.isRepack,
        });
    }, [isPlaced, rect.x, rect.y, rect.width, rect.height]);

    useLayoutEffect(() => () => glideRef.current?.cancel(), []);

    const state: MosaicItemState = {
        index: props.index,
        readingIndex: props.readingIndex,
        itemCount: props.itemCount,
        rect,
        isFocusVisible,
    };

    const content = props.renderItem(props.index, state);

    return (
        <div
            ref={tileRef}
            className={[MosaicStyles.mosaicItem, props.isItemSized ? MosaicStyles.mosaicSizedItem : ""].join(" ")}
            style={MosaicUtils.computeTileStyle(rect, isPlaced, props.isItemSized)}
            role={props.isWalked ? "listitem" : undefined}
        >
            {props.isWalked ? (
                <div
                    ref={(element) => props.setButtonRef(props.slot, element)}
                    className={MosaicStyles.mosaicTileButton}
                    role="button"
                    tabIndex={props.isTabStop ? 0 : -1}
                    onFocus={(e) => {
                        props.onFocusSlot(props.slot);
                        setIsFocusVisible(e.currentTarget.matches(":focus-visible"));
                    }}
                    onKeyDown={(e) => setIsFocusVisible(e.currentTarget.matches(":focus-visible"))}
                    onBlur={() => setIsFocusVisible(false)}
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

export const Mosaic = (props: MosaicProps) => {
    const sizeAnchor = props.sizeAnchor ?? MOSAIC_DEFAULTS.sizeAnchor;
    const gap = props.gap ?? MOSAIC_DEFAULTS.gap;
    const transitionDurationMs = props.transitionDurationMs ?? MOSAIC_DEFAULTS.transitionDurationMs;
    const isWalked = props.onActivate !== undefined;

    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion(transitionDurationMs <= NO_TRANSITION_MS);
    const glideDurationMs = prefersReducedMotion ? NO_TRANSITION_MS : transitionDurationMs;

    const rootRef = useRef<HTMLDivElement | null>(null);
    const buttonRefs = useRef(new Map<object, HTMLElement>());
    const slotIds = useRef(new WeakMap<object, number>());
    const nextSlotId = useRef(0);
    const refocusTargetRef = useRef<HTMLElement | undefined>(undefined);
    const lastAnchoredExtentRef = useRef<number | undefined>(undefined);

    const [assignSlots] = useState(MosaicUtils.createSlotKeeper);
    const [focusedSlot, setFocusedSlot] = useState<object>();

    const rootSize = ElementObserverReactUtils.useBorderBoxSize(rootRef);
    const anchoredExtent = sizeAnchor === "width" ? rootSize.width : rootSize.height;

    const layout = useMemo(
        () =>
            MosaicUtils.computeLayout({
                sizes: props.sizes,
                anchoredExtent,
                sizeAnchor,
                gap,
                computePlacements: props.computePlacements,
            }),
        [props.sizes, anchoredExtent, sizeAnchor, gap, props.computePlacements],
    );

    const isRepack = lastAnchoredExtentRef.current === layout.anchoredExtent;

    useLayoutEffect(() => {
        lastAnchoredExtentRef.current = layout.anchoredExtent;
    });

    const rectByIndex = useMemo(
        () => new Map(layout.placements.map((placement) => [placement.index, placement as Rect])),
        [layout],
    );

    const keys = props.keys ?? props.sizes.map((_, index) => index);
    const slots = useStableList(assignSlots(keys));
    const indexBySlot = useMemo(() => new Map(slots.map((slot, index) => [slot, index])), [slots]);

    const slotOrder = useStableList(
        MosaicUtils.computeOrder(layout.placements, props.sizes.length).flatMap((index) => slots[index] ?? []),
    );

    const seenSlotOrderRef = useRef(slotOrder);

    if (seenSlotOrderRef.current !== slotOrder) {
        const active = document.activeElement;

        seenSlotOrderRef.current = slotOrder;
        refocusTargetRef.current =
            active instanceof HTMLElement && rootRef.current?.contains(active) ? active : undefined;
    }

    useLayoutEffect(() => {
        const target = refocusTargetRef.current;

        refocusTargetRef.current = undefined;

        if (target?.isConnected && document.activeElement !== target) target.focus({ preventScroll: true });
    }, [slotOrder]);

    const focusedIndex = focusedSlot === undefined ? undefined : indexBySlot.get(focusedSlot);
    const rovingIndex =
        focusedIndex !== undefined && rectByIndex.has(focusedIndex) ? focusedIndex : layout.placements[0]?.index;

    const getSlotId = (slot: object) => {
        const known = slotIds.current.get(slot);

        if (known !== undefined) return known;

        const id = nextSlotId.current++;

        slotIds.current.set(slot, id);

        return id;
    };

    const setButtonRef = (slot: object, element: HTMLElement | null) => {
        if (element) {
            buttonRefs.current.set(slot, element);
        } else {
            buttonRefs.current.delete(slot);
        }
    };

    const focusIndex = (index: number) => {
        const slot = slots[index];

        if (slot === undefined) return;

        setFocusedSlot(slot);
        buttonRefs.current.get(slot)?.focus();
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (!isWalked || rovingIndex === undefined) return;

        if (NavigatorUtils.getIsActivationKey(e.key)) {
            e.preventDefault();
            props.onActivate?.(rovingIndex);

            return;
        }

        const step = MosaicUtils.getStepForKey(e.key);

        if (step === undefined) return;

        const next = MosaicUtils.computeStepIndex(step, rovingIndex, layout.placements);

        if (next === undefined) return;

        e.preventDefault();
        focusIndex(next);
    };

    return (
        <div
            ref={rootRef}
            className={MosaicStyles.mosaicRoot}
            style={MosaicUtils.computeRootSize(sizeAnchor, layout.freeExtent)}
            role={isWalked ? "list" : undefined}
            aria-label={isWalked ? props.ariaLabel : undefined}
            onKeyDown={handleKeyDown}
        >
            {slotOrder.map((slot, readingIndex) => {
                const index = indexBySlot.get(slot) ?? NOT_PLACED;

                return (
                    <MosaicTile
                        key={getSlotId(slot)}
                        slot={slot}
                        index={index}
                        readingIndex={readingIndex}
                        itemCount={props.sizes.length}
                        rect={rectByIndex.get(index)}
                        isItemSized={props.isItemSized}
                        isWalked={isWalked}
                        isTabStop={index === rovingIndex}
                        isRepack={isRepack}
                        glideDurationMs={glideDurationMs}
                        renderItem={props.renderItem}
                        setButtonRef={setButtonRef}
                        onFocusSlot={setFocusedSlot}
                        onActivate={(activated) => props.onActivate?.(activated)}
                    />
                );
            })}
        </div>
    );
};
