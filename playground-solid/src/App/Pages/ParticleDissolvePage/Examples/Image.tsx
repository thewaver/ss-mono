import { createSignal } from "solid-js";

import { Button, ParticleDissolve } from "@thewaver/ss-components-solid";
import {
    ASH_ANIMATION,
    ASH_SRC,
} from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.css";
import knight from "@thewaver/ss-playground/App/knight.webp";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { ParticleDissolveAngleExampleProps } from "../ParticleDissolvePageSolid.types";

type Props = ParticleDissolveAngleExampleProps;

export const ImageExample = (props: Props) => {
    const [getIsDissolved, setIsDissolved] = createSignal(false);

    return (
        <div id={"particleDissolveImageStage"} class={styles.stack}>
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
                <img class={styles.image} src={knight} alt={"A knight"} />
            </ParticleDissolve>

            <div class={styles.buttonRow}>
                <Button
                    id={"particleDissolveImageBurn"}
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Dissolve</PageButtonContent>}
                    onClick={() => {
                        setIsDissolved(true);
                    }}
                />
                <Button
                    id={"particleDissolveImageRebuild"}
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Rebuild</PageButtonContent>}
                    onClick={() => {
                        setIsDissolved(false);
                    }}
                />
            </div>
        </div>
    );
};
