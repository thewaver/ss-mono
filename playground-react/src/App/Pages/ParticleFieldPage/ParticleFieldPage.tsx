import { useState } from "react";

import { CellAnimationKeyframes, CellAnimationOrigins, CellAnimationWeights } from "@thewaver/ss-components-react";
import { ParticleFieldKnobs } from "@thewaver/ss-playground/App/Knobs/ParticleFields.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleFieldPage/ParticleFieldPage.css";
import { type Index2d, ShapeConst } from "@thewaver/ss-utils";

import { PageExampleKnobs } from "../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import {
    PageCheckField,
    PageGroupedSelectField,
    PageNumberField,
    PageSelectField,
} from "../../PageComponents/Field/Field";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PagePlaybackScrubber } from "../../PageComponents/PlaybackScrubber/PlaybackScrubber";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { StressTest } from "../../PageComponents/StressTest/StressTest";
import type { StressTestDefs } from "../../PageComponents/StressTest/StressText.types";
import { DefaultExample } from "./Examples/Default";
import { ShapedExample } from "./Examples/Shaped";
import type { ParticleFieldExampleProps } from "./ParticleFieldPage.types";

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
    props: ParticleFieldExampleProps & {
        progressState: readonly [number, (value: number) => void];
        ownPlaybackState: readonly [boolean, (value: boolean) => void];
    },
) => {
    return (
        <div className={styles.stack}>
            <PageMeasureBox width={BOX_WIDTH} height={BOX_HEIGHT}>
                <DefaultExample {...props} playbackState={props.ownPlaybackState} progressState={props.progressState} />
            </PageMeasureBox>

            <PagePlaybackScrubber
                id={"particleField"}
                ariaLabel={"Position in the pass"}
                playbackState={props.ownPlaybackState}
                progressState={props.progressState}
            />
        </div>
    );
};

const ShapedExampleWrapper = (props: ParticleFieldExampleProps) => {
    const [shapeKind, setShapeKind] = useState<ShapeConst.DefaultShape>(ParticleFieldKnobs.STARTING_SHAPE_KIND);
    const [joinRadius, setJoinRadius] = useState(ParticleFieldKnobs.STARTING_JOIN_RADIUS);

    return (
        <>
            <PageMeasureBox width={SHAPED_BOX_SIZE} height={SHAPED_BOX_SIZE}>
                <ShapedExample {...props} shapeKind={shapeKind} joinRadius={joinRadius} />
            </PageMeasureBox>

            <PageExampleKnobs>
                <PageProp
                    itemKey={"shapeKind"}
                    label={"Shape"}
                    hint={"The area particles may appear in. A cell spawns only when its center is inside it."}
                >
                    <PageSelectField
                        value={shapeKind}
                        values={ShapeConst.DEFAULT_SHAPES}
                        ariaLabel={"Shape"}
                        onChange={(kind) => setShapeKind(kind)}
                    />
                </PageProp>

                <PageProp
                    itemKey={"joinRadius"}
                    label={"Corner radius"}
                    hint={"How far each corner of the area is rounded, as the Shape page rounds them."}
                >
                    <PageNumberField
                        value={joinRadius}
                        min={ParticleFieldKnobs.MIN_JOIN_RADIUS}
                        max={ParticleFieldKnobs.MAX_JOIN_RADIUS}
                        step={ParticleFieldKnobs.JOIN_RADIUS_STEP}
                        ariaLabel={"Corner radius"}
                        onInput={setJoinRadius}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const StressTestWrapper = (props: ParticleFieldExampleProps) => {
    const modalPlayback = useState(true);

    return (
        <>
            <div>{`${STRESS_CELL_COUNT.col} x ${STRESS_CELL_COUNT.row} cells`}</div>

            <StressTest
                configs={STRESS_ITEMS}
                onShowModal={() => props.playbackState[1](false)}
                onHideModal={() => props.playbackState[1](true)}
                renderLabel={(configIndex) => `Render ${STRESS_ITEMS[configIndex].count} fields`}
                renderItem={(configIndex) => (
                    <PageMeasureBox width={STRESS_ITEMS[configIndex].size} height={STRESS_ITEMS[configIndex].size}>
                        <DefaultExample {...props} playbackState={modalPlayback} cellCount={STRESS_CELL_COUNT} />
                    </PageMeasureBox>
                )}
            />
        </>
    );
};

export const ParticleFieldPage = () => {
    const playback = useState(true);
    const defaultPlayback = useState(true);
    const progress = useState(0);

    const [spawnChance, setSpawnChance] = useState(ParticleFieldKnobs.STARTING_SPAWN_CHANCE);
    const [durationMs, setDurationMs] = useState(ParticleFieldKnobs.STARTING_DURATION_MS);
    const [lifetimeMs, setLifetimeMs] = useState(ParticleFieldKnobs.STARTING_LIFETIME_MS);
    const [iterationDelayMs, setIterationDelayMs] = useState(ParticleFieldKnobs.STARTING_ITERATION_DELAY_MS);
    const [holdShare, setHoldShare] = useState(ParticleFieldKnobs.STARTING_HOLD_SHARE);
    const [isScattered, setIsScattered] = useState(ParticleFieldKnobs.STARTING_IS_SCATTERED);
    const [originType, setOriginType] = useState<CellAnimationOrigins.OriginType>(
        ParticleFieldKnobs.STARTING_ORIGIN_KEY,
    );
    const [weightType, setWeightType] = useState<CellAnimationWeights.WeightType>(
        ParticleFieldKnobs.STARTING_WEIGHT_KEY,
    );
    const [animationType, setAnimationType] = useState<CellAnimationKeyframes.AnimationType>(
        ParticleFieldKnobs.STARTING_ANIMATION_KEY,
    );
    const [cellCount, setCellCount] = useState<Index2d>({ ...ParticleFieldKnobs.STARTING_CELL_COUNT });

    const commonProps: ParticleFieldExampleProps = {
        cellCount,
        spawnChance,
        animationIterationDelayMs: iterationDelayMs,
        animationDurationMs: durationMs,
        particleLifetimeMs: lifetimeMs,
        originType,
        weightType,
        animationType,
        holdShare,
        isScattered,
        playbackState: playback,
    };

    const examples = [
        {
            key: "default",
            name: "The whole box",
            readout: () =>
                `${Math.round(progress[0] * PERCENT)}% through the pass, ${defaultPlayback[0] ? "running" : "stopped"} — the progress signal is written by the field while it plays, and writing it moves the pass there`,
            component: () => (
                <DefaultExampleWrapper {...commonProps} progressState={progress} ownPlaybackState={defaultPlayback} />
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

    return (
        <div className={styles.root}>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"spawnChance"}
                    label={"Spawn chance (0-1)"}
                    hint={
                        "The chance each cell spawns in a given pass. 1 spawns every cell every pass; lower leaves gaps that change from pass to pass. When a cell does spawn is still its weight's call."
                    }
                >
                    <PageNumberField
                        value={spawnChance}
                        min={ParticleFieldKnobs.MIN_SPAWN_CHANCE}
                        max={ParticleFieldKnobs.MAX_SPAWN_CHANCE}
                        step={ParticleFieldKnobs.SPAWN_CHANCE_STEP}
                        ariaLabel={"Spawn chance"}
                        onInput={setSpawnChance}
                    />
                </PageProp>

                <PageProp
                    itemKey={"cellCount"}
                    label={"Cell count (cols x rows)"}
                    hint={"How many columns and rows the field is split into. A cell holds one particle at a time."}
                >
                    <div className={styles.valueList}>
                        <PageNumberField
                            value={cellCount.col}
                            min={ParticleFieldKnobs.MIN_CELL_COUNT}
                            max={ParticleFieldKnobs.MAX_CELL_COUNT}
                            step={ParticleFieldKnobs.CELL_COUNT_STEP}
                            ariaLabel={"Columns"}
                            onInput={(value) => setCellCount((count) => ({ ...count, col: value }))}
                        />
                        <PageNumberField
                            value={cellCount.row}
                            min={ParticleFieldKnobs.MIN_CELL_COUNT}
                            max={ParticleFieldKnobs.MAX_CELL_COUNT}
                            step={ParticleFieldKnobs.CELL_COUNT_STEP}
                            ariaLabel={"Rows"}
                            onInput={(value) => setCellCount((count) => ({ ...count, row: value }))}
                        />
                    </div>
                </PageProp>

                <PageProp
                    itemKey={"originType"}
                    label={"Origin"}
                    hint={
                        "Where in the grid the weights are measured from. It only applies to weights that are measured from a point."
                    }
                >
                    <PageSelectField
                        value={originType}
                        values={CellAnimationOrigins.ORIGIN_TYPES}
                        isDisabled={!CellAnimationWeights.isOriginAware(weightType)}
                        ariaLabel={"Origin"}
                        onChange={(origin) => setOriginType(origin)}
                    />
                </PageProp>

                <PageProp
                    itemKey={"weightType"}
                    label={"Weight"}
                    hint={
                        "The same weights CellAnimation uses: a heavy cell spawns early in the pass and a light one late."
                    }
                >
                    <PageGroupedSelectField
                        value={weightType}
                        groups={GROUPPED_WEIGHTS}
                        ariaLabel={"Weight"}
                        onChange={(weight) => setWeightType(weight)}
                    />
                </PageProp>

                <PageProp
                    itemKey={"animationType"}
                    label={"Animation"}
                    hint={
                        "How a particle appears, played forwards as it arrives and backwards as it leaves: CellAnimation's own keyframes."
                    }
                >
                    <PageGroupedSelectField
                        value={animationType}
                        groups={GROUPPED_ANIMATIONS}
                        ariaLabel={"Animation"}
                        onChange={(anim) => setAnimationType(anim)}
                    />
                </PageProp>

                <PageProp
                    itemKey={"holdShare"}
                    label={"Hold (0-1)"}
                    hint={
                        "How much of a particle's life it spends fully shown, between appearing and disappearing. 1 cuts in and out."
                    }
                >
                    <PageNumberField
                        value={holdShare}
                        min={ParticleFieldKnobs.MIN_HOLD_SHARE}
                        max={ParticleFieldKnobs.MAX_HOLD_SHARE}
                        step={ParticleFieldKnobs.HOLD_SHARE_STEP}
                        ariaLabel={"Hold share"}
                        onInput={setHoldShare}
                    />
                </PageProp>

                <PageProp
                    itemKey={"isScattered"}
                    label={"Scatter in cell"}
                    hint={
                        "Places each particle at a random point in its cell rather than at the center, so the grid stops showing."
                    }
                >
                    <PageCheckField value={isScattered} ariaLabel={"Scatter in cell"} onChange={setIsScattered} />
                </PageProp>

                <PageProp
                    itemKey={"animationDurationMs"}
                    label={"Duration (ms)"}
                    hint={
                        "How long one pass over the grid takes, and so the shortest time between two spawns from the same cell."
                    }
                >
                    <PageNumberField
                        value={durationMs}
                        min={ParticleFieldKnobs.MIN_DURATION_MS}
                        max={ParticleFieldKnobs.MAX_DURATION_MS}
                        step={ParticleFieldKnobs.DURATION_STEP_MS}
                        ariaLabel={"Duration"}
                        onInput={setDurationMs}
                    />
                </PageProp>

                <PageProp
                    itemKey={"particleLifetimeMs"}
                    label={"Lifetime (ms)"}
                    hint={"How long one particle lives, from appearing to being removed."}
                >
                    <PageNumberField
                        value={lifetimeMs}
                        min={ParticleFieldKnobs.MIN_LIFETIME_MS}
                        max={ParticleFieldKnobs.MAX_LIFETIME_MS}
                        step={ParticleFieldKnobs.DURATION_STEP_MS}
                        ariaLabel={"Lifetime"}
                        onInput={setLifetimeMs}
                    />
                </PageProp>

                <PageProp
                    itemKey={"iterationDelayMs"}
                    label={"Iteration delay (ms)"}
                    hint={"How long the field waits between one pass and the next."}
                >
                    <PageNumberField
                        value={iterationDelayMs}
                        min={ParticleFieldKnobs.MIN_ITERATION_DELAY_MS}
                        max={ParticleFieldKnobs.MAX_ITERATION_DELAY_MS}
                        step={ParticleFieldKnobs.DURATION_STEP_MS}
                        ariaLabel={"Iteration delay"}
                        onInput={setIterationDelayMs}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} layout={"flow"} />
        </div>
    );
};
