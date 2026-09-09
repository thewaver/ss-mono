import type { AccessorProps, FittedLayouts } from "@thewaver/ss-components";
import type { ShapeConst } from "@thewaver/ss-utils";

export type FormationExampleProps = AccessorProps<{
    items: string[];
    isStackedInReverse: boolean;
    layoutKey: FittedLayouts.SampleKey;
    shapeKind: ShapeConst.DefaultShape;
}>;
