import type { SVGDefsSamples } from "@thewaver/ss-components";
import type { ShapeConst } from "@thewaver/ss-utils";

import type { PaintKind } from "../PageComponents/PaintPicker/PaintKind.types";

export namespace ShapeKnobs {
    export const MIN_EDGE_THICKNESS = 0;
    export const MAX_EDGE_THICKNESS = 80;
    export const EDGE_THICKNESS_STEP = 1;
    export const MIN_JOIN_RADIUS = 0;
    export const MAX_JOIN_RADIUS = 160;
    export const JOIN_RADIUS_STEP = 5;
    export const MIN_LAME_EXPONENT = -5;
    export const MAX_LAME_EXPONENT = 5;
    export const LAME_EXPONENT_STEP = 0.5;
    export const MIN_CELL_SIZE = 10;
    export const MAX_CELL_SIZE = 160;
    export const CELL_SIZE_STEP = 10;
    export const MIN_BLUR_WIDTH = 0;
    export const MAX_BLUR_WIDTH = 40;
    export const BLUR_WIDTH_STEP = 1;
    export const MIN_DURATION_MS = 1000;
    export const MAX_DURATION_MS = 5000;
    export const MIN_STAR_POINTS = 3;
    export const MAX_STAR_POINTS = 16;
    export const STAR_POINTS_STEP = 1;

    export const STARTING_BLUR_WIDTH = 8;
    export const STARTING_DURATION_MS = 2000;
    export const STARTING_CELL_SIZE = 40;
    export const STARTING_HAS_INDIVIDUAL_CORNERS = false;
    export const STARTING_SHOULD_CLIP_CHILDREN = true;
    export const STARTING_SHOULD_PAD_CHILDREN = true;
    export const STARTING_SHAPE_KIND: ShapeConst.DefaultShape = "square";
    export const STARTING_TEXT_WRAP_SHAPE_KIND: ShapeConst.DefaultShape = "lozenge";
    export const STARTING_FROM_CSS_TEXT =
        "background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 30%, transparent 35%) right 10px top 10px / 40px 40px space, linear-gradient(120deg, #e8590c, #5f3dc4); border: 12px solid; border-image: linear-gradient(90deg, #ffd43b, #12b886, #228be6, #f06595) 24 round; border-radius: 80px / 40px; corner-shape: squircle; box-shadow: inset 0 6px 12px 2px rgba(0, 0, 0, 0.5), 0 14px 24px -6px rgba(0, 0, 0, 0.8)";
    export const STARTING_EDGE_THICKNESS = 4;
    export const STARTING_STAR_POINTS = 4;
    export const STARTING_JOIN_RADII: number[] = [40, 40, 40, 40, 40, 40];
    export const STARTING_LAME_EXPONENTS: number[] = [1, 1, 1, 1, 1, 1];
    export const STARTING_STROKE_PAINT_KIND: PaintKind = "timed";
    export const STARTING_FILL_PAINT_KIND: PaintKind = "solid";
    export const STARTING_ITERATION_KEY: SVGDefsSamples.Iteration.SampleKey = "constant";
    export const DURATION_STEP_MS = 100;

    export const SHAPE_KIND_TEXT = {
        label: "Shape",
        hint: "The contour the shape is cut to, which also decides how many corners the corner fields offer.",
        controls: "Picks the example contour sent to ShapeProps.computePoints",
    };

    export const HAS_INDIVIDUAL_CORNERS_TEXT = {
        label: "Individual corner settings",
        hint: "Opens one field per corner instead of one field driving all of them together.",
        controls:
            "Writes the corner fields below into every entry of ShapeProps.joinRadii and ShapeProps.lameExponents at once, or one entry each",
    };

    export const JOINT_RADII_PX_TEXT = {
        label: "Joint Radii (px)",
        hint: "How far each corner is rounded. With individual corners off, the first field drives them all.",
        controls: "Sets ShapeProps.joinRadii",
    };

    export const LAME_EXPONENT_TEXT = {
        label: "Lamé Exponent",
        hint: "How square or how pinched each rounded corner is: 1 is a circular round, higher is squarer, 0 is a straight bevel and below 0 scoops inward.",
        controls: "Sets ShapeProps.lameExponents",
    };

    export const SHOULD_CLIP_CHILDREN_TEXT = {
        label: "Clip children",
        hint: "Cuts whatever is inside the shape to the shape's own contour, instead of letting it spill past.",
        controls: "Decides whether the example's ShapeProps.renderChildren applies the clip path it is handed",
    };

    export const SHOULD_PAD_CHILDREN_TEXT = {
        label: "Pad children",
        hint: "Insets whatever is inside far enough to clear the rounded corners, so text does not run under them.",
        controls: "Decides whether the example's ShapeProps.renderChildren pads its content to the contour",
    };

    export const STAR_POINTS_TEXT = {
        label: "Star points",
        hint: "How many tips the star has. The contour carries twice as many points: one per tip, one per notch between tips.",
        controls: "Sets the number of points of the example star sent to ShapeProps.computePoints",
    };

    export const CELL_SIZE_TEXT = {
        label: "Pattern Cell Size (px)",
        hint: "How large one tile of a pattern is before it repeats.",
        controls:
            "Sets the tile size of the example paints sent to ShapeProps.computeFillDefs and ShapeProps.computeStrokeDefs",
    };

    export const COLORS_TEXT = {
        label: "Colors",
        hint: "The colors the stroke, the fill and the page's own background are painted from.",
        controls:
            "Sets the colors of the example paints sent to ShapeProps.computeFillDefs and ShapeProps.computeStrokeDefs",
    };

    export const STROKE_THICKNESS_PX_TEXT = {
        label: "Stroke Thickness (px)",
        hint: "How thick the stroke is.",
        controls: "Sets the thickness in the example's ShapeProps.strokeGeom",
    };

    export const BLUR_WIDTH_TEXT = {
        label: "Blur (px)",
        hint: "How far the stroke is blurred outward, which is what gives it its glow.",
        controls:
            "Sets the blur of the example paints sent to ShapeProps.computeFillDefs and ShapeProps.computeStrokeDefs",
    };

    export const ANIMATION_DURATION_MS_TEXT = {
        label: "Animation duration (ms)",
        hint: "How long one pass of the stroke or fill animation takes.",
        controls:
            "Sets the duration of the example paints sent to ShapeProps.computeFillDefs and ShapeProps.computeStrokeDefs",
    };

    export const ITERATION_CONFIG_KEY_TEXT = {
        label: "Iteration Pattern",
        hint: "How the animation repeats: once, endlessly, or back and forth.",
        controls:
            "Picks how the example paints repeat, sent to ShapeProps.computeFillDefs and ShapeProps.computeStrokeDefs",
    };
}
