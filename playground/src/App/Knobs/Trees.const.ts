import type { TreeFalloff } from "../Pages/TreePage/TreeFalloffs.types";

export namespace TreeKnobs {
    export const FALLOFFS: TreeFalloff[] = ["smooth", "linear", "sharp"];

    export const STARTING_FALLOFF: TreeFalloff = "smooth";
}
