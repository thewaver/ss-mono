import { type GradientHandTrailOpts, type TrackedGradientElementDefs } from "@thewaver/ss-components";
import type { TrackedGradientConfig } from "../../SVGDefsSvelte.types.js";
type HandTrailProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    opts?: GradientHandTrailOpts;
};
export declare const hand_trail_1: (opts?: GradientHandTrailOpts) => TrackedGradientConfig;
declare const HandTrail1: import("svelte").Component<HandTrailProps, {}, "">;
type HandTrail1 = ReturnType<typeof HandTrail1>;
export default HandTrail1;
