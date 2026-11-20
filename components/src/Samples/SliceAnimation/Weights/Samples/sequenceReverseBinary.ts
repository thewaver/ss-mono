import { Index2dUtils, MathUtils } from "@thewaver/ss-utils";

import type { WeightFn } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.types";
import { SliceAnimationWeightUtils } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.utils";

let orderedTotal = 0;
let orderedPlaces: number[] = [];

const getOrderedPlaces = (total: number) => {
    if (total === orderedTotal) return orderedPlaces;

    const bits = Math.ceil(Math.log2(total));
    const places = new Array<number>(total);

    let turn = 0;

    for (let step = 0; step < 2 ** bits; step++) {
        const place = MathUtils.reverseBits(step, bits);

        if (place < total) places[place] = turn++;
    }

    orderedTotal = total;
    orderedPlaces = places;

    return places;
};

export const sequenceReverseBinary: WeightFn = (pos, count) => {
    const total = count.colCount * count.rowCount;

    if (total <= 1) return 1;

    return SliceAnimationWeightUtils.fromOrderedIndex(
        getOrderedPlaces(total)[Index2dUtils.toFlatIndex(pos, count.colCount)],
        total,
    );
};
