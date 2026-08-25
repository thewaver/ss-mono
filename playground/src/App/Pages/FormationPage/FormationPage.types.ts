import type { AccessorProps, FormationLayouts } from "@thewaver/ss-components";
import type { ShapeConst } from "@thewaver/ss-utils";

export type FormationExampleProps = AccessorProps<{
    items: string[];
    isStackedInReverse: boolean;
    layoutKey: FormationLayouts.SampleKey;
    shapeKind: ShapeConst.DefaultShape;
}>;
