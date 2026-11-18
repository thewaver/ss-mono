import type { AnchorPlacement } from "@thewaver/ss-components";

export const ARROW_BED_PLACEMENTS: AnchorPlacement[] = [
    { x: "left_out", y: "top_out" },
    { x: "center", y: "top_out" },
    { x: "right_out", y: "top_out" },
    { x: "left_out", y: "center" },
    { x: "right_out", y: "center" },
    { x: "left_out", y: "bottom_out" },
    { x: "center", y: "bottom_out" },
    { x: "right_out", y: "bottom_out" },
];

export const ARROW_BED_SHAPES = ["box", "rounded_box", "octagon"] as const;

export type ArrowBedShape = (typeof ARROW_BED_SHAPES)[number];

export const ARROW_BED_ARROWS = ["even", "left", "right"] as const;

export type ArrowBedArrow = (typeof ARROW_BED_ARROWS)[number];

export const ARROW_BED_BOX_SIZE = { width: 120, height: 60 };

export const ARROW_BED_GAP = 40;

export const ARROW_BED_CHAMFER_RATIO = 0.25;

export const DOCS_ROOT = "/src/App/Pages/TooltipPage/Docs";

export const FIELD_WIDTH = 110;

export const CIRCLING_MIN_DEGREES = 0;

export const CIRCLING_MAX_DEGREES = 359;

export const CIRCLING_STEP_DEGREES = 1;

export const STARTING_CIRCLING_DEGREES = 90;

export const CIRCLING_CORE_RATIO = 0.25;

export const CIRCLING_SLIDER_WIDTH = 320;

export const DOCS_SECTIONS = {
    wordRunningText: {
        title: "On a word in running text",
        content:
            "The tooltip is handed the element it describes through [prop]anchorRef[/prop] rather than wrapping it, so anything with a ref can carry one, here a word in the middle of a sentence.",
    },
    moreThanLine: {
        title: "More than a line",
        content:
            "What the tooltip shows is whatever [prop]renderContent[/prop] draws, here a title over a paragraph, and it sits where its [prop]placement[/prop] puts it however tall that makes it. It is still read out as the anchor's description, in one run, so nothing in it can be pressed; a link or a button belongs in a HoverCard.",
    },
    rightLeft: {
        title: "Right to left",
        content:
            "Inside a box whose text runs right to left, the tooltip takes the box's direction although it is drawn outside it, so its lines read from the right. Its [prop]placement[/prop] is used as it stands: one asked to sit on the left still sits on the left.",
    },
    arrowGoingRound: {
        title: "An arrow going round",
        content:
            "An arrow is the drawing's too: [prop]renderContent[/prop] is handed where one should point, and ShapeUtils.attachArrow grows it out of any contour. Move the slider to aim it all the way round: it leaves straight out of the edge it faces, and turns through the diagonal as it rounds a corner.",
    },
    everyArrowOnce: {
        title: "Every arrow at once",
        content:
            "Eight tooltips round one anchor, one on each side and at each corner, every arrow aimed by the rule a live tooltip's is aimed by, AnchorUtils.computeArrowAim. The corners are where a wide arrow goes wrong: past twice its length, its sides lean 45° or more.",
    },
};

export const WHERE_ARROW_SITS_ROUND_LABEL = "Where the arrow sits round the tooltip";

export const KEEP_WAS_RAISED_MASONS_TEXT = "The keep was raised by masons paid in ";
