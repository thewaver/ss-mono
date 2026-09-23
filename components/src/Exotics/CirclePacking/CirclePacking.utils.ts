import type { CirclePackingCircle, CirclePackingNode, CirclePackingView } from "./CirclePacking.types";

type Placed = { x: number; y: number; r: number };

type ChainLink = { circle: Placed; next: ChainLink; previous: ChainLink };

type Work<T> = Placed & { node: CirclePackingNode<T>; children: Work<T>[] };

/** Zero, as a weight, a length or an index. */
const NOTHING = 0;
/** One, as a count or a whole. */
const SINGLE = 1;
/** Halfway. */
const HALF = 0.5;
/** Double, for the two sides of a diameter. */
const DOUBLE = 2;
/** Quadruple, for a quadratic's discriminant. */
const QUADRUPLE = 4;
/** How far two circles may overlap and still count as touching rather than crossing. */
const TOUCH_EPSILON = 1e-6;
/** How much slack a circle is given when asking whether it encloses another, relative to the larger radius. */
const ENCLOSE_EPSILON = 1e-9;
/** How close to flat the quadratic in a three-circle enclosure may be before it is solved as a line. */
const FLAT_EPSILON = 1e-6;
/** The first-pass padding, as a share of the final one. */
const FIRST_PASS_PADDING = 0.5;
/** Multiplier of the seeded shuffle's generator. */
const SEED_MULTIPLIER = 1664525;
/** Increment of the seeded shuffle's generator. */
const SEED_INCREMENT = 1013904223;
/** Modulus of the seeded shuffle's generator. */
const SEED_MODULUS = 4294967296;
/** How far apart two views have to be before a zoom between them travels rather than only scaling. */
const TRAVEL_EPSILON = 1e-12;
/** The curvature of a zoom's path: how far it pulls out before traveling. */
const ZOOM_RHO = Math.SQRT2;

const createRandom = () => {
    let state = SINGLE;

    return () => (state = (SEED_MULTIPLIER * state + SEED_INCREMENT) % SEED_MODULUS) / SEED_MODULUS;
};

const shuffle = <V>(values: V[], random: () => number) => {
    let remaining = values.length;

    while (remaining) {
        const index = Math.floor(random() * remaining--);
        const held = values[remaining];

        values[remaining] = values[index];
        values[index] = held;
    }

    return values;
};

const encloseOne = (a: Placed): Placed => ({ x: a.x, y: a.y, r: a.r });

const encloseTwo = (a: Placed, b: Placed): Placed => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dr = b.r - a.r;
    const length = Math.sqrt(dx * dx + dy * dy);

    return {
        x: (a.x + b.x + (dx / length) * dr) * HALF,
        y: (a.y + b.y + (dy / length) * dr) * HALF,
        r: (length + a.r + b.r) * HALF,
    };
};

const encloseThree = (a: Placed, b: Placed, c: Placed): Placed => {
    const a2 = a.x - b.x;
    const a3 = a.x - c.x;
    const b2 = a.y - b.y;
    const b3 = a.y - c.y;
    const c2 = b.r - a.r;
    const c3 = c.r - a.r;
    const d1 = a.x * a.x + a.y * a.y - a.r * a.r;
    const d2 = d1 - b.x * b.x - b.y * b.y + b.r * b.r;
    const d3 = d1 - c.x * c.x - c.y * c.y + c.r * c.r;
    const ab = a3 * b2 - a2 * b3;
    const xa = (b2 * d3 - b3 * d2) / (ab * DOUBLE) - a.x;
    const xb = (b3 * c2 - b2 * c3) / ab;
    const ya = (a3 * d2 - a2 * d3) / (ab * DOUBLE) - a.y;
    const yb = (a2 * c3 - a3 * c2) / ab;
    const quadA = xb * xb + yb * yb - SINGLE;
    const quadB = DOUBLE * (a.r + xa * xb + ya * yb);
    const quadC = xa * xa + ya * ya - a.r * a.r;
    const r = -(Math.abs(quadA) > FLAT_EPSILON
        ? (quadB + Math.sqrt(quadB * quadB - QUADRUPLE * quadA * quadC)) / (DOUBLE * quadA)
        : quadC / quadB);

    return { x: a.x + xa + xb * r, y: a.y + ya + yb * r, r };
};

const getEnclosesNot = (a: Placed, b: Placed) => {
    const dr = a.r - b.r;
    const dx = b.x - a.x;
    const dy = b.y - a.y;

    return dr < NOTHING || dr * dr < dx * dx + dy * dy;
};

const getEnclosesWeak = (a: Placed, b: Placed) => {
    const dr = a.r - b.r + Math.max(a.r, b.r, SINGLE) * ENCLOSE_EPSILON;
    const dx = b.x - a.x;
    const dy = b.y - a.y;

    return dr > NOTHING && dr * dr > dx * dx + dy * dy;
};

const getEnclosesWeakAll = (a: Placed, basis: Placed[]) => basis.every((b) => getEnclosesWeak(a, b));

const encloseBasis = (basis: Placed[]) =>
    basis.length === 1
        ? encloseOne(basis[0])
        : basis.length === 2
          ? encloseTwo(basis[0], basis[1])
          : encloseThree(basis[0], basis[1], basis[2]);

const extendBasis = (basis: Placed[], p: Placed): Placed[] => {
    if (getEnclosesWeakAll(p, basis)) return [p];

    for (const b of basis) {
        if (getEnclosesNot(p, b) && getEnclosesWeakAll(encloseTwo(b, p), basis)) return [b, p];
    }

    for (let i = NOTHING; i < basis.length - SINGLE; i++) {
        for (let j = i + SINGLE; j < basis.length; j++) {
            if (
                getEnclosesNot(encloseTwo(basis[i], basis[j]), p) &&
                getEnclosesNot(encloseTwo(basis[i], p), basis[j]) &&
                getEnclosesNot(encloseTwo(basis[j], p), basis[i]) &&
                getEnclosesWeakAll(encloseThree(basis[i], basis[j], p), basis)
            ) {
                return [basis[i], basis[j], p];
            }
        }
    }

    return [p];
};

const encloseAll = (circles: Placed[], random: () => number): Placed => {
    const order = shuffle([...circles], random);

    let basis: Placed[] = [];
    let enclosing: Placed | undefined;
    let index = NOTHING;

    while (index < order.length) {
        const circle = order[index];

        if (enclosing && getEnclosesWeak(enclosing, circle)) {
            index++;
        } else {
            basis = extendBasis(basis, circle);
            enclosing = encloseBasis(basis);
            index = NOTHING;
        }
    }

    return enclosing ?? { x: NOTHING, y: NOTHING, r: NOTHING };
};

const place = (b: Placed, a: Placed, c: Placed) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const d2 = dx * dx + dy * dy;

    if (!d2) {
        c.x = a.x + c.r;
        c.y = a.y;

        return;
    }

    const a2 = (a.r + c.r) ** DOUBLE;
    const b2 = (b.r + c.r) ** DOUBLE;

    if (a2 > b2) {
        const x = (d2 + b2 - a2) / (DOUBLE * d2);
        const y = Math.sqrt(Math.max(NOTHING, b2 / d2 - x * x));

        c.x = b.x - x * dx - y * dy;
        c.y = b.y - x * dy + y * dx;
    } else {
        const x = (d2 + a2 - b2) / (DOUBLE * d2);
        const y = Math.sqrt(Math.max(NOTHING, a2 / d2 - x * x));

        c.x = a.x + x * dx - y * dy;
        c.y = a.y + x * dy + y * dx;
    }
};

const getIntersects = (a: Placed, b: Placed) => {
    const dr = a.r + b.r - TOUCH_EPSILON;
    const dx = b.x - a.x;
    const dy = b.y - a.y;

    return dr > NOTHING && dr * dr > dx * dx + dy * dy;
};

const score = (entry: ChainLink) => {
    const a = entry.circle;
    const b = entry.next.circle;
    const ab = a.r + b.r;
    const dx = (a.x * b.r + b.x * a.r) / ab;
    const dy = (a.y * b.r + b.y * a.r) / ab;

    return dx * dx + dy * dy;
};

const link = (circle: Placed) => {
    const created = { circle } as ChainLink;

    created.next = created;
    created.previous = created;

    return created;
};

const packSiblingsInPlace = (circles: Placed[], random: () => number) => {
    const count = circles.length;

    if (!count) return NOTHING;

    const first = circles[0];

    first.x = NOTHING;
    first.y = NOTHING;

    if (count === 1) return first.r;

    const second = circles[1];

    first.x = -second.r;
    second.x = first.r;
    second.y = NOTHING;

    if (count === 2) return first.r + second.r;

    place(second, first, circles[2]);

    let a = link(first);
    let b = link(second);
    let c = link(circles[2]);

    a.next = c.previous = b;
    b.next = a.previous = c;
    c.next = b.previous = a;

    pack: for (let index = 3; index < count; index++) {
        place(a.circle, b.circle, circles[index]);
        c = link(circles[index]);

        let j = b.next;
        let k = a.previous;
        let sj = b.circle.r;
        let sk = a.circle.r;

        do {
            if (sj <= sk) {
                if (getIntersects(j.circle, c.circle)) {
                    b = j;
                    a.next = b;
                    b.previous = a;
                    index--;

                    continue pack;
                }

                sj += j.circle.r;
                j = j.next;
            } else {
                if (getIntersects(k.circle, c.circle)) {
                    a = k;
                    a.next = b;
                    b.previous = a;
                    index--;

                    continue pack;
                }

                sk += k.circle.r;
                k = k.previous;
            }
        } while (j !== k.next);

        c.previous = a;
        c.next = b;
        a.next = b.previous = b = c;

        let best = score(a);

        while ((c = c.next) !== b) {
            const candidate = score(c);

            if (candidate < best) {
                a = c;
                best = candidate;
            }
        }

        b = a.next;
    }

    const chain = [b.circle];

    for (let walker = b.next; walker !== b; walker = walker.next) chain.push(walker.circle);

    const enclosing = encloseAll(chain, random);

    circles.forEach((circle) => {
        circle.x -= enclosing.x;
        circle.y -= enclosing.y;
    });

    return enclosing.r;
};

/**
 * Packs a tree as nested circles, and moves a view smoothly from one circle to another.
 *
 * The packing is the one D3's `pack` produces: a leaf's area is its weight, siblings are laid against each other as
 * tightly as they will go, and a branch is the smallest circle around its children plus the padding. The shuffle
 * inside it is seeded, so the same tree always packs the same way.
 */
export namespace CirclePackingUtils {
    /**
     * The smallest circle that contains every circle given.
     *
     * @param circles The circles to enclose. The array is not changed.
     * @returns The enclosing circle, or one of no size at the origin when there is nothing to enclose.
     */
    export const enclose = (circles: CirclePackingCircle[]): CirclePackingCircle => {
        const enclosing = encloseAll(
            circles.map((circle) => ({ x: circle.x, y: circle.y, r: circle.radius })),
            createRandom(),
        );

        return { x: enclosing.x, y: enclosing.y, radius: enclosing.r };
    };

    /**
     * Lays circles of the given sizes against each other as tightly as they will go.
     *
     * @param radii The circles' radii, largest first for the tightest result.
     * @returns Where each circle sits, in the same order, with the smallest circle around them all centered on the
     * origin, and that circle's radius. No two circles overlap.
     */
    export const packSiblings = (radii: number[]) => {
        const circles = radii.map((r) => ({ x: NOTHING, y: NOTHING, r }));
        const radius = packSiblingsInPlace(circles, createRandom());

        return { circles: circles.map((circle) => ({ x: circle.x, y: circle.y, radius: circle.r })), radius };
    };

    /**
     * Packs a whole tree into a square.
     *
     * @param root The whole tree.
     * @param weights How much every node weighs — a leaf its own weight, a branch the total of its children.
     * @param side The width of the square, in pixels.
     * @param padding The space left between neighboring circles and inside each branch, in pixels.
     * @returns A circle per node that weighs something, with the root filling the square and centered on the origin.
     */
    export const computeLayout = <T>(
        root: CirclePackingNode<T>,
        weights: Map<CirclePackingNode<T>, number>,
        side: number,
        padding: number,
    ) => {
        const random = createRandom();

        const build = (node: CirclePackingNode<T>): Work<T> => ({
            node,
            x: NOTHING,
            y: NOTHING,
            r: Math.sqrt(weights.get(node) ?? NOTHING),
            children: (node.children ?? [])
                .filter((child) => (weights.get(child) ?? NOTHING) > NOTHING)
                .sort((first, second) => (weights.get(second) ?? NOTHING) - (weights.get(first) ?? NOTHING))
                .map(build),
        });

        const packChildren = (work: Work<T>, gap: number) => {
            work.children.forEach((child) => packChildren(child, gap));

            if (!work.children.length) return;

            work.children.forEach((child) => (child.r += gap));

            const radius = packSiblingsInPlace(work.children, random);

            work.children.forEach((child) => (child.r -= gap));
            work.r = radius + gap;
        };

        const translate = (work: Work<T>, scale: number, parent?: Work<T>) => {
            work.r *= scale;

            if (parent) {
                work.x = parent.x + scale * work.x;
                work.y = parent.y + scale * work.y;
            }

            work.children.forEach((child) => translate(child, scale, work));
        };

        const top = build(root);

        packChildren(top, padding * FIRST_PASS_PADDING);
        translate(top, SINGLE);

        const firstRadius = top.r;

        packChildren(top, side > NOTHING && firstRadius > NOTHING ? padding * (firstRadius / side) : NOTHING);
        translate(top, top.r > NOTHING ? side / (DOUBLE * top.r) : NOTHING);

        const layout = new Map<CirclePackingNode<T>, CirclePackingCircle>();

        const collect = (work: Work<T>) => {
            layout.set(work.node, { x: work.x, y: work.y, radius: work.r });
            work.children.forEach(collect);
        };

        collect(top);

        return layout;
    };

    /**
     * A path from one view to another that pulls out, travels and comes back in, rather than sliding flat.
     *
     * It is van Wijk and Nuij's smooth zoom, as D3's `interpolateZoom` draws it: when two views are far apart the
     * path widens first, so the journey is seen from above.
     *
     * @param from The view to start from.
     * @param to The view to end on.
     * @returns A function from progress, `0` to `1`, to the view at that point.
     */
    export const interpolateZoom = (from: CirclePackingView, to: CirclePackingView) => {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const d2 = dx * dx + dy * dy;
        const rho2 = ZOOM_RHO * ZOOM_RHO;
        const rho4 = rho2 * rho2;

        if (d2 < TRAVEL_EPSILON) {
            const span = Math.log(to.diameter / from.diameter) / ZOOM_RHO;

            return (progress: number): CirclePackingView => ({
                x: from.x + progress * dx,
                y: from.y + progress * dy,
                diameter: from.diameter * Math.exp(ZOOM_RHO * progress * span),
            });
        }

        const distance = Math.sqrt(d2);
        const w0 = from.diameter;
        const w1 = to.diameter;
        const b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (DOUBLE * w0 * rho2 * distance);
        const b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (DOUBLE * w1 * rho2 * distance);
        const r0 = Math.log(Math.sqrt(b0 * b0 + SINGLE) - b0);
        const r1 = Math.log(Math.sqrt(b1 * b1 + SINGLE) - b1);
        const span = (r1 - r0) / ZOOM_RHO;

        return (progress: number): CirclePackingView => {
            const s = progress * span;
            const u = (w0 / (rho2 * distance)) * (Math.cosh(r0) * Math.tanh(ZOOM_RHO * s + r0) - Math.sinh(r0));

            return {
                x: from.x + u * dx,
                y: from.y + u * dy,
                diameter: (w0 * Math.cosh(r0)) / Math.cosh(ZOOM_RHO * s + r0),
            };
        };
    };

    /**
     * Where a circle is drawn while a view is showing.
     *
     * @param circle The circle, as {@link computeLayout} placed it.
     * @param view What is in view: a center and the diameter that has to fit across the drawing.
     * @param side The width of the drawing, in pixels.
     * @returns The circle relative to the drawing's center, scaled so the view's diameter fills the drawing.
     */
    export const project = (
        circle: CirclePackingCircle,
        view: CirclePackingView,
        side: number,
    ): CirclePackingCircle => {
        const scale = view.diameter > NOTHING ? side / view.diameter : NOTHING;

        return {
            x: (circle.x - view.x) * scale,
            y: (circle.y - view.y) * scale,
            radius: circle.radius * scale,
        };
    };
}
