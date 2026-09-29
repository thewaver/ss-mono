import { type GradientRippleSampleOpts, type TrackedGradientElementDefs } from "@thewaver/ss-components";
import type { TrackedGradientConfig } from "../../SVGDefsSvelte.types.js";
type SpotRipplesProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    opts?: GradientRippleSampleOpts;
};
export declare const spot_ripple_2: (opts?: GradientRippleSampleOpts) => TrackedGradientConfig;
declare const SpotRipple2: import("svelte").Component<SpotRipplesProps, {}, "">;
type SpotRipple2 = ReturnType<typeof SpotRipple2>;
export default SpotRipple2;
