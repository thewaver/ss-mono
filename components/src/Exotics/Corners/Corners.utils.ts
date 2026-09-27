import type { Size2d } from "@thewaver/ss-utils";

const NEAR_GLOW_PX = 8;
const FAR_GLOW_PX = 16;

/**
 * The geometry and styling behind `Corners`' marks: the outline of one corner's arms and the glow the set is lit
 * with. The marks' markup is each framework's.
 */
export namespace CornerUtils {
    /**
     * The outline of one corner's two arms, drawn for the top-left corner and mirrored into the others.
     *
     * @param cornerLength How long the arms are, across and down.
     * @param strokeThickness How thick they are drawn.
     * @returns The `points` of a `polygon` in a box the size of `cornerLength`, running along the outer edges and
     * back along the inner ones.
     */
    export const computeArmPoints = (cornerLength: Size2d, strokeThickness: number) =>
        [
            `0,0`,
            `${cornerLength.width},0`,
            `${cornerLength.width - strokeThickness},${strokeThickness}`,
            `${strokeThickness},${strokeThickness}`,
            `${strokeThickness},${cornerLength.height - strokeThickness}`,
            `0,${cornerLength.height}`,
        ].join(" ");

    /**
     * The glow layer's style: the marks' color, a double drop shadow in the same color, and the transition that
     * lets both follow a change of color.
     *
     * @param color The color the marks are drawn and lit in.
     * @param transitionDurationMs How long a change of color takes.
     * @returns `color`, `filter` and `transition`, whose names read the same in every framework's style object.
     */
    export const computeGlowStyle = (color: string, transitionDurationMs: number) => ({
        color,
        filter: `drop-shadow(0 0 ${NEAR_GLOW_PX}px ${color}) drop-shadow(0 0 ${FAR_GLOW_PX}px ${color})`,
        transition: `color ${transitionDurationMs}ms, filter ${transitionDurationMs}ms`,
    });
}
