import { SVGDefsSampleConfigs } from "@thewaver/ss-components-vue";
import { splitEntriesIntoGroups } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";

export { GROUPPED_TRACKED_PATTERNS } from "@thewaver/ss-playground/App/Pages/SVGPatterns/SVGPatterns.const";

export const GROUPPED_TIMED_PATTERNS = splitEntriesIntoGroups(SVGDefsSampleConfigs.Pattern.Timed.SAMPLE_CONFIGS);
