import type { Snippet } from "svelte";
import type { CornersProps } from "./Corners.types.js";
type $$ComponentProps = CornersProps & {
    children?: Snippet;
};
declare const Corners: import("svelte").Component<$$ComponentProps, {}, "">;
type Corners = ReturnType<typeof Corners>;
export default Corners;
