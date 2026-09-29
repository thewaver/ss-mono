import { type GradientSpotTrailOpts, type TrackedGradientElementDefs } from "@thewaver/ss-components";
import type { TrackedGradientConfig } from "../../SVGDefsSvelte.types.js";
type SpotTrailProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    opts?: GradientSpotTrailOpts;
};
export declare const spot_trail_2: (opts?: GradientSpotTrailOpts) => TrackedGradientConfig;
declare const SpotTrail2: import("svelte").Component<SpotTrailProps, {}, "">;
type SpotTrail2 = ReturnType<typeof SpotTrail2>;
export default SpotTrail2;
