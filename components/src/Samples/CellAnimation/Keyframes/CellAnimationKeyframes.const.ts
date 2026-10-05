import type { Index2d } from "@thewaver/ss-utils";

import type {
    CellAnimationEvaluationDefs,
    CellAnimationEvaluationResult,
} from "../../../Exotics/Animations/CellAnimation/CellAnimation.types";
import type {
    CellAnimationBreakpointTriple,
    CellAnimationEasing,
} from "../../../Generators/CellAnimationBreakpoints/CellAnimationBreakpoints.types";
import type { CellAnimationFn } from "../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.utils";
import { blurDefault } from "./Samples/blurDefault";
import { bounceDefault } from "./Samples/bounceDefault";
import { carouselBottom } from "./Samples/carouselBottom";
import { carouselLeft } from "./Samples/carouselLeft";
import { carouselQuadrant } from "./Samples/carouselQuadrant";
import { carouselQuadrantInverted } from "./Samples/carouselQuadrantInverted";
import { carouselRight } from "./Samples/carouselRight";
import { carouselTop } from "./Samples/carouselTop";
import { cubeBottom } from "./Samples/cubeBottom";
import { cubeLeft } from "./Samples/cubeLeft";
import { cubeQuadrant } from "./Samples/cubeQuadrant";
import { cubeQuadrantInverted } from "./Samples/cubeQuadrantInverted";
import { cubeRight } from "./Samples/cubeRight";
import { cubeTop } from "./Samples/cubeTop";
import { dripDown } from "./Samples/dripDown";
import { dripLeft } from "./Samples/dripLeft";
import { dripQuadrant } from "./Samples/dripQuadrant";
import { dripQuadrantInverted } from "./Samples/dripQuadrantInverted";
import { dripRight } from "./Samples/dripRight";
import { dripUp } from "./Samples/dripUp";
import { elasticDown } from "./Samples/elasticDown";
import { elasticLeft } from "./Samples/elasticLeft";
import { elasticQuadrant } from "./Samples/elasticQuadrant";
import { elasticQuadrantInverted } from "./Samples/elasticQuadrantInverted";
import { elasticRight } from "./Samples/elasticRight";
import { elasticUp } from "./Samples/elasticUp";
import { encircleCcw } from "./Samples/encircleCcw";
import { encircleCheckered } from "./Samples/encircleCheckered";
import { encircleCw } from "./Samples/encircleCw";
import { encircleRings } from "./Samples/encircleRings";
import { fadeInFlash } from "./Samples/fadeInFlash";
import { fadeInFlicker } from "./Samples/fadeInFlicker";
import { fadeInLinear } from "./Samples/fadeInLinear";
import { flipCheckered } from "./Samples/flipCheckered";
import { flipHorizontal } from "./Samples/flipHorizontal";
import { flipRings } from "./Samples/flipRings";
import { flipVertical } from "./Samples/flipVertical";
import { hingeBottom } from "./Samples/hingeBottom";
import { hingeLeft } from "./Samples/hingeLeft";
import { hingeQuadrant } from "./Samples/hingeQuadrant";
import { hingeQuadrantInverted } from "./Samples/hingeQuadrantInverted";
import { hingeRight } from "./Samples/hingeRight";
import { hingeTop } from "./Samples/hingeTop";
import { hopDown } from "./Samples/hopDown";
import { hopLeft } from "./Samples/hopLeft";
import { hopQuadrant } from "./Samples/hopQuadrant";
import { hopQuadrantInverted } from "./Samples/hopQuadrantInverted";
import { hopRight } from "./Samples/hopRight";
import { hopUp } from "./Samples/hopUp";
import { invertFlash } from "./Samples/invertFlash";
import { popBottomLeft } from "./Samples/popBottomLeft";
import { popBottomRight } from "./Samples/popBottomRight";
import { popCenter } from "./Samples/popCenter";
import { popQuadrant } from "./Samples/popQuadrant";
import { popQuadrantInverted } from "./Samples/popQuadrantInverted";
import { popTopLeft } from "./Samples/popTopLeft";
import { popTopRight } from "./Samples/popTopRight";
import { pullCheckered } from "./Samples/pullCheckered";
import { pullDown } from "./Samples/pullDown";
import { pullHorizontal } from "./Samples/pullHorizontal";
import { pullLeft } from "./Samples/pullLeft";
import { pullQuadrant } from "./Samples/pullQuadrant";
import { pullQuadrantInverted } from "./Samples/pullQuadrantInverted";
import { pullRight } from "./Samples/pullRight";
import { pullRings } from "./Samples/pullRings";
import { pullUp } from "./Samples/pullUp";
import { pullVertical } from "./Samples/pullVertical";
import { quadrantScatter } from "./Samples/quadrantScatter";
import { rollDownLeft } from "./Samples/rollDownLeft";
import { rollDownRight } from "./Samples/rollDownRight";
import { rollQuadrant } from "./Samples/rollQuadrant";
import { rollQuadrantInverted } from "./Samples/rollQuadrantInverted";
import { rollUpLeft } from "./Samples/rollUpLeft";
import { rollUpRight } from "./Samples/rollUpRight";
import { shakeDown } from "./Samples/shakeDown";
import { shakeLeft } from "./Samples/shakeLeft";
import { shakeQuadrant } from "./Samples/shakeQuadrant";
import { shakeQuadrantInverted } from "./Samples/shakeQuadrantInverted";
import { shakeRight } from "./Samples/shakeRight";
import { shakeUp } from "./Samples/shakeUp";
import { shootDown } from "./Samples/shootDown";
import { shootLeft } from "./Samples/shootLeft";
import { shootQuadrant } from "./Samples/shootQuadrant";
import { shootQuadrantInverted } from "./Samples/shootQuadrantInverted";
import { shootRight } from "./Samples/shootRight";
import { shootUp } from "./Samples/shootUp";
import { skewCcw } from "./Samples/skewCcw";
import { skewCheckered } from "./Samples/skewCheckered";
import { skewCw } from "./Samples/skewCw";
import { skewRings } from "./Samples/skewRings";
import { spinDownCcw } from "./Samples/spinDownCcw";
import { spinDownCheckered } from "./Samples/spinDownCheckered";
import { spinDownCw } from "./Samples/spinDownCw";
import { spinDownRings } from "./Samples/spinDownRings";
import { spinUpCcw } from "./Samples/spinUpCcw";
import { spinUpCheckered } from "./Samples/spinUpCheckered";
import { spinUpCw } from "./Samples/spinUpCw";
import { spinUpRings } from "./Samples/spinUpRings";
import { swarmCcw } from "./Samples/swarmCcw";
import { swarmCheckered } from "./Samples/swarmCheckered";
import { swarmCw } from "./Samples/swarmCw";
import { swarmRings } from "./Samples/swarmRings";
import { swingBottom } from "./Samples/swingBottom";
import { swingLeft } from "./Samples/swingLeft";
import { swingQuadrant } from "./Samples/swingQuadrant";
import { swingQuadrantInverted } from "./Samples/swingQuadrantInverted";
import { swingRight } from "./Samples/swingRight";
import { swingTop } from "./Samples/swingTop";
import { tumbleDown } from "./Samples/tumbleDown";
import { tumbleLeft } from "./Samples/tumbleLeft";
import { tumbleQuadrant } from "./Samples/tumbleQuadrant";
import { tumbleQuadrantInverted } from "./Samples/tumbleQuadrantInverted";
import { tumbleRight } from "./Samples/tumbleRight";
import { tumbleUp } from "./Samples/tumbleUp";
import { zoomIn } from "./Samples/zoomIn";
import { zoomOut } from "./Samples/zoomOut";

export namespace CellAnimationKeyframes {
    export const ANIMATION_TYPES = [
        "blur_default",
        "bounce_default",
        "carousel_bottom",
        "carousel_left",
        "carousel_quadrant",
        "carousel_quadrant_inverted",
        "carousel_right",
        "carousel_top",
        "cube_bottom",
        "cube_left",
        "cube_quadrant",
        "cube_quadrant_inverted",
        "cube_right",
        "cube_top",
        "drip_down",
        "drip_left",
        "drip_quadrant",
        "drip_quadrant_inverted",
        "drip_right",
        "drip_up",
        "elastic_down",
        "elastic_left",
        "elastic_quadrant",
        "elastic_quadrant_inverted",
        "elastic_right",
        "elastic_up",
        "encircle_ccw",
        "encircle_checkered",
        "encircle_cw",
        "encircle_rings",
        "fade_in_flash",
        "fade_in_flicker",
        "fade_in_linear",
        "flip_checkered",
        "flip_horizontal",
        "flip_rings",
        "flip_vertical",
        "hinge_bottom",
        "hinge_left",
        "hinge_quadrant",
        "hinge_quadrant_inverted",
        "hinge_right",
        "hinge_top",
        "hop_down",
        "hop_left",
        "hop_quadrant",
        "hop_quadrant_inverted",
        "hop_right",
        "hop_up",
        "invert_flash",
        "pop_bottom_left",
        "pop_bottom_right",
        "pop_center",
        "pop_quadrant",
        "pop_quadrant_inverted",
        "pop_top_left",
        "pop_top_right",
        "pull_checkered",
        "pull_down",
        "pull_horizontal",
        "pull_left",
        "pull_quadrant",
        "pull_quadrant_inverted",
        "pull_right",
        "pull_rings",
        "pull_up",
        "pull_vertical",
        "quadrant_scatter",
        "roll_down_left",
        "roll_down_right",
        "roll_quadrant",
        "roll_quadrant_inverted",
        "roll_up_left",
        "roll_up_right",
        "shake_down",
        "shake_left",
        "shake_quadrant",
        "shake_quadrant_inverted",
        "shake_right",
        "shake_up",
        "shoot_down",
        "shoot_left",
        "shoot_quadrant",
        "shoot_quadrant_inverted",
        "shoot_right",
        "shoot_up",
        "skew_ccw",
        "skew_checkered",
        "skew_cw",
        "skew_rings",
        "spin_down_ccw",
        "spin_down_checkered",
        "spin_down_cw",
        "spin_down_rings",
        "spin_up_ccw",
        "spin_up_checkered",
        "spin_up_cw",
        "spin_up_rings",
        "swarm_ccw",
        "swarm_checkered",
        "swarm_cw",
        "swarm_rings",
        "swing_bottom",
        "swing_left",
        "swing_quadrant",
        "swing_quadrant_inverted",
        "swing_right",
        "swing_top",
        "tumble_down",
        "tumble_left",
        "tumble_quadrant",
        "tumble_quadrant_inverted",
        "tumble_right",
        "tumble_up",
        "zoom_in",
        "zoom_out",
    ] as const;
    export type AnimationType = (typeof ANIMATION_TYPES)[number];

    export const SAMPLE_ANIMATIONS: Record<AnimationType, CellAnimationFn> = {
        blur_default: blurDefault,
        bounce_default: bounceDefault,
        carousel_bottom: carouselBottom,
        carousel_left: carouselLeft,
        carousel_quadrant: carouselQuadrant,
        carousel_quadrant_inverted: carouselQuadrantInverted,
        carousel_right: carouselRight,
        carousel_top: carouselTop,
        cube_bottom: cubeBottom,
        cube_left: cubeLeft,
        cube_quadrant: cubeQuadrant,
        cube_quadrant_inverted: cubeQuadrantInverted,
        cube_right: cubeRight,
        cube_top: cubeTop,
        drip_down: dripDown,
        drip_left: dripLeft,
        drip_quadrant: dripQuadrant,
        drip_quadrant_inverted: dripQuadrantInverted,
        drip_right: dripRight,
        drip_up: dripUp,
        elastic_down: elasticDown,
        elastic_left: elasticLeft,
        elastic_quadrant: elasticQuadrant,
        elastic_quadrant_inverted: elasticQuadrantInverted,
        elastic_right: elasticRight,
        elastic_up: elasticUp,
        encircle_ccw: encircleCcw,
        encircle_checkered: encircleCheckered,
        encircle_cw: encircleCw,
        encircle_rings: encircleRings,
        fade_in_flash: fadeInFlash,
        fade_in_flicker: fadeInFlicker,
        fade_in_linear: fadeInLinear,
        flip_checkered: flipCheckered,
        flip_horizontal: flipHorizontal,
        flip_rings: flipRings,
        flip_vertical: flipVertical,
        hinge_bottom: hingeBottom,
        hinge_left: hingeLeft,
        hinge_quadrant: hingeQuadrant,
        hinge_quadrant_inverted: hingeQuadrantInverted,
        hinge_right: hingeRight,
        hinge_top: hingeTop,
        hop_down: hopDown,
        hop_left: hopLeft,
        hop_quadrant: hopQuadrant,
        hop_quadrant_inverted: hopQuadrantInverted,
        hop_right: hopRight,
        hop_up: hopUp,
        invert_flash: invertFlash,
        pop_bottom_left: popBottomLeft,
        pop_bottom_right: popBottomRight,
        pop_center: popCenter,
        pop_quadrant: popQuadrant,
        pop_quadrant_inverted: popQuadrantInverted,
        pop_top_left: popTopLeft,
        pop_top_right: popTopRight,
        pull_checkered: pullCheckered,
        pull_down: pullDown,
        pull_horizontal: pullHorizontal,
        pull_left: pullLeft,
        pull_quadrant: pullQuadrant,
        pull_quadrant_inverted: pullQuadrantInverted,
        pull_right: pullRight,
        pull_rings: pullRings,
        pull_up: pullUp,
        pull_vertical: pullVertical,
        quadrant_scatter: quadrantScatter,
        roll_down_left: rollDownLeft,
        roll_down_right: rollDownRight,
        roll_quadrant: rollQuadrant,
        roll_quadrant_inverted: rollQuadrantInverted,
        roll_up_left: rollUpLeft,
        roll_up_right: rollUpRight,
        shake_down: shakeDown,
        shake_left: shakeLeft,
        shake_quadrant: shakeQuadrant,
        shake_quadrant_inverted: shakeQuadrantInverted,
        shake_right: shakeRight,
        shake_up: shakeUp,
        shoot_down: shootDown,
        shoot_left: shootLeft,
        shoot_quadrant: shootQuadrant,
        shoot_quadrant_inverted: shootQuadrantInverted,
        shoot_right: shootRight,
        shoot_up: shootUp,
        skew_ccw: skewCcw,
        skew_checkered: skewCheckered,
        skew_cw: skewCw,
        skew_rings: skewRings,
        spin_down_ccw: spinDownCcw,
        spin_down_checkered: spinDownCheckered,
        spin_down_cw: spinDownCw,
        spin_down_rings: spinDownRings,
        spin_up_ccw: spinUpCcw,
        spin_up_checkered: spinUpCheckered,
        spin_up_cw: spinUpCw,
        spin_up_rings: spinUpRings,
        swarm_ccw: swarmCcw,
        swarm_checkered: swarmCheckered,
        swarm_cw: swarmCw,
        swarm_rings: swarmRings,
        swing_bottom: swingBottom,
        swing_left: swingLeft,
        swing_quadrant: swingQuadrant,
        swing_quadrant_inverted: swingQuadrantInverted,
        swing_right: swingRight,
        swing_top: swingTop,
        tumble_down: tumbleDown,
        tumble_left: tumbleLeft,
        tumble_quadrant: tumbleQuadrant,
        tumble_quadrant_inverted: tumbleQuadrantInverted,
        tumble_right: tumbleRight,
        tumble_up: tumbleUp,
        zoom_in: zoomIn,
        zoom_out: zoomOut,
    };

    export const computeAnimation = (
        type: AnimationType,
        breakpoints: CellAnimationBreakpointTriple,
        defs: CellAnimationEvaluationDefs & { origin: Index2d },
        timeline: number,
        easing?: CellAnimationEasing,
    ): CellAnimationEvaluationResult =>
        CellAnimationKeyframeUtils.computeAnimation(SAMPLE_ANIMATIONS[type], breakpoints, defs, timeline, easing);
}
