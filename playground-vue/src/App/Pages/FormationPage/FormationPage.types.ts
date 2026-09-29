import type { PlacementLayoutEntry, ProximityEffectEntry } from "@thewaver/ss-components-vue";
import type { ShapeConst } from "@thewaver/ss-utils";

export type FormationExampleProps = {
    items: string[];
    isStackedInReverse: boolean;
    layoutEntry: PlacementLayoutEntry;
    effectEntry: ProximityEffectEntry | undefined;
    shapeKind: ShapeConst.DefaultShape;
    transitionDurationMs: number;
    staggerMs: number;
};
