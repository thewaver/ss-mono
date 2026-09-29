import type { Snippet } from "svelte";
import type { GlassSurfaceProps } from "./GlassSurface.types.js";
type $$ComponentProps = GlassSurfaceProps & {
    children?: Snippet;
};
declare const GlassSurface: import("svelte").Component<$$ComponentProps, {}, "">;
type GlassSurface = ReturnType<typeof GlassSurface>;
export default GlassSurface;
