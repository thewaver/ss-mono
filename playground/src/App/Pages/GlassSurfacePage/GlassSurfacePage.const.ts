import { SVGDefsSamples } from "@thewaver/ss-components";

import {
    splitEntriesIntoGroups,
    toGroupEntriesWithNoSample,
} from "../../PageComponents/SampleGroups/SampleGroups.const";

export const EXAMPLE_NAMES = {
    default: "Default",
};

export const GROUPPED_GRADIENTS = splitEntriesIntoGroups(SVGDefsSamples.Gradient.Tracked.SAMPLE_ENTRIES);

export const STROKE_GROUPS = toGroupEntriesWithNoSample(GROUPPED_GRADIENTS);

export const DEFAULT_EXAMPLE_PATH = "/src/App/Pages/GlassSurfacePage/Examples/Default.tsx";
