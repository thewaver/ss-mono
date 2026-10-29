import { Show, createMemo, createSignal, onCleanup, onMount } from "solid-js";

import { PARTICLE_DISSOLVE_DEFAULTS, ParticleDissolve } from "@thewaver/ss-components-solid";
import { ParticleDissolveKnobs } from "@thewaver/ss-playground/App/Knobs/ParticleDissolves.const";
import { CellGpuUtils } from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellGpu/CellGpu.utils";
import {
    CARD_TEXT,
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
    PARTICLE_SHARE,
    STRESS_CELL_SIZE,
    STRESS_ITEMS,
    computeAshAnimation,
    createAshAnimation,
} from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.css";
import { ShapeConst } from "@thewaver/ss-utils";

import { PageExampleKnobs } from "../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageCheckField, PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { StressTest } from "../../PageComponents/StressTest/StressTest";
import { AshParticle } from "./AshParticle";
import { ButtonExample } from "./Examples/Button";
import { CardExample } from "./Examples/Card";
import { ImageExample } from "./Examples/Image";
import { SvgExample } from "./Examples/Svg";
import { GpuParticleDissolve } from "./GpuParticleDissolve";
import type { ParticleDissolveExampleProps } from "./ParticleDissolvePageSolid.types";

const AngleKnob = (props: { value: () => number; onInput: (value: number) => void }) => (
    <PageProp
        key={"angleDegrees"}
        label={"Angle (degrees)"}
        hint={"The direction the edge travels: 0 sweeps up, 90 to the right, 180 down."}
        controls={"Sets ParticleDissolveProps.angleDegrees"}
    >
        <PageNumberField
            value={props.value}
            min={ParticleDissolveKnobs.MIN_ANGLE}
            max={ParticleDissolveKnobs.MAX_ANGLE}
            step={ParticleDissolveKnobs.ANGLE_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Angle in degrees"}
            onInput={props.onInput}
        />
    </PageProp>
);

const StressCard = (props: ParticleDissolveExampleProps & { isOnGpu: boolean }) => {
    const [getIsDissolved, setIsDissolved] = createSignal(false);

    const ashAnimation = createAshAnimation();

    const src = CellGpuUtils.createDotSrc("#ffffff", "#ffffff");

    onMount(() => {
        const timeout = setTimeout(() => setIsDissolved(true));

        onCleanup(() => clearTimeout(timeout));
    });

    const renderCard = () => (
        <div class={styles.card}>
            <span class={styles.cardTitle}>{CARD_TEXT.title}</span>
            <span>{CARD_TEXT.body}</span>
            <span class={styles.badge}>{CARD_TEXT.badge}</span>
        </div>
    );

    return (
        <Show
            when={props.isOnGpu}
            fallback={
                <ParticleDissolve
                    isDissolved={getIsDissolved}
                    durationMs={props.durationMs}
                    particleLifetimeMs={props.particleLifetimeMs}
                    featherShare={props.featherShare}
                    spawnChance={props.spawnChance}
                    cellSize={STRESS_CELL_SIZE}
                    computeParticleAnimation={computeAshAnimation}
                    renderParticle={(defs) => <AshParticle defs={defs} />}
                    onDissolveEnd={() => setIsDissolved(false)}
                    onRebuildEnd={() => setIsDissolved(true)}
                >
                    {renderCard()}
                </ParticleDissolve>
            }
        >
            <GpuParticleDissolve
                src={src}
                isDissolved={getIsDissolved}
                durationMs={props.durationMs}
                particleLifetimeMs={props.particleLifetimeMs}
                featherShare={props.featherShare}
                spawnChance={props.spawnChance}
                cellSize={STRESS_CELL_SIZE}
                animation={ashAnimation}
                computeParticleSize={(cell) => ({
                    width: cell.size.width * PARTICLE_SHARE,
                    height: cell.size.height * PARTICLE_SHARE,
                })}
                onDissolveEnd={() => setIsDissolved(false)}
                onRebuildEnd={() => setIsDissolved(true)}
            >
                {renderCard()}
            </GpuParticleDissolve>
        </Show>
    );
};

const StressTestWrapper = (props: ParticleDissolveExampleProps) => {
    const [getIsOnGpu, setIsOnGpu] = createSignal(true);

    return (
        <>
            <div>{`${STRESS_CELL_SIZE} px cells`}</div>

            <PagePropsPanel scope={"local"} hasReset={false}>
                <PageProp
                    key={"gpuProof"}
                    label={"On the graphics card"}
                    hint={
                        "A proof of concept: draws each card's ash in one WebGL canvas, with each particle's motion worked out on the graphics card."
                    }
                    controls={"Swaps ParticleDissolve for the Playground's GpuParticleDissolve in the stress test"}
                >
                    <PageCheckField value={getIsOnGpu} ariaLabel={"On the graphics card"} onChange={setIsOnGpu} />
                </PageProp>
            </PagePropsPanel>

            <StressTest
                configs={STRESS_ITEMS}
                renderLabel={(getConfigIndex) => `Render ${STRESS_ITEMS[getConfigIndex()].count} cards`}
                renderItem={() => <StressCard {...props} isOnGpu={getIsOnGpu()} />}
            />
        </>
    );
};

const CardExampleWrapper = (props: ParticleDissolveExampleProps) => {
    const [getAngle, setAngle] = createSignal(PARTICLE_DISSOLVE_DEFAULTS.angleDegrees);

    return (
        <>
            <CardExample {...props} angleDegrees={getAngle} />

            <PageExampleKnobs>
                <AngleKnob value={getAngle} onInput={setAngle} />
            </PageExampleKnobs>
        </>
    );
};

const SvgExampleWrapper = (props: ParticleDissolveExampleProps) => {
    const [getAngle, setAngle] = createSignal(PARTICLE_DISSOLVE_DEFAULTS.angleDegrees);
    const [getShapeKind, setShapeKind] = createSignal<ShapeConst.DefaultShape>(
        ParticleDissolveKnobs.STARTING_SHAPE_KIND,
    );

    return (
        <>
            <SvgExample {...props} angleDegrees={getAngle} shapeKind={getShapeKind} />

            <PageExampleKnobs>
                <AngleKnob value={getAngle} onInput={setAngle} />

                <PageProp
                    key={"shapeKind"}
                    label={"Shape"}
                    hint={
                        "The SVG shape that dissolves. Particles rise only from inside the shape's fill and along its stroke, however its corners fall in the box."
                    }
                    controls={"Picks the built-in shape drawn into the SVG inside ParticleDissolve"}
                >
                    <PageSelectField
                        value={getShapeKind}
                        values={ShapeConst.DEFAULT_SHAPES}
                        ariaLabel={"Shape"}
                        onChange={(kind) => setShapeKind(() => kind)}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const ImageExampleWrapper = (props: ParticleDissolveExampleProps) => {
    const [getAngle, setAngle] = createSignal(PARTICLE_DISSOLVE_DEFAULTS.angleDegrees);

    return (
        <>
            <ImageExample {...props} angleDegrees={getAngle} />

            <PageExampleKnobs>
                <AngleKnob value={getAngle} onInput={setAngle} />
            </PageExampleKnobs>
        </>
    );
};

export const ParticleDissolvePage = () => {
    const [getDurationMs, setDurationMs] = createSignal(PARTICLE_DISSOLVE_DEFAULTS.durationMs);
    const [getLifetimeMs, setLifetimeMs] = createSignal(PARTICLE_DISSOLVE_DEFAULTS.particleLifetimeMs);
    const [getFeather, setFeather] = createSignal(PARTICLE_DISSOLVE_DEFAULTS.featherShare);
    const [getSpawnChance, setSpawnChance] = createSignal(PARTICLE_DISSOLVE_DEFAULTS.spawnChance);
    const [getCellSize, setCellSize] = createSignal(PARTICLE_DISSOLVE_DEFAULTS.cellSize);

    const getExamples = createMemo(() => {
        const commonProps = {
            durationMs: getDurationMs,
            particleLifetimeMs: getLifetimeMs,
            featherShare: getFeather,
            spawnChance: getSpawnChance,
            cellSize: getCellSize,
        };

        return [
            {
                key: "button",
                name: EXAMPLE_NAMES.button,
                readout: () =>
                    "burns away outward from the point it was pressed, and the Rebuild button brings it back",
                component: () => <ButtonExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Button.tsx`,
            },
            {
                key: "card",
                name: EXAMPLE_NAMES.card,
                readout: () =>
                    "dissolves along a straight edge at the angle set in this example's knobs; particles rise only from the text and the painted boxes, never from the empty parts of the card",
                component: () => <CardExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Card.tsx`,
            },
            {
                key: "svg",
                name: EXAMPLE_NAMES.svg,
                readout: () =>
                    "an SVG shape, read point by point against its fill and stroke, so a triangle sheds ash only from the triangle",
                component: () => <SvgExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Svg.tsx`,
            },
            {
                key: "image",
                name: EXAMPLE_NAMES.image,
                readout: () =>
                    "a picture, read pixel by pixel: ash rises only from what is shown, in the colors it is shown in, and never from the transparent parts",
                component: () => <ImageExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Image.tsx`,
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
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"durationMs"}
                    label={"Duration (ms)"}
                    hint={
                        "How long the whole dissolve takes, from the first of the content going to the last particle gone."
                    }
                    controls={"Sets ParticleDissolveProps.durationMs"}
                >
                    <PageNumberField
                        value={getDurationMs}
                        min={ParticleDissolveKnobs.MIN_DURATION_MS}
                        max={ParticleDissolveKnobs.MAX_DURATION_MS}
                        step={ParticleDissolveKnobs.DURATION_STEP_MS}
                        width={FIELD_WIDTH}
                        ariaLabel={"Duration in milliseconds"}
                        onInput={setDurationMs}
                    />
                </PageProp>

                <PageProp
                    key={"particleLifetimeMs"}
                    label={"Lifetime (ms)"}
                    hint={
                        "How long one particle lives. It is held below the duration, so a longer lifetime leaves less time for the edge to travel."
                    }
                    controls={"Sets ParticleDissolveProps.particleLifetimeMs"}
                >
                    <PageNumberField
                        value={getLifetimeMs}
                        min={ParticleDissolveKnobs.MIN_LIFETIME_MS}
                        max={ParticleDissolveKnobs.MAX_LIFETIME_MS}
                        step={ParticleDissolveKnobs.DURATION_STEP_MS}
                        width={FIELD_WIDTH}
                        ariaLabel={"Lifetime in milliseconds"}
                        onInput={setLifetimeMs}
                    />
                </PageProp>

                <PageProp
                    key={"featherShare"}
                    label={"Feather (0-1)"}
                    hint={
                        "How gradually the edge fades the content, as a share of the distance the sweep travels. 0 gives a hard edge."
                    }
                    controls={"Sets ParticleDissolveProps.featherShare"}
                >
                    <PageNumberField
                        value={getFeather}
                        min={ParticleDissolveKnobs.MIN_FEATHER}
                        max={ParticleDissolveKnobs.MAX_FEATHER}
                        step={ParticleDissolveKnobs.FEATHER_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Feather"}
                        onInput={setFeather}
                    />
                </PageProp>

                <PageProp
                    key={"spawnChance"}
                    label={"Spawn chance (0-1)"}
                    hint={"The chance each particle is released. Lower thins the ash out."}
                    controls={"Sets ParticleDissolveProps.spawnChance"}
                >
                    <PageNumberField
                        value={getSpawnChance}
                        min={ParticleDissolveKnobs.MIN_SPAWN_CHANCE}
                        max={ParticleDissolveKnobs.MAX_SPAWN_CHANCE}
                        step={ParticleDissolveKnobs.SPAWN_CHANCE_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Spawn chance"}
                        onInput={setSpawnChance}
                    />
                </PageProp>

                <PageProp
                    key={"cellSize"}
                    label={"Cell size (px)"}
                    hint={
                        "The side of one square of the grid particles are released from. Smaller squares mean finer ash and more of them."
                    }
                    controls={"Sets ParticleDissolveProps.cellSize"}
                >
                    <PageNumberField
                        value={getCellSize}
                        min={ParticleDissolveKnobs.MIN_CELL_SIZE}
                        max={ParticleDissolveKnobs.MAX_CELL_SIZE}
                        step={ParticleDissolveKnobs.CELL_SIZE_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Cell size in pixels"}
                        onInput={setCellSize}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};
