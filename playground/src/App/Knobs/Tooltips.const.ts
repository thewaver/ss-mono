import type { AnchorHPlacement, AnchorVPlacement } from "@thewaver/ss-components";

import type { ArrowBedShape } from "../Pages/TooltipPage/TooltipPage.const";
import type { TooltipArrow, TooltipReveal } from "../StyledComponents/TooltipContent/TooltipContent.const";

export namespace TooltipKnobs {
    export const MIN_OFFSET = -40;
    export const MAX_OFFSET = 40;
    export const OFFSET_STEP = 5;
    export const MIN_DURATION = 0;
    export const MAX_DURATION = 1000;
    export const DURATION_STEP = 50;

    export const STARTING_H_PLACEMENT: AnchorHPlacement = "center";
    export const STARTING_V_PLACEMENT: AnchorVPlacement = "top_out";
    export const STARTING_OFFSET_Y = 10;
    export const STARTING_OFFSET_X = 0;
    export const STARTING_REVEAL: TooltipReveal = "fade";
    export const STARTING_ARROW: TooltipArrow = "none";
    export const MIN_ARROW_SIZE = 1;
    export const MAX_ARROW_SIZE = 40;
    export const ARROW_SIZE_STEP = 1;
    export const STARTING_ARROW_WIDTH = 16;
    export const STARTING_ARROW_LENGTH = 9;
    export const STARTING_ARROW_BED_ARROW: Exclude<TooltipArrow, "none"> = "even";
    export const STARTING_ARROW_BED_SHAPE: ArrowBedShape = "rounded_box";

    export const ARROW_TEXT = {
        label: "Arrow",
        hint: "Which arrow every tooltip here grows.",
        controls: "Picks the template handed to ShapeUtils.attachArrow",
    };

    export const ARROW_WIDTH_PX_TEXT = {
        label: "Arrow width (px)",
        hint: "How wide every arrow is across its base. Past twice the length, a corner arrow's sides lean 45° or more.",
        controls: "Sets the arrow width handed to the template",
    };

    export const ARROW_LENGTH_PX_TEXT = {
        label: "Arrow length (px)",
        hint: "How far every arrow's tip stands off its tooltip.",
        controls: "Sets the arrow length handed to the template",
    };

    export const SHAPE_TEXT = {
        label: "Shape",
        hint: "The contour every tooltip here is cut to, which is what each arrow's base is walked along from where it attaches.",
        controls: "Picks the contour handed to ShapeUtils.attachArrow",
    };

    export const REVEAL_TEXT = {
        label: "Reveal",
        hint: "How the tooltip appears and goes, which is the drawing's own: the tooltip only says whether it is showing and for how long the change takes.",
        controls: "Picks how the example content drawn by TooltipProps.renderContent appears",
    };

    export const ARROW_2_TEXT = {
        label: "Arrow",
        hint: "An arrow grown out of the tooltip's body to point at its anchor. It comes out of the side facing the anchor, or out of the nearest corner when the tooltip sits off a corner, and there is none while the tooltip overlaps its anchor. The offset is what makes room for it.",
        controls: "Picks the arrow on the example content drawn by TooltipProps.renderContent",
    };

    export const ARROW_WIDTH_TEXT = {
        label: "Arrow width (px)",
        hint: "How wide the arrow is across its base. The lightning bolt spans this much from where its base starts to its tip.",
        controls: "Sets the arrow width on the example content drawn by TooltipProps.renderContent",
    };

    export const ARROW_LENGTH_TEXT = {
        label: "Arrow length (px)",
        hint: "How far the arrow's tip stands off the tooltip. Longer than the offset, and the tip reaches over the anchor.",
        controls: "Sets the arrow length on the example content drawn by TooltipProps.renderContent",
    };

    export const H_PLACEMENT_TEXT = {
        label: "Placement across",
        hint: "Where the tooltip sits across its anchor: inside an edge, centered, or outside it altogether.",
        controls: "Sets TooltipProps.placement.x",
    };

    export const V_PLACEMENT_TEXT = {
        label: "Placement down",
        hint: "Where the tooltip sits above or below its anchor: inside an edge, centered, or outside it altogether.",
        controls: "Sets TooltipProps.placement.y",
    };

    export const OFFSET_X_TEXT = {
        label: "Offset across (px)",
        hint: "How far the tooltip is nudged sideways from where the placement put it.",
        controls: "Sets TooltipProps.offset.x",
    };

    export const OFFSET_Y_TEXT = {
        label: "Offset down (px)",
        hint: "How far the tooltip is nudged up or down from where the placement put it.",
        controls: "Sets TooltipProps.offset.y",
    };

    export const TRANSITION_DURATION_MS_TEXT = {
        label: "Reveal (ms)",
        hint: "How long the tooltip takes to appear and to go.",
        controls: "Sets TooltipProps.transitionDurationMs",
    };

    export const FOCUS_SHOW_DELAY_MS_TEXT = {
        label: "Focus delay (ms)",
        hint: "How long a keyboard focus has to rest on the anchor before the tooltip appears.",
        controls: "Sets TooltipProps.focusShowDelayMs",
    };

    export const HOVER_SHOW_DELAY_MS_TEXT = {
        label: "Hover delay (ms)",
        hint: "How long the pointer has to rest on the anchor before the tooltip appears. Leave before then and nothing shows.",
        controls: "Sets TooltipProps.hoverShowDelayMs",
    };
}
