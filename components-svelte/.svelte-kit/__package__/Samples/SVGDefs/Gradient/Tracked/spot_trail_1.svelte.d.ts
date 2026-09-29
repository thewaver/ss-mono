import { type GradientSpotTrailOpts, type TrackedGradientElementDefs } from "@thewaver/ss-components";
import type { TrackedGradientConfig } from "../../SVGDefsSvelte.types.js";
type SpotTrailProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    opts?: GradientSpotTrailOpts;
};
export declare const spot_trail_1: (opts?: GradientSpotTrailOpts) => TrackedGradientConfig;
declare const SpotTrail1: import("svelte").Component<SpotTrailProps, {}, "">;
type SpotTrail1 = ReturnType<typeof SpotTrail1>;
export default SpotTrail1;
