import { PERCENT } from "./SplitPanePage.const";

export namespace SplitPanePageUtils {
    export const toPercentText = (ratios: number[]) =>
        ratios.map((ratio) => `${Math.round(ratio * PERCENT)}%`).join(" / ");
}
