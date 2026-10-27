import { createMemo, createSignal } from "solid-js";

import { Button, ParticleDissolve, access } from "@thewaver/ss-components-solid";
import {
    NO_EDGE_THICKNESSES,
    SVG_SIZE,
    computeAshAnimation,
} from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.css";
import { ShapeConst, ShapeUtils } from "@thewaver/ss-utils";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { AshParticle } from "../AshParticle";
import type { ParticleDissolveSvgExampleProps } from "../ParticleDissolvePageSolid.types";

type Props = ParticleDissolveSvgExampleProps;

export const SvgExample = (props: Props) => {
    const [getIsDissolved, setIsDissolved] = createSignal(false);

    const getPath = createMemo(
        () =>
            ShapeUtils.getPaths(
                ShapeConst.getDefaultShapePoints(access(props.shapeKind), SVG_SIZE),
                NO_EDGE_THICKNESSES,
            ).outerPath,
    );

    return (
        <div id={"particleDissolveSvgStage"} class={styles.stack}>
            <ParticleDissolve
                isDissolved={getIsDissolved}
                angleDegrees={props.angleDegrees}
                durationMs={props.durationMs}
                particleLifetimeMs={props.particleLifetimeMs}
                featherShare={props.featherShare}
                spawnChance={props.spawnChance}
                particlesPerCell={props.particlesPerCell}
                cellSize={props.cellSize}
                computeParticleAnimation={computeAshAnimation}
                renderParticle={(defs) => <AshParticle defs={defs} />}
            >
                <svg
                    class={styles.svgShape}
                    width={SVG_SIZE.width}
                    height={SVG_SIZE.height}
                    role="img"
                    aria-label={"The shape that dissolves"}
                >
                    <path class={styles.svgShapePath} d={getPath()} />
                </svg>
            </ParticleDissolve>

            <div class={styles.buttonRow}>
                <Button
                    id={"particleDissolveSvgBurn"}
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Dissolve</PageButtonContent>}
                    onClick={() => {
                        setIsDissolved(true);
                    }}
                />
                <Button
                    id={"particleDissolveSvgRebuild"}
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Rebuild</PageButtonContent>}
                    onClick={() => {
                        setIsDissolved(false);
                    }}
                />
            </div>
        </div>
    );
};
