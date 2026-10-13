import { SVGDefsSamples } from "@thewaver/ss-components";

import { splitEntriesIntoGroups } from "../../PageComponents/SampleGroups/SampleGroups.const";

export const GROUPPED_TIMED_GRADIENTS = splitEntriesIntoGroups(SVGDefsSamples.Gradient.Timed.SAMPLE_ENTRIES);

export const GROUPPED_TRACKED_GRADIENTS = splitEntriesIntoGroups(SVGDefsSamples.Gradient.Tracked.SAMPLE_ENTRIES);

export const STROKE_THICKNESS = 16;

export const TRACKED_CELLS = Array.from({ length: 4 }, (_unused, index) => index);
