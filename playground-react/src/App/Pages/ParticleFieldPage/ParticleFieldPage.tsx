import { useState } from "react";

import { CellAnimationKeyframes, CellAnimationOrigins, SliceAnimationWeights } from "@thewaver/ss-components-react";
import { ParticleFieldKnobs } from "@thewaver/ss-playground/App/Knobs/ParticleFields.const";
import {
    BOX_HEIGHT,
    BOX_WIDTH,
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    PERCENT,
    SHAPED_BOX_SIZE,
    STRESS_CELL_COUNT,
    STRESS_ITEMS,
} from "@thewaver/ss-playground/App/Pages/ParticleFieldPage/ParticleFieldPage.const";
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
import { DefaultExample } from "./Examples/Default";
import { ShapedExample } from "./Examples/Shaped";
import type { ParticleFieldExampleProps } from "./ParticleFieldPage.types";

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

const GROUPPED_WEIGHTS = groupOptions(SliceAnimationWeights.WEIGHT_TYPES);
const GROUPPED_ANIMATIONS = groupOptions(CellAnimationKeyframes.ANIMATION_TYPES);

const DefaultExampleWrapper = (
    props: ParticleFieldExampleProps & {
        progress: readonly [number, (value: number) => void];
        ownPlayback: readonly [boolean, (value: boolean) => void];
    },
) => {
    return (
        <div className={styles.stack}>
            <PageMeasureBox width={BOX_WIDTH} height={BOX_HEIGHT}>
                <DefaultExample {...props} playback={props.ownPlayback} progress={props.progress} />
            </PageMeasureBox>

            <PagePlaybackScrubber
                id={"particleField"}
                ariaLabel={"Position in the pass"}
                playback={props.ownPlayback}
                progress={props.progress}
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
                <PageProp itemKey={"shapeKind"} {...ParticleFieldKnobs.SHAPE_KIND_TEXT}>
                    <PageSelectField
                        value={shapeKind}
                        values={ShapeConst.DEFAULT_SHAPES}
                        ariaLabel={"Shape"}
                        onChange={(kind) => setShapeKind(kind)}
                    />
                </PageProp>

                <PageProp itemKey={"joinRadius"} {...ParticleFieldKnobs.JOIN_RADIUS_TEXT}>
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

    const [isOnGraphicsCard, setIsOnGraphicsCard] = useState(true);

    return (
        <>
            <div>{`${STRESS_CELL_COUNT.col} x ${STRESS_CELL_COUNT.row} cells`}</div>

            <PagePropsPanel scope={"local"} hasReset={false}>
                <PageProp itemKey={"onGraphicsCard"} {...ParticleFieldKnobs.ON_GRAPHICS_CARD_TEXT}>
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
                renderLabel={(configIndex) => `Render ${STRESS_ITEMS[configIndex].count} fields`}
                renderItem={(configIndex) => (
                    <PageMeasureBox width={STRESS_ITEMS[configIndex].size} height={STRESS_ITEMS[configIndex].size}>
                        <DefaultExample
                            {...props}
                            playback={modalPlayback}
                            cellCount={STRESS_CELL_COUNT}
                            renderer={isOnGraphicsCard ? "graphics_card" : "elements"}
                        />
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
    const [weightType, setWeightType] = useState<SliceAnimationWeights.WeightType>(
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
        playback,
    };

    const examples = [
        {
            key: "default",
            name: EXAMPLE_NAMES.default,
            readout: () =>
                `${Math.round(progress[0] * PERCENT)}% through the pass, ${defaultPlayback[0] ? "running" : "stopped"} — the progress signal is written by the field while it plays, and writing it moves the pass there`,
            component: () => (
                <DefaultExampleWrapper {...commonProps} progress={progress} ownPlayback={defaultPlayback} />
            ),
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "shaped",
            name: EXAMPLE_NAMES.shaped,
            readout: () =>
                "the same field, limited to one of the built-in shapes Shape draws; a cell whose center falls outside it never spawns",
            component: () => <ShapedExampleWrapper {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Shaped.tsx`,
        },
        {
            key: "stressTest",
            name: EXAMPLE_NAMES.stressTest,
            component: () => <StressTestWrapper {...commonProps} />,
        },
    ];

    return (
        <div className={styles.root}>
            <PagePropsPanel scope={"global"}>
                <PageProp itemKey={"spawnChance"} {...ParticleFieldKnobs.SPAWN_CHANCE_TEXT}>
                    <PageNumberField
                        value={spawnChance}
                        min={ParticleFieldKnobs.MIN_SPAWN_CHANCE}
                        max={ParticleFieldKnobs.MAX_SPAWN_CHANCE}
                        step={ParticleFieldKnobs.SPAWN_CHANCE_STEP}
                        ariaLabel={"Spawn chance"}
                        onInput={setSpawnChance}
                    />
                </PageProp>

                <PageProp itemKey={"cellCount"} {...ParticleFieldKnobs.CELL_COUNT_TEXT}>
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

                <PageProp itemKey={"originType"} {...ParticleFieldKnobs.ORIGIN_TYPE_TEXT}>
                    <PageSelectField
                        value={originType}
                        values={CellAnimationOrigins.ORIGIN_TYPES}
                        isDisabled={!SliceAnimationWeights.isOriginAware(weightType)}
                        ariaLabel={"Origin"}
                        onChange={(origin) => setOriginType(origin)}
                    />
                </PageProp>

                <PageProp itemKey={"weightType"} {...ParticleFieldKnobs.WEIGHT_TYPE_TEXT}>
                    <PageGroupedSelectField
                        value={weightType}
                        groups={GROUPPED_WEIGHTS}
                        ariaLabel={"Weight"}
                        onChange={(weight) => setWeightType(weight)}
                    />
                </PageProp>

                <PageProp itemKey={"animationType"} {...ParticleFieldKnobs.ANIMATION_TYPE_TEXT}>
                    <PageGroupedSelectField
                        value={animationType}
                        groups={GROUPPED_ANIMATIONS}
                        ariaLabel={"Animation"}
                        onChange={(anim) => setAnimationType(anim)}
                    />
                </PageProp>

                <PageProp itemKey={"holdShare"} {...ParticleFieldKnobs.HOLD_SHARE_TEXT}>
                    <PageNumberField
                        value={holdShare}
                        min={ParticleFieldKnobs.MIN_HOLD_SHARE}
                        max={ParticleFieldKnobs.MAX_HOLD_SHARE}
                        step={ParticleFieldKnobs.HOLD_SHARE_STEP}
                        ariaLabel={"Hold share"}
                        onInput={setHoldShare}
                    />
                </PageProp>

                <PageProp itemKey={"isScattered"} {...ParticleFieldKnobs.IS_SCATTERED_TEXT}>
                    <PageCheckField value={isScattered} ariaLabel={"Scatter in cell"} onChange={setIsScattered} />
                </PageProp>

                <PageProp itemKey={"animationDurationMs"} {...ParticleFieldKnobs.ANIMATION_DURATION_MS_TEXT}>
                    <PageNumberField
                        value={durationMs}
                        min={ParticleFieldKnobs.MIN_DURATION_MS}
                        max={ParticleFieldKnobs.MAX_DURATION_MS}
                        step={ParticleFieldKnobs.DURATION_STEP_MS}
                        ariaLabel={"Duration"}
                        onInput={setDurationMs}
                    />
                </PageProp>

                <PageProp itemKey={"particleLifetimeMs"} {...ParticleFieldKnobs.PARTICLE_LIFETIME_MS_TEXT}>
                    <PageNumberField
                        value={lifetimeMs}
                        min={ParticleFieldKnobs.MIN_LIFETIME_MS}
                        max={ParticleFieldKnobs.MAX_LIFETIME_MS}
                        step={ParticleFieldKnobs.DURATION_STEP_MS}
                        ariaLabel={"Lifetime"}
                        onInput={setLifetimeMs}
                    />
                </PageProp>

                <PageProp itemKey={"iterationDelayMs"} {...ParticleFieldKnobs.ITERATION_DELAY_MS_TEXT}>
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
