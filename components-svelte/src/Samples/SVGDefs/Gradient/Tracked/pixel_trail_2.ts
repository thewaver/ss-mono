import { TrackedGradientDefaults } from "@thewaver/ss-components";

import { createPixelTrailSample } from "./pixel_trail.svelte";

export const pixel_trail_2 = createPixelTrailSample(
    ["primary", "secondary"],
    TrackedGradientDefaults.PIXEL_TRAIL_CYCLING_DEFAULTS,
);
