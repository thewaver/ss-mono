import { defineComponent, shallowRef, watch } from "vue";

import {
    type GradientSwarmSampleOpts,
    SVGDefsUtils,
    TrackedGradientDefaults,
    type TrackedGradientElementDefs,
} from "@thewaver/ss-components";
import type { Point2d } from "@thewaver/ss-utils";

import { PointerTrackerVueUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerVue.utils";
import { declareProps } from "../../../../Utils/propUtils";
import type { TrackedGradientConfig } from "../../SVGDefsVue.types";
import { SVGDefsVueUtils } from "../../SVGDefsVue.utils";

type SwarmProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    opts?: GradientSwarmSampleOpts;
};

const COLOR_KEYS = ["primary", "secondary", "tertiary"] as const;
const SETTLE_MS = 1500;
const RESTING_POINT: Point2d = { x: 0.5, y: 0.5 };
const STILL: Point2d = { x: 0, y: 0 };
const NO_FADE = 0;

const DEFAULTS = TrackedGradientDefaults.SWARM_DEFAULTS;

const clock = SVGDefsUtils.createClock(SETTLE_MS);

const getSpotCount = (opts?: GradientSwarmSampleOpts) => opts?.spotCount ?? DEFAULTS.spotCount;

const getPatternId = (id: string) => `pattern-${id}`;

const getMergeId = (id: string) => `merge-${id}`;

const createSpots = (count: number) => Array.from({ length: count }, () => RESTING_POINT);

const Swarm = defineComponent(
    (props: SwarmProps) => {
        const { reading, isPointerPresent } = PointerTrackerVueUtils.usePointerReading(
            () => props.element,
            false,
            () => props.defs.getPointSource?.(),
        );
        const frameMs = SVGDefsVueUtils.useFrameMs(clock);
        const spots = shallowRef(createSpots(getSpotCount(props.opts)));

        let velocities = spots.value.map(() => STILL);
        let lastMs: number | undefined;

        watch([frameMs, reading, isPointerPresent], ([nowMs, current, isPresent]) => {
            const stepMs = lastMs === undefined ? 0 : nowMs - lastMs;
            const count = getSpotCount(props.opts);
            const stiffness = props.opts?.stiffness ?? DEFAULTS.stiffness;
            const damping = props.opts?.damping ?? DEFAULTS.damping;
            const wanderRatio = props.opts?.wanderRatio ?? DEFAULTS.wanderRatio;
            const wanderMs = props.opts?.wanderMs ?? DEFAULTS.wanderMs;

            lastMs = nowMs;

            if (SVGDefsUtils.getPointerFade(current, isPresent) > NO_FADE) clock.keepAwake();

            if (spots.value.length !== count) {
                spots.value = createSpots(count);
                velocities = spots.value.map(() => STILL);
            }

            if (stepMs <= 0) return;

            const nextVelocities: Point2d[] = [];

            spots.value = spots.value.map((spot, index) => {
                const target = SVGDefsUtils.computeSwarmTarget(
                    current.boxRatio,
                    index,
                    count,
                    nowMs,
                    wanderRatio,
                    wanderMs,
                );
                const step = SVGDefsUtils.stepSpring(spot, velocities[index], target, stepMs, stiffness, damping);

                nextVelocities.push(step.velocity);

                return step.position;
            });

            velocities = nextVelocities;
        });

        return () => {
            const alpha =
                (props.opts?.spotAlpha ?? DEFAULTS.spotAlpha) *
                SVGDefsUtils.getPointerFade(reading.value, isPointerPresent.value);
            const size = props.defs.getSize();
            const radii = SVGDefsUtils.computeSwarmRadii(
                size,
                props.opts?.spotScale ?? DEFAULTS.spotScale,
                props.opts?.circular ?? DEFAULTS.circular,
            );
            const mergeId = getMergeId(props.id);

            return (
                <>
                    <filter id={mergeId} x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation={SVGDefsUtils.computeSwarmMergeBlur(radii)} />
                        <feColorMatrix type="matrix" values={SVGDefsUtils.SWARM_MERGE_MATRIX} />
                    </filter>

                    <pattern
                        id={getPatternId(props.id)}
                        patternUnits="userSpaceOnUse"
                        width={size.width}
                        height={size.height}
                    >
                        <g opacity={alpha}>
                            <g filter={`url(#${mergeId})`}>
                                {spots.value.map((spot, index) => (
                                    <ellipse
                                        key={index}
                                        cx={spot.x * size.width}
                                        cy={spot.y * size.height}
                                        rx={radii.x}
                                        ry={radii.y}
                                        fill={props.defs.colors[COLOR_KEYS[index % COLOR_KEYS.length]]}
                                    />
                                ))}
                            </g>
                        </g>
                    </pattern>
                </>
            );
        };
    },
    { name: "Swarm", props: declareProps<SwarmProps>({ id: null, element: null, defs: null, opts: null }) },
);

export const swarm_3 = (opts?: GradientSwarmSampleOpts): TrackedGradientConfig => ({
    computeSVGDefs: (id, __, element, defs) => [
        { color: SVGDefsUtils.getBaseBorderColor(defs) },
        {
            gradientOrPattern: {
                id: getPatternId(id),
                renderDefsElement: () => <Swarm id={id} element={element} defs={defs} opts={opts} />,
            },
            filter: SVGDefsVueUtils.getBaseBlur(id, defs),
        },
    ],
});
