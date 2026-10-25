import type { PlacementLayoutDefs, PlacementLayoutFn, PlacementRect } from "@thewaver/ss-components";
import { AngleUtils } from "@thewaver/ss-utils";

import { RADIAL_DEFS } from "./TreePage.const";
import type { RadialSpan } from "./TreePage.types";

const CENTER = 0.5;
const HALF = 0.5;
const UPWARD_DEGREES = -90;
const CENTERD_ROOT_COUNT = 1;

const toRadialSpans = (itemCount: number, itemParents: (number | undefined)[], spreadDegrees: number) => {
    const byParent = new Map<number | undefined, number[]>();

    for (let index = 0; index < itemCount; index++) {
        const parent = itemParents[index];
        const siblings = byParent.get(parent) ?? [];

        siblings.push(index);
        byParent.set(parent, siblings);
    }

    const spans: RadialSpan[] = Array.from({ length: itemCount }, () => ({ from: 0, to: 0, depth: 0 }));

    const assign = (parent: number | undefined, from: number, to: number, depth: number) => {
        const siblings = byParent.get(parent) ?? [];
        const step = (to - from) / Math.max(siblings.length, 1);

        siblings.forEach((child, order) => {
            const childFrom = from + step * order;

            spans[child] = { from: childFrom, to: childFrom + step, depth };
            assign(child, childFrom, childFrom + step, depth + 1);
        });
    };

    assign(undefined, UPWARD_DEGREES, UPWARD_DEGREES + spreadDegrees, 0);

    return { spans, rootCount: (byParent.get(undefined) ?? []).length };
};

export namespace TreePageUtils {
    export const radialLayout: PlacementLayoutFn = ({ itemCount, itemParents = [] }: PlacementLayoutDefs) => {
        const { spans, rootCount } = toRadialSpans(itemCount, itemParents, RADIAL_DEFS.spreadDegrees);
        const radiusAt = (depth: number) =>
            depth === 0 && rootCount === CENTERD_ROOT_COUNT ? 0 : RADIAL_DEFS.innerRadius + RADIAL_DEFS.ringGap * depth;
        const deepest = spans.reduce((lowest, span) => Math.max(lowest, span.depth), 0);
        const width = (radiusAt(deepest) + RADIAL_DEFS.itemWidth * HALF) * 2;

        const placements = spans.map<PlacementRect>((span) => {
            const radians = AngleUtils.toRadians((span.from + span.to) * HALF);
            const radius = radiusAt(span.depth);

            return {
                leftShare: CENTER + (Math.cos(radians) * radius) / width,
                topShare: CENTER + (Math.sin(radians) * radius) / width,
                widthShare: RADIAL_DEFS.itemWidth / width,
                heightShare: RADIAL_DEFS.itemHeight / width,
            };
        });

        return { placements, heightRatio: 1, pickRule: "nearest", origin: { x: CENTER, y: CENTER } };
    };
}
