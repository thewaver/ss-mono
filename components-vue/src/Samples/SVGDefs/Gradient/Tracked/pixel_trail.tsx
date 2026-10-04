import { Fragment, defineComponent, shallowRef, watch } from "vue";

import {
    type CycleColorKey,
    type GradientPixelTrailSampleOpts,
    SVGDefsUtils,
    TrackedGradientDefaults,
    type TrackedGradientElementDefs,
} from "@thewaver/ss-components";
import type { Index2d, Point2d, Size2d } from "@thewaver/ss-utils";

import { PointerTrackerVueUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerVue.utils";
import { SVGClipPath } from "../../../../Generators/SVGDefs/SVGClipPaths/SVGClipPath";
import { SVGGradientDefsVueUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsVue.utils";
import { declareProps } from "../../../../Utils/propUtils";
import type { TrackedGradientConfig } from "../../SVGDefsVue.types";
import { SVGDefsVueUtils } from "../../SVGDefsVue.utils";

type PixelTrailStamp = Index2d & {
    bornMs: number;
};

type PixelTrailDefaults = typeof TrackedGradientDefaults.PIXEL_TRAIL_DEFAULTS;

type PixelTrailProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    colorKeys: CycleColorKey[];
    defaults: PixelTrailDefaults;
    opts?: GradientPixelTrailSampleOpts;
};

const STAMP_COUNT = 48;
const GRACE_MS = 100;
const NO_FADE = 0;
const EMPTY_STAMPS: (PixelTrailStamp | undefined)[] = Array.from({ length: STAMP_COUNT }, () => undefined);
const NO_SQUARE = { x: 0, y: 0, width: 0, height: 0 };
const NO_COLORS = [{ value: "transparent" }, { value: "transparent", stop: 100 }];

const CYCLING_DEFAULTS = TrackedGradientDefaults.PIXEL_TRAIL_CYCLING_DEFAULTS;

const RENDERED_ELSEWHERE = () => undefined;

const clock = SVGDefsUtils.createClock(GRACE_MS);

const getGradientId = (id: string, index: number) => `gradient${index + 1}-${id}`;

const getClipId = (id: string, index: number) => `clip${index + 1}-${id}`;

const getIsInside = (ratio: Point2d) => ratio.x >= 0 && ratio.x <= 1 && ratio.y >= 0 && ratio.y <= 1;

const computeSquare = (stamp: PixelTrailStamp | undefined, size: Size2d, squareSize: number) =>
    stamp && size.width && size.height
        ? {
              x: (stamp.col * squareSize) / size.width,
              y: (stamp.row * squareSize) / size.height,
              width: squareSize / size.width,
              height: squareSize / size.height,
          }
        : NO_SQUARE;

const PixelTrail = defineComponent(
    (props: PixelTrailProps) => {
        const { reading, isPointerPresent } = PointerTrackerVueUtils.usePointerReading(
            () => props.element,
            false,
            () => props.defs.getPointSource?.(),
        );
        const frameMs = SVGDefsVueUtils.useFrameMs(clock);
        const stamps = shallowRef(EMPTY_STAMPS);

        let nextSlot = 0;
        let lastPoint: Point2d | undefined;

        watch([frameMs, reading, isPointerPresent], ([nowMs, current, isPresent]) => {
            const size = props.defs.getSize();
            const squareSize = props.opts?.squareSize ?? props.defaults.squareSize;
            const trailMs = props.opts?.trailMs ?? props.defaults.trailMs;
            const isLaying = getIsInside(current.boxRatio) && SVGDefsUtils.getPointerFade(current, isPresent) > NO_FADE;
            const point = { x: current.boxRatio.x * size.width, y: current.boxRatio.y * size.height };
            const laid = isLaying ? SVGDefsUtils.computePixelTrailCells(lastPoint, point, squareSize) : [];

            lastPoint = isLaying ? point : undefined;

            if (stamps.value.some((stamp) => stamp && nowMs - stamp.bornMs < trailMs) || laid.length) clock.keepAwake();

            if (!laid.length) return;

            const next = [...stamps.value];

            for (const cell of laid) {
                next[nextSlot] = { ...cell, bornMs: nowMs };
                nextSlot = (nextSlot + 1) % STAMP_COUNT;
            }

            stamps.value = next;
        });

        return () => {
            const size = props.defs.getSize();
            const squareSize = props.opts?.squareSize ?? props.defaults.squareSize;
            const squareAlpha = props.opts?.squareAlpha ?? props.defaults.squareAlpha;
            const trailMs = props.opts?.trailMs ?? props.defaults.trailMs;
            const cycleMs = props.opts?.cycleMs ?? CYCLING_DEFAULTS.cycleMs;
            const ageColorSpan = props.opts?.ageColorSpan ?? CYCLING_DEFAULTS.ageColorSpan;

            const getColor = (stamp: PixelTrailStamp) => {
                if (props.opts?.cycles) {
                    return SVGDefsUtils.computeCycleColor(props.defs.colors, props.colorKeys, stamp.bornMs, cycleMs);
                }

                const ageRatio = (frameMs.value - stamp.bornMs) / trailMs;
                const band = Math.floor((ageRatio / ageColorSpan) * props.colorKeys.length);

                return props.defs.colors[props.colorKeys[Math.min(Math.max(band, 0), props.colorKeys.length - 1)]];
            };

            const computeStampColors = (stamp: PixelTrailStamp | undefined) => {
                if (!stamp) return NO_COLORS;

                const alpha = squareAlpha * SVGDefsUtils.computePixelTrailAlpha(frameMs.value - stamp.bornMs, trailMs);
                const value = `rgb(from ${getColor(stamp)} r g b / ${alpha})`;

                return [{ value }, { value, stop: 100 }];
            };

            return stamps.value.map((stamp, index) => {
                const square = computeSquare(stamp, size, squareSize);

                return (
                    <Fragment key={index}>
                        {SVGGradientDefsVueUtils.computeLinearGradient({
                            id: getGradientId(props.id, index),
                            angle: 0,
                            colors: computeStampColors(stamp),
                        })}
                        <SVGClipPath id={getClipId(props.id, index)}>
                            <rect x={square.x} y={square.y} width={square.width} height={square.height} />
                        </SVGClipPath>
                    </Fragment>
                );
            });
        };
    },
    {
        name: "PixelTrail",
        props: declareProps<PixelTrailProps>({
            id: null,
            element: null,
            defs: null,
            colorKeys: null,
            defaults: null,
            opts: null,
        }),
    },
);

export const createPixelTrailSample =
    (colorKeys: CycleColorKey[], defaults: PixelTrailDefaults) =>
    (opts?: GradientPixelTrailSampleOpts): TrackedGradientConfig => ({
        computeSVGDefs: (id, __, element, defs) => {
            const sharedBlur = SVGDefsVueUtils.getBaseBlur(id, defs);
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
