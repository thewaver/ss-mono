import { type GradientHandOpts, type TrackedGradientElementDefs } from "@thewaver/ss-components";
import type { TrackedGradientConfig } from "../../SVGDefsSvelte.types.js";
type HandPartProps = {
    part: "gradient" | "clip";
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    opts?: GradientHandOpts;
};
export declare const hand_1: (opts?: GradientHandOpts) => TrackedGradientConfig;
declare const Hand1: import("svelte").Component<HandPartProps, {}, "">;
type Hand1 = ReturnType<typeof Hand1>;
export default Hand1;
