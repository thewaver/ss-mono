import type { SortableDir } from "./Sortable.types";

export namespace SortableUtils {
    export const computeDropIndex = (rects: DOMRect[], x: number, y: number, dir: SortableDir): number => {
        for (let index = 0; index < rects.length; index++) {
            const rect = rects[index];
            const middle = dir === "row" ? rect.left + rect.width / 2 : rect.top + rect.height / 2;

            if ((dir === "row" ? x : y) < middle) return index;
        }

        return rects.length;
    };

    export const computeSettledIndex = (dropIndex: number, fromIndex: number, isSameZone: boolean) =>
        isSameZone && dropIndex > fromIndex ? dropIndex - 1 : dropIndex;

    export const computeMarkerIndex = (settledIndex: number, fromIndex: number, isSameZone: boolean) =>
        isSameZone && settledIndex >= fromIndex ? settledIndex + 1 : settledIndex;
}
