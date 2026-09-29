import { type GradientSmearSampleOpts, type TrackedGradientElementDefs } from "@thewaver/ss-components";
import type { TrackedGradientConfig } from "../../SVGDefsSvelte.types.js";
type SpotSmearProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    opts?: GradientSmearSampleOpts;
};
export declare const spot_smear_1: (opts?: GradientSmearSampleOpts) => TrackedGradientConfig;
declare const SpotSmear1: import("svelte").Component<SpotSmearProps, {}, "">;
type SpotSmear1 = ReturnType<typeof SpotSmear1>;
export default SpotSmear1;
