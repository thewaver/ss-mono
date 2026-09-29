import type { AccessorProps, FormationItemState } from "@thewaver/ss-components-solid";
import type { ShapeConst } from "@thewaver/ss-utils";

export type PageFormationItemProps = AccessorProps<{
    state: FormationItemState;
    shapeKind: ShapeConst.DefaultShape;
}>;
