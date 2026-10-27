import { createSignal } from "solid-js";

import { Button, ParticleDissolve } from "@thewaver/ss-components-solid";
import { computeAshAnimation } from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { AshParticle } from "../AshParticle";
import type { ParticleDissolveAngleExampleProps } from "../ParticleDissolvePageSolid.types";

type Props = ParticleDissolveAngleExampleProps;

export const CardExample = (props: Props) => {
    const [getIsDissolved, setIsDissolved] = createSignal(false);

    return (
        <div id={"particleDissolveCardStage"} class={styles.stack}>
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
                <div class={styles.card}>
                    <span id={"particleDissolveCardTitle"} class={styles.cardTitle}>
                        Quarterly report
                    </span>
                    <span>Revenue grew in every region, and the notes below explain the two that did not.</span>
                    <span id={"particleDissolveCardBadge"} class={styles.badge}>
                        Approved
                    </span>
                </div>
            </ParticleDissolve>

            <div class={styles.buttonRow}>
                <Button
                    id={"particleDissolveCardBurn"}
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Dissolve</PageButtonContent>}
                    onClick={() => {
                        setIsDissolved(true);
                    }}
                />
                <Button
                    id={"particleDissolveCardRebuild"}
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Rebuild</PageButtonContent>}
                    onClick={() => {
                        setIsDissolved(false);
                    }}
                />
            </div>
        </div>
    );
};
