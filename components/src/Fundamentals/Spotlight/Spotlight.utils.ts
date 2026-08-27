import type { Rect } from "@thewaver/ss-utils";

export namespace SpotlightUtils {
    export const getHoleClipPath = (rect: Rect) => {
        const right = rect.x + rect.width;
        const bottom = rect.y + rect.height;
        const outer = "0 0, 0 100%, 100% 100%, 100% 0, 0 0";
        const inner = [
            `${rect.x}px ${rect.y}px`,
            `${right}px ${rect.y}px`,
            `${right}px ${bottom}px`,
            `${rect.x}px ${bottom}px`,
            `${rect.x}px ${rect.y}px`,
        ].join(", ");

        return `polygon(evenodd, ${outer}, ${inner}, 0 0)`;
    };
}
