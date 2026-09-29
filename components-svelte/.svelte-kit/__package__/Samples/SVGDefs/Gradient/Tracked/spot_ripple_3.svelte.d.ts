import { type GradientRippleSampleOpts, type TrackedGradientElementDefs } from "@thewaver/ss-components";
import type { TrackedGradientConfig } from "../../SVGDefsSvelte.types.js";
type SpotRipplesProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    opts?: GradientRippleSampleOpts;
};
export declare const spot_ripple_3: (opts?: GradientRippleSampleOpts) => TrackedGradientConfig;
declare const SpotRipple3: import("svelte").Component<SpotRipplesProps, {}, "">;
type SpotRipple3 = ReturnType<typeof SpotRipple3>;
export default SpotRipple3;
