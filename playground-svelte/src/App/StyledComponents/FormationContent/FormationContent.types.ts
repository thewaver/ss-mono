import type { FormationItemState } from "@thewaver/ss-components-svelte";
import type { ShapeConst } from "@thewaver/ss-utils";

export type PageFormationItemProps = {
    state: FormationItemState;
    shapeKind: ShapeConst.DefaultShape;
};
