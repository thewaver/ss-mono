import { type GradientSmearSampleOpts, type TrackedGradientElementDefs } from "@thewaver/ss-components";
import type { TrackedGradientConfig } from "../../SVGDefsSvelte.types.js";
type SpotSmearProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    opts?: GradientSmearSampleOpts;
};
export declare const spot_smear_2: (opts?: GradientSmearSampleOpts) => TrackedGradientConfig;
declare const SpotSmear2: import("svelte").Component<SpotSmearProps, {}, "">;
type SpotSmear2 = ReturnType<typeof SpotSmear2>;
export default SpotSmear2;
