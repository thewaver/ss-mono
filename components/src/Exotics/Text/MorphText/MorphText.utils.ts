import { MathUtils, StoreUtils } from "@thewaver/ss-utils";

import type { MorphTextCopyStyle, MorphTextMorpher, MorphTextMorpherOpts, MorphTextState } from "./MorphText.types";

const DONE = 1;
const NOT_STARTED = 0;
const OPACITY_EASE_EXPONENT = 0.4;
const NO_BLUR = 0;

/**
 * The arithmetic and the clock behind `MorphText`: two copies of the text cross-fade while blurring, under a filter
 * that makes anything half-transparent either solid or clear, so the blur melts one word into the next.
 */
export namespace MorphTextUtils {
    /**
     * The values of the filter that turns a blurred, half-transparent copy into a solid shape with a hard edge.
     *
     * Alpha is stretched far past `1` and pulled down, so a pixel more than about half covered becomes fully covered
     * and the rest disappears; colors are left alone.
     */
    export const THRESHOLD_MATRIX = "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 255 -140";

    /**
     * How one copy is drawn at a point of the morph.
     *
     * A copy fading in is sharp only at the end and a copy fading out only at the start; in between the blur grows
     * towards the side it is leaving, capped at `maxBlurPx`, and the opacity eases so both copies stay visible across
     * the middle, where the filter fuses them.
     *
     * @param share How present the copy is, `0` gone to `1` fully there.
     * @param maxBlurPx The most the copy is blurred.
     */
    export const computeCopyStyle = (share: number, maxBlurPx: number): MorphTextCopyStyle => {
        const clamped = MathUtils.clamp01(share);

        return {
            blurPx: clamped <= 0 ? maxBlurPx : Math.min(maxBlurPx / clamped - maxBlurPx, maxBlurPx),
            opacity: clamped ** OPACITY_EASE_EXPONENT,
        };
    };

    /**
     * How the incoming and the outgoing copy are drawn at a point of the morph.
     *
     * @param progress How far the morph has run, `0` to `1`.
     * @param maxBlurPx The most either copy is blurred.
     */
    export const computeFrame = (progress: number, maxBlurPx: number) => ({
        incoming: computeCopyStyle(progress, maxBlurPx),
        outgoing: computeCopyStyle(DONE - progress, maxBlurPx),
    });

    /**
     * A copy's style as CSS.
     *
     * @param copy From {@link computeFrame}.
     * @returns The `filter` and `opacity`, the filter left out when there is no blur.
     */
    export const toCopyStyle = (copy: MorphTextCopyStyle) => ({
        filter: copy.blurPx > NO_BLUR ? `blur(${copy.blurPx}px)` : undefined,
        opacity: `${copy.opacity}`,
    });

    /**
     * Holds the text a `MorphText` shows, and runs the morph from one text to the next on animation frames.
     *
     * A change of text part-way through a morph starts a new one from the text that was arriving, so the copy on
     * screen never jumps. A morph that takes no time puts the text straight on.
     *
     * @param text The text to start on.
     * @param opts What the morpher reads, at the moment it needs it.
     * @returns The morpher.
     */
    export const createMorpher = (text: string, opts: MorphTextMorpherOpts): MorphTextMorpher => {
        const store = StoreUtils.create<MorphTextState>({ current: text, previous: undefined, progress: DONE });

        let frame: number | undefined;

        const cancelFrame = () => {
            if (frame !== undefined) cancelAnimationFrame(frame);

            frame = undefined;
        };

        const rest = (next: string) => {
            cancelFrame();
            store.set({ current: next, previous: undefined, progress: DONE });
        };

        const stop = () => rest(store.get().current);

        const morphTo = (next: string) => {
            const { current } = store.get();

            if (next === current) return;

            const durationMs = opts.getMorphDurationMs();

            if (durationMs <= 0) {
                rest(next);
                opts.onMorphEnd?.(next);

                return;
            }

            cancelFrame();
            store.set({ current: next, previous: current, progress: NOT_STARTED });

            const startMs = performance.now();

            const tick = (nowMs: number) => {
                const progress = MathUtils.clamp01((nowMs - startMs) / durationMs);

                if (progress >= DONE) {
                    rest(next);
                    opts.onMorphEnd?.(next);

                    return;
                }

                store.update((state) => ({ ...state, progress }));
                frame = requestAnimationFrame(tick);
            };

            frame = requestAnimationFrame(tick);
        };

        return { get: store.get, subscribe: store.subscribe, morphTo, rest, stop };
    };
}
