import { JSXTextParserUtils, type Point2d, type Rect, StoreUtils } from "@thewaver/ss-utils";

import type { LetterAnimation } from "../../../Abstracts/LetterDriver/LetterDriver.types";
import { LetterDriverUtils } from "../../../Abstracts/LetterDriver/LetterDriver.utils";
import type { PointerReading } from "../../../Abstracts/PointerTracker/PointerTracker.types";
import { ProximityUtils } from "../../../Abstracts/Proximity/Proximity.utils";
import type {
    ProximityTextDistanceAxis,
    ProximityTextLayout,
    ProximityTextLayoutOpts,
    ProximityTextLayoutState,
} from "./ProximityText.types";

/** How long a letter's keyframes are taken to last. Only the share of it that a strength names is ever shown. */
const LETTER_RUN_MS = 1000;

const HALF = 0.5;

/** Names the elements in the text the copy cannot reproduce, so the difference is never a mystery. */
const warnIfUnsupported = (container: HTMLElement) => {
    const unsupported = JSXTextParserUtils.findUnsupportedElements(container);

    if (!unsupported.length) return;

    console.warn(
        `ProximityText: ${unsupported.map((element) => `<${element.localName}>`).join(", ")} cannot be copied faithfully into the drawn text, which loses a canvas's drawing, media playback, a frame's page and a form control's value.`,
    );
};

/**
 * Letters that answer to how near a point is: each one plays its keyframes held at a strength, `0` far away and `1`
 * under the point.
 *
 * The keyframes are the consumer's, so any property can follow the point — a variable font's axes as readily as a
 * color. The text is wrapped once for every letter at its widest end frame, so a growing letter pushes the rest of its
 * line along without ever moving a line break, and nearness is measured from where the letters sit at rest, so the
 * push cannot feed back into what is measured.
 */
export namespace ProximityTextUtils {
    /**
     * Where the point is in the text's own box, or `undefined` while there is none.
     *
     * @param reading Where the point is relative to the text, from `PointerTrackerUtils.observe`.
     * @param isPresent Whether there is a point at all.
     * @param size The text's box, in layout pixels.
     */
    export const toPoint = (reading: PointerReading, isPresent: boolean, size: { width: number; height: number }) =>
        isPresent ? { x: reading.boxRatio.x * size.width, y: reading.boxRatio.y * size.height } : undefined;

    /**
     * How strongly each letter answers the point.
     *
     * @param boxes Where each letter sits at rest, in the same layout pixels as the point.
     * @param point Where the point is, or `undefined` while there is none.
     * @param reachPx How far from a letter's middle the point still reaches it.
     * @param axis Which way the distance is measured: `"both"`, straight to the point; `"vertical"`, up and down
     * only, so the point acts as a line across the text and every letter on one line answers it alike;
     * `"horizontal"`, across only, a line down the text.
     * @returns One strength per letter, `1` under the point falling with `Proximity`'s curve to `0` at the reach,
     * and `0` for every letter while there is no point.
     */
    export const computeStrengths = (
        boxes: readonly Rect[],
        point: Point2d | undefined,
        reachPx: number,
        axis: ProximityTextDistanceAxis = "both",
    ) =>
        boxes.map((box) => {
            if (!point) return 0;

            const dx = axis === "vertical" ? 0 : point.x - (box.x + box.width * HALF);
            const dy = axis === "horizontal" ? 0 : point.y - (box.y + box.height * HALF);

            return ProximityUtils.getDistanceFalloff(Math.hypot(dx, dy), reachPx);
        });

    /**
     * What one letter plays to show a strength.
     *
     * The letter's keyframes are held at that share of the way through, through
     * `LetterDriverUtils.computeAnimationStyle` with the driver's time at `0`.
     *
     * @param name The letter's keyframes.
     * @param strength How strongly it answers, `0` to `1`.
     */
    export const toLetterAnimation = (name: string, strength: number): LetterAnimation => ({
        name,
        durationMs: LETTER_RUN_MS,
        delayMs: -strength * LETTER_RUN_MS,
        direction: "normal",
    });

    /**
     * Measures and wraps the text a `ProximityText` draws, and keeps the result.
     *
     * The text is taken from the hidden copy the consumer's children are rendered into, wrapped at its width for every
     * letter at its widest end frame (see `LetterDriverUtils.wrapAtWidestFrame`) and numbered letter by letter. A
     * change of size measures again only when the width changed; a web font or an image finishing loading measures
     * again whatever the width, since either moves line breaks without moving the box. While a drawer inside draws the
     * letters, nothing is measured here. The first measurement and every change of content warn about elements the
     * copy cannot reproduce — see `JSXTextParserUtils.findUnsupportedElements`.
     *
     * @param opts What the layout reads, at the moment it measures.
     * @returns The layout.
     */
    export const createLayout = (opts: ProximityTextLayoutOpts): ProximityTextLayout => {
        const store = StoreUtils.create<ProximityTextLayoutState>(
            { segments: [], count: 0, width: undefined },
            { isEqual: StoreUtils.getIsShallowEqual },
        );

        const update = (isForced = false, isContentChange = false) => {
            const container = opts.getContainer();

            if (!container || opts.getIsDriven?.()) return false;

            const width = container.clientWidth;

            if (!isForced && width === store.get().width) return false;

            if (store.get().width === undefined || isContentChange) warnIfUnsupported(container);

            const { segments, count } = LetterDriverUtils.indexSegments(
                LetterDriverUtils.wrapAtWidestFrame(
                    JSXTextParserUtils.getSegmentTokens(container),
                    width,
                    container.parentElement ?? container,
                    opts.getComputeAnimationName(),
                ),
            );

            store.set({ segments, count, width });

            return true;
        };

        const observe = (container: HTMLElement) => {
            const resizeObserver = new ResizeObserver(() => update());
            const mutationObserver = new MutationObserver(() => update(true, true));
            const handleLoaded = () => update(true);

            resizeObserver.observe(container);
            mutationObserver.observe(container, {
                subtree: true,
                childList: true,
                characterData: true,
                attributes: true,
            });
            container.addEventListener("load", handleLoaded, true);
            document.fonts.addEventListener("loadingdone", handleLoaded);

            return () => {
                resizeObserver.disconnect();
                mutationObserver.disconnect();
                container.removeEventListener("load", handleLoaded, true);
                document.fonts.removeEventListener("loadingdone", handleLoaded);
            };
        };

        return { get: store.get, subscribe: store.subscribe, update: (isForced) => update(isForced), observe };
    };
}
