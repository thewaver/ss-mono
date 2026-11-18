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

export const DOCS_SECTIONS = {
    rightLeft: {
        title: "Right to left",
        content:
            "Inside a box whose text runs right to left, a strip running across starts from the right: the first step sits at the right-hand end and the connectors lead to the left.",
    },
    stepsWithOwnContent: {
        title: "Steps that carry their own content",
        content:
            "Give the stepper [prop]renderBody[/prop] and each step holds a body beside its connector, so the line runs on past the content rather than stopping at it.",
    },
    noConnector: {
        title: "No connector",
        content:
            "The line between steps is optional: leave out [prop]renderConnector[/prop] and nothing is drawn between them, and they sit [prop]gap[/prop] pixels apart.",
    },
    bentAlongArc: {
        title: "Bent along an arc",
        content:
            "Give the stepper [prop]computeLayout[/prop] and each step goes where the layout puts it, here along an arc from PlacementLayoutUtils. The connector is handed where the two steps it joins sit, so the run between them follows the curve rather than cutting across it. A step's body has nowhere to go on a curve, so a stepper with a layout takes no [prop]renderBody[/prop].",
    },
};

export const CHECKOUT_WITHOUT_CONNECTORS_LABEL = "Checkout without connectors";

export const FAILURE_REASON =
    "The card was declined, so this step has to be repeated before the order can be reviewed.";

export const LOCKED_REASON = "Review opens once payment succeeds, so there is nothing to look at here yet.";

export const CHECKOUT_FAILURE_LABEL = "Checkout with a failure";
