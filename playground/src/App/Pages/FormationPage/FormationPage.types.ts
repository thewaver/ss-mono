import type { AccessorProps, PlacementLayoutEntry } from "@thewaver/ss-components";
import type { ShapeConst } from "@thewaver/ss-utils";

export type FormationExampleProps = AccessorProps<{
    items: string[];
    isStackedInReverse: boolean;
    layoutEntry: PlacementLayoutEntry;
    shapeKind: ShapeConst.DefaultShape;
}>;
