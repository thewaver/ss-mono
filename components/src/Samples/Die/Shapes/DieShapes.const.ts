import type { Point3d } from "@thewaver/ss-utils";

import type { DieShape } from "../../../Exotics/Die/Die.types";
import { DieUtils } from "../../../Exotics/Die/Die.utils";

const PHI = (1 + Math.sqrt(5)) * 0.5;
const INVERSE_PHI = 1 / PHI;
const SIGNS = [1, -1];
const KITE_COUNT = 5;
const KITE_TURN = (Math.PI * 2) / KITE_COUNT;
const KITE_HALF_TURN = Math.PI / KITE_COUNT;
const KITE_RING_HEIGHT = (1 - Math.cos(KITE_HALF_TURN)) / (1 + Math.cos(KITE_HALF_TURN));
const SPIRAL_POINT_COUNT = 52;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

const point = (x: number, y: number, z: number): Point3d => ({ x, y, z });

const onUnitSphere = (points: Point3d[]) => {
    const farthest = Math.max(...points.map((p) => Math.hypot(p.x, p.y, p.z)));

    return points.map((p) => point(p.x / farthest, p.y / farthest, p.z / farthest));
};

const everySign = (make: (a: number, b: number) => Point3d) => SIGNS.flatMap((a) => SIGNS.map((b) => make(a, b)));

const everyCorner = SIGNS.flatMap((x) => SIGNS.flatMap((y) => SIGNS.map((z) => point(x, y, z))));

const TETRAHEDRON = [point(1, 1, 1), point(1, -1, -1), point(-1, 1, -1), point(-1, -1, 1)];

const OCTAHEDRON = SIGNS.flatMap((sign) => [point(sign, 0, 0), point(0, sign, 0), point(0, 0, sign)]);

const ICOSAHEDRON = [
    ...everySign((a, b) => point(0, a, b * PHI)),
    ...everySign((a, b) => point(a, b * PHI, 0)),
    ...everySign((a, b) => point(a * PHI, 0, b)),
];

const DODECAHEDRON = [
    ...everyCorner,
    ...everySign((a, b) => point(0, a * INVERSE_PHI, b * PHI)),
    ...everySign((a, b) => point(a * INVERSE_PHI, b * PHI, 0)),
    ...everySign((a, b) => point(a * PHI, 0, b * INVERSE_PHI)),
];

const TRAPEZOHEDRON = [
    point(0, 0, 1),
    point(0, 0, -1),
    ...Array.from({ length: KITE_COUNT }, (_unused, index) =>
        point(Math.cos(index * KITE_TURN), Math.sin(index * KITE_TURN), KITE_RING_HEIGHT),
    ),
    ...Array.from({ length: KITE_COUNT }, (_unused, index) =>
        point(
            Math.cos(index * KITE_TURN + KITE_HALF_TURN),
            Math.sin(index * KITE_TURN + KITE_HALF_TURN),
            -KITE_RING_HEIGHT,
        ),
    ),
];

const SPIRAL = Array.from({ length: SPIRAL_POINT_COUNT }, (_unused, index) => {
    const height = 1 - ((index + 0.5) * 2) / SPIRAL_POINT_COUNT;
    const ring = Math.sqrt(1 - height * height);

    return point(Math.cos(index * GOLDEN_ANGLE) * ring, height, Math.sin(index * GOLDEN_ANGLE) * ring);
});

export namespace DieShapes {
    export const SAMPLE_SHAPES = {
        d4: DieUtils.computeHull(onUnitSphere(TETRAHEDRON)),
        d6: DieUtils.computeHull(onUnitSphere(everyCorner)),
        d8: DieUtils.computeHull(onUnitSphere(OCTAHEDRON)),
        d10: DieUtils.computeHull(onUnitSphere(TRAPEZOHEDRON)),
        d12: DieUtils.computeHull(onUnitSphere(DODECAHEDRON)),
        d20: DieUtils.computeHull(onUnitSphere(ICOSAHEDRON)),
        d100: DieUtils.computeHull(SPIRAL),
    } satisfies Record<string, DieShape>;

    export type SampleKey = keyof typeof SAMPLE_SHAPES;

    export const SAMPLE_KEYS = Object.keys(SAMPLE_SHAPES) as SampleKey[];
}
