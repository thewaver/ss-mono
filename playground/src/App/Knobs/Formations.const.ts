import type { PlacementLayouts } from "@thewaver/ss-components";
import { ProximityEffects } from "@thewaver/ss-components";
import type { ShapeConst } from "@thewaver/ss-utils";

import { NO_SAMPLE_KEY } from "../PageComponents/SampleGroups/SampleGroups.const";
import type { WithNoSample } from "../PageComponents/SampleGroups/SampleGroups.types";

export namespace FormationKnobs {
    export const EFFECT_KEYS: WithNoSample<ProximityEffects.SampleKey>[] = [
        NO_SAMPLE_KEY,
        ...ProximityEffects.SAMPLE_KEYS,
    ];

    export const MIN_ITEM_COUNT = 1;
    export const MAX_ITEM_COUNT = 12;
    export const ITEM_COUNT_STEP = 1;
    export const MIN_SKIPPED_COUNT = 0;
    export const MIN_DURATION_MS = 0;
    export const MAX_DURATION_MS = 3000;
    export const DURATION_STEP_MS = 100;
    export const MIN_STAGGER_MS = 0;
    export const MAX_STAGGER_MS = 500;
    export const STAGGER_STEP_MS = 10;

    export const STARTING_ITEM_COUNT = 6;
    export const STARTING_LAYOUT_KEY: PlacementLayouts.SampleKey = "cliff";
    export const STARTING_EFFECT_KEY: ProximityEffects.SampleKey = "zoomIn";
    export const STARTING_SHAPE_KIND: ShapeConst.DefaultShape = "lozenge";
    export const STARTING_IS_STACKED_IN_REVERSE = false;
}
