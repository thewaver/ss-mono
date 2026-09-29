import { SVGDefsUtils } from "@thewaver/ss-components";
import { SVGGradientDefsSvelteUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSvelte.utils.js";
import { SVGAnimations } from "../../SVGAnimations.const.js";
import { SVGDefsSvelteUtils } from "../../SVGDefsSvelte.utils.svelte.js";
const CYCLE_KEYS = ["primary", "secondary"];
const SMOOTH_REPEATS = 3;
const BANDED_REPEATS = 8;
export const flow_2 = (opts) => ({
    computeSVGDefs: (id, __, ___, defs) => {
        const stopKeys = SVGDefsUtils.getCycleStopKeys(CYCLE_KEYS, opts?.bands ?? (opts?.banded ? BANDED_REPEATS : SMOOTH_REPEATS));
        return [
            {
                gradientOrPattern: {
                    id: `gradient1-${id}`,
                    renderDefsElement: () => SVGGradientDefsSvelteUtils.computeLinearGradient({
                        id: `gradient1-${id}`,
                        colors: stopKeys.map((key) => ({ value: defs.colors[key] })),
                        spreadKind: opts?.banded ? "banded" : undefined,
                        scale: { width: 2, height: 1 },
                        offset: { x: 0.5, y: 0 },
                    }, (x1, y1, x2, y2) => [
                        SVGAnimations.Linear.sweepOrthogonal("x", x1, x2, [0, -1], defs),
                        opts?.cycles &&
                            (opts?.banded
                                ? SVGAnimations.Gradient.cycleBandedColors
                                : SVGAnimations.Gradient.cycleSmoothColors)(`gradient1-${id}`, stopKeys.map((key) => SVGDefsUtils.getCycleWalk(defs.colors, key)), defs),
                    ]),
                },
                filter: opts?.banded ? undefined : SVGDefsSvelteUtils.getBaseBlur(id, defs),
            },
        ];
    },
});
