import { type GradientFlareOpts, type SVGDefsColors, type TrackedGradientElementDefs } from "@thewaver/ss-components";
import type { TrackedGradientConfig } from "../../SVGDefsSvelte.types.js";
type FlareGhost = {
    reach: number;
    scale: number;
    alpha: number;
    colorKey: keyof SVGDefsColors;
    isRing?: boolean;
};
type FlarePartProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    ghost?: FlareGhost;
    opts?: GradientFlareOpts;
};
export declare const spot_flare_2: (opts?: GradientFlareOpts) => TrackedGradientConfig;
declare const SpotFlare2: import("svelte").Component<FlarePartProps, {}, "">;
type SpotFlare2 = ReturnType<typeof SpotFlare2>;
export default SpotFlare2;
