import { createMemo, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import { PARTICLE_SPAWNER_DEFAULTS } from "@thewaver/ss-components-solid";
import { ParticleSpawnerKnobs } from "@thewaver/ss-playground/App/Knobs/ParticleSpawners.const";
import { EXAMPLES_ONLY_PROP } from "@thewaver/ss-playground/App/PageComponents/Prop/Prop.const";
import {
    BOX_HEIGHT,
    BOX_WIDTH,
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
    ITERATION_PATTERNS,
    ITERATION_PATTERN_KEYS,
    STRESS_ITEMS,
    TRAVEL_EASING_FNS,
    TRAVEL_EASING_KEYS,
    TRAVEL_PATTERN_FACTORIES,
    TRAVEL_PATTERN_KEYS,
    applyOvershoot,
} from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageCheckField, PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageKnobs } from "../../PageComponents/Knobs/Knobs";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsDivider, PagePropsGroups, PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { StressTest } from "../../PageComponents/StressTest/StressTest";
import { BurstExample } from "./Examples/Burst";
import { DiagonalExample } from "./Examples/Diagonal";
import { GridExample } from "./Examples/Grid";
import { ManyToOneExample } from "./Examples/ManyToOne";
import { MovingTargetExample } from "./Examples/MovingTarget";
import { MultipleTargetsExample } from "./Examples/MultipleTargets";
import { RadialExample } from "./Examples/Radial";
import { RoundTripExample } from "./Examples/RoundTrip";
import { SingleTargetExample } from "./Examples/SingleTarget";
import { VerticalExample } from "./Examples/Vertical";
import type {
    IterationPattern,
    ParticleSpawnerExampleProps,
    ParticleTravelPattern,
    TravelEasingKey,
} from "./ParticleSpawnerPage.types";

const StressTestWrapper = (props: ParticleSpawnerExampleProps) => {
    const modalPlayback = createSignal(true);

    return (
        <StressTest
            configs={STRESS_ITEMS}
            onShowModal={() => props.playback[1](false)}
            onHideModal={() => props.playback[1](true)}
            renderLabel={(getConfigIndex) => `Render ${STRESS_ITEMS[getConfigIndex()].count} spawners`}
            renderItem={(getConfigIndex) => (
                <div
                    style={{
                        width: `${STRESS_ITEMS[getConfigIndex()].width}px`,
                        height: `${STRESS_ITEMS[getConfigIndex()].height}px`,
                    }}
                >
                    <SingleTargetExample {...props} playback={modalPlayback} />
                </div>
            )}
        />
    );
};

export const ParticleSpawnerPage = () => {
    const [getParticleCount, setParticleCount] = createSignal(ParticleSpawnerKnobs.STARTING_PARTICLE_COUNT);
    const [getTravelDurationMs, setTravelDurationMs] = createSignal(PARTICLE_SPAWNER_DEFAULTS.travelDurationMs);
    const [getRestDurationMs, setRestDurationMs] = createSignal(PARTICLE_SPAWNER_DEFAULTS.restDurationMs);
    const [getSpawnDelayMs, setSpawnDelayMs] = createSignal(ParticleSpawnerKnobs.STARTING_SPAWN_DELAY_MS);
    const [getOvershootPercent, setOvershootPercent] = createSignal(ParticleSpawnerKnobs.STARTING_OVERSHOOT_PERCENT);
    const [getTravelEasingKey, setTravelEasingKey] = createSignal<TravelEasingKey>(
        ParticleSpawnerKnobs.STARTING_TRAVEL_EASING_KEY,
    );

    const [getTravelPatternKey, setTravelPatternKey] = createSignal<ParticleTravelPattern>(
        ParticleSpawnerKnobs.STARTING_TRAVEL_PATTERN_KEY,
    );

    const [getIterationPatternKey, setIterationPatternKey] = createSignal<IterationPattern>(
        ParticleSpawnerKnobs.STARTING_ITERATION_PATTERN_KEY,
    );

    const [getAreTargetsHidden, setAreTargetsHidden] = createSignal(ParticleSpawnerKnobs.STARTING_ARE_TARGETS_HIDDEN);

    const [travelDefs, setTravelDefs] = createStore<Record<string, Record<string, number | boolean>>>({});
    const playback = createSignal(true);

    const getTravelKnobs = () => ParticleSpawnerKnobs.TRAVEL_KNOBS_BY_PATTERN[getTravelPatternKey()];
    const getTravelDefaults = () => ParticleSpawnerKnobs.TRAVEL_DEFAULTS_BY_PATTERN[getTravelPatternKey()];
    const getPickedTravelDefs = () => travelDefs[getTravelPatternKey()] ?? {};

    const getComputeParticlePos = createMemo(() => {
        const evaluate = TRAVEL_PATTERN_FACTORIES[getTravelPatternKey()]({
            ...getTravelDefaults(),
            ...getPickedTravelDefs(),
        } as Record<string, number>);
        const easingFn = TRAVEL_EASING_FNS[getTravelEasingKey()];
        const overshootPercent = getOvershootPercent();

        return (defs: Parameters<typeof evaluate>[0], t: number) =>
            evaluate(defs, applyOvershoot(t, easingFn(t), overshootPercent));
    });

    const getExamples = createMemo(() => {
        const commonProps: ParticleSpawnerExampleProps = {
            particleCount: getParticleCount,
            travelDurationMs: getTravelDurationMs,
            restDurationMs: getRestDurationMs,
            spawnDelayMs: getSpawnDelayMs,
            spawnIterationPatterns: () => ITERATION_PATTERNS[getIterationPatternKey()](),
            computeParticlePos: (defs, t) => getComputeParticlePos()(defs, t),
            areTargetsHidden: getAreTargetsHidden,
            playback,
        };

        return [
            {
                key: "singleTarget",
                name: EXAMPLE_NAMES.singleTarget,
                component: () => (
                    <PageMeasureBox width={BOX_WIDTH} height={BOX_HEIGHT}>
                        <SingleTargetExample {...commonProps} />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/SingleTarget.tsx`,
            },
            {
                key: "vertical",
                name: EXAMPLE_NAMES.vertical,
                component: () => (
                    <PageMeasureBox width={BOX_WIDTH} height={BOX_HEIGHT}>
                        <VerticalExample {...commonProps} />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/Vertical.tsx`,
            },
            {
                key: "diagonal",
                name: EXAMPLE_NAMES.diagonal,
                component: () => (
                    <PageMeasureBox width={BOX_WIDTH} height={BOX_HEIGHT}>
                        <DiagonalExample {...commonProps} />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/Diagonal.tsx`,
            },
            {
                key: "movingTarget",
                name: EXAMPLE_NAMES.movingTarget,
                component: () => (
                    <PageMeasureBox width={BOX_WIDTH} height={BOX_HEIGHT}>
                        <MovingTargetExample {...commonProps} />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/MovingTarget.tsx`,
            },
            {
                key: "radial",
                name: EXAMPLE_NAMES.radial,
                component: () => (
                    <PageMeasureBox width={BOX_WIDTH} height={BOX_HEIGHT}>
                        <RadialExample {...commonProps} />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/Radial.tsx`,
            },
            {
                key: "manyToOne",
                name: EXAMPLE_NAMES.manyToOne,
                component: () => (
                    <PageMeasureBox width={BOX_WIDTH} height={BOX_HEIGHT}>
                        <ManyToOneExample {...commonProps} />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/ManyToOne.tsx`,
            },
            {
                key: "burst",
                name: EXAMPLE_NAMES.burst,
                component: () => (
                    <PageMeasureBox width={BOX_WIDTH} height={BOX_HEIGHT}>
                        <BurstExample {...commonProps} />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/Burst.tsx`,
            },
            {
                key: "roundTrip",
                name: EXAMPLE_NAMES.roundTrip,
                component: () => (
                    <PageMeasureBox width={BOX_WIDTH} height={BOX_HEIGHT}>
                        <RoundTripExample {...commonProps} />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/RoundTrip.tsx`,
            },
            {
                key: "multipleTargets",
                name: EXAMPLE_NAMES.multipleTargets,
                component: () => (
                    <PageMeasureBox width={BOX_WIDTH} height={BOX_HEIGHT}>
                        <MultipleTargetsExample {...commonProps} />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/MultipleTargets.tsx`,
            },
            {
                key: "grid",
                name: EXAMPLE_NAMES.grid,
                component: () => (
                    <PageMeasureBox width={BOX_WIDTH} height={BOX_HEIGHT}>
                        <GridExample {...commonProps} />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/Grid.tsx`,
            },
            {
                key: "stressTest",
                name: EXAMPLE_NAMES.stressTest,
                component: () => <StressTestWrapper {...commonProps} />,
            },
        ];
    });

    return (
        <>
            <PagePropsGroups>
                <PagePropsPanel scope={"sample"}>
                    <PageProp
                        key={"travelPattern"}
                        label={"Travel pattern"}
                        hint={
                            "The path a particle takes from where it starts to where it ends. Choosing one brings its own knobs with it."
                        }
                        controls={
                            "Picks the example's travel path function sent to ParticleSpawnerProps.computeParticlePos"
                        }
                    >
                        <PageSelectField
                            value={getTravelPatternKey}
                            values={TRAVEL_PATTERN_KEYS}
                            width={FIELD_WIDTH}
                            ariaLabel={"Travel pattern"}
                            onChange={(key) => setTravelPatternKey(() => key)}
                        />
                    </PageProp>

                    <PageKnobs
                        knobs={getTravelKnobs}
                        defaults={getTravelDefaults}
                        values={getPickedTravelDefs}
                        width={() => FIELD_WIDTH}
                        onInput={(key, value) =>
                            setTravelDefs(getTravelPatternKey(), (previous) => ({ ...previous, [key]: value }))
                        }
                    />
                </PagePropsPanel>

                <PagePropsDivider />

                <PagePropsPanel scope={"global"}>
                    <PageProp
                        key={"particleCount"}
                        label={"Particle count"}
                        hint={"How many particles are sent on each round."}
                        controls={"Sets ParticleSpawnerProps.particleCount"}
                    >
                        <PageNumberField
                            value={getParticleCount}
                            min={ParticleSpawnerKnobs.MIN_PARTICLE_COUNT}
                            max={ParticleSpawnerKnobs.MAX_PARTICLE_COUNT}
                            step={ParticleSpawnerKnobs.PARTICLE_COUNT_STEP}
                            width={FIELD_WIDTH}
                            ariaLabel={"Particle count"}
                            onInput={setParticleCount}
                        />
                    </PageProp>

                    <PageProp
                        key={"travelDurationMs"}
                        label={"Travel (ms)"}
                        hint={"How long one particle takes to walk its path."}
                        controls={"Sets ParticleSpawnerProps.travelDurationMs"}
                    >
                        <PageNumberField
                            value={getTravelDurationMs}
                            min={ParticleSpawnerKnobs.MIN_TRAVEL_DURATION_MS}
                            max={ParticleSpawnerKnobs.MAX_TRAVEL_DURATION_MS}
                            step={ParticleSpawnerKnobs.TRAVEL_DURATION_STEP_MS}
                            width={FIELD_WIDTH}
                            ariaLabel={"Travel duration in milliseconds"}
                            onInput={setTravelDurationMs}
                        />
                    </PageProp>

                    <PageProp
                        key={"restDurationMs"}
                        label={"Rest duration (ms)"}
                        hint={"How long a particle stays put at the end of its path before it disappears."}
                        controls={"Sets ParticleSpawnerProps.restDurationMs"}
                    >
                        <PageNumberField
                            value={getRestDurationMs}
                            min={ParticleSpawnerKnobs.MIN_RETENTION_MS}
                            max={ParticleSpawnerKnobs.MAX_RETENTION_MS}
                            step={ParticleSpawnerKnobs.RETENTION_STEP_MS}
                            width={FIELD_WIDTH}
                            ariaLabel={"Rest duration in milliseconds"}
                            onInput={setRestDurationMs}
                        />
                    </PageProp>

                    <PageProp
                        key={"spawnDelayMs"}
                        label={"Spawn delay (ms)"}
                        hint={
                            "How long each particle waits after the one before it sets off, which is what staggers them."
                        }
                        controls={"Sets ParticleSpawnerProps.spawnDelayMs"}
                    >
                        <PageNumberField
                            value={getSpawnDelayMs}
                            min={ParticleSpawnerKnobs.MIN_SPAWN_DELAY_MS}
                            max={ParticleSpawnerKnobs.MAX_SPAWN_DELAY_MS}
                            step={ParticleSpawnerKnobs.SPAWN_DELAY_STEP_MS}
                            width={FIELD_WIDTH}
                            ariaLabel={"Spawn delay in milliseconds"}
                            onInput={setSpawnDelayMs}
                        />
                    </PageProp>

                    <PageProp
                        key={"iterationPattern"}
                        label={"Iteration pattern"}
                        hint={
                            "How the rounds follow each other: in bursts of three with a pause, one at a time with a pause, or without any pause at all."
                        }
                        controls={
                            "Picks the example's list of rounds sent to ParticleSpawnerProps.spawnIterationPatterns"
                        }
                    >
                        <PageSelectField
                            value={getIterationPatternKey}
                            values={ITERATION_PATTERN_KEYS}
                            width={FIELD_WIDTH}
                            ariaLabel={"Iteration pattern"}
                            onChange={(key) => setIterationPatternKey(() => key)}
                        />
                    </PageProp>

                    <PageProp
                        key={"overshootPercent"}
                        label={"Overshoot (%)"}
                        hint={
                            "How far a particle runs past its destination before coming back to it. 0 stops it dead on target."
                        }
                        controls={
                            "Sets how far the example's travel path runs past its end, sent to ParticleSpawnerProps.computeParticlePos"
                        }
                    >
                        <PageNumberField
                            value={getOvershootPercent}
                            min={ParticleSpawnerKnobs.MIN_OVERSHOOT_PERCENT}
                            max={ParticleSpawnerKnobs.MAX_OVERSHOOT_PERCENT}
                            step={ParticleSpawnerKnobs.OVERSHOOT_PERCENT_STEP}
                            width={FIELD_WIDTH}
                            ariaLabel={"Overshoot percent"}
                            onInput={setOvershootPercent}
                        />
                    </PageProp>

                    <PageProp
                        key={"areTargetsHidden"}
                        label={"Hide targets"}
                        hint={
                            "Takes the target markers out of sight while leaving them where they are, so the particles still land on them."
                        }
                        controls={EXAMPLES_ONLY_PROP}
                    >
                        <PageCheckField
                            value={getAreTargetsHidden}
                            ariaLabel={"Hide targets"}
                            onChange={setAreTargetsHidden}
                        />
                    </PageProp>

                    <PageProp
                        key={"travelEasing"}
                        label={"Travel easing"}
                        hint={"The speed curve a particle follows along its path."}
                        controls={
                            "Picks the speed curve of the example's travel path, sent to ParticleSpawnerProps.computeParticlePos"
                        }
                    >
                        <PageSelectField
                            value={getTravelEasingKey}
                            values={TRAVEL_EASING_KEYS}
                            width={FIELD_WIDTH}
                            ariaLabel={"Travel easing"}
                            onChange={(key) => setTravelEasingKey(() => key)}
                        />
                    </PageProp>
                </PagePropsPanel>
            </PagePropsGroups>

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};
