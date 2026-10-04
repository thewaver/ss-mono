import { Fragment, defineComponent, shallowRef, watch } from "vue";

import {
    type CycleColorKey,
    type GradientSwarmSampleOpts,
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

type SwarmDefaults = typeof TrackedGradientDefaults.SWARM_DEFAULTS;

type SwarmProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    colorKeys: CycleColorKey[];
    defaults: SwarmDefaults;
    opts?: GradientSwarmSampleOpts;
};

const SETTLE_MS = 1500;
const RESTING_POINT: Point2d = { x: 0.5, y: 0.5 };
const STILL: Point2d = { x: 0, y: 0 };
const NO_FADE = 0;

const CYCLING_DEFAULTS = TrackedGradientDefaults.SWARM_CYCLING_DEFAULTS;

const RENDERED_ELSEWHERE = () => undefined;

const clock = SVGDefsUtils.createClock(SETTLE_MS);

const getSpotCount = (defaults: SwarmDefaults, opts?: GradientSwarmSampleOpts) => opts?.spotCount ?? defaults.spotCount;

const getTailLength = (defaults: SwarmDefaults, opts?: GradientSwarmSampleOpts) =>
    opts?.tailLength ?? defaults.tailLength;

const getCycleMs = (opts?: GradientSwarmSampleOpts) =>
    opts?.cycles ? (opts.cycleMs ?? CYCLING_DEFAULTS.cycleMs) : undefined;

const getGradientId = (id: string, tracer: number, index: number) => `gradient-${tracer}-${index}-${id}`;

const getTracers = (count: number) => Array.from({ length: count }, (_unused, tracer) => count - 1 - tracer);

const getStampIndexes = (length: number) => Array.from({ length }, (_unused, stamp) => length - 1 - stamp);

const createChains = (count: number, length: number) =>
    Array.from({ length: count }, () => Array.from({ length }, () => RESTING_POINT));

const Swarm = defineComponent(
    (props: SwarmProps) => {
        const { reading, isPointerPresent } = PointerTrackerVueUtils.usePointerReading(
            () => props.element,
            false,
            () => props.defs.getPointSource?.(),
        );
        const frameMs = SVGDefsVueUtils.useFrameMs(clock);
        const chains = shallowRef(
            createChains(getSpotCount(props.defaults, props.opts), getTailLength(props.defaults, props.opts)),
        );

        let velocities = chains.value.map(() => STILL);
        let lastMs: number | undefined;

        watch([frameMs, reading, isPointerPresent], ([nowMs, current, isPresent]) => {
            const stepMs = lastMs === undefined ? 0 : nowMs - lastMs;
            const count = getSpotCount(props.defaults, props.opts);
            const length = getTailLength(props.defaults, props.opts);
            const stiffness = props.opts?.stiffness ?? props.defaults.stiffness;
            const damping = props.opts?.damping ?? props.defaults.damping;
            const follow = props.opts?.followStiffness ?? props.defaults.followStiffness;
            const wanderRatio = props.opts?.wanderRatio ?? props.defaults.wanderRatio;
            const wanderMs = props.opts?.wanderMs ?? props.defaults.wanderMs;

            lastMs = nowMs;

            if (SVGDefsUtils.getPointerFade(current, isPresent) > NO_FADE) clock.keepAwake();

            if (chains.value.length !== count || chains.value[0]?.length !== length) {
                chains.value = createChains(count, length);
                velocities = chains.value.map(() => STILL);
            }

            if (stepMs <= 0) return;

            chains.value = chains.value.map((chain, tracer) => {
                const target = SVGDefsUtils.computeSwarmTarget(
                    current.boxRatio,
                    tracer,
                    count,
                    nowMs,
                    wanderRatio,
                    wanderMs,
                );
                const head = SVGDefsUtils.stepSpring(chain[0], velocities[tracer], target, stepMs, stiffness, damping);

                velocities[tracer] = head.velocity;

                return SVGDefsUtils.followChain(chain, head.position, follow);
            });
        });

        return () => {
            const count = chains.value.length;
            const length = chains.value[0]?.length ?? 0;
            const spotScale = props.opts?.spotScale ?? props.defaults.spotScale;
            const fade = SVGDefsUtils.getPointerFade(reading.value, isPointerPresent.value);
            const cycleMs = getCycleMs(props.opts);
            const elementSize = (props.opts?.circular ?? props.defaults.circular) ? props.defs.getSize() : undefined;

            return getTracers(count).map((tracer) => {
                const color = SVGDefsUtils.computeTracerColor(
                    props.defs.colors,
                    props.colorKeys,
                    tracer,
                    count,
                    frameMs.value,
                    cycleMs,
                );

                return getStampIndexes(length).map((index) => {
                    const share = length > 1 ? index / (length - 1) : 0;
                    const alpha = (props.opts?.spotAlpha ?? props.defaults.spotAlpha) * (1 - share) * fade;

                    return (
                        <Fragment key={`${tracer}-${index}`}>
                            {SVGGradientDefsVueUtils.computeRadialGradient({
                                id: getGradientId(props.id, tracer, index),
                                elementSize,
                                origin: chains.value[tracer][index],
                                scale: MathUtils.lerp(
                                    spotScale,
                                    spotScale * (props.opts?.tailScale ?? props.defaults.tailScale),
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
        name: "Swarm",
        props: declareProps<SwarmProps>({
            id: null,
            element: null,
            defs: null,
            colorKeys: null,
            defaults: null,
            opts: null,
        }),
    },
);

export const createSwarmSample =
    (colorKeys: CycleColorKey[], defaults: SwarmDefaults) =>
    (opts?: GradientSwarmSampleOpts): TrackedGradientConfig => ({
        computeSVGDefs: (id, __, element, defs) => {
            const sharedBlur = SVGDefsVueUtils.getBaseBlur(id, defs);
            const sharedBlurRef = SVGDefsUtils.getSharedFilter(sharedBlur);
            const length = getTailLength(defaults, opts);

            const layers = getTracers(getSpotCount(defaults, opts)).flatMap((tracer, order) =>
                getStampIndexes(length).map((index) => {
                    const isFirst = order === 0 && index === length - 1;

                    return {
                        gradientOrPattern: {
                            id: getGradientId(id, tracer, index),
                            renderDefsElement: isFirst
                                ? () => (
                                      <Swarm
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
                        filter: isFirst ? sharedBlur : sharedBlurRef,
                    };
                }),
            );

            return [{ color: SVGDefsUtils.getBaseBorderColor(defs) }, ...layers];
        },
    });
