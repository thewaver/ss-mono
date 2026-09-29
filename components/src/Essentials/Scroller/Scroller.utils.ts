import { MathUtils } from "@thewaver/ss-utils";

import type { ScrollerButtonPlacement, ScrollerMetrics, ScrollerStep } from "./Scroller.types";

/** How close to an end, in pixels, counts as being at it, so a fractional scroll position still reads as arrived. */
const SCROLL_EPSILON = 1;

const computeOffsetWithin = (element: HTMLElement, ancestor: HTMLElement) => {
    let offset = 0;
    let node: HTMLElement | null = element;

    while (node && node !== ancestor) {
        offset += node.offsetLeft;
        node = node.offsetParent as HTMLElement | null;
    }

    return offset;
};

/**
 * The parts of a scroller that are not about any framework: what it measures, where a step or a reveal lands, and
 * which buttons it shows.
 */
export namespace ScrollerUtils {
    /** The progress a strip reports when it is at its start, or has nothing to scroll. */
    export const RATIO_MIN = 0;

    /** The reading of a track that has not been measured yet. */
    export const NO_METRICS: ScrollerMetrics = { start: 0, visible: 0, total: 0 };

    /**
     * Measures a track along its scrolling axis.
     *
     * @param track The scrolling track.
     * @returns How far it is scrolled, how much of it is visible, and how long it is, in layout pixels.
     */
    export const readMetrics = (track: HTMLElement): ScrollerMetrics => ({
        start: track.scrollLeft,
        visible: track.clientWidth,
        total: track.scrollWidth,
    });

    /**
     * Whether a track is scrolled all the way to its start.
     *
     * @param metrics The track's reading.
     * @returns `true` within a pixel of the start.
     */
    export const getIsAtStart = (metrics: ScrollerMetrics) => metrics.start <= SCROLL_EPSILON;

    /**
     * Whether a track is scrolled all the way to its end.
     *
     * @param metrics The track's reading.
     * @returns `true` within a pixel of the end.
     */
    export const getIsAtEnd = (metrics: ScrollerMetrics) =>
        metrics.start + metrics.visible >= metrics.total - SCROLL_EPSILON;

    /**
     * Whether a track holds more than it shows, which is what decides whether the buttons are there at all.
     *
     * @param metrics The track's reading.
     * @returns `true` when the content overruns the track by more than a pixel.
     */
    export const getIsScrollable = (metrics: ScrollerMetrics) => metrics.total > metrics.visible + SCROLL_EPSILON;

    /**
     * How far a track can travel: its length less what is visible, and never negative.
     *
     * @param metrics The track's reading.
     * @returns The distance, in layout pixels.
     */
    export const computeScrollRange = (metrics: ScrollerMetrics) => Math.max(metrics.total - metrics.visible, 0);

    /**
     * How far through its run a track is, as a ratio.
     *
     * @param metrics The track's reading.
     * @returns The scroll position over the distance there is to travel, clamped into 0..1, and zero when nothing
     * overflows.
     */
    export const computeProgressRatio = (metrics: ScrollerMetrics) => {
        const range = computeScrollRange(metrics);

        return range === 0 ? RATIO_MIN : MathUtils.clamp01(metrics.start / range);
    };

    /**
     * Where a track has to scroll to so a child shows whole, with `padding` of room clear of the edge.
     *
     * A child already fully in view leaves the track where it is; one cut off by an edge moves it by the least that
     * shows it, rather than centering it, so a half-clicked item is not dragged out from under the pointer.
     *
     * @param track The scrolling track.
     * @param target The element to reveal, anywhere inside the track.
     * @param padding The room to leave between the element and the edge, for its focus ring.
     * @returns The scroll position to go to.
     */
    export const computeRevealTarget = (track: HTMLElement, target: HTMLElement, padding: number) => {
        const { start, visible } = readMetrics(track);
        const offset = computeOffsetWithin(target, track);
        const length = target.offsetWidth;

        if (offset - padding < start) return offset - padding;

        return offset + length + padding > start + visible ? offset + length + padding - visible : start;
    };

    /**
     * Where one step of a track lands.
     *
     * A step goes about one view in its direction and lands on an item boundary: forward, on the furthest child
     * start still within the next view; back, on the nearest child start within the previous one. Where there is no
     * boundary inside the page — a track holding one child — it goes a full view.
     *
     * @param track The scrolling track.
     * @param step Which way.
     * @returns The scroll position to go to.
     */
    export const computeStepTarget = (track: HTMLElement, step: ScrollerStep) => {
        const { start, visible } = readMetrics(track);
        const offsets = [...track.children].map((child) => (child as HTMLElement).offsetLeft);

        if (step === "next") {
            const limit = start + visible;

            return offsets.filter((offset) => offset > start + SCROLL_EPSILON && offset <= limit).pop() ?? limit;
        }

        const limit = start - visible;

        return offsets.filter((offset) => offset < start - SCROLL_EPSILON && offset >= limit).shift() ?? limit;
    };

    /**
     * Scrolls a track one step, unless it is already at the end that step goes towards.
     *
     * @param track The scrolling track, once it exists.
     * @param step Which way.
     * @returns `true` when it scrolled, `false` at the matching end or with no track.
     */
    export const stepTo = (track: HTMLElement | undefined, step: ScrollerStep) => {
        if (!track) return false;

        const metrics = readMetrics(track);

        if (step === "previous" ? getIsAtStart(metrics) : getIsAtEnd(metrics)) return false;

        track.scrollTo({ left: computeStepTarget(track, step) });

        return true;
    };

    /**
     * Which step buttons go before the track and which after it.
     *
     * `split` puts one on each side, `start` and `end` put both on that side, and a track with nothing to scroll gets
     * none at all.
     *
     * @param placement Where the buttons sit.
     * @param isScrollable Whether the track has anything to scroll.
     * @returns The steps to render before the track, and after it.
     */
    export const getSteps = (
        placement: ScrollerButtonPlacement,
        isScrollable: boolean,
    ): { leading: ScrollerStep[]; trailing: ScrollerStep[] } => {
        if (!isScrollable) return { leading: [], trailing: [] };
        if (placement === "start") return { leading: ["previous", "next"], trailing: [] };
        if (placement === "end") return { leading: [], trailing: ["previous", "next"] };

        return { leading: ["previous"], trailing: ["next"] };
    };

    /**
     * Watches a track for everything that changes its reading.
     *
     * The track and each of its children are watched for size, children arriving later are picked up, and the
     * track's own scroll is followed. The callback runs once at the start.
     *
     * @param track The scrolling track.
     * @param onMetrics Receives each new reading.
     * @returns A function that stops watching.
     */
    export const observe = (track: HTMLElement, onMetrics: (metrics: ScrollerMetrics) => void) => {
        const update = () => onMetrics(readMetrics(track));
        const sizeObserver = new ResizeObserver(update);
        const childObserver = new MutationObserver(() => {
            for (const child of track.children) sizeObserver.observe(child);

            update();
        });

        sizeObserver.observe(track);

        for (const child of track.children) sizeObserver.observe(child);

        childObserver.observe(track, { childList: true });
        track.addEventListener("scroll", update, { passive: true });

        update();

        return () => {
            sizeObserver.disconnect();
            childObserver.disconnect();
            track.removeEventListener("scroll", update);
        };
    };
}
