import { type GradientHandTrailOpts, type TrackedGradientElementDefs } from "@thewaver/ss-components";
import type { TrackedGradientConfig } from "../../SVGDefsSvelte.types.js";
type HandTrailProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    opts?: GradientHandTrailOpts;
};
export declare const hand_trail_2: (opts?: GradientHandTrailOpts) => TrackedGradientConfig;
declare const HandTrail2: import("svelte").Component<HandTrailProps, {}, "">;
type HandTrail2 = ReturnType<typeof HandTrail2>;
export default HandTrail2;
