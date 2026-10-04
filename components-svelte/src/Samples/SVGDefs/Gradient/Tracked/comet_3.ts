import { TrackedGradientDefaults } from "@thewaver/ss-components";

import { createCometSample } from "./comet.svelte";

export const comet_3 = createCometSample(
    ["primary", "secondary", "tertiary"],
    TrackedGradientDefaults.COMET_CYCLING_DEFAULTS,
);
