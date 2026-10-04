import { TrackedGradientDefaults } from "@thewaver/ss-components";

import { createPixelTrailSample } from "./pixel_trail.svelte";

export const pixel_trail_3 = createPixelTrailSample(
    ["primary", "secondary", "tertiary"],
    TrackedGradientDefaults.PIXEL_TRAIL_CYCLING_DEFAULTS,
);
