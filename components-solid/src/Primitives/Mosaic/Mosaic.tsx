import { For, createComputed, createEffect, createMemo, createSignal, on, onCleanup, untrack } from "solid-js";

import { MOSAIC_DEFAULTS, MosaicUtils, NavigatorUtils, MosaicStyles as styles } from "@thewaver/ss-components";
import type { Rect } from "@thewaver/ss-utils";

import { ElementObserverSolidUtils } from "../../Abstracts/ElementObserver/ElementObserverSolid.utils";
import { MediaQueryMonitorSolidUtils } from "../../Abstracts/MediaQueryMonitor/MediaQueryMonitorSolid.utils";
import { access } from "../../Utils/propUtils";
import type { MosaicProps } from "./MosaicSolid.types";

const EMPTY_RECT: Rect = { x: 0, y: 0, width: 0, height: 0 };
const NOT_PLACED = -1;
const NO_TRANSITION_MS = 0;

export const Mosaic = (props: MosaicProps) => {
    const getSizeAnchor = createMemo(() => access(props.sizeAnchor) ?? MOSAIC_DEFAULTS.sizeAnchor);

    const getGap = createMemo(() => access(props.gap) ?? MOSAIC_DEFAULTS.gap);

    const getTransitionDurationMs = createMemo(
        () => access(props.transitionDurationMs) ?? MOSAIC_DEFAULTS.transitionDurationMs,
    );

    const getPrefersReducedMotion = MediaQueryMonitorSolidUtils.createReducedMotion(
        () => getTransitionDurationMs() <= NO_TRANSITION_MS,
    );

    const getGlideDurationMs = () => (getPrefersReducedMotion() ? NO_TRANSITION_MS : getTransitionDurationMs());

    const getIsWalked = () => props.onActivate !== undefined;

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getFocusedSlot, setFocusedSlot] = createSignal<object>();

    const buttonRefs = new Map<object, HTMLElement>();

    const assignSlots = MosaicUtils.createSlotKeeper();

    let refocusTarget: HTMLElement | undefined;

    const getRootSize = ElementObserverSolidUtils.createBorderBoxSizeObserver(getRootRef);

    const getAnchoredExtent = createMemo(() =>
        getSizeAnchor() === "width" ? getRootSize().width : getRootSize().height,
    );

    const getLayout = createMemo(() =>
        MosaicUtils.computeLayout({
            sizes: access(props.sizes),
            anchoredExtent: getAnchoredExtent(),
            sizeAnchor: getSizeAnchor(),
            gap: getGap(),
            computePlacements: props.computePlacements,
        }),
    );

    const getRepack = createMemo<{ anchoredExtent: number; isRepack: boolean } | undefined>((previous) => {
        const anchoredExtent = getLayout().anchoredExtent;

        return { anchoredExtent, isRepack: previous?.anchoredExtent === anchoredExtent };
    });

    const getRectByIndex = createMemo(
        () => new Map(getLayout().placements.map((placement) => [placement.index, placement as Rect])),
    );

    const getKeys = createMemo(() => access(props.keys) ?? access(props.sizes).map((_, index) => index));

    const getSlots = createMemo(() => assignSlots(getKeys()));

    const getIndexBySlot = createMemo(() => new Map(getSlots().map((slot, index) => [slot, index])));

    const getOrder = createMemo<number[], undefined>(
        () => MosaicUtils.computeOrder(getLayout().placements, access(props.sizes).length),
        undefined,
        { equals: MosaicUtils.getIsSameList },
    );

    const getSlotOrder = createMemo<object[], undefined>(
        () => getOrder().flatMap((index) => getSlots()[index] ?? []),
        undefined,
        { equals: MosaicUtils.getIsSameList },
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

        const step = MosaicUtils.getStepForKey(e.key);

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
            style={MosaicUtils.computeRootSize(getSizeAnchor(), getLayout().freeExtent)}
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
                        glide = MosaicUtils.glideTile({
                            element,
                            glide,
                            from,
                            to,
                            isSized: access(props.isItemSized),
                            durationMs: getGlideDurationMs(),
                            isRepack: getRepack()?.isRepack ?? false,
                        });
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
                            style={MosaicUtils.computeTileStyle(getRect(), getIsPlaced(), access(props.isItemSized))}
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
