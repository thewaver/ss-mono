import { type GradientRippleSampleOpts, type TrackedGradientElementDefs } from "@thewaver/ss-components";
import type { TrackedGradientConfig } from "../../SVGDefsSvelte.types.js";
type SpotRipplesProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    opts?: GradientRippleSampleOpts;
};
export declare const spot_ripple_1: (opts?: GradientRippleSampleOpts) => TrackedGradientConfig;
declare const SpotRipple1: import("svelte").Component<SpotRipplesProps, {}, "">;
type SpotRipple1 = ReturnType<typeof SpotRipple1>;
export default SpotRipple1;
