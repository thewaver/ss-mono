import { createSignal } from "solid-js";

import { Button, ParticleDissolve } from "@thewaver/ss-components-solid";
import {
    ASH_ANIMATION,
    ASH_SRC,
    CARD_TEXT,
} from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
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
                cellSize={props.cellSize}
                src={ASH_SRC}
                computeParticleAnimation={ASH_ANIMATION}
            >
                <div class={styles.card}>
                    <span id={"particleDissolveCardTitle"} class={styles.cardTitle}>
                        {CARD_TEXT.title}
                    </span>
                    <span>{CARD_TEXT.body}</span>
                    <span id={"particleDissolveCardBadge"} class={styles.badge}>
                        {CARD_TEXT.badge}
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
