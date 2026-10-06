import type { SVGAnimationDefs, SVGAnimationIterationPattern } from "./SVGAnimationDefs.types";

const MS_PER_SECOND = 1000;
/** What an animation begun from script has written for its `begin`. */
const INDEFINITE_BEGIN = "indefinite";
const FIRST_PATTERN_INDEX = 0;

/**
 * Drives SVG's own `animate` elements from a script of iteration patterns.
 *
 * SMIL animation is used rather than CSS because several `animate` elements can be begun in the
 * same instant and stay in step, which is what a filter's worth of animated primitives needs.
 * The cost is that its scheduling has to be driven by hand, and that is what this does. The markup
 * the schedule is spread onto is each framework's.
 */
/** The outermost `<svg>` an element is drawn in, whose clock its animations run on. */
const getOutermostSvg = (el: SVGElement) => {
    let svg = el.ownerSVGElement;

    while (svg?.ownerSVGElement) svg = svg.ownerSVGElement;

    return svg;
};

export namespace SVGAnimationDefsUtils {
    /**
     * Rewrites a pattern that loops to itself as a pair that alternate.
     *
     * An `animate` element cannot be told to begin again while it is the one that just ended — the
     * event that would restart it is the event it is still delivering — so a self-loop would stall. Two
     * patterns pointing at each other run identically and do not.
     *
     * @param patterns The patterns as written, each naming which pattern follows it.
     * @returns The same patterns with any self-loop expanded into a pair. The originals are copied
     * rather than modified, and no pattern loses its identity, so indices already in the list stay
     * valid.
     */
    export const unrollSelfReferencingPatterns = (
        patterns: SVGAnimationIterationPattern[],
    ): SVGAnimationIterationPattern[] => {
        if (patterns.length === 0) return patterns;

        const result = patterns.map((p) => ({ ...p }));
        const originalLength = result.length;

        for (let i = 0; i < originalLength; i++) {
            const pattern = result[i];

            if (pattern.nextIndex === i) {
                const duplicateIndex = result.length;

                pattern.nextIndex = duplicateIndex;
                result.push({ ...pattern, nextIndex: i });
            }
        }

        return result;
    };

    /**
     * The `repeatCount` an `animate` element carries while one pattern runs.
     *
     * @param pattern The running pattern. Missing — no script at all, or an index past its end — repeats
     * forever, as does a count of `Infinity`.
     * @returns `"indefinite"` or the pattern's count.
     */
    export const computeRepeatCount = (pattern: SVGAnimationIterationPattern | undefined) =>
        !pattern || pattern.count === Infinity ? "indefinite" : pattern.count;

    /**
     * Whether an animation runs on the page's clock rather than from the moment it is put in the page.
     *
     * A pattern that loops forever with no delay has no start anybody can see, only a phase, so it is written to begin
     * at the drawing's time zero and the drawing's clock is set to the page's: two drawings of the same looping paint
     * then show the same moment of it, and one put in the page later, such as a word replaced by the next, carries the
     * loop on instead of restarting it. Anything scripted — a count, a delay — is begun from script, after its own delay
     * from the moment it is put in the page, as it was written. A framework writes `begin="0s"` on an animation this
     * answers `true` for, and `"indefinite"` otherwise; {@link createScheduler} reads which it was given.
     *
     * @param pattern The first pattern, or `undefined` for none, which loops forever.
     */
    export const getIsPageClocked = (pattern: SVGAnimationIterationPattern | undefined) =>
        computeRepeatCount(pattern) === "indefinite" && !((pattern?.beginDelayMs ?? 0) > 0);

    /**
     * Names an animation by what it plays, so two records describing the same animation get the same name.
     *
     * A running SMIL animation cannot be rewound or retimed in place, so a framework that keeps elements across
     * renders rebuilds them when this changes — and only then, so a record rebuilt with the same values does not
     * restart an animation that is already running.
     *
     * @param defs The animation.
     * @returns A string that changes when the duration or any pattern does, and not otherwise.
     */
    export const computeIdentity = (defs: SVGAnimationDefs) =>
        [
            defs.animationDurationMs,
            ...(defs.animationIterationPatterns ?? []).map(
                (pattern) => `${pattern.count}_${pattern.beginDelayMs ?? ""}_${pattern.nextIndex ?? ""}`,
            ),
        ].join("|");

    /**
     * Runs one animation's schedule over every `animate` element that shares it.
     *
     * All the elements attached to one scheduler are begun together and end together, and one of them —
     * whichever is still in the document — is picked to drive the schedule, so the callbacks fire once
     * per iteration rather than once per element. Beginning is deferred to the next frame, because an
     * element that has not yet been laid out cannot be told to start, and it is asked for as a delay from
     * now rather than as a moment on the document's clock. An element written to begin at time zero rather than
     * `"indefinite"` — a loop with no start of its own ({@link getIsPageClocked}) — is not begun at all: its drawing's
     * clock is set to the page's instead, once as soon as it is in the page and again on the next frame. The first is
     * what keeps it seamless: browsers hold a newly added animation at its first frame until something moves the clock
     * it runs on, so one added after the page has worked out its animations for a frame — a paint rebuilt when its box
     * is resized — would otherwise be drawn for that frame at its start. The second lines it up with the frame's own
     * time.
     *
     * The pattern index is the caller's, read and written through `opts`. `setPatternIndex` must have
     * applied its value to the elements' `repeatCount` by the time it returns, since the elements are begun
     * again straight afterwards.
     *
     * @param opts.getPatterns The script, already unrolled by {@link unrollSelfReferencingPatterns}. Read
     * whenever a pattern starts, so it may change between them.
     * @param opts.getPatternIndex Which pattern is running.
     * @param opts.setPatternIndex Moves to the next pattern.
     * @param opts.getDefs The animation, read when a pattern ends for its `onAnimationIteration` and
     * `onAnimationEnd`.
     * @returns `attach`, which takes an element into the schedule and answers the call that takes it out
     * again. Attaching the same element after detaching it starts it again.
     */
    export const createScheduler = (opts: {
        getPatterns: () => SVGAnimationIterationPattern[];
        getPatternIndex: () => number;
        setPatternIndex: (index: number) => void;
        getDefs: () => SVGAnimationDefs;
    }) => {
        const elements = new Set<SVGAnimateElement>();

        const getLeadElement = () => {
            for (const candidate of elements) {
                if (candidate.isConnected) return candidate;
            }

            return undefined;
        };

        return {
            attach: (el: SVGAnimateElement) => {
                elements.add(el);

                let isAttached = true;

                queueMicrotask(() => {
                    if (!isAttached || !el.isConnected || el.getAttribute("begin") === INDEFINITE_BEGIN) return;

                    getOutermostSvg(el)?.setCurrentTime(performance.now() / MS_PER_SECOND);
                });

                const frameId = requestAnimationFrame((frameMs) => {
                    if (!el.isConnected) return;

                    if (el.getAttribute("begin") !== INDEFINITE_BEGIN) {
                        getOutermostSvg(el)?.setCurrentTime(frameMs / MS_PER_SECOND);

                        return;
                    }

                    el.beginElementAt((opts.getPatterns()[FIRST_PATTERN_INDEX]?.beginDelayMs ?? 0) / MS_PER_SECOND);
                });

                const handleEndEvent = () => {
                    if (el !== getLeadElement()) return;

                    const currentIndex = opts.getPatternIndex();
                    const nextIndex = opts.getPatterns()[currentIndex]?.nextIndex;

                    opts.getDefs().onAnimationIteration?.(currentIndex);

                    if (nextIndex === undefined) {
                        opts.getDefs().onAnimationEnd?.();
                        return;
                    }

                    opts.setPatternIndex(nextIndex);

                    const delaySecs = (opts.getPatterns()[nextIndex]?.beginDelayMs ?? 0) / MS_PER_SECOND;

                    for (const element of elements) {
                        if (element.isConnected) {
                            element.beginElementAt(delaySecs);
                        }
                    }
                };

                el.addEventListener("endEvent", handleEndEvent);

                return () => {
                    isAttached = false;
                    cancelAnimationFrame(frameId);
                    el.removeEventListener("endEvent", handleEndEvent);
                    elements.delete(el);
                };
            },
        };
    };
}
