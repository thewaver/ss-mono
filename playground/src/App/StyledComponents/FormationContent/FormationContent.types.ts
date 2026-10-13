import type { FormationItemState } from "@thewaver/ss-components";
import type { ShapeConst } from "@thewaver/ss-utils";

export type BasePageFormationItemValues = {
    state: FormationItemState;
    shapeKind: ShapeConst.DefaultShape;
};

export type BasePageFormationItemProps = BasePageFormationItemValues;
