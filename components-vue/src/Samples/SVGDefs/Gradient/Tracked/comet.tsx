import { Fragment, defineComponent, shallowRef, watch } from "vue";

import {
    type CycleColorKey,
    type GradientCometSampleOpts,
    SVGDefsUtils,
    TrackedGradientDefaults,
    type TrackedGradientElementDefs,
} from "@thewaver/ss-components";
import { CometConst, TrackedGradientSampleConst } from "@thewaver/ss-components/internal";
import { MathUtils } from "@thewaver/ss-utils";

import { PointerTrackerVueUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerVue.utils";
import { SVGGradientDefsVueUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsVue.utils";
import { declareProps } from "../../../../Utils/propUtils";
import type { TrackedGradientConfig } from "../../SVGDefsVue.types";
import { SVGDefsVueUtils } from "../../SVGDefsVue.utils";

type CometDefaults = typeof TrackedGradientDefaults.COMET_DEFAULTS;

type CometsProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    colorKeys: CycleColorKey[];
    defaults: CometDefaults;
    opts?: GradientCometSampleOpts;
};

const clock = SVGDefsUtils.createClock(CometConst.SETTLE_MS);

const getTailLength = (defaults: CometDefaults, opts?: GradientCometSampleOpts) =>
    opts?.tailLength ?? defaults.tailLength;

const getCycleMs = (opts?: GradientCometSampleOpts) =>
    opts?.cycles ? (opts.cycleMs ?? CometConst.CYCLING_DEFAULTS.cycleMs) : undefined;

const getGradientId = (id: string, comet: number, index: number) => `gradient-${comet}-${index}-${id}`;

const getComets = () => CometConst.PACE_BY_COMET.map((_unused, comet) => comet).reverse();

const getStampIndexes = (length: number) => Array.from({ length }, (_unused, stamp) => length - 1 - stamp);

const createChains = (length: number) =>
    CometConst.PACE_BY_COMET.map(() => Array.from({ length }, () => CometConst.RESTING_POINT));

const Comets = defineComponent(
    (props: CometsProps) => {
        const { reading, isPointerPresent } = PointerTrackerVueUtils.usePointerReading(
            () => props.element,
            false,
            () => props.defs.getPointSource?.(),
        );
        const frameMs = SVGDefsVueUtils.useFrameMs(clock);
        const chains = shallowRef(createChains(getTailLength(props.defaults, props.opts)));

        let velocities = CometConst.PACE_BY_COMET.map(() => CometConst.STILL);
        let lastMs: number | undefined;

        watch([frameMs, reading, isPointerPresent], ([nowMs, current, isPresent]) => {
            const stepMs = lastMs === undefined ? 0 : nowMs - lastMs;
            const length = getTailLength(props.defaults, props.opts);
            const stiffness = props.opts?.stiffness ?? props.defaults.stiffness;
            const damping = props.opts?.damping ?? props.defaults.damping;
            const follow = props.opts?.followStiffness ?? props.defaults.followStiffness;

            lastMs = nowMs;

            if (SVGDefsUtils.getPointerFade(current, isPresent) > TrackedGradientSampleConst.NO_FADE) clock.keepAwake();

            if (chains.value[0].length !== length) {
                chains.value = createChains(length);
                velocities = CometConst.PACE_BY_COMET.map(() => CometConst.STILL);
            }

            if (stepMs <= 0) return;

            chains.value = chains.value.map((chain, comet) => {
                const head = SVGDefsUtils.stepSpring(
                    chain[0],
                    velocities[comet],
                    current.boxRatio,
                    stepMs,
                    stiffness * CometConst.PACE_BY_COMET[comet],
                    damping,
                );

                velocities[comet] = head.velocity;

                return SVGDefsUtils.followChain(chain, head.position, follow);
            });
        });

        return () => {
            const length = chains.value[0].length;
            const fade = SVGDefsUtils.getPointerFade(reading.value, isPointerPresent.value);
            const cycleMs = getCycleMs(props.opts);
            const elementSize = (props.opts?.circular ?? props.defaults.circular) ? props.defs.getSize() : undefined;

            return getComets().map((comet) => {
                const color = SVGDefsUtils.computeTracerColor(
                    props.defs.colors,
                    props.colorKeys,
                    comet,
                    CometConst.PACE_BY_COMET.length,
                    frameMs.value,
                    cycleMs,
                );

                return getStampIndexes(length).map((index) => {
                    const share = length > 1 ? index / (length - 1) : 0;
                    const alpha = (props.opts?.headAlpha ?? props.defaults.headAlpha) * (1 - share) * fade;

                    return (
                        <Fragment key={`${comet}-${index}`}>
                            {SVGGradientDefsVueUtils.computeRadialGradient({
                                id: getGradientId(props.id, comet, index),
                                elementSize,
                                origin: chains.value[comet][index],
                                scale: MathUtils.lerp(
                                    props.opts?.headScale ?? props.defaults.headScale,
                                    props.opts?.tailScale ?? props.defaults.tailScale,
                                    share,
                                ),
                                colors: [
                                    { value: `rgb(from ${color} r g b / ${alpha})` },
                                    { value: `rgb(from ${color} r g b / 0)`, stop: 100 },
                                ],
                            })}
                        </Fragment>
                    );
                });
            });
        };
    },
    {
        name: "Comets",
        props: declareProps<CometsProps>({
            id: null,
            element: null,
            defs: null,
            colorKeys: null,
            defaults: null,
            opts: null,
        }),
    },
);

export const createCometSample =
    (colorKeys: CycleColorKey[], defaults: CometDefaults) =>
    (opts?: GradientCometSampleOpts): TrackedGradientConfig => ({
        computeSVGDefs: (id, __, element, defs) => {
            const sharedBlur = SVGDefsVueUtils.getBaseBlur(id, defs);
            const sharedBlurRef = SVGDefsUtils.getSharedFilter(sharedBlur);
            const length = getTailLength(defaults, opts);

            const layers = getComets().flatMap((comet, order) =>
                getStampIndexes(length).map((index) => {
                    const isFirst = order === 0 && index === length - 1;

                    return {
                        gradientOrPattern: {
                            id: getGradientId(id, comet, index),
                            renderDefsElement: isFirst
                                ? () => (
                                      <Comets
                                          id={id}
                                          element={element}
                                          defs={defs}
                                          colorKeys={colorKeys}
                                          defaults={defaults}
                                          opts={opts}
                                      />
                                  )
                                : TrackedGradientSampleConst.RENDERED_ELSEWHERE,
                        },
                        filter: isFirst ? sharedBlur : sharedBlurRef,
                    };
                }),
            );

            return [{ color: SVGDefsUtils.getBaseBorderColor(defs) }, ...layers];
        },
    });
