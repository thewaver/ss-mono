import { type GradientSpotTrailOpts, type TrackedGradientElementDefs } from "@thewaver/ss-components";
import type { TrackedGradientConfig } from "../../SVGDefsSvelte.types.js";
type SpotTrailProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    opts?: GradientSpotTrailOpts;
};
export declare const spot_trail_3: (opts?: GradientSpotTrailOpts) => TrackedGradientConfig;
declare const SpotTrail3: import("svelte").Component<SpotTrailProps, {}, "">;
type SpotTrail3 = ReturnType<typeof SpotTrail3>;
export default SpotTrail3;
