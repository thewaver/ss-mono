import { type ReactNode, useMemo, useState } from "react";

import {
    PARTICLE_SPAWNER_DEFAULTS,
    type ParticleIterationPatternType,
    ParticleIterationPatterns,
    type ParticleTravelEasingType,
    ParticleTravelEasings,
    type ParticleTravelPathType,
    ParticleTravelPaths,
} from "@thewaver/ss-components-react";
import { ParticleSpawnerKnobs } from "@thewaver/ss-playground/App/Knobs/ParticleSpawners.const";
import { EXAMPLES_ONLY_PROP } from "@thewaver/ss-playground/App/PageComponents/Prop/Prop.const";
import {
    BOX_HEIGHT,
    BOX_WIDTH,
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
    NO_TRAVEL_DEFS,
    STRESS_ITEMS,
    STRESS_PARTICLE_COUNT,
    STRESS_SPAWN_DELAY_MS,
} from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.css";

import { PageExampleKnobs } from "../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageCheckField, PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageKnobs } from "../../PageComponents/Knobs/Knobs";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PagePlaybackScrubber } from "../../PageComponents/PlaybackScrubber/PlaybackScrubber";
import { PlaybackScrubberUtils } from "../../PageComponents/PlaybackScrubber/PlaybackScrubber.utils";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsDivider, PagePropsGroups, PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { StressTest } from "../../PageComponents/StressTest/StressTest";
import { AttractionExample } from "./Examples/Attraction";
import { DiagonalExample } from "./Examples/Diagonal";
import { GridExample } from "./Examples/Grid";
import { ManyToOneExample } from "./Examples/ManyToOne";
import { MovingTargetExample } from "./Examples/MovingTarget";
import { MultipleTargetsExample } from "./Examples/MultipleTargets";
import { RadialExample } from "./Examples/Radial";
import { RoundTripExample } from "./Examples/RoundTrip";
import { SingleTargetExample } from "./Examples/SingleTarget";
import { VerticalExample } from "./Examples/Vertical";
import { WindExample } from "./Examples/Wind";
import type { ParticleSpawnerExampleProps } from "./ParticleSpawnerPage.types";

type PlaybackPair = readonly [boolean, (isPlaying: boolean) => void];

type ProgressPair = readonly [number, (value: number) => void];

const NO_FOLLOWERS: Record<number, number> = {};

const ScrubbedExampleWrapper = (props: {
    id: string;
    isPagePlaying: boolean;
    playback: PlaybackPair;
    renderExample: (
        playback: PlaybackPair,
        progress: ProgressPair,
        takeProgress: (index: number) => ProgressPair,
    ) => ReactNode;
}) => {
    const [progress, setProgress] = useState(0);
    const [followers, setFollowers] = useState(NO_FOLLOWERS);

    const takeProgress = (index: number): ProgressPair => [
        followers[index] ?? progress,
        (value) => setFollowers((previous) => ({ ...previous, [index]: value })),
    ];

    const scrubbedProgress: ProgressPair = [
        progress,
        (value) => {
            setProgress(value);
            setFollowers(NO_FOLLOWERS);
        },
    ];

    return (
        <div className={styles.stack}>
            <PageMeasureBox width={BOX_WIDTH} height={BOX_HEIGHT}>
                {props.renderExample(
                    PlaybackScrubberUtils.gate(props.playback, props.isPagePlaying),
                    [progress, setProgress],
                    takeProgress,
                )}
            </PageMeasureBox>

            <PagePlaybackScrubber
                id={props.id}
                ariaLabel={"Position in the round"}
                playback={props.playback}
                progress={scrubbedProgress}
            />
        </div>
    );
};

const WindExampleWrapper = (props: {
    exampleProps: ParticleSpawnerExampleProps;
    isPagePlaying: boolean;
    playback: PlaybackPair;
}) => {
    const [directionDegrees, setDirectionDegrees] = useState(ParticleSpawnerKnobs.STARTING_WIND_DIRECTION_DEGREES);
    const [strengthPixels, setStrengthPixels] = useState(ParticleSpawnerKnobs.STARTING_WIND_STRENGTH_PIXELS);
    const [gustRatio, setGustRatio] = useState(ParticleSpawnerKnobs.STARTING_WIND_GUST_RATIO);

    return (
        <>
            <ScrubbedExampleWrapper
                id={"wind"}
                isPagePlaying={props.isPagePlaying}
                playback={props.playback}
                renderExample={(examplePlayback, progress) => (
                    <WindExample
                        {...props.exampleProps}
                        playback={examplePlayback}
                        progress={progress}
                        windDirectionDegrees={directionDegrees}
                        windStrengthPixels={strengthPixels}
                        windGustRatio={gustRatio}
                    />
                )}
            />

            <PageExampleKnobs>
                <PageProp
                    itemKey={"windDirectionDegrees"}
                    label={"Direction (degrees)"}
                    hint={"Which way the wind blows, in degrees clockwise from rightward. 90 blows down."}
                    controls={
                        "Sets directionDegrees of ParticleModifierUtils.createWind, sent to ParticleSpawnerProps.particleModifiers"
                    }
                >
                    <PageNumberField
                        value={directionDegrees}
                        min={ParticleSpawnerKnobs.MIN_WIND_DIRECTION_DEGREES}
                        max={ParticleSpawnerKnobs.MAX_WIND_DIRECTION_DEGREES}
                        step={ParticleSpawnerKnobs.WIND_DIRECTION_STEP_DEGREES}
                        width={FIELD_WIDTH}
                        ariaLabel={"Wind direction in degrees"}
                        onInput={setDirectionDegrees}
                    />
                </PageProp>

                <PageProp
                    itemKey={"windStrengthPixels"}
                    label={"Strength (px)"}
                    hint={"How far a particle is carried off its path halfway along it, between gusts."}
                    controls={
                        "Sets strengthPixels of ParticleModifierUtils.createWind, sent to ParticleSpawnerProps.particleModifiers"
                    }
                >
                    <PageNumberField
                        value={strengthPixels}
                        min={ParticleSpawnerKnobs.MIN_WIND_STRENGTH_PIXELS}
                        max={ParticleSpawnerKnobs.MAX_WIND_STRENGTH_PIXELS}
                        step={ParticleSpawnerKnobs.WIND_STRENGTH_STEP_PIXELS}
                        width={FIELD_WIDTH}
                        ariaLabel={"Wind strength in pixels"}
                        onInput={setStrengthPixels}
                    />
                </PageProp>

                <PageProp
                    itemKey={"windGustRatio"}
                    label={"Gusts"}
                    hint={"How much the strength swings above and below itself over time. 0 is a steady wind."}
                    controls={
                        "Sets gustRatio of ParticleModifierUtils.createWind, sent to ParticleSpawnerProps.particleModifiers"
                    }
                >
                    <PageNumberField
                        value={gustRatio}
                        min={ParticleSpawnerKnobs.MIN_WIND_GUST_RATIO}
                        max={ParticleSpawnerKnobs.MAX_WIND_GUST_RATIO}
                        step={ParticleSpawnerKnobs.WIND_GUST_RATIO_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Wind gusts"}
                        onInput={setGustRatio}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const AttractionExampleWrapper = (props: {
    exampleProps: ParticleSpawnerExampleProps;
    isPagePlaying: boolean;
    playback: PlaybackPair;
}) => {
    const [strengthRatio, setStrengthRatio] = useState(ParticleSpawnerKnobs.STARTING_ATTRACTION_STRENGTH_RATIO);
    const [reachPixels, setReachPixels] = useState(ParticleSpawnerKnobs.STARTING_ATTRACTION_REACH_PIXELS);

    return (
        <>
            <ScrubbedExampleWrapper
                id={"attraction"}
                isPagePlaying={props.isPagePlaying}
                playback={props.playback}
                renderExample={(examplePlayback, progress) => (
                    <AttractionExample
                        {...props.exampleProps}
                        playback={examplePlayback}
                        progress={progress}
                        attractionStrengthRatio={strengthRatio}
                        attractionReachPixels={reachPixels}
                    />
                )}
            />

            <PageExampleKnobs>
                <PageProp
                    itemKey={"attractionStrengthRatio"}
                    label={"Strength"}
                    hint={"How much of the way to the ring a particle passing right by it is drawn."}
                    controls={
                        "Sets strengthRatio of ParticleModifierUtils.createAttraction, sent to ParticleSpawnerProps.particleModifiers"
                    }
                >
                    <PageNumberField
                        value={strengthRatio}
                        min={ParticleSpawnerKnobs.MIN_ATTRACTION_STRENGTH_RATIO}
                        max={ParticleSpawnerKnobs.MAX_ATTRACTION_STRENGTH_RATIO}
                        step={ParticleSpawnerKnobs.ATTRACTION_STRENGTH_RATIO_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Attraction strength"}
                        onInput={setStrengthRatio}
                    />
                </PageProp>

                <PageProp
                    itemKey={"attractionReachPixels"}
                    label={"Reach (px)"}
                    hint={
                        "How far from the ring the pull is felt at all. Particles passing farther away are left alone."
                    }
                    controls={
                        "Sets reachPixels of ParticleModifierUtils.createAttraction, sent to ParticleSpawnerProps.particleModifiers"
                    }
                >
                    <PageNumberField
                        value={reachPixels}
                        min={ParticleSpawnerKnobs.MIN_ATTRACTION_REACH_PIXELS}
                        max={ParticleSpawnerKnobs.MAX_ATTRACTION_REACH_PIXELS}
                        step={ParticleSpawnerKnobs.ATTRACTION_REACH_STEP_PIXELS}
                        width={FIELD_WIDTH}
                        ariaLabel={"Attraction reach in pixels"}
                        onInput={setReachPixels}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const StressTestWrapper = (props: ParticleSpawnerExampleProps) => {
    const modalPlayback = useState(true);

    const [isOnGraphicsCard, setIsOnGraphicsCard] = useState(true);

    return (
        <>
            <PagePropsPanel scope={"local"} hasReset={false}>
                <PageProp
                    itemKey={"onGraphicsCard"}
                    label={"On the graphics card"}
                    hint={
                        "Draws each spawner's particles in one canvas that follows them, with their positions worked out as before. Off, every particle is an element of its own."
                    }
                    controls={"Sets ParticleSpawnerProps.renderer in the stress test"}
                >
                    <PageCheckField
                        value={isOnGraphicsCard}
                        ariaLabel={"On the graphics card"}
                        onChange={setIsOnGraphicsCard}
                    />
                </PageProp>
            </PagePropsPanel>

            <StressTest
                configs={STRESS_ITEMS}
                onShowModal={() => props.playback[1](false)}
                onHideModal={() => props.playback[1](true)}
                renderLabel={(configIndex) => `Render ${STRESS_ITEMS[configIndex].count} spawners`}
                renderItem={(configIndex) => (
                    <PageMeasureBox width={STRESS_ITEMS[configIndex].size} height={STRESS_ITEMS[configIndex].size}>
                        <SingleTargetExample
                            {...props}
                            particleCount={STRESS_PARTICLE_COUNT}
                            spawnDelayMs={STRESS_SPAWN_DELAY_MS}
                            playback={modalPlayback}
                            renderer={isOnGraphicsCard ? "graphics_card" : "elements"}
                        />
                    </PageMeasureBox>
                )}
            />
        </>
    );
};

export const ParticleSpawnerPage = () => {
    const [particleCount, setParticleCount] = useState(ParticleSpawnerKnobs.STARTING_PARTICLE_COUNT);
    const [travelDurationMs, setTravelDurationMs] = useState(PARTICLE_SPAWNER_DEFAULTS.travelDurationMs);
    const [restDurationMs, setRestDurationMs] = useState(PARTICLE_SPAWNER_DEFAULTS.restDurationMs);
    const [spawnDelayMs, setSpawnDelayMs] = useState(ParticleSpawnerKnobs.STARTING_SPAWN_DELAY_MS);
    const [overshootPercent, setOvershootPercent] = useState(ParticleSpawnerKnobs.STARTING_OVERSHOOT_PERCENT);
    const [travelEasingKey, setTravelEasingKey] = useState<ParticleTravelEasingType>(
        ParticleSpawnerKnobs.STARTING_TRAVEL_EASING_KEY,
    );

    const [travelPatternKey, setTravelPatternKey] = useState<ParticleTravelPathType>(
        ParticleSpawnerKnobs.STARTING_TRAVEL_PATTERN_KEY,
    );

    const [iterationPatternKey, setIterationPatternKey] = useState<ParticleIterationPatternType>(
        ParticleSpawnerKnobs.STARTING_ITERATION_PATTERN_KEY,
    );

    const [areTargetsHidden, setAreTargetsHidden] = useState(ParticleSpawnerKnobs.STARTING_ARE_TARGETS_HIDDEN);

    const [travelDefs, setTravelDefs] = useState<Record<string, Record<string, number | boolean>>>({});
    const playback = useState(true);
    const takePlayback = PlaybackScrubberUtils.useGroup("singleTarget");

    const travelKnobs = ParticleSpawnerKnobs.TRAVEL_KNOBS_BY_PATTERN[travelPatternKey];
    const travelDefaults = ParticleTravelPaths.DEFAULT_OPTS[travelPatternKey];
    const pickedTravelDefs = travelDefs[travelPatternKey] ?? NO_TRAVEL_DEFS;

    const computeParticlePos = useMemo(() => {
        const evaluate = ParticleTravelPaths.SAMPLE_PATHS[travelPatternKey]({
            ...travelDefaults,
            ...pickedTravelDefs,
        } as Record<string, number>);
        const easingFn = ParticleTravelEasings.SAMPLE_EASINGS[travelEasingKey];

        return (defs: Parameters<typeof evaluate>[0], t: number) =>
            evaluate(defs, ParticleTravelEasings.applyOvershoot(t, easingFn(t), overshootPercent));
    }, [travelPatternKey, travelDefaults, pickedTravelDefs, travelEasingKey, overshootPercent]);

    const commonProps: ParticleSpawnerExampleProps = {
        particleCount,
        travelDurationMs,
        restDurationMs,
        spawnDelayMs,
        spawnIterationPatterns: ParticleIterationPatterns.SAMPLE_PATTERNS[iterationPatternKey],
        computeParticlePos,
        areTargetsHidden,
        playback,
    };

    const examples = [
        {
            key: "singleTarget",
            name: EXAMPLE_NAMES.singleTarget,
            component: () => (
                <ScrubbedExampleWrapper
                    id={"singleTarget"}
                    isPagePlaying={playback[0]}
                    playback={takePlayback("singleTarget")}
                    renderExample={(examplePlayback, progress) => (
                        <SingleTargetExample {...commonProps} playback={examplePlayback} progress={progress} />
                    )}
                />
            ),
            path: `${EXAMPLES_ROOT}/SingleTarget.tsx`,
        },
        {
            key: "vertical",
            name: EXAMPLE_NAMES.vertical,
            component: () => (
                <ScrubbedExampleWrapper
                    id={"vertical"}
                    isPagePlaying={playback[0]}
                    playback={takePlayback("vertical")}
                    renderExample={(examplePlayback, progress) => (
                        <VerticalExample {...commonProps} playback={examplePlayback} progress={progress} />
                    )}
                />
            ),
            path: `${EXAMPLES_ROOT}/Vertical.tsx`,
        },
        {
            key: "diagonal",
            name: EXAMPLE_NAMES.diagonal,
            component: () => (
                <ScrubbedExampleWrapper
                    id={"diagonal"}
                    isPagePlaying={playback[0]}
                    playback={takePlayback("diagonal")}
                    renderExample={(examplePlayback, progress) => (
                        <DiagonalExample {...commonProps} playback={examplePlayback} progress={progress} />
                    )}
                />
            ),
            path: `${EXAMPLES_ROOT}/Diagonal.tsx`,
        },
        {
            key: "movingTarget",
            name: EXAMPLE_NAMES.movingTarget,
            component: () => (
                <ScrubbedExampleWrapper
                    id={"movingTarget"}
                    isPagePlaying={playback[0]}
                    playback={takePlayback("movingTarget")}
                    renderExample={(examplePlayback, progress) => (
                        <MovingTargetExample {...commonProps} playback={examplePlayback} progress={progress} />
                    )}
                />
            ),
            path: `${EXAMPLES_ROOT}/MovingTarget.tsx`,
        },
        {
            key: "radial",
            name: EXAMPLE_NAMES.radial,
            component: () => (
                <ScrubbedExampleWrapper
                    id={"radial"}
                    isPagePlaying={playback[0]}
                    playback={takePlayback("radial")}
                    renderExample={(examplePlayback, progress) => (
                        <RadialExample {...commonProps} playback={examplePlayback} progress={progress} />
                    )}
                />
            ),
            path: `${EXAMPLES_ROOT}/Radial.tsx`,
        },
        {
            key: "manyToOne",
            name: EXAMPLE_NAMES.manyToOne,
            component: () => (
                <ScrubbedExampleWrapper
                    id={"manyToOne"}
                    isPagePlaying={playback[0]}
                    playback={takePlayback("manyToOne")}
                    renderExample={(examplePlayback, progress, takeProgress) => (
                        <ManyToOneExample
                            {...commonProps}
                            playback={examplePlayback}
                            progress={progress}
                            takeProgress={takeProgress}
                        />
                    )}
                />
            ),
            path: `${EXAMPLES_ROOT}/ManyToOne.tsx`,
        },
        {
            key: "roundTrip",
            name: EXAMPLE_NAMES.roundTrip,
            component: () => (
                <ScrubbedExampleWrapper
                    id={"roundTrip"}
                    isPagePlaying={playback[0]}
                    playback={takePlayback("roundTrip")}
                    renderExample={(examplePlayback, progress) => (
                        <RoundTripExample {...commonProps} playback={examplePlayback} progress={progress} />
                    )}
                />
            ),
            path: `${EXAMPLES_ROOT}/RoundTrip.tsx`,
        },
        {
            key: "wind",
            name: EXAMPLE_NAMES.wind,
            component: () => (
                <WindExampleWrapper
                    exampleProps={commonProps}
                    isPagePlaying={playback[0]}
                    playback={takePlayback("wind")}
                />
            ),
            path: `${EXAMPLES_ROOT}/Wind.tsx`,
        },
        {
            key: "attraction",
            name: EXAMPLE_NAMES.attraction,
            component: () => (
                <AttractionExampleWrapper
                    exampleProps={commonProps}
                    isPagePlaying={playback[0]}
                    playback={takePlayback("attraction")}
                />
            ),
            path: `${EXAMPLES_ROOT}/Attraction.tsx`,
        },
        {
            key: "multipleTargets",
            name: EXAMPLE_NAMES.multipleTargets,
            component: () => (
                <ScrubbedExampleWrapper
                    id={"multipleTargets"}
                    isPagePlaying={playback[0]}
                    playback={takePlayback("multipleTargets")}
                    renderExample={(examplePlayback, progress) => (
                        <MultipleTargetsExample {...commonProps} playback={examplePlayback} progress={progress} />
                    )}
                />
            ),
            path: `${EXAMPLES_ROOT}/MultipleTargets.tsx`,
        },
        {
            key: "grid",
            name: EXAMPLE_NAMES.grid,
            component: () => (
                <ScrubbedExampleWrapper
                    id={"grid"}
                    isPagePlaying={playback[0]}
                    playback={takePlayback("grid")}
                    renderExample={(examplePlayback, progress, takeProgress) => (
                        <GridExample
                            {...commonProps}
                            playback={examplePlayback}
                            progress={progress}
                            takeProgress={takeProgress}
                        />
                    )}
                />
            ),
            path: `${EXAMPLES_ROOT}/Grid.tsx`,
        },
        {
            key: "stressTest",
            name: EXAMPLE_NAMES.stressTest,
            component: () => <StressTestWrapper {...commonProps} />,
        },
    ];

    return (
        <>
            <PagePropsGroups>
                <PagePropsPanel scope={"sample"}>
                    <PageProp
                        itemKey={"travelPattern"}
                        label={"Travel pattern"}
                        hint={
                            "The path a particle takes from where it starts to where it ends. Choosing one brings its own knobs with it."
                        }
                        controls={
                            "Picks the example's travel path function sent to ParticleSpawnerProps.computeParticlePos"
                        }
                    >
                        <PageSelectField
                            value={travelPatternKey}
                            values={ParticleTravelPaths.PATH_TYPES}
                            width={FIELD_WIDTH}
                            ariaLabel={"Travel pattern"}
                            onChange={(key) => setTravelPatternKey(key)}
                        />
                    </PageProp>

                    <PageKnobs
                        knobs={travelKnobs}
                        defaults={travelDefaults}
                        values={pickedTravelDefs}
                        width={FIELD_WIDTH}
                        onInput={(key, value) =>
                            setTravelDefs((defs) => ({
                                ...defs,
                                [travelPatternKey]: { ...defs[travelPatternKey], [key]: value },
                            }))
                        }
                    />
                </PagePropsPanel>

                <PagePropsDivider />

                <PagePropsPanel scope={"global"}>
                    <PageProp
                        itemKey={"particleCount"}
                        label={"Particle count"}
                        hint={"How many particles are sent on each round."}
                        controls={"Sets ParticleSpawnerProps.particleCount"}
                    >
                        <PageNumberField
                            value={particleCount}
                            min={ParticleSpawnerKnobs.MIN_PARTICLE_COUNT}
                            max={ParticleSpawnerKnobs.MAX_PARTICLE_COUNT}
                            step={ParticleSpawnerKnobs.PARTICLE_COUNT_STEP}
                            width={FIELD_WIDTH}
                            ariaLabel={"Particle count"}
                            onInput={setParticleCount}
                        />
                    </PageProp>

                    <PageProp
                        itemKey={"travelDurationMs"}
                        label={"Travel (ms)"}
                        hint={"How long one particle takes to walk its path."}
                        controls={"Sets ParticleSpawnerProps.travelDurationMs"}
                    >
                        <PageNumberField
                            value={travelDurationMs}
                            min={ParticleSpawnerKnobs.MIN_TRAVEL_DURATION_MS}
                            max={ParticleSpawnerKnobs.MAX_TRAVEL_DURATION_MS}
                            step={ParticleSpawnerKnobs.TRAVEL_DURATION_STEP_MS}
                            width={FIELD_WIDTH}
                            ariaLabel={"Travel duration in milliseconds"}
                            onInput={setTravelDurationMs}
                        />
                    </PageProp>

                    <PageProp
                        itemKey={"restDurationMs"}
                        label={"Rest duration (ms)"}
                        hint={"How long a particle stays put at the end of its path before it disappears."}
                        controls={"Sets ParticleSpawnerProps.restDurationMs"}
                    >
                        <PageNumberField
                            value={restDurationMs}
                            min={ParticleSpawnerKnobs.MIN_RETENTION_MS}
                            max={ParticleSpawnerKnobs.MAX_RETENTION_MS}
                            step={ParticleSpawnerKnobs.RETENTION_STEP_MS}
                            width={FIELD_WIDTH}
                            ariaLabel={"Rest duration in milliseconds"}
                            onInput={setRestDurationMs}
                        />
                    </PageProp>

                    <PageProp
                        itemKey={"spawnDelayMs"}
                        label={"Spawn delay (ms)"}
                        hint={
                            "How long each particle waits after the one before it sets off, which is what staggers them."
                        }
                        controls={"Sets ParticleSpawnerProps.spawnDelayMs"}
                    >
                        <PageNumberField
                            value={spawnDelayMs}
                            min={ParticleSpawnerKnobs.MIN_SPAWN_DELAY_MS}
                            max={ParticleSpawnerKnobs.MAX_SPAWN_DELAY_MS}
                            step={ParticleSpawnerKnobs.SPAWN_DELAY_STEP_MS}
                            width={FIELD_WIDTH}
                            ariaLabel={"Spawn delay in milliseconds"}
                            onInput={setSpawnDelayMs}
                        />
                    </PageProp>

                    <PageProp
                        itemKey={"iterationPattern"}
                        label={"Iteration pattern"}
                        hint={
                            "How the rounds follow each other: in bursts of three with a pause, one at a time with a pause, or without any pause at all."
                        }
                        controls={
                            "Picks the example's list of rounds sent to ParticleSpawnerProps.spawnIterationPatterns"
                        }
                    >
                        <PageSelectField
                            value={iterationPatternKey}
                            values={ParticleIterationPatterns.PATTERN_TYPES}
                            width={FIELD_WIDTH}
                            ariaLabel={"Iteration pattern"}
                            onChange={(key) => setIterationPatternKey(key)}
                        />
                    </PageProp>

                    <PageProp
                        itemKey={"overshootPercent"}
                        label={"Overshoot (%)"}
                        hint={
                            "How far a particle runs past its destination before coming back to it. 0 stops it dead on target."
                        }
                        controls={
                            "Sets how far the example's travel path runs past its end, sent to ParticleSpawnerProps.computeParticlePos"
                        }
                    >
                        <PageNumberField
                            value={overshootPercent}
                            min={ParticleSpawnerKnobs.MIN_OVERSHOOT_PERCENT}
                            max={ParticleSpawnerKnobs.MAX_OVERSHOOT_PERCENT}
                            step={ParticleSpawnerKnobs.OVERSHOOT_PERCENT_STEP}
                            width={FIELD_WIDTH}
                            ariaLabel={"Overshoot percent"}
                            onInput={setOvershootPercent}
                        />
                    </PageProp>

                    <PageProp
                        itemKey={"areTargetsHidden"}
                        label={"Hide targets"}
                        hint={
                            "Takes the target markers out of sight while leaving them where they are, so the particles still land on them."
                        }
                        controls={EXAMPLES_ONLY_PROP}
                    >
                        <PageCheckField
                            value={areTargetsHidden}
                            ariaLabel={"Hide targets"}
                            onChange={setAreTargetsHidden}
                        />
                    </PageProp>

                    <PageProp
                        itemKey={"travelEasing"}
                        label={"Travel easing"}
                        hint={"The speed curve a particle follows along its path."}
                        controls={
                            "Picks the speed curve of the example's travel path, sent to ParticleSpawnerProps.computeParticlePos"
                        }
                    >
                        <PageSelectField
                            value={travelEasingKey}
                            values={ParticleTravelEasings.EASING_TYPES}
                            width={FIELD_WIDTH}
                            ariaLabel={"Travel easing"}
                            onChange={(key) => setTravelEasingKey(key)}
                        />
                    </PageProp>
                </PagePropsPanel>
            </PagePropsGroups>

            <PageExamples items={examples} layout={"flow"} />
        </>
    );
};
