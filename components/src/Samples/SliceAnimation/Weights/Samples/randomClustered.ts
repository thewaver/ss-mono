import { MathUtils, RandomUtils } from "@thewaver/ss-utils";

import type { WeightFn } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.types";
import { SliceAnimationWeightUtils } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.utils";

const CLUSTER_SIZE = 4;

const fade = (ratio: number) => ratio * ratio * (3 - 2 * ratio);

export const randomClustered: WeightFn = (pos) => {
    const seed = SliceAnimationWeightUtils.getRandomSeed();
    const cluster = { col: pos.col / CLUSTER_SIZE, row: pos.row / CLUSTER_SIZE };
    const corner = { col: Math.floor(cluster.col), row: Math.floor(cluster.row) };
    const withinX = fade(cluster.col - corner.col);
    const withinY = fade(cluster.row - corner.row);
    const topLeft = RandomUtils.hash(corner.col, corner.row, seed);
    const topRight = RandomUtils.hash(corner.col + 1, corner.row, seed);
    const bottomLeft = RandomUtils.hash(corner.col, corner.row + 1, seed);
    const bottomRight = RandomUtils.hash(corner.col + 1, corner.row + 1, seed);

    return MathUtils.lerp(
        MathUtils.lerp(topLeft, topRight, withinX),
        MathUtils.lerp(bottomLeft, bottomRight, withinX),
        withinY,
    );
};
