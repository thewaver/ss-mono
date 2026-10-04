import { MathUtils } from "@thewaver/ss-utils";

export namespace TypewriterPageUtils {
    export const computeMiddleLineShare = (box: HTMLElement | undefined, text: HTMLElement | undefined, bandPx = 0) => {
        if (!box || !text) return 0;

        const boxRect = box.getBoundingClientRect();
        const textRect = text.getBoundingClientRect();
        const scale = box.offsetHeight ? boxRect.height / box.offsetHeight : 1;
        const band = bandPx * scale;
        const middle = boxRect.top + boxRect.height * 0.5;

        return MathUtils.clamp01((middle - textRect.top + band * 0.5) / (textRect.height + band));
    };
}
