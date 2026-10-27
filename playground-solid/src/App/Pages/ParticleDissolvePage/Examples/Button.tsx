import { createSignal } from "solid-js";

import { Button, ParticleDissolve } from "@thewaver/ss-components-solid";
import {
    CENTER_SHARE,
    computeAshAnimation,
} from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.css";
import type { Point2d } from "@thewaver/ss-utils";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { AshParticle } from "../AshParticle";
import type { ParticleDissolveExampleProps } from "../ParticleDissolvePageSolid.types";

type Props = ParticleDissolveExampleProps;

const computePressShare = (e: MouseEvent | KeyboardEvent): Point2d => {
    const element = e.currentTarget;

    if (!(e instanceof MouseEvent) || e.detail === 0 || !(element instanceof HTMLElement)) return CENTER_SHARE;

    const rect = element.getBoundingClientRect();

    if (rect.width <= 0 || rect.height <= 0) return CENTER_SHARE;

    return { x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height };
};

export const ButtonExample = (props: Props) => {
    const [getIsDissolved, setIsDissolved] = createSignal(false);
    const [getOriginShare, setOriginShare] = createSignal<Point2d>(CENTER_SHARE);

    return (
        <div id={"particleDissolveButtonStage"} class={styles.stack}>
            <ParticleDissolve
                isDissolved={getIsDissolved}
                originShare={getOriginShare}
                durationMs={props.durationMs}
                particleLifetimeMs={props.particleLifetimeMs}
                featherShare={props.featherShare}
                spawnChance={props.spawnChance}
                particlesPerCell={props.particlesPerCell}
                cellSize={props.cellSize}
                computeParticleAnimation={computeAshAnimation}
                renderParticle={(defs) => <AshParticle defs={defs} />}
            >
                <Button
                    id={"particleDissolveBurn"}
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Burn me</PageButtonContent>}
                    onClick={(e) => {
                        setOriginShare(computePressShare(e));
                        setIsDissolved(true);
                    }}
                />
            </ParticleDissolve>

            <Button
                id={"particleDissolveRebuild"}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Rebuild</PageButtonContent>}
                onClick={() => {
                    setIsDissolved(false);
                }}
            />
        </div>
    );
};
