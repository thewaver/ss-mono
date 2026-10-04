import { TrackedGradientDefaults } from "@thewaver/ss-components";

import { createSwarmSample } from "./swarm.svelte";

export const swarm_3 = createSwarmSample(
    ["primary", "secondary", "tertiary"],
    TrackedGradientDefaults.SWARM_CYCLING_DEFAULTS,
);
