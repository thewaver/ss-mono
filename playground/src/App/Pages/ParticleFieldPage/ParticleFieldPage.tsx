import { type Signal, createMemo, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import { CellAnimationKeyframes, CellAnimationOrigins, CellAnimationWeights } from "@thewaver/ss-components";
import { type Index2d, ShapeConst } from "@thewaver/ss-utils";

import { ParticleFieldKnobs } from "../../Knobs/ParticleFields.const";
import { PageExampleKnobs } from "../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PagePlaybackScrubber } from "../../PageComponents/PlaybackScrubber/PlaybackScrubber";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { StressTest } from "../../PageComponents/StressTest/StressTest";
import type { StressTestDefs } from "../../PageComponents/StressTest/StressText.types";
import {
    PageCheckField,
    PageGroupedSelectField,
    PageNumberField,
    PageSelectField,
} from "../../StyledComponents/Field/Field";
import { DefaultExample } from "./Examples/Default";
import { ShapedExample } from "./Examples/Shaped";
import type { ParticleFieldExampleProps } from "./ParticleFieldPage.types";

import * as styles from "./ParticleFieldPage.css";

const EXAMPLES_ROOT = "/src/App/Pages/ParticleFieldPage/Examples";
const BOX_WIDTH = 320;
const BOX_HEIGHT = 320;
const SHAPED_BOX_SIZE = 320;
const PERCENT = 100;

const STRESS_CELL_COUNT: Index2d = { col: 11, row: 11 };
const STRESS_ITEM_SIZE = 120;
const STRESS_ITEMS: (StressTestDefs & { size: number })[] = [
    { count: 4 * 3, cols: 4, gap: 10, size: STRESS_ITEM_SIZE },
    { count: 6 * 4, cols: 6, gap: 10, size: STRESS_ITEM_SIZE },
    { count: 8 * 6, cols: 8, gap: 10, size: STRESS_ITEM_SIZE },
    { count: 12 * 6, cols: 12, gap: 10, size: STRESS_ITEM_SIZE },
];

const extractOptionGroupWord = (key: string) => key.replace(/^_/, "").match(/^[a-z]+/)?.[0] ?? key;

const groupOptions = <T extends string>(keys: readonly T[]) => {
    const result: Record<string, T[]> = {};

    for (const key of keys) {
        const group = extractOptionGroupWord(key);

        result[group] ??= [];
        result[group].push(key);
    }

    return Object.entries(result);
};

const GROUPPED_WEIGHTS = groupOptions(CellAnimationWeights.WEIGHT_TYPES);
const GROUPPED_ANIMATIONS = groupOptions(CellAnimationKeyframes.ANIMATION_TYPES);

const DefaultExampleWrapper = (
    props: ParticleFieldExampleProps & { progressSignal: Signal<number>; ownPlaybackSignal: Signal<boolean> },
) => {
    return (
        <div class={styles.stack}>
            <PageMeasureBox width={() => BOX_WIDTH} height={() => BOX_HEIGHT}>
                <DefaultExample
                    {...props}
                    playbackSignal={props.ownPlaybackSignal}
                    progressSignal={props.progressSignal}
                />
            </PageMeasureBox>

            <PagePlaybackScrubber
                id={"particleField"}
                ariaLabel={"Position in the pass"}
                playbackSignal={props.ownPlaybackSignal}
                progressSignal={props.progressSignal}
            />
        </div>
    );
};

const ShapedExampleWrapper = (props: ParticleFieldExampleProps) => {
    const [getShapeKind, setShapeKind] = createSignal<ShapeConst.DefaultShape>(ParticleFieldKnobs.STARTING_SHAPE_KIND);
    const [getJoinRadius, setJoinRadius] = createSignal(ParticleFieldKnobs.STARTING_JOIN_RADIUS);

    return (
        <>
            <PageMeasureBox width={() => SHAPED_BOX_SIZE} height={() => SHAPED_BOX_SIZE}>
                <ShapedExample {...props} shapeKind={getShapeKind} joinRadius={getJoinRadius} />
            </PageMeasureBox>

            <PageExampleKnobs>
                <PageProp
                    key={"shapeKind"}
                    label={"Shape"}
                    hint={"The area particles may appear in. A cell spawns only when its center is inside it."}
                >
                    <PageSelectField
                        value={getShapeKind}
                        values={() => ShapeConst.DEFAULT_SHAPES}
                        ariaLabel={"Shape"}
                        onChange={(kind) => setShapeKind(() => kind)}
                    />
                </PageProp>

                <PageProp
                    key={"joinRadius"}
                    label={"Corner radius"}
                    hint={"How far each corner of the area is rounded, as the Shape page rounds them."}
                >
                    <PageNumberField
                        value={getJoinRadius}
                        min={() => ParticleFieldKnobs.MIN_JOIN_RADIUS}
                        max={() => ParticleFieldKnobs.MAX_JOIN_RADIUS}
                        step={() => ParticleFieldKnobs.JOIN_RADIUS_STEP}
                        ariaLabel={"Corner radius"}
                        onInput={setJoinRadius}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const StressTestWrapper = (props: ParticleFieldExampleProps) => {
    const modalPlayback = createSignal(true);

    return (
        <>
            <div>{`${STRESS_CELL_COUNT.col} x ${STRESS_CELL_COUNT.row} cells`}</div>

            <StressTest
                configs={() => STRESS_ITEMS}
                onShowModal={() => props.playbackSignal[1](false)}
                onHideModal={() => props.playbackSignal[1](true)}
                renderLabel={(getConfigIndex) => `Render ${STRESS_ITEMS[getConfigIndex()].count} fields`}
                renderItem={(getConfigIndex) => (
                    <PageMeasureBox
                        width={() => STRESS_ITEMS[getConfigIndex()].size}
                        height={() => STRESS_ITEMS[getConfigIndex()].size}
                    >
                        <DefaultExample {...props} playbackSignal={modalPlayback} cellCount={() => STRESS_CELL_COUNT} />
                    </PageMeasureBox>
                )}
            />
        </>
    );
};

export const ParticleFieldPage = () => {
    const playback = createSignal(true);
    const defaultPlayback = createSignal(true);
    const progress = createSignal(0);

    const [getSpawnChance, setSpawnChance] = createSignal(ParticleFieldKnobs.STARTING_SPAWN_CHANCE);
    const [getDurationMs, setDurationMs] = createSignal(ParticleFieldKnobs.STARTING_DURATION_MS);
    const [getLifetimeMs, setLifetimeMs] = createSignal(ParticleFieldKnobs.STARTING_LIFETIME_MS);
    const [getIterationDelayMs, setIterationDelayMs] = createSignal(ParticleFieldKnobs.STARTING_ITERATION_DELAY_MS);
    const [getHoldShare, setHoldShare] = createSignal(ParticleFieldKnobs.STARTING_HOLD_SHARE);
    const [getIsScattered, setIsScattered] = createSignal(ParticleFieldKnobs.STARTING_IS_SCATTERED);
    const [getOriginType, setOriginType] = createSignal<CellAnimationOrigins.OriginType>(
        ParticleFieldKnobs.STARTING_ORIGIN_KEY,
    );
    const [getWeightType, setWeightType] = createSignal<CellAnimationWeights.WeightType>(
        ParticleFieldKnobs.STARTING_WEIGHT_KEY,
    );
    const [getAnimationType, setAnimationType] = createSignal<CellAnimationKeyframes.AnimationType>(
        ParticleFieldKnobs.STARTING_ANIMATION_KEY,
    );
    const [cellCount, setCellCount] = createStore<Index2d>({ ...ParticleFieldKnobs.STARTING_CELL_COUNT });

    const getExamples = createMemo(() => {
        const commonProps: ParticleFieldExampleProps = {
            cellCount: () => ({ ...cellCount }),
            spawnChance: getSpawnChance,
            animationIterationDelayMs: getIterationDelayMs,
            animationDurationMs: getDurationMs,
            particleLifetimeMs: getLifetimeMs,
            originType: getOriginType,
            weightType: getWeightType,
            animationType: getAnimationType,
            holdShare: getHoldShare,
            isScattered: getIsScattered,
            playbackSignal: playback,
        };

        return [
            {
                key: "default",
                name: "The whole box",
                readout: () =>
                    `${Math.round(progress[0]() * PERCENT)}% through the pass, ${defaultPlayback[0]() ? "running" : "stopped"} — the progress signal is written by the field while it plays, and writing it moves the pass there`,
                component: () => (
                    <DefaultExampleWrapper
                        {...commonProps}
                        progressSignal={progress}
                        ownPlaybackSignal={defaultPlayback}
                    />
                ),
                path: `${EXAMPLES_ROOT}/Default.tsx`,
            },
            {
                key: "shaped",
                name: "Inside a shape",
                readout: () =>
                    "the same field, limited to one of the built-in shapes Shape draws; a cell whose center falls outside it never spawns",
                component: () => <ShapedExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Shaped.tsx`,
            },
            {
                key: "stressTest",
                name: "Stress Test",
                component: () => <StressTestWrapper {...commonProps} />,
            },
        ];
    });

    return (
        <div class={styles.root}>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"spawnChance"}
                    label={"Spawn chance (0-1)"}
                    hint={
                        "The chance each cell spawns in a given pass. 1 spawns every cell every pass; lower leaves gaps that change from pass to pass. When a cell does spawn is still its weight's call."
                    }
                >
                    <PageNumberField
                        value={getSpawnChance}
                        min={() => ParticleFieldKnobs.MIN_SPAWN_CHANCE}
                        max={() => ParticleFieldKnobs.MAX_SPAWN_CHANCE}
                        step={() => ParticleFieldKnobs.SPAWN_CHANCE_STEP}
                        ariaLabel={"Spawn chance"}
                        onInput={setSpawnChance}
                    />
                </PageProp>

                <PageProp
                    key={"cellCount"}
                    label={"Cell count (cols x rows)"}
                    hint={"How many columns and rows the field is split into. A cell holds one particle at a time."}
                >
                    <div class={styles.valueList}>
                        <PageNumberField
                            value={() => cellCount.col}
                            min={() => ParticleFieldKnobs.MIN_CELL_COUNT}
                            max={() => ParticleFieldKnobs.MAX_CELL_COUNT}
                            step={() => ParticleFieldKnobs.CELL_COUNT_STEP}
                            ariaLabel={"Columns"}
                            onInput={(value) => setCellCount("col", value)}
                        />
                        <PageNumberField
                            value={() => cellCount.row}
                            min={() => ParticleFieldKnobs.MIN_CELL_COUNT}
                            max={() => ParticleFieldKnobs.MAX_CELL_COUNT}
                            step={() => ParticleFieldKnobs.CELL_COUNT_STEP}
                            ariaLabel={"Rows"}
                            onInput={(value) => setCellCount("row", value)}
                        />
                    </div>
                </PageProp>

                <PageProp
                    key={"originType"}
                    label={"Origin"}
                    hint={
                        "Where in the grid the weights are measured from. It only applies to weights that are measured from a point."
                    }
                >
                    <PageSelectField
                        value={getOriginType}
                        values={() => CellAnimationOrigins.ORIGIN_TYPES}
                        isDisabled={() => !CellAnimationWeights.isOriginAware(getWeightType())}
                        ariaLabel={"Origin"}
                        onChange={(origin) => setOriginType(() => origin)}
                    />
                </PageProp>

                <PageProp
                    key={"weightType"}
                    label={"Weight"}
                    hint={
                        "The same weights CellAnimation uses: a heavy cell spawns early in the pass and a light one late."
                    }
                >
                    <PageGroupedSelectField
                        value={getWeightType}
                        groups={() => GROUPPED_WEIGHTS}
                        ariaLabel={"Weight"}
                        onChange={(weight) => setWeightType(() => weight)}
                    />
                </PageProp>

                <PageProp
                    key={"animationType"}
                    label={"Animation"}
                    hint={
                        "How a particle appears, played forwards as it arrives and backwards as it leaves: CellAnimation's own keyframes."
                    }
                >
                    <PageGroupedSelectField
                        value={getAnimationType}
                        groups={() => GROUPPED_ANIMATIONS}
                        ariaLabel={"Animation"}
                        onChange={(anim) => setAnimationType(() => anim)}
                    />
                </PageProp>

                <PageProp
                    key={"holdShare"}
                    label={"Hold (0-1)"}
                    hint={
                        "How much of a particle's life it spends fully shown, between appearing and disappearing. 1 cuts in and out."
                    }
                >
                    <PageNumberField
                        value={getHoldShare}
                        min={() => ParticleFieldKnobs.MIN_HOLD_SHARE}
                        max={() => ParticleFieldKnobs.MAX_HOLD_SHARE}
                        step={() => ParticleFieldKnobs.HOLD_SHARE_STEP}
                        ariaLabel={"Hold share"}
                        onInput={setHoldShare}
                    />
                </PageProp>

                <PageProp
                    key={"isScattered"}
                    label={"Scatter in cell"}
                    hint={
                        "Places each particle at a random point in its cell rather than at the center, so the grid stops showing."
                    }
                >
                    <PageCheckField value={getIsScattered} ariaLabel={"Scatter in cell"} onChange={setIsScattered} />
                </PageProp>

                <PageProp
                    key={"animationDurationMs"}
                    label={"Duration (ms)"}
                    hint={
                        "How long one pass over the grid takes, and so the shortest time between two spawns from the same cell."
                    }
                >
                    <PageNumberField
                        value={getDurationMs}
                        min={() => ParticleFieldKnobs.MIN_DURATION_MS}
                        max={() => ParticleFieldKnobs.MAX_DURATION_MS}
                        step={() => ParticleFieldKnobs.DURATION_STEP_MS}
                        ariaLabel={"Duration"}
                        onInput={setDurationMs}
                    />
                </PageProp>

                <PageProp
                    key={"particleLifetimeMs"}
                    label={"Lifetime (ms)"}
                    hint={"How long one particle lives, from appearing to being removed."}
                >
                    <PageNumberField
                        value={getLifetimeMs}
                        min={() => ParticleFieldKnobs.MIN_LIFETIME_MS}
                        max={() => ParticleFieldKnobs.MAX_LIFETIME_MS}
                        step={() => ParticleFieldKnobs.DURATION_STEP_MS}
                        ariaLabel={"Lifetime"}
                        onInput={setLifetimeMs}
                    />
                </PageProp>

                <PageProp
                    key={"iterationDelayMs"}
                    label={"Iteration delay (ms)"}
                    hint={"How long the field waits between one pass and the next."}
                >
                    <PageNumberField
                        value={getIterationDelayMs}
                        min={() => ParticleFieldKnobs.MIN_ITERATION_DELAY_MS}
                        max={() => ParticleFieldKnobs.MAX_ITERATION_DELAY_MS}
                        step={() => ParticleFieldKnobs.DURATION_STEP_MS}
                        ariaLabel={"Iteration delay"}
                        onInput={setIterationDelayMs}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} layout={"flow"} />
        </div>
    );
};
