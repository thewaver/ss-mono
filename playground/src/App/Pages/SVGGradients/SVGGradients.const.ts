import { SVGDefsSamples } from "@thewaver/ss-components";

import { splitEntriesIntoGroups } from "../../PageComponents/SampleGroups/SampleGroups.const";
import type { SVGGradientsPaintKind } from "./SVGGradients.types";

export const GROUPPED_TIMED_GRADIENTS = splitEntriesIntoGroups(SVGDefsSamples.Gradient.Timed.SAMPLE_ENTRIES);

export const GROUPPED_TRACKED_GRADIENTS = splitEntriesIntoGroups(SVGDefsSamples.Gradient.Tracked.SAMPLE_ENTRIES);

export const PAINT_KINDS: SVGGradientsPaintKind[] = ["fill", "stroke"];

export const STROKE_THICKNESS = 16;

export const TRACKED_CELLS = Array.from({ length: 4 }, (_unused, index) => index);

export const MIN_BLUR_WIDTH = 0;
export const MAX_BLUR_WIDTH = 40;
export const BLUR_WIDTH_STEP = 1;
export const MIN_DURATION_MS = 1000;
export const MAX_DURATION_MS = 5000;
export const DURATION_STEP_MS = 100;
