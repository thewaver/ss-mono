import { createEffect, createSignal, untrack } from "solid-js";

import {
    type CycleColorKey,
    type GradientPixelTrailSampleOpts,
    type PointerReading,
    SVGDefsUtils,
    TrackedGradientDefaults,
} from "@thewaver/ss-components";
import type { Index2d, Point2d, Size2d } from "@thewaver/ss-utils";

import { PointerTrackerSolidUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerSolid.utils";
import { SVGClipPath } from "../../../../Generators/SVGDefs/SVGClipPaths/SVGClipPath";
import { SVGGradientDefsSolidUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSolid.utils";
import type { TrackedGradientConfig } from "../../SVGDefsSolid.types";
import { SVGDefsSolidUtils } from "../../SVGDefsSolid.utils";

type PixelTrailStamp = Index2d & {
    bornMs: number;
};

const STAMP_COUNT = 48;
const GRACE_MS = 100;
const NO_FADE = 0;
const EMPTY_STAMPS: (PixelTrailStamp | undefined)[] = Array.from({ length: STAMP_COUNT }, () => undefined);

const CYCLING_DEFAULTS = TrackedGradientDefaults.PIXEL_TRAIL_CYCLING_DEFAULTS;

const NO_REF = () => undefined;

const clock = SVGDefsSolidUtils.createClock(GRACE_MS);

const getIsInside = (ratio: Point2d) => ratio.x >= 0 && ratio.x <= 1 && ratio.y >= 0 && ratio.y <= 1;

const createPixelTrail = (
    getReading: () => PointerReading,
    getIsPointerPresent: () => boolean,
    getSize: () => Size2d,
    squareSize: number,
    trailMs: number,
) => {
    const [getStamps, setStamps] = createSignal(EMPTY_STAMPS);

    let nextSlot = 0;
    let lastPoint: Point2d | undefined;

    clock.subscribe();

    createEffect(() => {
        const nowMs = clock.getFrameMs();
        const reading = getReading();
        const size = getSize();
        const isLaying =
            getIsInside(reading.boxRatio) && SVGDefsUtils.getPointerFade(reading, getIsPointerPresent()) > NO_FADE;
        const point = { x: reading.boxRatio.x * size.width, y: reading.boxRatio.y * size.height };
        const laid = isLaying ? SVGDefsUtils.computePixelTrailCells(lastPoint, point, squareSize) : [];

        lastPoint = isLaying ? point : undefined;

        const stamps = untrack(getStamps);

        if (stamps.some((stamp) => stamp && nowMs - stamp.bornMs < trailMs) || laid.length) clock.keepAwake();

        if (!laid.length) return;

        const next = [...stamps];

        for (const cell of laid) {
            next[nextSlot] = { ...cell, bornMs: nowMs };
            nextSlot = (nextSlot + 1) % STAMP_COUNT;
        }

        setStamps(next);
    });

    return getStamps;
};

export const createPixelTrailSample =
    (colorKeys: CycleColorKey[], defaults: typeof TrackedGradientDefaults.PIXEL_TRAIL_DEFAULTS) =>
    (opts?: GradientPixelTrailSampleOpts): TrackedGradientConfig => ({
        computeSVGDefs: (id, __, getRef, defs) => {
            const sharedBlur = SVGDefsSolidUtils.getBaseBlur(id, defs);
            const sharedBlurRef = SVGDefsUtils.getSharedFilter(sharedBlur);
            const squareSize = opts?.squareSize ?? defaults.squareSize;
            const squareAlpha = opts?.squareAlpha ?? defaults.squareAlpha;
            const trailMs = opts?.trailMs ?? defaults.trailMs;
            const cycleMs = opts?.cycleMs ?? CYCLING_DEFAULTS.cycleMs;
            const ageColorSpan = opts?.ageColorSpan ?? CYCLING_DEFAULTS.ageColorSpan;

            const { getReading, getIsPointerPresent } = PointerTrackerSolidUtils.create(
                getRef ?? NO_REF,
                undefined,
                defs.getPointSource,
            );

            const getStamps = createPixelTrail(getReading, getIsPointerPresent, defs.getSize, squareSize, trailMs);

            const getColor = (stamp: PixelTrailStamp) => {
                if (opts?.cycles) return SVGDefsUtils.computeCycleColor(defs.colors, colorKeys, stamp.bornMs, cycleMs);

                const ageRatio = (clock.getFrameMs() - stamp.bornMs) / trailMs;
                const band = Math.floor((ageRatio / ageColorSpan) * colorKeys.length);

                return defs.colors[colorKeys[Math.min(Math.max(band, 0), colorKeys.length - 1)]];
            };

            const getStampColors = (index: number) => {
                const stamp = getStamps()[index];

                if (!stamp) return [{ value: "transparent" }, { value: "transparent", stop: 100 }];

                const alpha =
                    squareAlpha * SVGDefsUtils.computePixelTrailAlpha(clock.getFrameMs() - stamp.bornMs, trailMs);
                const value = `rgb(from ${getColor(stamp)} r g b / ${alpha})`;

                return [{ value }, { value, stop: 100 }];
            };

            const getSquare = (index: number) => {
                const stamp = getStamps()[index];
                const size = defs.getSize();

                if (!stamp || !size.width || !size.height) return { x: 0, y: 0, width: 0, height: 0 };

                return {
                    x: (stamp.col * squareSize) / size.width,
                    y: (stamp.row * squareSize) / size.height,
                    width: squareSize / size.width,
                    height: squareSize / size.height,
                };
            };

            return [
                { color: SVGDefsUtils.getBaseBorderColor(defs) },
                ...Array.from({ length: STAMP_COUNT }, (_unused, index) => ({
                    gradientOrPattern: {
                        id: `gradient${index + 1}-${id}`,
                        renderDefsElement: () =>
                            SVGGradientDefsSolidUtils.computeLinearGradient({
                                id: `gradient${index + 1}-${id}`,
                                angle: 0,
                                colors: () => getStampColors(index),
                            }),
                    },
                    clipPath: {
                        id: `clip${index + 1}-${id}`,
                        renderDefsElement: () => (
                            <SVGClipPath id={`clip${index + 1}-${id}`}>
                                <rect
                                    x={getSquare(index).x}
                                    y={getSquare(index).y}
                                    width={getSquare(index).width}
                                    height={getSquare(index).height}
                                />
                            </SVGClipPath>
                        ),
                    },
                    filter: index === 0 ? sharedBlur : sharedBlurRef,
                })),
            ];
        },
    });
