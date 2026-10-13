import { toGroupEntriesWithNoSample } from "../../../PageComponents/SampleGroups/SampleGroups.const";
import { GROUPPED_TRACKED_GRADIENTS } from "../SVGGradients.const";

export const EXAMPLE_NAMES = {
    default: "Default",
    continuity: "Continuity",
    shared: "Shared",
    screenOverlay: "A screen overlay",
};

export const EXAMPLES_ROOT = "/src/App/Pages/SVGGradients/TrackedGradientsPage/Examples";

export const TRACKED_GRADIENT_GROUPS = toGroupEntriesWithNoSample(GROUPPED_TRACKED_GRADIENTS);
