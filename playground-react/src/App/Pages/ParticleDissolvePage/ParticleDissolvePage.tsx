import { useState } from "react";

import { PARTICLE_DISSOLVE_DEFAULTS } from "@thewaver/ss-components-react";
import { ParticleDissolveKnobs } from "@thewaver/ss-playground/App/Knobs/ParticleDissolves.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.const";
import { ShapeConst } from "@thewaver/ss-utils";

import { PageExampleKnobs } from "../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { ButtonExample } from "./Examples/Button";
import { CardExample } from "./Examples/Card";
import { ImageExample } from "./Examples/Image";
import { SvgExample } from "./Examples/Svg";
import type { ParticleDissolveExampleProps } from "./ParticleDissolvePageReact.types";

const AngleKnob = (props: { value: number; onInput: (value: number) => void }) => (
    <PageProp
        itemKey={"angleDegrees"}
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

const CardExampleWrapper = (props: ParticleDissolveExampleProps) => {
    const [angle, setAngle] = useState(PARTICLE_DISSOLVE_DEFAULTS.angleDegrees);

    return (
        <>
            <CardExample {...props} angleDegrees={angle} />

            <PageExampleKnobs>
                <AngleKnob value={angle} onInput={setAngle} />
            </PageExampleKnobs>
        </>
    );
};

const SvgExampleWrapper = (props: ParticleDissolveExampleProps) => {
    const [angle, setAngle] = useState(PARTICLE_DISSOLVE_DEFAULTS.angleDegrees);
    const [shapeKind, setShapeKind] = useState<ShapeConst.DefaultShape>(ParticleDissolveKnobs.STARTING_SHAPE_KIND);

    return (
        <>
            <SvgExample {...props} angleDegrees={angle} shapeKind={shapeKind} />

            <PageExampleKnobs>
                <AngleKnob value={angle} onInput={setAngle} />

                <PageProp
                    itemKey={"shapeKind"}
                    label={"Shape"}
                    hint={
                        "The SVG shape that dissolves. Particles rise only from inside the shape's fill and along its stroke, however its corners fall in the box."
                    }
                    controls={"Picks the built-in shape drawn into the SVG inside ParticleDissolve"}
                >
                    <PageSelectField
                        value={shapeKind}
                        values={ShapeConst.DEFAULT_SHAPES}
                        ariaLabel={"Shape"}
                        onChange={(kind) => setShapeKind(kind)}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const ImageExampleWrapper = (props: ParticleDissolveExampleProps) => {
    const [angle, setAngle] = useState(PARTICLE_DISSOLVE_DEFAULTS.angleDegrees);

    return (
        <>
            <ImageExample {...props} angleDegrees={angle} />

            <PageExampleKnobs>
                <AngleKnob value={angle} onInput={setAngle} />
            </PageExampleKnobs>
        </>
    );
};

export const ParticleDissolvePage = () => {
    const [durationMs, setDurationMs] = useState(PARTICLE_DISSOLVE_DEFAULTS.durationMs);
    const [lifetimeMs, setLifetimeMs] = useState(PARTICLE_DISSOLVE_DEFAULTS.particleLifetimeMs);
    const [feather, setFeather] = useState(PARTICLE_DISSOLVE_DEFAULTS.featherShare);
    const [spawnChance, setSpawnChance] = useState(PARTICLE_DISSOLVE_DEFAULTS.spawnChance);
    const [particlesPerCell, setParticlesPerCell] = useState(PARTICLE_DISSOLVE_DEFAULTS.particlesPerCell);
    const [cellSize, setCellSize] = useState(PARTICLE_DISSOLVE_DEFAULTS.cellSize);

    const commonProps: ParticleDissolveExampleProps = {
        durationMs,
        particleLifetimeMs: lifetimeMs,
        featherShare: feather,
        spawnChance,
        particlesPerCell,
        cellSize,
    };

    const examples = [
        {
            key: "button",
            name: EXAMPLE_NAMES.button,
            readout: () => "burns away outward from the point it was pressed, and the Rebuild button brings it back",
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
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"durationMs"}
                    label={"Duration (ms)"}
                    hint={
                        "How long the whole dissolve takes, from the first of the content going to the last particle gone."
                    }
                    controls={"Sets ParticleDissolveProps.durationMs"}
                >
                    <PageNumberField
                        value={durationMs}
                        min={ParticleDissolveKnobs.MIN_DURATION_MS}
                        max={ParticleDissolveKnobs.MAX_DURATION_MS}
                        step={ParticleDissolveKnobs.DURATION_STEP_MS}
                        width={FIELD_WIDTH}
                        ariaLabel={"Duration in milliseconds"}
                        onInput={setDurationMs}
                    />
                </PageProp>

                <PageProp
                    itemKey={"particleLifetimeMs"}
                    label={"Lifetime (ms)"}
                    hint={
                        "How long one particle lives. It is held below the duration, so a longer lifetime leaves less time for the edge to travel."
                    }
                    controls={"Sets ParticleDissolveProps.particleLifetimeMs"}
                >
                    <PageNumberField
                        value={lifetimeMs}
                        min={ParticleDissolveKnobs.MIN_LIFETIME_MS}
                        max={ParticleDissolveKnobs.MAX_LIFETIME_MS}
                        step={ParticleDissolveKnobs.DURATION_STEP_MS}
                        width={FIELD_WIDTH}
                        ariaLabel={"Lifetime in milliseconds"}
                        onInput={setLifetimeMs}
                    />
                </PageProp>

                <PageProp
                    itemKey={"featherShare"}
                    label={"Feather (0-1)"}
                    hint={
                        "How gradually the edge fades the content, as a share of the distance the sweep travels. 0 gives a hard edge."
                    }
                    controls={"Sets ParticleDissolveProps.featherShare"}
                >
                    <PageNumberField
                        value={feather}
                        min={ParticleDissolveKnobs.MIN_FEATHER}
                        max={ParticleDissolveKnobs.MAX_FEATHER}
                        step={ParticleDissolveKnobs.FEATHER_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Feather"}
                        onInput={setFeather}
                    />
                </PageProp>

                <PageProp
                    itemKey={"spawnChance"}
                    label={"Spawn chance (0-1)"}
                    hint={"The chance each particle is released. Lower thins the ash out."}
                    controls={"Sets ParticleDissolveProps.spawnChance"}
                >
                    <PageNumberField
                        value={spawnChance}
                        min={ParticleDissolveKnobs.MIN_SPAWN_CHANCE}
                        max={ParticleDissolveKnobs.MAX_SPAWN_CHANCE}
                        step={ParticleDissolveKnobs.SPAWN_CHANCE_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Spawn chance"}
                        onInput={setSpawnChance}
                    />
                </PageProp>

                <PageProp
                    itemKey={"particlesPerCell"}
                    label={"Particles per cell"}
                    hint={
                        "How many particles one grid square of painted content can release. Each is rolled against the spawn chance on its own."
                    }
                    controls={"Sets ParticleDissolveProps.particlesPerCell"}
                >
                    <PageNumberField
                        value={particlesPerCell}
                        min={ParticleDissolveKnobs.MIN_PARTICLES_PER_CELL}
                        max={ParticleDissolveKnobs.MAX_PARTICLES_PER_CELL}
                        step={ParticleDissolveKnobs.PARTICLES_PER_CELL_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Particles per cell"}
                        onInput={setParticlesPerCell}
                    />
                </PageProp>

                <PageProp
                    itemKey={"cellSize"}
                    label={"Cell size (px)"}
                    hint={
                        "The side of one square of the grid particles are released from. Smaller squares mean finer ash and more of them."
                    }
                    controls={"Sets ParticleDissolveProps.cellSize"}
                >
                    <PageNumberField
                        value={cellSize}
                        min={ParticleDissolveKnobs.MIN_CELL_SIZE}
                        max={ParticleDissolveKnobs.MAX_CELL_SIZE}
                        step={ParticleDissolveKnobs.CELL_SIZE_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Cell size in pixels"}
                        onInput={setCellSize}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} />
        </>
    );
};
