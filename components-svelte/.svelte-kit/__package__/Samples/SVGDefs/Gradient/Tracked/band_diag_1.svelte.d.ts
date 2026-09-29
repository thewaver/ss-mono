import { type GradientBandOpts, type TrackedGradientElementDefs } from "@thewaver/ss-components";
import type { TrackedGradientConfig } from "../../SVGDefsSvelte.types.js";
type DiagonalBandGradientProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    opts?: GradientBandOpts;
};
export declare const band_diag_1: (opts?: GradientBandOpts) => TrackedGradientConfig;
declare const BandDiag1: import("svelte").Component<DiagonalBandGradientProps, {}, "">;
type BandDiag1 = ReturnType<typeof BandDiag1>;
export default BandDiag1;
