import { type GradientSpotOpts, type TrackedGradientElementDefs } from "@thewaver/ss-components";
import type { TrackedGradientConfig } from "../../SVGDefsSvelte.types.js";
type SpotGradientProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    opts?: GradientSpotOpts;
};
export declare const spot_1: (opts?: GradientSpotOpts) => TrackedGradientConfig;
declare const Spot1: import("svelte").Component<SpotGradientProps, {}, "">;
type Spot1 = ReturnType<typeof Spot1>;
export default Spot1;
