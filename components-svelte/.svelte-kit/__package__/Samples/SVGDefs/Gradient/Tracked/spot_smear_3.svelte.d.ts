import { type GradientSmearSampleOpts, type TrackedGradientElementDefs } from "@thewaver/ss-components";
import type { TrackedGradientConfig } from "../../SVGDefsSvelte.types.js";
type SpotSmearProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    opts?: GradientSmearSampleOpts;
};
export declare const spot_smear_3: (opts?: GradientSmearSampleOpts) => TrackedGradientConfig;
declare const SpotSmear3: import("svelte").Component<SpotSmearProps, {}, "">;
type SpotSmear3 = ReturnType<typeof SpotSmear3>;
export default SpotSmear3;
