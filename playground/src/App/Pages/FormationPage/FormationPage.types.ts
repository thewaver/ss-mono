import type { AccessorProps, PlacementLayouts } from "@thewaver/ss-components";
import type { ShapeConst } from "@thewaver/ss-utils";

export type FormationExampleProps = AccessorProps<{
    items: string[];
    isStackedInReverse: boolean;
    layoutKey: PlacementLayouts.SampleKey;
    shapeKind: ShapeConst.DefaultShape;
}>;
