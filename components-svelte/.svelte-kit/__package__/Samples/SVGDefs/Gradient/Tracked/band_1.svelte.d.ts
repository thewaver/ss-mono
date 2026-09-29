import { type GradientBandOpts, type TrackedGradientElementDefs } from "@thewaver/ss-components";
import type { TrackedGradientConfig } from "../../SVGDefsSvelte.types.js";
type BandGradientProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    opts?: GradientBandOpts;
};
export declare const band_1: (opts?: GradientBandOpts) => TrackedGradientConfig;
declare const Band1: import("svelte").Component<BandGradientProps, {}, "">;
type Band1 = ReturnType<typeof Band1>;
export default Band1;
