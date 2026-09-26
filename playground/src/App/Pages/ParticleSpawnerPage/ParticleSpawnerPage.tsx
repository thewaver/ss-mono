import { createMemo, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import { PARTICLE_SPAWNER_DEFAULTS } from "@thewaver/ss-components";

import { ParticleSpawnerKnobs } from "../../Knobs/ParticleSpawners.const";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageCheckField, PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageKnobs } from "../../PageComponents/Knobs/Knobs";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsDivider, PagePropsGroups, PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { StressTest } from "../../PageComponents/StressTest/StressTest";
import type { StressTestDefs } from "../../PageComponents/StressTest/StressText.types";
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
import {
    ITERATION_PATTERNS,
    ITERATION_PATTERN_KEYS,
    TRAVEL_EASING_FNS,
    TRAVEL_EASING_KEYS,
    TRAVEL_PATTERN_FACTORIES,
    TRAVEL_PATTERN_KEYS,
    applyOvershoot,
} from "./ParticleSpawnerPage.const";
import type {
    IterationPattern,
    ParticleSpawnerExampleProps,
    ParticleTravelPattern,
    TravelEasingKey,
} from "./ParticleSpawnerPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/ParticleSpawnerPage/Examples";
const FIELD_WIDTH = 130;
const BOX_WIDTH = 420;
const BOX_HEIGHT = 260;

const STRESS_BOX_WIDTH = 120;
const STRESS_BOX_HEIGHT = 80;

const STRESS_ITEMS: (StressTestDefs & { width: number; height: number })[] = [
    { count: 8, cols: 4, gap: 10, width: STRESS_BOX_WIDTH, height: STRESS_BOX_HEIGHT },
    { count: 24, cols: 6, gap: 8, width: STRESS_BOX_WIDTH, height: STRESS_BOX_HEIGHT },
    { count: 48, cols: 8, gap: 6, width: STRESS_BOX_WIDTH, height: STRESS_BOX_HEIGHT },
    { count: 96, cols: 12, gap: 4, width: STRESS_BOX_WIDTH, height: STRESS_BOX_HEIGHT },
];

const StressTestWrapper = (props: ParticleSpawnerExampleProps) => {
    const modalPlayback = createSignal(true);

    return (
        <StressTest
            configs={() => STRESS_ITEMS}
            onShowModal={() => props.playbackSignal[1](false)}
            onHideModal={() => props.playbackSignal[1](true)}
            renderLabel={(getConfigIndex) => `Render ${STRESS_ITEMS[getConfigIndex()].count} spawners`}
            renderItem={(getConfigIndex) => (
                <div
                    style={{
                        width: `${STRESS_ITEMS[getConfigIndex()].width}px`,
                        height: `${STRESS_ITEMS[getConfigIndex()].height}px`,
                    }}
                >
                    <SingleTargetExample {...props} playbackSignal={modalPlayback} />
                </div>
            )}
        />
    );
};

export const ParticleSpawnerPage = () => {
    const [getParticleCount, setParticleCount] = createSignal(ParticleSpawnerKnobs.STARTING_PARTICLE_COUNT);
    const [getTravelDurationMs, setTravelDurationMs] = createSignal(PARTICLE_SPAWNER_DEFAULTS.travelDurationMs);
    const [getRetentionMs, setRetentionMs] = createSignal(PARTICLE_SPAWNER_DEFAULTS.retentionMs);
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
            retentionMs: getRetentionMs,
            spawnDelayMs: getSpawnDelayMs,
            spawnIterationPatterns: () => ITERATION_PATTERNS[getIterationPatternKey()](),
            computeParticlePos: (defs, t) => getComputeParticlePos()(defs, t),
            areTargetsHidden: getAreTargetsHidden,
            playbackSignal: playback,
        };

        return [
            {
                key: "singleTarget",
                name: "Single target",
                component: () => (
                    <PageMeasureBox width={() => BOX_WIDTH} height={() => BOX_HEIGHT}>
                        <SingleTargetExample {...commonProps} />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/SingleTarget.tsx`,
            },
            {
                key: "vertical",
                name: "Vertical",
                component: () => (
                    <PageMeasureBox width={() => BOX_WIDTH} height={() => BOX_HEIGHT}>
                        <VerticalExample {...commonProps} />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/Vertical.tsx`,
            },
            {
                key: "diagonal",
                name: "Diagonal",
                component: () => (
                    <PageMeasureBox width={() => BOX_WIDTH} height={() => BOX_HEIGHT}>
                        <DiagonalExample {...commonProps} />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/Diagonal.tsx`,
            },
            {
                key: "movingTarget",
                name: "Moving target",
                component: () => (
                    <PageMeasureBox width={() => BOX_WIDTH} height={() => BOX_HEIGHT}>
                        <MovingTargetExample {...commonProps} />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/MovingTarget.tsx`,
            },
            {
                key: "radial",
                name: "Radial (1 spawner, many targets)",
                component: () => (
                    <PageMeasureBox width={() => BOX_WIDTH} height={() => BOX_HEIGHT}>
                        <RadialExample {...commonProps} />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/Radial.tsx`,
            },
            {
                key: "manyToOne",
                name: "Many to one (many spawners, 1 target)",
                component: () => (
                    <PageMeasureBox width={() => BOX_WIDTH} height={() => BOX_HEIGHT}>
                        <ManyToOneExample {...commonProps} />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/ManyToOne.tsx`,
            },
            {
                key: "burst",
                name: "Burst on press",
                component: () => (
                    <PageMeasureBox width={() => BOX_WIDTH} height={() => BOX_HEIGHT}>
                        <BurstExample {...commonProps} />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/Burst.tsx`,
            },
            {
                key: "roundTrip",
                name: "Round trip (a relay on arrival)",
                component: () => (
                    <PageMeasureBox width={() => BOX_WIDTH} height={() => BOX_HEIGHT}>
                        <RoundTripExample {...commonProps} />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/RoundTrip.tsx`,
            },
            {
                key: "multipleTargets",
                name: "Multiple targets",
                component: () => (
                    <PageMeasureBox width={() => BOX_WIDTH} height={() => BOX_HEIGHT}>
                        <MultipleTargetsExample {...commonProps} />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/MultipleTargets.tsx`,
            },
            {
                key: "grid",
                name: "N spawners x M targets",
                component: () => (
                    <PageMeasureBox width={() => BOX_WIDTH} height={() => BOX_HEIGHT}>
                        <GridExample {...commonProps} />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/Grid.tsx`,
            },
            {
                key: "stressTest",
                name: "Stress Test",
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
                    >
                        <PageSelectField
                            value={getTravelPatternKey}
                            values={() => TRAVEL_PATTERN_KEYS}
                            width={() => FIELD_WIDTH}
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
                    >
                        <PageNumberField
                            value={getParticleCount}
                            min={() => ParticleSpawnerKnobs.MIN_PARTICLE_COUNT}
                            max={() => ParticleSpawnerKnobs.MAX_PARTICLE_COUNT}
                            step={() => ParticleSpawnerKnobs.PARTICLE_COUNT_STEP}
                            width={() => FIELD_WIDTH}
                            ariaLabel={"Particle count"}
                            onInput={setParticleCount}
                        />
                    </PageProp>

                    <PageProp
                        key={"travelDurationMs"}
                        label={"Travel (ms)"}
                        hint={"How long one particle takes to walk its path."}
                    >
                        <PageNumberField
                            value={getTravelDurationMs}
                            min={() => ParticleSpawnerKnobs.MIN_TRAVEL_DURATION_MS}
                            max={() => ParticleSpawnerKnobs.MAX_TRAVEL_DURATION_MS}
                            step={() => ParticleSpawnerKnobs.TRAVEL_DURATION_STEP_MS}
                            width={() => FIELD_WIDTH}
                            ariaLabel={"Travel duration in milliseconds"}
                            onInput={setTravelDurationMs}
                        />
                    </PageProp>

                    <PageProp
                        key={"retentionMs"}
                        label={"Retention (ms)"}
                        hint={"How long a particle stays put at the end of its path before it disappears."}
                    >
                        <PageNumberField
                            value={getRetentionMs}
                            min={() => ParticleSpawnerKnobs.MIN_RETENTION_MS}
                            max={() => ParticleSpawnerKnobs.MAX_RETENTION_MS}
                            step={() => ParticleSpawnerKnobs.RETENTION_STEP_MS}
                            width={() => FIELD_WIDTH}
                            ariaLabel={"Retention in milliseconds"}
                            onInput={setRetentionMs}
                        />
                    </PageProp>

                    <PageProp
                        key={"spawnDelayMs"}
                        label={"Spawn delay (ms)"}
                        hint={
                            "How long each particle waits after the one before it sets off, which is what staggers them."
                        }
                    >
                        <PageNumberField
                            value={getSpawnDelayMs}
                            min={() => ParticleSpawnerKnobs.MIN_SPAWN_DELAY_MS}
                            max={() => ParticleSpawnerKnobs.MAX_SPAWN_DELAY_MS}
                            step={() => ParticleSpawnerKnobs.SPAWN_DELAY_STEP_MS}
                            width={() => FIELD_WIDTH}
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
                    >
                        <PageSelectField
                            value={getIterationPatternKey}
                            values={() => ITERATION_PATTERN_KEYS}
                            width={() => FIELD_WIDTH}
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
                    >
                        <PageNumberField
                            value={getOvershootPercent}
                            min={() => ParticleSpawnerKnobs.MIN_OVERSHOOT_PERCENT}
                            max={() => ParticleSpawnerKnobs.MAX_OVERSHOOT_PERCENT}
                            step={() => ParticleSpawnerKnobs.OVERSHOOT_PERCENT_STEP}
                            width={() => FIELD_WIDTH}
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
                    >
                        <PageSelectField
                            value={getTravelEasingKey}
                            values={() => TRAVEL_EASING_KEYS}
                            width={() => FIELD_WIDTH}
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
