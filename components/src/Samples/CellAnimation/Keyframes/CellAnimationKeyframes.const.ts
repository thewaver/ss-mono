import type { Point2d } from "@thewaver/ss-utils";

import type {
    CellAnimationEvaluationDefs,
    CellAnimationEvaluationResult,
} from "../../../Exotics/CellAnimation/CellAnimation.types";
import { CellAnimationBreakpoints } from "../Breakpoints/CellAnimationBreakpoints.const";
import type { CellAnimationFn } from "./CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "./CellAnimationKeyframes.utils";
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
        "blurDefault",
        "bounceDefault",
        "carouselBottom",
        "carouselLeft",
        "carouselQuadrant",
        "carouselQuadrantInverted",
        "carouselRight",
        "carouselTop",
        "cubeBottom",
        "cubeLeft",
        "cubeQuadrant",
        "cubeQuadrantInverted",
        "cubeRight",
        "cubeTop",
        "dripDown",
        "dripLeft",
        "dripQuadrant",
        "dripQuadrantInverted",
        "dripRight",
        "dripUp",
        "elasticDown",
        "elasticLeft",
        "elasticQuadrant",
        "elasticQuadrantInverted",
        "elasticRight",
        "elasticUp",
        "encircleCcw",
        "encircleCheckered",
        "encircleCw",
        "encircleRings",
        "fadeInFlash",
        "fadeInFlicker",
        "fadeInLinear",
        "flipCheckered",
        "flipHorizontal",
        "flipRings",
        "flipVertical",
        "hingeBottom",
        "hingeLeft",
        "hingeQuadrant",
        "hingeQuadrantInverted",
        "hingeRight",
        "hingeTop",
        "hopDown",
        "hopLeft",
        "hopQuadrant",
        "hopQuadrantInverted",
        "hopRight",
        "hopUp",
        "invertFlash",
        "popBottomLeft",
        "popBottomRight",
        "popCenter",
        "popQuadrant",
        "popQuadrantInverted",
        "popTopLeft",
        "popTopRight",
        "pullCheckered",
        "pullDown",
        "pullHorizontal",
        "pullLeft",
        "pullQuadrant",
        "pullQuadrantInverted",
        "pullRight",
        "pullRings",
        "pullUp",
        "pullVertical",
        "quadrantScatter",
        "rollDownLeft",
        "rollDownRight",
        "rollQuadrant",
        "rollQuadrantInverted",
        "rollUpLeft",
        "rollUpRight",
        "shakeDown",
        "shakeLeft",
        "shakeQuadrant",
        "shakeQuadrantInverted",
        "shakeRight",
        "shakeUp",
        "shootDown",
        "shootLeft",
        "shootQuadrant",
        "shootQuadrantInverted",
        "shootRight",
        "shootUp",
        "skewCcw",
        "skewCheckered",
        "skewCw",
        "skewRings",
        "spinDownCcw",
        "spinDownCheckered",
        "spinDownCw",
        "spinDownRings",
        "spinUpCcw",
        "spinUpCheckered",
        "spinUpCw",
        "spinUpRings",
        "swarmCcw",
        "swarmCheckered",
        "swarmCw",
        "swarmRings",
        "swingBottom",
        "swingLeft",
        "swingQuadrant",
        "swingQuadrantInverted",
        "swingRight",
        "swingTop",
        "tumbleDown",
        "tumbleLeft",
        "tumbleQuadrant",
        "tumbleQuadrantInverted",
        "tumbleRight",
        "tumbleUp",
        "zoomIn",
        "zoomOut",
    ] as const;
    export type AnimationType = (typeof ANIMATION_TYPES)[number];

    export const SAMPLE_ANIMATIONS: Record<AnimationType, CellAnimationFn> = {
        blurDefault,
        bounceDefault,
        carouselBottom,
        carouselLeft,
        carouselQuadrant,
        carouselQuadrantInverted,
        carouselRight,
        carouselTop,
        cubeBottom,
        cubeLeft,
        cubeQuadrant,
        cubeQuadrantInverted,
        cubeRight,
        cubeTop,
        dripDown,
        dripLeft,
        dripQuadrant,
        dripQuadrantInverted,
        dripRight,
        dripUp,
        elasticDown,
        elasticLeft,
        elasticQuadrant,
        elasticQuadrantInverted,
        elasticRight,
        elasticUp,
        encircleCcw,
        encircleCheckered,
        encircleCw,
        encircleRings,
        fadeInFlash,
        fadeInFlicker,
        fadeInLinear,
        flipCheckered,
        flipHorizontal,
        flipRings,
        flipVertical,
        hingeBottom,
        hingeLeft,
        hingeQuadrant,
        hingeQuadrantInverted,
        hingeRight,
        hingeTop,
        hopDown,
        hopLeft,
        hopQuadrant,
        hopQuadrantInverted,
        hopRight,
        hopUp,
        invertFlash,
        popBottomLeft,
        popBottomRight,
        popCenter,
        popQuadrant,
        popQuadrantInverted,
        popTopLeft,
        popTopRight,
        pullCheckered,
        pullDown,
        pullHorizontal,
        pullLeft,
        pullQuadrant,
        pullQuadrantInverted,
        pullRight,
        pullRings,
        pullUp,
        pullVertical,
        quadrantScatter,
        rollDownLeft,
        rollDownRight,
        rollQuadrant,
        rollQuadrantInverted,
        rollUpLeft,
        rollUpRight,
        shakeDown,
        shakeLeft,
        shakeQuadrant,
        shakeQuadrantInverted,
        shakeRight,
        shakeUp,
        shootDown,
        shootLeft,
        shootQuadrant,
        shootQuadrantInverted,
        shootRight,
        shootUp,
        skewCcw,
        skewCheckered,
        skewCw,
        skewRings,
        spinDownCcw,
        spinDownCheckered,
        spinDownCw,
        spinDownRings,
        spinUpCcw,
        spinUpCheckered,
        spinUpCw,
        spinUpRings,
        swarmCcw,
        swarmCheckered,
        swarmCw,
        swarmRings,
        swingBottom,
        swingLeft,
        swingQuadrant,
        swingQuadrantInverted,
        swingRight,
        swingTop,
        tumbleDown,
        tumbleLeft,
        tumbleQuadrant,
        tumbleQuadrantInverted,
        tumbleRight,
        tumbleUp,
        zoomIn,
        zoomOut,
    };

    export const computeAnimation = (
        type: AnimationType,
        breakpoints: CellAnimationBreakpoints.BreakpointTupleTriple,
        defs: CellAnimationEvaluationDefs & { origin: Point2d },
        timeline: number,
        easing?: CellAnimationBreakpoints.Easing,
    ): CellAnimationEvaluationResult =>
        CellAnimationKeyframeUtils.computeAnimation(SAMPLE_ANIMATIONS[type], breakpoints, defs, timeline, easing);
}
