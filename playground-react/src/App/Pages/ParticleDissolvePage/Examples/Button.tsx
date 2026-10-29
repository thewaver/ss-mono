import { useState } from "react";

import { Button, ParticleDissolve } from "@thewaver/ss-components-react";
import {
    ASH_ANIMATION,
    ASH_SRC,
    CENTER_SHARE,
} from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.css";
import type { Point2d } from "@thewaver/ss-utils";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { ParticleDissolveExampleProps } from "../ParticleDissolvePageReact.types";

type Props = ParticleDissolveExampleProps;

const computePressShare = (e: MouseEvent | KeyboardEvent, element: HTMLElement): Point2d => {
    if (!(e instanceof MouseEvent) || e.detail === 0) return CENTER_SHARE;

    const rect = element.getBoundingClientRect();

    if (rect.width <= 0 || rect.height <= 0) return CENTER_SHARE;

    return { x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height };
};

export const ButtonExample = (props: Props) => {
    const [isDissolved, setIsDissolved] = useState(false);
    const [originShare, setOriginShare] = useState<Point2d>(CENTER_SHARE);

    return (
        <div id={"particleDissolveButtonStage"} className={styles.stack}>
            <ParticleDissolve
                isDissolved={isDissolved}
                originShare={originShare}
                durationMs={props.durationMs}
                particleLifetimeMs={props.particleLifetimeMs}
                featherShare={props.featherShare}
                spawnChance={props.spawnChance}
                cellSize={props.cellSize}
                src={ASH_SRC}
                computeParticleAnimation={ASH_ANIMATION}
            >
                <Button
                    id={"particleDissolveBurn"}
                    renderContent={(flags) => <PageButtonContent flags={flags}>Click to burn me up</PageButtonContent>}
                    onClick={(e) => {
                        setOriginShare(computePressShare(e.nativeEvent, e.currentTarget));
                        setIsDissolved(true);
                    }}
                />
            </ParticleDissolve>

            <Button
                id={"particleDissolveRebuild"}
                renderContent={(flags) => <PageButtonContent flags={flags}>Rebuild</PageButtonContent>}
                onClick={() => {
                    setIsDissolved(false);
                }}
            />
        </div>
    );
};
