import { type Accessor, type JSX, type Signal, createMemo, createSignal, untrack } from "solid-js";
import { createStore } from "solid-js/store";

import {
    PARTICLE_SPAWNER_DEFAULTS,
    type ParticleIterationPatternType,
    ParticleIterationPatterns,
    type ParticleTravelEasingType,
    ParticleTravelEasings,
    type ParticleTravelPathType,
    ParticleTravelPaths,
    type SignalPair,
} from "@thewaver/ss-components-solid";
import { ParticleSpawnerKnobs } from "@thewaver/ss-playground/App/Knobs/ParticleSpawners.const";
import { EXAMPLES_ONLY_PROP } from "@thewaver/ss-playground/App/PageComponents/Prop/Prop.const";
import {
    BOX_HEIGHT,
    BOX_WIDTH,
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
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

const ScrubbedExampleWrapper = (props: {
    id: string;
    getIsPagePlaying: Accessor<boolean>;
    takePlayback: (key: string) => SignalPair<boolean>;
    renderExample: (
        playback: SignalPair<boolean>,
        progress: Signal<number>,
        takeProgress: () => Signal<number>,
    ) => JSX.Element;
}) => {
    const ownPlayback = props.takePlayback(props.id);
    const progress = createSignal(0);
    const followers: Signal<number>[] = [];

    const takeProgress = () => {
        const follower = createSignal(untrack(progress[0]));

        followers.push(follower);

        return follower;
    };

    const scrubbedProgress: SignalPair<number> = [
        progress[0],
        (value) => {
            progress[1](value);

            for (const [, setFollower] of followers) setFollower(value);
        },
    ];

    return (
        <div class={styles.stack}>
            <PageMeasureBox width={BOX_WIDTH} height={BOX_HEIGHT}>
                {props.renderExample(
                    PlaybackScrubberUtils.gate(ownPlayback, props.getIsPagePlaying),
                    progress,
                    takeProgress,
                )}
            </PageMeasureBox>

            <PagePlaybackScrubber
                id={props.id}
                ariaLabel={"Position in the round"}
                playback={ownPlayback}
                progress={scrubbedProgress}
            />
        </div>
    );
};

const WindExampleWrapper = (props: {
    exampleProps: ParticleSpawnerExampleProps;
    getIsPagePlaying: Accessor<boolean>;
    takePlayback: (key: string) => SignalPair<boolean>;
}) => {
    const [getDirectionDegrees, setDirectionDegrees] = createSignal(
        ParticleSpawnerKnobs.STARTING_WIND_DIRECTION_DEGREES,
    );
    const [getStrengthPixels, setStrengthPixels] = createSignal(ParticleSpawnerKnobs.STARTING_WIND_STRENGTH_PIXELS);
    const [getGustRatio, setGustRatio] = createSignal(ParticleSpawnerKnobs.STARTING_WIND_GUST_RATIO);

    return (
        <>
            <ScrubbedExampleWrapper
                id={"wind"}
                getIsPagePlaying={props.getIsPagePlaying}
                takePlayback={props.takePlayback}
                renderExample={(examplePlayback, progress) => (
                    <WindExample
                        {...props.exampleProps}
                        playback={examplePlayback}
                        progress={progress}
                        windDirectionDegrees={getDirectionDegrees}
                        windStrengthPixels={getStrengthPixels}
                        windGustRatio={getGustRatio}
                    />
                )}
            />

            <PageExampleKnobs>
                <PageProp key={"windDirectionDegrees"} {...ParticleSpawnerKnobs.WIND_DIRECTION_DEGREES_TEXT}>
                    <PageNumberField
                        value={getDirectionDegrees}
                        min={ParticleSpawnerKnobs.MIN_WIND_DIRECTION_DEGREES}
                        max={ParticleSpawnerKnobs.MAX_WIND_DIRECTION_DEGREES}
                        step={ParticleSpawnerKnobs.WIND_DIRECTION_STEP_DEGREES}
                        width={FIELD_WIDTH}
                        ariaLabel={"Wind direction in degrees"}
                        onInput={setDirectionDegrees}
                    />
                </PageProp>

                <PageProp key={"windStrengthPixels"} {...ParticleSpawnerKnobs.WIND_STRENGTH_PIXELS_TEXT}>
                    <PageNumberField
                        value={getStrengthPixels}
                        min={ParticleSpawnerKnobs.MIN_WIND_STRENGTH_PIXELS}
                        max={ParticleSpawnerKnobs.MAX_WIND_STRENGTH_PIXELS}
                        step={ParticleSpawnerKnobs.WIND_STRENGTH_STEP_PIXELS}
                        width={FIELD_WIDTH}
                        ariaLabel={"Wind strength in pixels"}
                        onInput={setStrengthPixels}
                    />
                </PageProp>

                <PageProp key={"windGustRatio"} {...ParticleSpawnerKnobs.WIND_GUST_RATIO_TEXT}>
                    <PageNumberField
                        value={getGustRatio}
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
    getIsPagePlaying: Accessor<boolean>;
    takePlayback: (key: string) => SignalPair<boolean>;
}) => {
    const [getStrengthRatio, setStrengthRatio] = createSignal(ParticleSpawnerKnobs.STARTING_ATTRACTION_STRENGTH_RATIO);
    const [getReachPixels, setReachPixels] = createSignal(ParticleSpawnerKnobs.STARTING_ATTRACTION_REACH_PIXELS);

    return (
        <>
            <ScrubbedExampleWrapper
                id={"attraction"}
                getIsPagePlaying={props.getIsPagePlaying}
                takePlayback={props.takePlayback}
                renderExample={(examplePlayback, progress) => (
                    <AttractionExample
                        {...props.exampleProps}
                        playback={examplePlayback}
                        progress={progress}
                        attractionStrengthRatio={getStrengthRatio}
                        attractionReachPixels={getReachPixels}
                    />
                )}
            />

            <PageExampleKnobs>
                <PageProp key={"attractionStrengthRatio"} {...ParticleSpawnerKnobs.ATTRACTION_STRENGTH_RATIO_TEXT}>
                    <PageNumberField
                        value={getStrengthRatio}
                        min={ParticleSpawnerKnobs.MIN_ATTRACTION_STRENGTH_RATIO}
                        max={ParticleSpawnerKnobs.MAX_ATTRACTION_STRENGTH_RATIO}
                        step={ParticleSpawnerKnobs.ATTRACTION_STRENGTH_RATIO_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Attraction strength"}
                        onInput={setStrengthRatio}
                    />
                </PageProp>

                <PageProp key={"attractionReachPixels"} {...ParticleSpawnerKnobs.ATTRACTION_REACH_PIXELS_TEXT}>
                    <PageNumberField
                        value={getReachPixels}
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
    const modalPlayback = createSignal(true);

    const [getIsOnGraphicsCard, setIsOnGraphicsCard] = createSignal(true);

    return (
        <>
            <PagePropsPanel scope={"local"} hasReset={false}>
                <PageProp key={"onGraphicsCard"} {...ParticleSpawnerKnobs.ON_GRAPHICS_CARD_TEXT}>
                    <PageCheckField
                        value={getIsOnGraphicsCard}
                        ariaLabel={"On the graphics card"}
                        onChange={setIsOnGraphicsCard}
                    />
                </PageProp>
            </PagePropsPanel>

            <StressTest
                configs={STRESS_ITEMS}
                onShowModal={() => props.playback[1](false)}
                onHideModal={() => props.playback[1](true)}
                renderLabel={(getConfigIndex) => `Render ${STRESS_ITEMS[getConfigIndex()].count} spawners`}
                renderItem={(getConfigIndex) => (
                    <PageMeasureBox
                        width={() => STRESS_ITEMS[getConfigIndex()].size}
                        height={() => STRESS_ITEMS[getConfigIndex()].size}
                    >
                        <SingleTargetExample
                            {...props}
                            particleCount={STRESS_PARTICLE_COUNT}
                            spawnDelayMs={STRESS_SPAWN_DELAY_MS}
                            playback={modalPlayback}
                            renderer={() => (getIsOnGraphicsCard() ? "graphics_card" : "elements")}
                        />
                    </PageMeasureBox>
                )}
            />
        </>
    );
};

export const ParticleSpawnerPage = () => {
    const [getParticleCount, setParticleCount] = createSignal(ParticleSpawnerKnobs.STARTING_PARTICLE_COUNT);
    const [getTravelDurationMs, setTravelDurationMs] = createSignal(PARTICLE_SPAWNER_DEFAULTS.travelDurationMs);
    const [getRestDurationMs, setRestDurationMs] = createSignal(PARTICLE_SPAWNER_DEFAULTS.restDurationMs);
    const [getSpawnDelayMs, setSpawnDelayMs] = createSignal(ParticleSpawnerKnobs.STARTING_SPAWN_DELAY_MS);
    const [getOvershootPercent, setOvershootPercent] = createSignal(ParticleSpawnerKnobs.STARTING_OVERSHOOT_PERCENT);
    const [getTravelEasingKey, setTravelEasingKey] = createSignal<ParticleTravelEasingType>(
        ParticleSpawnerKnobs.STARTING_TRAVEL_EASING_KEY,
    );

    const [getTravelPatternKey, setTravelPatternKey] = createSignal<ParticleTravelPathType>(
        ParticleSpawnerKnobs.STARTING_TRAVEL_PATTERN_KEY,
    );

    const [getIterationPatternKey, setIterationPatternKey] = createSignal<ParticleIterationPatternType>(
        ParticleSpawnerKnobs.STARTING_ITERATION_PATTERN_KEY,
    );

    const [getAreTargetsHidden, setAreTargetsHidden] = createSignal(ParticleSpawnerKnobs.STARTING_ARE_TARGETS_HIDDEN);

    const [travelDefs, setTravelDefs] = createStore<Record<string, Record<string, number | boolean>>>({});
    const playback = createSignal(true);
    const takePlayback = PlaybackScrubberUtils.createGroup("singleTarget");

    const getTravelKnobs = () => ParticleSpawnerKnobs.TRAVEL_KNOBS_BY_PATTERN[getTravelPatternKey()];
    const getTravelDefaults = () => ParticleTravelPaths.DEFAULT_OPTS[getTravelPatternKey()];
    const getPickedTravelDefs = () => travelDefs[getTravelPatternKey()] ?? {};

    const getComputeParticlePos = createMemo(() => {
        const evaluate = ParticleTravelPaths.SAMPLE_PATHS[getTravelPatternKey()]({
            ...getTravelDefaults(),
            ...getPickedTravelDefs(),
        } as Record<string, number>);
        const easingFn = ParticleTravelEasings.SAMPLE_EASINGS[getTravelEasingKey()];
        const overshootPercent = getOvershootPercent();

        return (defs: Parameters<typeof evaluate>[0], t: number) =>
            evaluate(defs, ParticleTravelEasings.applyOvershoot(t, easingFn(t), overshootPercent));
    });

    const getExamples = createMemo(() => {
        const commonProps: ParticleSpawnerExampleProps = {
            particleCount: getParticleCount,
            travelDurationMs: getTravelDurationMs,
            restDurationMs: getRestDurationMs,
            spawnDelayMs: getSpawnDelayMs,
            spawnIterationPatterns: () => ParticleIterationPatterns.SAMPLE_PATTERNS[getIterationPatternKey()],
            computeParticlePos: (defs, t) => getComputeParticlePos()(defs, t),
            areTargetsHidden: getAreTargetsHidden,
            playback,
        };

        return [
            {
                key: "singleTarget",
                name: EXAMPLE_NAMES.singleTarget,
                component: () => (
                    <ScrubbedExampleWrapper
                        id={"singleTarget"}
                        getIsPagePlaying={playback[0]}
                        takePlayback={takePlayback}
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
                        getIsPagePlaying={playback[0]}
                        takePlayback={takePlayback}
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
                        getIsPagePlaying={playback[0]}
                        takePlayback={takePlayback}
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
                        getIsPagePlaying={playback[0]}
                        takePlayback={takePlayback}
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
                        getIsPagePlaying={playback[0]}
                        takePlayback={takePlayback}
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
                        getIsPagePlaying={playback[0]}
                        takePlayback={takePlayback}
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
                        getIsPagePlaying={playback[0]}
                        takePlayback={takePlayback}
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
                        getIsPagePlaying={playback[0]}
                        takePlayback={takePlayback}
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
                        getIsPagePlaying={playback[0]}
                        takePlayback={takePlayback}
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
                        getIsPagePlaying={playback[0]}
                        takePlayback={takePlayback}
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
                        getIsPagePlaying={playback[0]}
                        takePlayback={takePlayback}
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
    });

    return (
        <>
            <PagePropsGroups>
                <PagePropsPanel scope={"sample"}>
                    <PageProp key={"travelPattern"} {...ParticleSpawnerKnobs.TRAVEL_PATTERN_TEXT}>
                        <PageSelectField
                            value={getTravelPatternKey}
                            values={ParticleTravelPaths.PATH_TYPES}
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
                    <PageProp key={"particleCount"} {...ParticleSpawnerKnobs.PARTICLE_COUNT_TEXT}>
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

                    <PageProp key={"travelDurationMs"} {...ParticleSpawnerKnobs.TRAVEL_DURATION_MS_TEXT}>
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

                    <PageProp key={"restDurationMs"} {...ParticleSpawnerKnobs.REST_DURATION_MS_TEXT}>
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

                    <PageProp key={"spawnDelayMs"} {...ParticleSpawnerKnobs.SPAWN_DELAY_MS_TEXT}>
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

                    <PageProp key={"iterationPattern"} {...ParticleSpawnerKnobs.ITERATION_PATTERN_TEXT}>
                        <PageSelectField
                            value={getIterationPatternKey}
                            values={ParticleIterationPatterns.PATTERN_TYPES}
                            width={FIELD_WIDTH}
                            ariaLabel={"Iteration pattern"}
                            onChange={(key) => setIterationPatternKey(() => key)}
                        />
                    </PageProp>

                    <PageProp key={"overshootPercent"} {...ParticleSpawnerKnobs.OVERSHOOT_PERCENT_TEXT}>
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

                    <PageProp key={"travelEasing"} {...ParticleSpawnerKnobs.TRAVEL_EASING_TEXT}>
                        <PageSelectField
                            value={getTravelEasingKey}
                            values={ParticleTravelEasings.EASING_TYPES}
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
