import { SVGDefsSamples } from "@thewaver/ss-components-vue";
import { splitEntriesIntoGroups } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";

export const GROUPPED_TIMED_PATTERNS = splitEntriesIntoGroups(SVGDefsSamples.Pattern.Timed.SAMPLE_CONFIGS);

export const GROUPPED_TRACKED_PATTERNS = splitEntriesIntoGroups(SVGDefsSamples.Pattern.Tracked.SAMPLE_ENTRIES);
