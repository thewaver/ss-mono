import { type GradientBandOpts } from "@thewaver/ss-components";
import type { TrackedGradientConfig } from "../../SVGDefsSvelte.types.js";
type BandAxis = "x" | "y";
type BandGradientProps = {
    id: string;
    element: HTMLElement | undefined;
    color: string;
    axis: BandAxis;
    opts?: GradientBandOpts;
};
export declare const band_1v1: (opts?: GradientBandOpts) => TrackedGradientConfig;
declare const Band1v1: import("svelte").Component<BandGradientProps, {}, "">;
type Band1v1 = ReturnType<typeof Band1v1>;
export default Band1v1;
