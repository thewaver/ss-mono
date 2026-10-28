import { useState } from "react";

import { Button, ParticleDissolve } from "@thewaver/ss-components-react";
import { computeAshAnimation } from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.css";
import knight from "@thewaver/ss-playground/App/knight.webp";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { AshParticle } from "../AshParticle";
import type { ParticleDissolveAngleExampleProps } from "../ParticleDissolvePageReact.types";

type Props = ParticleDissolveAngleExampleProps;

export const ImageExample = (props: Props) => {
    const [isDissolved, setIsDissolved] = useState(false);

    return (
        <div id={"particleDissolveImageStage"} className={styles.stack}>
            <ParticleDissolve
                isDissolved={isDissolved}
                angleDegrees={props.angleDegrees}
                durationMs={props.durationMs}
                particleLifetimeMs={props.particleLifetimeMs}
                featherShare={props.featherShare}
                spawnChance={props.spawnChance}
                cellSize={props.cellSize}
                computeParticleAnimation={computeAshAnimation}
                renderParticle={(defs) => <AshParticle defs={defs} />}
            >
                <img className={styles.image} src={knight} alt={"A knight"} />
            </ParticleDissolve>

            <div className={styles.buttonRow}>
                <Button
                    id={"particleDissolveImageBurn"}
                    renderContent={(flags) => <PageButtonContent flags={flags}>Dissolve</PageButtonContent>}
                    onClick={() => {
                        setIsDissolved(true);
                    }}
                />
                <Button
                    id={"particleDissolveImageRebuild"}
                    renderContent={(flags) => <PageButtonContent flags={flags}>Rebuild</PageButtonContent>}
                    onClick={() => {
                        setIsDissolved(false);
                    }}
                />
            </div>
        </div>
    );
};
