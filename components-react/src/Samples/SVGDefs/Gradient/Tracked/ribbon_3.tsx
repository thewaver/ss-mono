import { Fragment, useEffect, useState } from "react";

import {
    type GradientRibbonSampleOpts,
    SVGDefsUtils,
    TrackedGradientDefaults,
    type TrackedGradientElementDefs,
} from "@thewaver/ss-components";
import { MathUtils, type Point2d } from "@thewaver/ss-utils";

import { PointerTrackerReactUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerReact.utils";
import { SVGGradientDefsReactUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsReact.utils";
import type { TrackedGradientConfig } from "../../SVGDefsReact.types";
import { SVGDefsReactUtils } from "../../SVGDefsReact.utils";

type RibbonMotion = {
    chains: Point2d[][];
    velocities: Point2d[];
    lastMs: number | undefined;
};

type RibbonsProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    opts?: GradientRibbonSampleOpts;
};

const COLOR_KEYS = ["primary", "secondary", "tertiary"] as const;
const PACE_BY_RIBBON = [1, 0.7, 0.5];
const SETTLE_MS = 1500;
const RESTING_POINT: Point2d = { x: 0.5, y: 0.5 };
const STILL: Point2d = { x: 0, y: 0 };
const NO_FADE = 0;

const DEFAULTS = TrackedGradientDefaults.RIBBON_DEFAULTS;

const RENDERED_ELSEWHERE = () => undefined;

const clock = SVGDefsUtils.createClock(SETTLE_MS);

const getGradientId = (id: string, ribbon: number, index: number) => `gradient-${ribbon}-${index}-${id}`;

const getStampOrder = (length: number) => Array.from({ length }, (_unused, stamp) => length - 1 - stamp);

const Ribbons = (props: RibbonsProps) => {
    const ref = SVGDefsReactUtils.useElementRef(props.element);
    const { reading, isPointerPresent } = PointerTrackerReactUtils.usePointerReading(
        ref,
        false,
        props.defs.getPointSource?.(),
    );
    const frameMs = SVGDefsReactUtils.useFrameMs(clock);

    const length = props.opts?.ribbonLength ?? DEFAULTS.ribbonLength;
    const stiffness = props.opts?.stiffness ?? DEFAULTS.stiffness;
    const damping = props.opts?.damping ?? DEFAULTS.damping;
    const follow = props.opts?.followStiffness ?? DEFAULTS.followStiffness;

    const [motion] = useState<RibbonMotion>(() => ({
        chains: COLOR_KEYS.map(() => Array.from({ length }, () => RESTING_POINT)),
        velocities: COLOR_KEYS.map(() => STILL),
        lastMs: undefined,
    }));

    useEffect(() => {
        const elapsedMs = motion.lastMs === undefined ? 0 : frameMs - motion.lastMs;

        motion.lastMs = frameMs;

        if (SVGDefsUtils.getPointerFade(reading, isPointerPresent) > NO_FADE) clock.keepAwake();

        if (elapsedMs <= 0) return;

        motion.chains = motion.chains.map((chain, ribbon) => {
            const head = SVGDefsUtils.stepSpring(
                chain[0],
                motion.velocities[ribbon],
                reading.boxRatio,
                elapsedMs,
                stiffness * PACE_BY_RIBBON[ribbon],
                damping,
            );
            const next = [head.position];

            motion.velocities[ribbon] = head.velocity;

            for (let index = 1; index < chain.length; index++) {
                const ahead = next[index - 1];

                next.push({
                    x: MathUtils.lerp(chain[index].x, ahead.x, follow),
                    y: MathUtils.lerp(chain[index].y, ahead.y, follow),
                });
            }

            return next;
        });
    }, [frameMs, reading, isPointerPresent]);

    const fade = SVGDefsUtils.getPointerFade(reading, isPointerPresent);
    const elementSize = (props.opts?.circular ?? DEFAULTS.circular) ? props.defs.getSize() : undefined;
    const headAlpha = props.opts?.headAlpha ?? DEFAULTS.headAlpha;
    const headScale = props.opts?.headScale ?? DEFAULTS.headScale;
    const tailScale = props.opts?.tailScale ?? DEFAULTS.tailScale;

    return (
        <>
            {COLOR_KEYS.map((colorKey, ribbon) =>
                getStampOrder(length).map((index) => {
                    const share = length > 1 ? index / (length - 1) : 0;
                    const alpha = headAlpha * (1 - share) * fade;
                    const color = props.defs.colors[colorKey];

                    return (
                        <Fragment key={`${ribbon}-${index}`}>
                            {SVGGradientDefsReactUtils.computeRadialGradient({
                                id: getGradientId(props.id, ribbon, index),
                                elementSize,
                                origin: motion.chains[ribbon][index],
                                scale: MathUtils.lerp(headScale, tailScale, share),
                                colors: [
                                    { value: `rgb(from ${color} r g b / ${alpha})` },
                                    { value: `rgb(from ${color} r g b / 0)`, stop: 100 },
                                ],
                            })}
                        </Fragment>
                    );
                }),
            )}
        </>
    );
};

export const ribbon_3 = (opts?: GradientRibbonSampleOpts): TrackedGradientConfig => ({
    computeSVGDefs: (id, __, element, defs) => {
        const sharedBlur = SVGDefsReactUtils.getBaseBlur(id, defs);
        const sharedBlurRef = SVGDefsUtils.getSharedFilter(sharedBlur);
        const length = opts?.ribbonLength ?? DEFAULTS.ribbonLength;

        const layers = COLOR_KEYS.flatMap((_colorKey, ribbon) =>
            getStampOrder(length).map((index) => {
                const isFirst = ribbon === 0 && index === length - 1;

                return {
                    gradientOrPattern: {
                        id: getGradientId(id, ribbon, index),
                        renderDefsElement: isFirst
                            ? () => <Ribbons key={length} id={id} element={element} defs={defs} opts={opts} />
                            : RENDERED_ELSEWHERE,
                    },
                    filter: isFirst ? sharedBlur : sharedBlurRef,
                };
            }),
        );

        return [{ color: SVGDefsUtils.getBaseBorderColor(defs) }, ...layers];
    },
});
