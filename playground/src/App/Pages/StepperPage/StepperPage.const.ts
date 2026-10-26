import { type ArcDefs, PlacementLayoutUtils } from "@thewaver/ss-components";

import type { PageStepState } from "../../StyledComponents/StepContent/StepContent.types";
import type { StepValue } from "./StepperSteps.types";

export const STATE_WORDS: Record<PageStepState, string> = {
    done: "completed",
    current: "current step",
    failed: "needs attention",
    skipped: "skipped",
    ahead: "not started",
};

export const STARTING_LINEAR: StepValue = "address";

export const STARTING_FAILED: StepValue = "payment";

export const STARTING_DETAILED: StepValue = "payment";

export const FAILED_OVERRIDES: Partial<Record<StepValue, PageStepState>> = { address: "failed", details: "skipped" };

export const DOCS_ROOT = "/src/App/Pages/StepperPage/Docs";

export const ARC_DEFS: ArcDefs = {
    ovalHeightRatio: 1,
    facingDegrees: 0,
    spreadDegrees: 90,
    itemWidthRatio: 0.3,
    itemHeightRatio: 0.1,
};

export const ARC_WIDTH = "400px";

export const ARC_LAYOUT = PlacementLayoutUtils.createArc(ARC_DEFS);
