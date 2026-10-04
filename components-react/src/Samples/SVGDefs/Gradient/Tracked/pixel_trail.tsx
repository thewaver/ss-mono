import { Fragment, useEffect, useState } from "react";

import {
    type CycleColorKey,
    type GradientPixelTrailSampleOpts,
    SVGDefsUtils,
    TrackedGradientDefaults,
    type TrackedGradientElementDefs,
} from "@thewaver/ss-components";
import type { Index2d, Point2d, Size2d } from "@thewaver/ss-utils";

import { PointerTrackerReactUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerReact.utils";
import { SVGClipPath } from "../../../../Generators/SVGDefs/SVGClipPaths/SVGClipPath";
import { SVGGradientDefsReactUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsReact.utils";
import type { TrackedGradientConfig } from "../../SVGDefsReact.types";
import { SVGDefsReactUtils } from "../../SVGDefsReact.utils";

type PixelTrailStamp = Index2d & {
    bornMs: number;
};

type PixelTrailMotion = {
    stamps: (PixelTrailStamp | undefined)[];
    nextSlot: number;
    lastPoint: Point2d | undefined;
};

type PixelTrailProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    colorKeys: CycleColorKey[];
    defaults: typeof TrackedGradientDefaults.PIXEL_TRAIL_DEFAULTS;
    opts?: GradientPixelTrailSampleOpts;
};

const STAMP_COUNT = 48;
const GRACE_MS = 100;
const NO_FADE = 0;
const EMPTY_STAMPS: (PixelTrailStamp | undefined)[] = Array.from({ length: STAMP_COUNT }, () => undefined);
const EMPTY_SQUARE = { x: 0, y: 0, width: 0, height: 0 };

const CYCLING_DEFAULTS = TrackedGradientDefaults.PIXEL_TRAIL_CYCLING_DEFAULTS;

const RENDERED_ELSEWHERE = () => undefined;

const clock = SVGDefsUtils.createClock(GRACE_MS);

const getGradientId = (id: string, index: number) => `gradient${index + 1}-${id}`;
const getClipId = (id: string, index: number) => `clip${index + 1}-${id}`;

const getIsInside = (ratio: Point2d) => ratio.x >= 0 && ratio.x <= 1 && ratio.y >= 0 && ratio.y <= 1;

const computeSquare = (stamp: PixelTrailStamp | undefined, size: Size2d, squareSize: number) => {
    if (!stamp || !size.width || !size.height) return EMPTY_SQUARE;

    return {
        x: (stamp.col * squareSize) / size.width,
        y: (stamp.row * squareSize) / size.height,
        width: squareSize / size.width,
        height: squareSize / size.height,
    };
};

const PixelTrail = (props: PixelTrailProps) => {
    const ref = SVGDefsReactUtils.useElementRef(props.element);
    const { reading, isPointerPresent } = PointerTrackerReactUtils.usePointerReading(
        ref,
        false,
        props.defs.getPointSource?.(),
    );
    const frameMs = SVGDefsReactUtils.useFrameMs(clock);

    const squareSize = props.opts?.squareSize ?? props.defaults.squareSize;
    const squareAlpha = props.opts?.squareAlpha ?? props.defaults.squareAlpha;
    const trailMs = props.opts?.trailMs ?? props.defaults.trailMs;
    const cycleMs = props.opts?.cycleMs ?? CYCLING_DEFAULTS.cycleMs;
    const ageColorSpan = props.opts?.ageColorSpan ?? CYCLING_DEFAULTS.ageColorSpan;
    const size = props.defs.getSize();

    const [motion] = useState<PixelTrailMotion>(() => ({
        stamps: [...EMPTY_STAMPS],
        nextSlot: 0,
        lastPoint: undefined,
    }));

    useEffect(() => {
        const isLaying =
            getIsInside(reading.boxRatio) && SVGDefsUtils.getPointerFade(reading, isPointerPresent) > NO_FADE;
        const point = { x: reading.boxRatio.x * size.width, y: reading.boxRatio.y * size.height };
        const laid = isLaying ? SVGDefsUtils.computePixelTrailCells(motion.lastPoint, point, squareSize) : [];

        motion.lastPoint = isLaying ? point : undefined;

        if (motion.stamps.some((stamp) => stamp && frameMs - stamp.bornMs < trailMs) || laid.length) clock.keepAwake();

        for (const cell of laid) {
            motion.stamps[motion.nextSlot] = { ...cell, bornMs: frameMs };
            motion.nextSlot = (motion.nextSlot + 1) % STAMP_COUNT;
        }
    }, [frameMs, reading, isPointerPresent]);

    const computeColor = (stamp: PixelTrailStamp) => {
        if (props.opts?.cycles) {
            return SVGDefsUtils.computeCycleColor(props.defs.colors, props.colorKeys, stamp.bornMs, cycleMs);
        }

        const ageRatio = (frameMs - stamp.bornMs) / trailMs;
        const band = Math.floor((ageRatio / ageColorSpan) * props.colorKeys.length);

        return props.defs.colors[props.colorKeys[Math.min(Math.max(band, 0), props.colorKeys.length - 1)]];
    };

    const computeStampColors = (stamp: PixelTrailStamp | undefined) => {
        if (!stamp) return [{ value: "transparent" }, { value: "transparent", stop: 100 }];

        const alpha = squareAlpha * SVGDefsUtils.computePixelTrailAlpha(frameMs - stamp.bornMs, trailMs);
        const value = `rgb(from ${computeColor(stamp)} r g b / ${alpha})`;

        return [{ value }, { value, stop: 100 }];
    };

    return (
        <>
            {motion.stamps.map((stamp, index) => {
                const square = computeSquare(stamp, size, squareSize);

                return (
                    <Fragment key={index}>
                        {SVGGradientDefsReactUtils.computeLinearGradient({
                            id: getGradientId(props.id, index),
                            angle: 0,
                            colors: computeStampColors(stamp),
                        })}
                        <SVGClipPath id={getClipId(props.id, index)}>
                            <rect x={square.x} y={square.y} width={square.width} height={square.height} />
                        </SVGClipPath>
                    </Fragment>
                );
            })}
        </>
    );
};

export const createPixelTrailSample =
    (colorKeys: CycleColorKey[], defaults: typeof TrackedGradientDefaults.PIXEL_TRAIL_DEFAULTS) =>
    (opts?: GradientPixelTrailSampleOpts): TrackedGradientConfig => ({
        computeSVGDefs: (id, __, element, defs) => {
            const sharedBlur = SVGDefsReactUtils.getBaseBlur(id, defs);
            const sharedBlurRef = SVGDefsUtils.getSharedFilter(sharedBlur);

            return [
                { color: SVGDefsUtils.getBaseBorderColor(defs) },
                ...Array.from({ length: STAMP_COUNT }, (_unused, index) => ({
                    gradientOrPattern: {
                        id: getGradientId(id, index),
                        renderDefsElement:
                            index === 0
                                ? () => (
                                      <PixelTrail
                                          id={id}
                                          element={element}
                                          defs={defs}
                                          colorKeys={colorKeys}
                                          defaults={defaults}
                                          opts={opts}
                                      />
                                  )
                                : RENDERED_ELSEWHERE,
                    },
                    clipPath: {
                        id: getClipId(id, index),
                        renderDefsElement: RENDERED_ELSEWHERE,
                    },
                    filter: index === 0 ? sharedBlur : sharedBlurRef,
                })),
            ];
        },
    });
