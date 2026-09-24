import { MathUtils } from "@thewaver/ss-utils";

import type { WeightFn } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.utils";

const CLUSTER_SIZE = 4;

const fade = (ratio: number) => ratio * ratio * (3 - 2 * ratio);

export const randomClustered: WeightFn = (pos) => {
    const seed = CellAnimationWeightUtils.getRandomSeed();
    const cluster = { col: pos.col / CLUSTER_SIZE, row: pos.row / CLUSTER_SIZE };
    const corner = { col: Math.floor(cluster.col), row: Math.floor(cluster.row) };
    const withinX = fade(cluster.col - corner.col);
    const withinY = fade(cluster.row - corner.row);
    const topLeft = CellAnimationWeightUtils.hashToUnit(corner.col, corner.row, seed);
    const topRight = CellAnimationWeightUtils.hashToUnit(corner.col + 1, corner.row, seed);
    const bottomLeft = CellAnimationWeightUtils.hashToUnit(corner.col, corner.row + 1, seed);
    const bottomRight = CellAnimationWeightUtils.hashToUnit(corner.col + 1, corner.row + 1, seed);

    return MathUtils.lerp(
        MathUtils.lerp(topLeft, topRight, withinX),
        MathUtils.lerp(bottomLeft, bottomRight, withinX),
        withinY,
    );
};
