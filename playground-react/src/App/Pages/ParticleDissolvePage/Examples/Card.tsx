import { useState } from "react";

import { Button, ParticleDissolve } from "@thewaver/ss-components-react";
import {
    CARD_TEXT,
    computeAshAnimation,
} from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { AshParticle } from "../AshParticle";
import type { ParticleDissolveAngleExampleProps } from "../ParticleDissolvePageReact.types";

type Props = ParticleDissolveAngleExampleProps;

export const CardExample = (props: Props) => {
    const [isDissolved, setIsDissolved] = useState(false);

    return (
        <div id={"particleDissolveCardStage"} className={styles.stack}>
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
                <div className={styles.card}>
                    <span id={"particleDissolveCardTitle"} className={styles.cardTitle}>
                        {CARD_TEXT.title}
                    </span>
                    <span>{CARD_TEXT.body}</span>
                    <span id={"particleDissolveCardBadge"} className={styles.badge}>
                        {CARD_TEXT.badge}
                    </span>
                </div>
            </ParticleDissolve>

            <div className={styles.buttonRow}>
                <Button
                    id={"particleDissolveCardBurn"}
                    renderContent={(flags) => <PageButtonContent flags={flags}>Dissolve</PageButtonContent>}
                    onClick={() => {
                        setIsDissolved(true);
                    }}
                />
                <Button
                    id={"particleDissolveCardRebuild"}
                    renderContent={(flags) => <PageButtonContent flags={flags}>Rebuild</PageButtonContent>}
                    onClick={() => {
                        setIsDissolved(false);
                    }}
                />
            </div>
        </div>
    );
};
