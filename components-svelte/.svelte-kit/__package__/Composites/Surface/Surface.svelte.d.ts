import type { Snippet } from "svelte";
import type { SurfaceProps } from "./Surface.types.js";
type $$ComponentProps = SurfaceProps & {
    children?: Snippet;
};
declare const Surface: import("svelte").Component<$$ComponentProps, {}, "">;
type Surface = ReturnType<typeof Surface>;
export default Surface;
