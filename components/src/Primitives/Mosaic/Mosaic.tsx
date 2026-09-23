import { For, createComputed, createEffect, createMemo, createSignal, on, onCleanup, untrack } from "solid-js";

import type { Rect } from "@thewaver/ss-utils";

import { ElementObserverUtils } from "../../Abstracts/ElementObserver/ElementObserver.utils";
import { MediaQueryMonitorUtils } from "../../Abstracts/MediaQueryMonitor/MediaQueryMonitor.utils";
import { NavigatorUtils } from "../../Abstracts/Navigator/Navigator.utils";
import { access } from "../../Utils/propUtils";
import { MOSAIC_DEFAULTS } from "./Mosaic.const";
import type { MosaicPlacement, MosaicProps, MosaicStep } from "./Mosaic.types";
import { MosaicUtils } from "./Mosaic.utils";

import * as styles from "./Mosaic.css";

const EMPTY_RECT: Rect = { x: 0, y: 0, width: 0, height: 0 };
const EMPTY_LAYOUT = { placements: [] as MosaicPlacement[], freeExtent: 0, anchoredExtent: 0 };
const NOT_PLACED = -1;
const NO_TRANSITION_MS = 0;
const GLIDE_EASING = "ease";
const IDENTITY_TRANSFORM = "none";

const STEP_BY_KEY: Record<string, MosaicStep> = {
    ArrowLeft: "previous",
    ArrowRight: "next",
    ArrowUp: "up",
    ArrowDown: "down",
    Home: "first",
    End: "last",
};

const isSameList = (prev: unknown[], next: unknown[]) =>
    prev.length === next.length && prev.every((value, at) => value === next[at]);

const toGlideFrame = (offsetX: number, offsetY: number, size: Rect | undefined) => ({
    transform: `translate(${offsetX}px, ${offsetY}px)`,
    ...(size ? { width: `${size.width}px`, height: `${size.height}px` } : {}),
});

const readShownRect = (element: HTMLElement, from: Rect): Rect => {
    const style = getComputedStyle(element);
    const offset = style.transform === IDENTITY_TRANSFORM ? undefined : new DOMMatrixReadOnly(style.transform);

    return {
        x: from.x + (offset?.e ?? 0),
        y: from.y + (offset?.f ?? 0),
        width: parseFloat(style.width),
        height: parseFloat(style.height),
    };
};

export const Mosaic = (props: MosaicProps) => {
    const getSizeAnchor = createMemo(() => access(props.sizeAnchor) ?? MOSAIC_DEFAULTS.sizeAnchor);

    const getGap = createMemo(() => access(props.gap) ?? MOSAIC_DEFAULTS.gap);

    const getTransitionDurationMs = createMemo(
        () => access(props.transitionDurationMs) ?? MOSAIC_DEFAULTS.transitionDurationMs,
    );

    const getPrefersReducedMotion = MediaQueryMonitorUtils.createReducedMotion(
        () => getTransitionDurationMs() <= NO_TRANSITION_MS,
    );

    const getGlideDurationMs = () => (getPrefersReducedMotion() ? NO_TRANSITION_MS : getTransitionDurationMs());

    const getIsWalked = () => props.onActivate !== undefined;

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getFocusedSlot, setFocusedSlot] = createSignal<object>();

    const buttonRefs = new Map<object, HTMLElement>();

    let slotsByKey = new Map<unknown, object[]>();
    let refocusTarget: HTMLElement | undefined;

    const getRootSize = ElementObserverUtils.createBorderBoxSizeObserver(getRootRef);

    const getAnchoredExtent = createMemo(() =>
        getSizeAnchor() === "width" ? getRootSize().width : getRootSize().height,
    );

    const getLayout = createMemo(() => {
        const sizes = access(props.sizes);
        const anchoredExtent = getAnchoredExtent();

        if (anchoredExtent <= 0 || !sizes.length) return EMPTY_LAYOUT;

        const isTransposed = getSizeAnchor() === "height";

        const packed = MosaicUtils.sortIntoReadingOrder(
            props.computePlacements({
                sizes: isTransposed ? sizes.map(MosaicUtils.transposeSize) : sizes,
                anchoredExtent,
                gap: getGap(),
            }),
        );

        return {
            placements: isTransposed ? packed.map(MosaicUtils.transposePlacement) : packed,
            freeExtent: MosaicUtils.getFreeExtent(packed),
            anchoredExtent,
        };
    });

    const getRepack = createMemo<{ anchoredExtent: number; isRepack: boolean } | undefined>((previous) => {
        const anchoredExtent = getLayout().anchoredExtent;

        return { anchoredExtent, isRepack: previous?.anchoredExtent === anchoredExtent };
    });

    const getRectByIndex = createMemo(
        () => new Map(getLayout().placements.map((placement) => [placement.index, placement as Rect])),
    );

    const getKeys = createMemo(() => access(props.keys) ?? access(props.sizes).map((_, index) => index));

    const getSlots = createMemo(() => {
        const previous = slotsByKey;
        const next = new Map<unknown, object[]>();

        const slots = getKeys().map((key) => {
            const taken = next.get(key) ?? [];
            const slot = previous.get(key)?.[taken.length] ?? {};

            next.set(key, [...taken, slot]);

            return slot;
        });

        slotsByKey = next;

        return slots;
    });

    const getIndexBySlot = createMemo(() => new Map(getSlots().map((slot, index) => [slot, index])));

    const getOrder = createMemo<number[], undefined>(
        () => {
            const placed = getLayout().placements.map((placement) => placement.index);
            const isPlaced = new Set(placed);

            return [...placed, ...access(props.sizes).flatMap((_, index) => (isPlaced.has(index) ? [] : [index]))];
        },
        undefined,
        { equals: isSameList },
    );

    const getSlotOrder = createMemo<object[], undefined>(
        () => getOrder().flatMap((index) => getSlots()[index] ?? []),
        undefined,
        { equals: isSameList },
    );

    const getRovingIndex = createMemo(() => {
        const focused = getFocusedSlot();
        const index = focused === undefined ? undefined : getIndexBySlot().get(focused);

        if (index !== undefined && getRectByIndex().has(index)) return index;

        return getLayout().placements[0]?.index;
    });

    createComputed(
        on(getSlotOrder, () => {
            const active = document.activeElement;

            refocusTarget = active instanceof HTMLElement && getRootRef()?.contains(active) ? active : undefined;
        }),
    );

    createEffect(
        on(
            getSlotOrder,
            () => {
                const target = refocusTarget;

                refocusTarget = undefined;

                if (target?.isConnected && document.activeElement !== target) target.focus({ preventScroll: true });
            },
            { defer: true },
        ),
    );

    const focusIndex = (index: number) => {
        const slot = getSlots()[index];

        if (slot === undefined) return;

        setFocusedSlot(slot);
        buttonRefs.get(slot)?.focus();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (!getIsWalked()) return;

        const from = getRovingIndex();

        if (from === undefined) return;

        if (NavigatorUtils.getIsActivationKey(e.key)) {
            e.preventDefault();
            props.onActivate?.(from);

            return;
        }

        const step = STEP_BY_KEY[e.key];

        if (step === undefined) return;

        const next = MosaicUtils.computeStepIndex(step, from, getLayout().placements);

        if (next === undefined) return;

        e.preventDefault();
        focusIndex(next);
    };

    return (
        <div
            ref={setRootRef}
            class={styles.mosaicRoot}
            style={{
                width: getSizeAnchor() === "width" ? "100%" : `${getLayout().freeExtent}px`,
                height: getSizeAnchor() === "height" ? "100%" : `${getLayout().freeExtent}px`,
            }}
            role={getIsWalked() ? "list" : undefined}
            aria-label={getIsWalked() ? access(props.ariaLabel) : undefined}
            onKeyDown={(e) => handleKeyDown(e)}
        >
            <For each={getSlotOrder()}>
                {(slot, getReadingIndex) => {
                    const getIndex = createMemo(() => getIndexBySlot().get(slot) ?? NOT_PLACED);
                    const getIsPlaced = createMemo(() => getRectByIndex().has(getIndex()));
                    const getRect = createMemo(() => getRectByIndex().get(getIndex()) ?? EMPTY_RECT);

                    const [getIsFocusVisible, setIsFocusVisible] = createSignal(false);

                    let tileRef: HTMLElement | undefined;
                    let glide: Animation | undefined;
                    let shownRect: Rect | undefined;

                    const glideTo = (element: HTMLElement, from: Rect, to: Rect) => {
                        const isSized = access(props.isItemSized);
                        const shown = glide?.playState === "running" ? readShownRect(element, from) : from;

                        glide?.cancel();
                        glide = undefined;

                        if (getGlideDurationMs() <= NO_TRANSITION_MS || !getRepack()?.isRepack) return;

                        const isStill =
                            shown.x === to.x &&
                            shown.y === to.y &&
                            (!isSized || (shown.width === to.width && shown.height === to.height));

                        if (isStill) return;

                        glide = element.animate(
                            [
                                toGlideFrame(shown.x - to.x, shown.y - to.y, isSized ? shown : undefined),
                                toGlideFrame(0, 0, isSized ? to : undefined),
                            ],
                            { duration: getGlideDurationMs(), easing: GLIDE_EASING },
                        );
                    };

                    createEffect(() => {
                        const rect = getRect();
                        const isPlaced = getIsPlaced();

                        untrack(() => {
                            const from = shownRect;

                            shownRect = isPlaced ? rect : undefined;

                            if (!tileRef) return;

                            if (from === undefined || !isPlaced) {
                                glide?.cancel();
                                glide = undefined;

                                return;
                            }

                            glideTo(tileRef, from, rect);
                        });
                    });

                    onCleanup(() => {
                        glide?.cancel();
                        buttonRefs.delete(slot);
                    });

                    const getContent = createMemo(() =>
                        props.renderItem(getIndex, () => ({
                            index: getIndex(),
                            readingIndex: getReadingIndex(),
                            itemCount: access(props.sizes).length,
                            rect: getRect(),
                            isFocusVisible: getIsFocusVisible(),
                        })),
                    );

                    return (
                        <div
                            ref={(element) => {
                                tileRef = element;
                            }}
                            class={styles.mosaicItem}
                            classList={{ [styles.mosaicSizedItem]: access(props.isItemSized) }}
                            style={{
                                left: `${getRect().x}px`,
                                top: `${getRect().y}px`,
                                width: access(props.isItemSized) ? `${getRect().width}px` : undefined,
                                height: access(props.isItemSized) ? `${getRect().height}px` : undefined,
                                visibility: getIsPlaced() ? undefined : "hidden",
                            }}
                            role={getIsWalked() ? "listitem" : undefined}
                        >
                            {getIsWalked() ? (
                                <div
                                    ref={(element) => {
                                        buttonRefs.set(slot, element);
                                    }}
                                    class={styles.mosaicTileButton}
                                    role="button"
                                    tabindex={getIndex() === getRovingIndex() ? 0 : -1}
                                    onFocus={(e) => {
                                        setFocusedSlot(slot);
                                        setIsFocusVisible(e.currentTarget.matches(":focus-visible"));
                                    }}
                                    onKeyDown={(e) => setIsFocusVisible(e.currentTarget.matches(":focus-visible"))}
                                    onBlur={() => setIsFocusVisible(false)}
                                    onClick={() => {
                                        setFocusedSlot(slot);
                                        props.onActivate?.(getIndex());
                                    }}
                                >
                                    {getContent()}
                                </div>
                            ) : (
                                getContent()
                            )}
                        </div>
                    );
                }}
            </For>
        </div>
    );
};
