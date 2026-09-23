import type { AccessorProps, PlacementLayoutEntry, ProximityEffectEntry } from "@thewaver/ss-components";
import type { ShapeConst } from "@thewaver/ss-utils";

export type FormationExampleProps = AccessorProps<{
    items: string[];
    isStackedInReverse: boolean;
    layoutEntry: PlacementLayoutEntry;
    effectEntry: ProximityEffectEntry | undefined;
    shapeKind: ShapeConst.DefaultShape;
    transitionDurationMs: number;
    staggerMs: number;
}>;
