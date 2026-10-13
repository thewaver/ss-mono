import type { PlacementLayoutEntry, ProximityEffectEntry } from "@thewaver/ss-components";
import type { ShapeConst } from "@thewaver/ss-utils";

export type BaseFormationExampleValues = {
    items: string[];
    isStackedInReverse: boolean;
    layoutEntry: PlacementLayoutEntry;
    effectEntry: ProximityEffectEntry | undefined;
    shapeKind: ShapeConst.DefaultShape;
    transitionDurationMs: number;
    transitionDelayMs: number;
};

export type BaseFormationExampleProps = BaseFormationExampleValues;
