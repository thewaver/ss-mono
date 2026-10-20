import { RandomUtils } from "./random.js";

const TOUCH_EPSILON = 1e-6;
const ENCLOSE_EPSILON = 1e-9;
const FLAT_EPSILON = 1e-6;
const TRAVEL_EPSILON = 1e-12;
const ZOOM_RHO = Math.SQRT2;

/** A circle, by its center and how far it reaches from it. */
export type Circle = { x: number; y: number; radius: number };

type ChainLink = { circle: Circle; next: ChainLink; previous: ChainLink };

const encloseTwo = (a: Circle, b: Circle): Circle => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dr = b.radius - a.radius;
    const length = Math.sqrt(dx * dx + dy * dy);

    return {
        x: (a.x + b.x + (dx / length) * dr) * 0.5,
        y: (a.y + b.y + (dy / length) * dr) * 0.5,
        radius: (length + a.radius + b.radius) * 0.5,
    };
};

const encloseThree = (a: Circle, b: Circle, c: Circle): Circle => {
    const a2 = a.x - b.x;
    const a3 = a.x - c.x;
    const b2 = a.y - b.y;
    const b3 = a.y - c.y;
    const c2 = b.radius - a.radius;
    const c3 = c.radius - a.radius;
    const d1 = a.x * a.x + a.y * a.y - a.radius * a.radius;
    const d2 = d1 - b.x * b.x - b.y * b.y + b.radius * b.radius;
    const d3 = d1 - c.x * c.x - c.y * c.y + c.radius * c.radius;
    const ab = a3 * b2 - a2 * b3;
    const xa = (b2 * d3 - b3 * d2) / (ab * 2) - a.x;
    const xb = (b3 * c2 - b2 * c3) / ab;
    const ya = (a3 * d2 - a2 * d3) / (ab * 2) - a.y;
    const yb = (a2 * c3 - a3 * c2) / ab;
    const quadA = xb * xb + yb * yb - 1;
    const quadB = 2 * (a.radius + xa * xb + ya * yb);
    const quadC = xa * xa + ya * ya - a.radius * a.radius;
    const radius = -(Math.abs(quadA) > FLAT_EPSILON
        ? (quadB + Math.sqrt(quadB * quadB - 4 * quadA * quadC)) / (2 * quadA)
        : quadC / quadB);

    return { x: a.x + xa + xb * radius, y: a.y + ya + yb * radius, radius };
};

const getEnclosesNot = (a: Circle, b: Circle) => {
    const dr = a.radius - b.radius;
    const dx = b.x - a.x;
    const dy = b.y - a.y;

    return dr < 0 || dr * dr < dx * dx + dy * dy;
};

const getEnclosesWeak = (a: Circle, b: Circle) => {
    const dr = a.radius - b.radius + Math.max(a.radius, b.radius, 1) * ENCLOSE_EPSILON;
    const dx = b.x - a.x;
    const dy = b.y - a.y;

    return dr > 0 && dr * dr > dx * dx + dy * dy;
};

const getEnclosesWeakAll = (a: Circle, basis: Circle[]) => basis.every((b) => getEnclosesWeak(a, b));

const encloseBasis = (basis: Circle[]): Circle =>
    basis.length === 1
        ? { ...basis[0] }
        : basis.length === 2
          ? encloseTwo(basis[0], basis[1])
          : encloseThree(basis[0], basis[1], basis[2]);

const extendBasis = (basis: Circle[], p: Circle): Circle[] => {
    if (getEnclosesWeakAll(p, basis)) return [p];

    for (const b of basis) {
        if (getEnclosesNot(p, b) && getEnclosesWeakAll(encloseTwo(b, p), basis)) return [b, p];
    }

    for (let i = 0; i < basis.length - 1; i++) {
        for (let j = i + 1; j < basis.length; j++) {
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

const encloseAll = (circles: readonly Circle[]): Circle => {
    const order = RandomUtils.shuffle(circles, RandomUtils.createSeeded());

    let basis: Circle[] = [];
    let enclosing: Circle | undefined;
    let index = 0;

    while (index < order.length) {
        const circle = order[index];

        if (enclosing && getEnclosesWeak(enclosing, circle)) {
            index++;
        } else {
            basis = extendBasis(basis, circle);
            enclosing = encloseBasis(basis);
            index = 0;
        }
    }

    return enclosing ?? { x: 0, y: 0, radius: 0 };
};

const place = (b: Circle, a: Circle, c: Circle) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const d2 = dx * dx + dy * dy;

    if (!d2) {
        c.x = a.x + c.radius;
        c.y = a.y;

        return;
    }

    const a2 = (a.radius + c.radius) ** 2;
    const b2 = (b.radius + c.radius) ** 2;

    if (a2 > b2) {
        const x = (d2 + b2 - a2) / (2 * d2);
        const y = Math.sqrt(Math.max(0, b2 / d2 - x * x));

        c.x = b.x - x * dx - y * dy;
        c.y = b.y - x * dy + y * dx;
    } else {
        const x = (d2 + a2 - b2) / (2 * d2);
        const y = Math.sqrt(Math.max(0, a2 / d2 - x * x));

        c.x = a.x + x * dx - y * dy;
        c.y = a.y + x * dy + y * dx;
    }
};

const getIntersects = (a: Circle, b: Circle) => {
    const dr = a.radius + b.radius - TOUCH_EPSILON;
    const dx = b.x - a.x;
    const dy = b.y - a.y;

    return dr > 0 && dr * dr > dx * dx + dy * dy;
};

const score = (entry: ChainLink) => {
    const a = entry.circle;
    const b = entry.next.circle;
    const ab = a.radius + b.radius;
    const dx = (a.x * b.radius + b.x * a.radius) / ab;
    const dy = (a.y * b.radius + b.y * a.radius) / ab;

    return dx * dx + dy * dy;
};

const link = (circle: Circle) => {
    const created = { circle } as ChainLink;

    created.next = created;
    created.previous = created;

    return created;
};

const packInPlace = (circles: Circle[]) => {
    const count = circles.length;

    if (!count) return 0;

    const first = circles[0];

    first.x = 0;
    first.y = 0;

    if (count === 1) return first.radius;

    const second = circles[1];

    first.x = -second.radius;
    second.x = first.radius;
    second.y = 0;

    if (count === 2) return first.radius + second.radius;

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
        let sj = b.circle.radius;
        let sk = a.circle.radius;

        do {
            if (sj <= sk) {
                if (getIntersects(j.circle, c.circle)) {
                    b = j;
                    a.next = b;
                    b.previous = a;
                    index--;

                    continue pack;
                }

                sj += j.circle.radius;
                j = j.next;
            } else {
                if (getIntersects(k.circle, c.circle)) {
                    a = k;
                    a.next = b;
                    b.previous = a;
                    index--;

                    continue pack;
                }

                sk += k.circle.radius;
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

    const enclosing = encloseAll(chain);

    circles.forEach((circle) => {
        circle.x -= enclosing.x;
        circle.y -= enclosing.y;
    });

    return enclosing.radius;
};

/** Enclosing, packing and zooming between {@link Circle} values. */
export namespace CircleUtils {
    /**
     * Finds the smallest circle that contains every circle given.
     *
     * The answer is the same whatever order the circles come in.
     *
     * @param circles The circles to enclose. The list is not changed.
     * @returns The enclosing circle, or one of no size at the origin when there is nothing to enclose.
     */
    export const enclose = (circles: readonly Circle[]): Circle => encloseAll(circles);

    /**
     * Lays circles of given sizes against each other as tightly as they will go, the way D3's `packSiblings`
     * does.
     *
     * Each circle is set against two already placed, at the spot that keeps the group closest to round, so the
     * result is the same every time for the same sizes in the same order.
     *
     * @param radii The circles' radii, largest first for the tightest result.
     * @returns Where each circle sits, in the same order, with the smallest circle around them all centered on
     * the origin, and that circle's radius. No two circles overlap.
     */
    export const pack = (radii: readonly number[]) => {
        const circles = radii.map((radius) => ({ x: 0, y: 0, radius }));
        const radius = packInPlace(circles);

        return { circles, radius };
    };

    /**
     * Plans a move between two views that pulls out, travels and comes back in, rather than sliding flat.
     *
     * A view is a circle that has to fit across a window. The path is van Wijk and Nuij's smooth zoom, as D3's
     * `interpolateZoom` draws it: when the two views are far apart the path widens first, so the journey is seen
     * from above, and the speed seems even all the way.
     *
     * @param from The view to start from.
     * @param to The view to end on.
     * @returns A function from progress, `0` to `1`, to the view at that point.
     */
    export const interpolateZoom = (from: Circle, to: Circle) => {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const d2 = dx * dx + dy * dy;
        const rho2 = ZOOM_RHO * ZOOM_RHO;
        const rho4 = rho2 * rho2;
        const w0 = from.radius * 2;
        const w1 = to.radius * 2;

        if (d2 < TRAVEL_EPSILON) {
            const span = Math.log(w1 / w0) / ZOOM_RHO;

            return (progress: number): Circle => ({
                x: from.x + progress * dx,
                y: from.y + progress * dy,
                radius: from.radius * Math.exp(ZOOM_RHO * progress * span),
            });
        }

        const distance = Math.sqrt(d2);
        const b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * distance);
        const b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * distance);
        const r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0);
        const r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
        const span = (r1 - r0) / ZOOM_RHO;

        return (progress: number): Circle => {
            const s = progress * span;
            const u = (w0 / (rho2 * distance)) * (Math.cosh(r0) * Math.tanh(ZOOM_RHO * s + r0) - Math.sinh(r0));

            return {
                x: from.x + u * dx,
                y: from.y + u * dy,
                radius: (w0 * Math.cosh(r0)) / Math.cosh(ZOOM_RHO * s + r0) / 2,
            };
        };
    };
}
