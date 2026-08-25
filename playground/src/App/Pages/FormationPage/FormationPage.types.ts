import type { AccessorProps } from "@thewaver/ss-components";
import type { ShapeConst } from "@thewaver/ss-utils";

import type { FormationLayouts } from "../../Samples/FormationLayouts/FormationLayouts.const";

export type FormationExampleProps = AccessorProps<{
    items: string[];
    isStackedInReverse: boolean;
    layoutKey: FormationLayouts.SampleKey;
    shapeKind: ShapeConst.DefaultShape;
}>;
