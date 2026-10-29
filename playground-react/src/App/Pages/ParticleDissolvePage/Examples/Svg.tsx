import { useMemo, useState } from "react";

import { Button, ParticleDissolve } from "@thewaver/ss-components-react";
import {
    ASH_ANIMATION,
    ASH_SRC,
    NO_EDGE_THICKNESSES,
    SVG_LABEL,
    SVG_SIZE,
} from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.css";
import { ShapeConst, ShapeUtils } from "@thewaver/ss-utils";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { ParticleDissolveSvgExampleProps } from "../ParticleDissolvePageReact.types";

type Props = ParticleDissolveSvgExampleProps;

export const SvgExample = (props: Props) => {
    const [isDissolved, setIsDissolved] = useState(false);

    const path = useMemo(
        () =>
            ShapeUtils.getPaths(ShapeConst.getDefaultShapePoints(props.shapeKind, SVG_SIZE), NO_EDGE_THICKNESSES)
                .outerPath,
        [props.shapeKind],
    );

    return (
        <div id={"particleDissolveSvgStage"} className={styles.stack}>
            <ParticleDissolve
                isDissolved={isDissolved}
                angleDegrees={props.angleDegrees}
                durationMs={props.durationMs}
                particleLifetimeMs={props.particleLifetimeMs}
                featherShare={props.featherShare}
                spawnChance={props.spawnChance}
                cellSize={props.cellSize}
                src={ASH_SRC}
                computeParticleAnimation={ASH_ANIMATION}
            >
                <svg
                    className={styles.svgShape}
                    width={SVG_SIZE.width}
                    height={SVG_SIZE.height}
                    role="img"
                    aria-label={"The shape that dissolves"}
                >
                    <path className={styles.svgShapePath} d={path} />
                    <text className={styles.svgShapeText} x={"50%"} y={"50%"}>
                        {SVG_LABEL}
                    </text>
                </svg>
            </ParticleDissolve>

            <div className={styles.buttonRow}>
                <Button
                    id={"particleDissolveSvgBurn"}
                    renderContent={(flags) => <PageButtonContent flags={flags}>Dissolve</PageButtonContent>}
                    onClick={() => {
                        setIsDissolved(true);
                    }}
                />
                <Button
                    id={"particleDissolveSvgRebuild"}
                    renderContent={(flags) => <PageButtonContent flags={flags}>Rebuild</PageButtonContent>}
                    onClick={() => {
                        setIsDissolved(false);
                    }}
                />
            </div>
        </div>
    );
};
