import { type GradientHandTrailOpts, type TrackedGradientElementDefs } from "@thewaver/ss-components";
import type { TrackedGradientConfig } from "../../SVGDefsSvelte.types.js";
type HandTrailProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    opts?: GradientHandTrailOpts;
};
export declare const hand_trail_3: (opts?: GradientHandTrailOpts) => TrackedGradientConfig;
declare const HandTrail3: import("svelte").Component<HandTrailProps, {}, "">;
type HandTrail3 = ReturnType<typeof HandTrail3>;
export default HandTrail3;
