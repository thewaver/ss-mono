import { Fragment, defineComponent, shallowRef, watch } from "vue";

import {
    type GradientRibbonSampleOpts,
    SVGDefsUtils,
    TrackedGradientDefaults,
    type TrackedGradientElementDefs,
} from "@thewaver/ss-components";
import { MathUtils, type Point2d } from "@thewaver/ss-utils";

import { PointerTrackerVueUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerVue.utils";
import { SVGGradientDefsVueUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsVue.utils";
import { declareProps } from "../../../../Utils/propUtils";
import type { TrackedGradientConfig } from "../../SVGDefsVue.types";
import { SVGDefsVueUtils } from "../../SVGDefsVue.utils";

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

const getRibbonLength = (opts?: GradientRibbonSampleOpts) => opts?.ribbonLength ?? DEFAULTS.ribbonLength;

const getGradientId = (id: string, ribbon: number, index: number) => `gradient-${ribbon}-${index}-${id}`;

const getStampIndexes = (length: number) => Array.from({ length }, (_unused, stamp) => length - 1 - stamp);

const createChains = (length: number) => COLOR_KEYS.map(() => Array.from({ length }, () => RESTING_POINT));

const Ribbons = defineComponent(
    (props: RibbonsProps) => {
        const { reading, isPointerPresent } = PointerTrackerVueUtils.usePointerReading(
            () => props.element,
            false,
            () => props.defs.getPointSource?.(),
        );
        const frameMs = SVGDefsVueUtils.useFrameMs(clock);
        const chains = shallowRef(createChains(getRibbonLength(props.opts)));

        let velocities = COLOR_KEYS.map(() => STILL);
        let lastMs: number | undefined;

        watch([frameMs, reading, isPointerPresent], ([nowMs, current, isPresent]) => {
            const stepMs = lastMs === undefined ? 0 : nowMs - lastMs;
            const length = getRibbonLength(props.opts);
            const stiffness = props.opts?.stiffness ?? DEFAULTS.stiffness;
            const damping = props.opts?.damping ?? DEFAULTS.damping;
            const follow = props.opts?.followStiffness ?? DEFAULTS.followStiffness;

            lastMs = nowMs;

            if (SVGDefsUtils.getPointerFade(current, isPresent) > NO_FADE) clock.keepAwake();

            if (chains.value[0].length !== length) {
                chains.value = createChains(length);
                velocities = COLOR_KEYS.map(() => STILL);
            }

            if (stepMs <= 0) return;

            chains.value = chains.value.map((chain, ribbon) => {
                const head = SVGDefsUtils.stepSpring(
                    chain[0],
                    velocities[ribbon],
                    current.boxRatio,
                    stepMs,
                    stiffness * PACE_BY_RIBBON[ribbon],
                    damping,
                );
                const next = [head.position];

                velocities[ribbon] = head.velocity;

                for (let index = 1; index < chain.length; index++) {
                    const ahead = next[index - 1];

                    next.push({
                        x: MathUtils.lerp(chain[index].x, ahead.x, follow),
                        y: MathUtils.lerp(chain[index].y, ahead.y, follow),
                    });
                }

                return next;
            });
        });

        return () => {
            const length = chains.value[0].length;
            const fade = SVGDefsUtils.getPointerFade(reading.value, isPointerPresent.value);
            const elementSize = (props.opts?.circular ?? DEFAULTS.circular) ? props.defs.getSize() : undefined;

            return COLOR_KEYS.map((colorKey, ribbon) =>
                getStampIndexes(length).map((index) => {
                    const share = length > 1 ? index / (length - 1) : 0;
                    const alpha = (props.opts?.headAlpha ?? DEFAULTS.headAlpha) * (1 - share) * fade;
                    const color = props.defs.colors[colorKey];

                    return (
                        <Fragment key={`${ribbon}-${index}`}>
                            {SVGGradientDefsVueUtils.computeRadialGradient({
                                id: getGradientId(props.id, ribbon, index),
                                elementSize,
                                origin: chains.value[ribbon][index],
                                scale: MathUtils.lerp(
                                    props.opts?.headScale ?? DEFAULTS.headScale,
                                    props.opts?.tailScale ?? DEFAULTS.tailScale,
                                    share,
                                ),
                                colors: [
                                    { value: `rgb(from ${color} r g b / ${alpha})` },
                                    { value: `rgb(from ${color} r g b / 0)`, stop: 100 },
                                ],
                            })}
                        </Fragment>
                    );
                }),
            );
        };
    },
    { name: "Ribbons", props: declareProps<RibbonsProps>({ id: null, element: null, defs: null, opts: null }) },
);

export const ribbon_3 = (opts?: GradientRibbonSampleOpts): TrackedGradientConfig => ({
    computeSVGDefs: (id, __, element, defs) => {
        const sharedBlur = SVGDefsVueUtils.getBaseBlur(id, defs);
        const sharedBlurRef = SVGDefsUtils.getSharedFilter(sharedBlur);
        const length = getRibbonLength(opts);

        const layers = COLOR_KEYS.flatMap((_colorKey, ribbon) =>
            getStampIndexes(length).map((index) => {
                const isFirst = ribbon === 0 && index === length - 1;

                return {
                    gradientOrPattern: {
                        id: getGradientId(id, ribbon, index),
                        renderDefsElement: isFirst
                            ? () => <Ribbons id={id} element={element} defs={defs} opts={opts} />
                            : RENDERED_ELSEWHERE,
                    },
                    filter: isFirst ? sharedBlur : sharedBlurRef,
                };
            }),
        );

        return [{ color: SVGDefsUtils.getBaseBorderColor(defs) }, ...layers];
    },
});
