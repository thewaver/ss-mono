import type { SunburstArc, SunburstArcPathOpts, SunburstNode, SunburstSpan } from "./Sunburst.types";

/** Zero, as a weight, a length or an angle. */
const NOTHING = 0;
/** A whole turn, as a fraction, and the first ring outside the center. */
const WHOLE = 1;
/** Halfway, for the middle of an arc and for splitting a gap between its two sides. */
const HALF = 0.5;
/** A full turn, in radians. */
const TURN = Math.PI * 2;
/** How close to a full turn an arc has to be before it is drawn as a ring rather than a slice. */
const FULL_TURN_EPSILON = 1e-6;
/** A quarter turn, in degrees, for turning text from twelve o'clock to three. */
const QUARTER_TURN_DEGREES = 90;
/** Half a turn, in degrees, for turning text on the left-hand side the right way up. */
const HALF_TURN_DEGREES = 180;
/** A full turn, in degrees. */
const FULL_TURN_DEGREES = 360;

const toPoint = (radius: number, angle: number) => `${radius * Math.sin(angle)},${-radius * Math.cos(angle)}`;

/**
 * Lays out a sunburst, and turns the layout into what is drawn.
 *
 * A layout is written in turns and rings rather than pixels: how far round the circle an arc starts and ends, as a
 * fraction of a whole turn, and which ring it covers, counting the root as ring nought. Zooming is then a matter of
 * re-reading every span against the branch at the center, and the size of the drawing only enters at the end.
 */
export namespace SunburstUtils {
    /**
     * Places every node of a tree around a circle.
     *
     * @param root The whole tree.
     * @param weights How much every node weighs — a leaf its own weight, a branch the total of its children.
     * @returns A span per node. The root covers the whole turn in ring nought; each node's children share its turn
     * in proportion to their weights, heaviest first clockwise from twelve o'clock, in the next ring out. A node
     * weighing nothing gets a span with no width.
     */
    export const computeSpans = <T>(root: SunburstNode<T>, weights: Map<SunburstNode<T>, number>) => {
        const spans = new Map<SunburstNode<T>, SunburstSpan>();

        const place = (node: SunburstNode<T>, span: SunburstSpan) => {
            spans.set(node, span);

            const total = weights.get(node) ?? NOTHING;
            const children = [...(node.children ?? [])].sort(
                (first, second) => (weights.get(second) ?? NOTHING) - (weights.get(first) ?? NOTHING),
            );

            let start = span.start;

            children.forEach((child) => {
                const share = total > NOTHING ? (weights.get(child) ?? NOTHING) / total : NOTHING;
                const end = start + (span.end - span.start) * share;

                place(child, { start, end, inner: span.outer, outer: span.outer + WHOLE });

                start = end;
            });
        };

        place(root, { start: NOTHING, end: WHOLE, inner: NOTHING, outer: WHOLE });

        return spans;
    };

    /**
     * Re-reads a span as it sits once another node is at the center.
     *
     * @param span The span to re-read, from {@link computeSpans}.
     * @param center The span of the node at the center.
     * @returns The span with the center's turn stretched to a whole turn and its ring moved to nought. Anything
     * outside the center's turn is squeezed to no width at the nearer edge, and anything inside the center's ring is
     * moved to ring nought, so an ancestor of the center shrinks away rather than going negative.
     */
    export const computeView = (span: SunburstSpan, center: SunburstSpan): SunburstSpan => {
        const width = center.end - center.start;
        const toTurn = (value: number) =>
            width > NOTHING ? Math.min(WHOLE, Math.max(NOTHING, (value - center.start) / width)) : NOTHING;

        return {
            start: toTurn(span.start),
            end: toTurn(span.end),
            inner: Math.max(NOTHING, span.inner - center.inner),
            outer: Math.max(NOTHING, span.outer - center.inner),
        };
    };

    /**
     * Whether a span is one of the rings drawn around the center.
     *
     * @param span A span as {@link computeView} answers it.
     * @param ringCount How many rings are drawn.
     * @returns `true` for a span with some width that sits between the first ring and the last.
     */
    export const getIsVisible = (span: SunburstSpan, ringCount: number) =>
        span.inner >= WHOLE && span.outer <= ringCount + WHOLE && span.end > span.start;

    /**
     * A span part of the way from one place to another.
     *
     * @param from Where it starts.
     * @param to Where it ends.
     * @param progress How far along, `0` at `from` and `1` at `to`.
     */
    export const interpolateSpan = (from: SunburstSpan, to: SunburstSpan, progress: number): SunburstSpan => ({
        start: from.start + (to.start - from.start) * progress,
        end: from.end + (to.end - from.end) * progress,
        inner: from.inner + (to.inner - from.inner) * progress,
        outer: from.outer + (to.outer - from.outer) * progress,
    });

    /**
     * Turns a span into angles and distances from the center.
     *
     * @param span The span, in turns and rings.
     * @param ringWidth How wide one ring is, in pixels.
     */
    export const toArc = (span: SunburstSpan, ringWidth: number): SunburstArc => ({
        startAngle: span.start * TURN,
        endAngle: span.end * TURN,
        innerRadius: span.inner * ringWidth,
        outerRadius: span.outer * ringWidth,
    });

    /**
     * The outline of an arc, as an SVG path about the origin.
     *
     * @param arc Where the arc sits.
     * @param opts.padLength A gap to leave between this arc and its neighbors in the ring. It is the same width in
     * pixels all the way along, so the gap does not fan out towards the rim. Nothing by default.
     * @param opts.ringGap A gap to leave between this arc and the ring outside it. Nothing by default.
     * @returns The `d` of a path, or an empty string for an arc with no width or no depth once the gaps are taken.
     * An arc that goes all the way round is drawn as a ring with a hole in it.
     */
    export const computeArcPath = (arc: SunburstArc, opts?: SunburstArcPathOpts) => {
        const pad = opts?.padLength ?? NOTHING;
        const inner = arc.innerRadius;
        const outer = arc.outerRadius - (opts?.ringGap ?? NOTHING);
        const span = arc.endAngle - arc.startAngle;

        if (span <= NOTHING || outer <= inner) return "";

        if (span >= TURN - FULL_TURN_EPSILON && pad <= NOTHING) {
            const ring = (radius: number, sweep: number) =>
                `M${toPoint(radius, NOTHING)}A${radius},${radius} 0 1 ${sweep} ${toPoint(radius, Math.PI)}A${radius},${radius} 0 1 ${sweep} ${toPoint(radius, NOTHING)}Z`;

            return inner > NOTHING ? `${ring(outer, WHOLE)}${ring(inner, NOTHING)}` : ring(outer, WHOLE);
        }

        const inset = (radius: number) => (radius > NOTHING ? Math.min(span * HALF, (pad * HALF) / radius) : NOTHING);

        const outerStart = arc.startAngle + inset(outer);
        const outerEnd = arc.endAngle - inset(outer);
        const innerStart = arc.startAngle + inset(inner);
        const innerEnd = arc.endAngle - inset(inner);
        const outerLarge = outerEnd - outerStart > Math.PI ? WHOLE : NOTHING;
        const innerLarge = innerEnd - innerStart > Math.PI ? WHOLE : NOTHING;

        const rim = `M${toPoint(outer, outerStart)}A${outer},${outer} 0 ${outerLarge} 1 ${toPoint(outer, outerEnd)}`;

        if (inner <= NOTHING) return `${rim}L0,0Z`;

        return `${rim}L${toPoint(inner, innerEnd)}A${inner},${inner} 0 ${innerLarge} 0 ${toPoint(inner, innerStart)}Z`;
    };

    /**
     * Where to put a label so it runs outward along the middle of an arc and never reads upside down.
     *
     * @param arc Where the arc sits.
     * @returns A `transform` for an element drawn at the origin with its text centered on it. Text on the right-hand
     * half reads outward from the center and text on the left-hand half reads inward, so both halves stay upright.
     */
    export const computeLabelTransform = (arc: SunburstArc) => {
        const angle = (((arc.startAngle + arc.endAngle) * HALF) / TURN) * FULL_TURN_DEGREES;
        const radius = (arc.innerRadius + arc.outerRadius) * HALF;

        return `rotate(${angle - QUARTER_TURN_DEGREES}) translate(${radius},0) rotate(${angle < HALF_TURN_DEGREES ? NOTHING : HALF_TURN_DEGREES})`;
    };
}
