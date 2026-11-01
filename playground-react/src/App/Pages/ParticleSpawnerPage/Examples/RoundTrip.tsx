import { useState } from "react";

import { type ParticleRouteStop, ParticleSpawner } from "@thewaver/ss-components-react";
import {
    computeParticleAnimation,
    createLegTints,
    createTintableParticleSrc,
} from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.css";

import type { ParticleSpawnerExampleProps } from "../ParticleSpawnerPage.types";

const OUT_AND_BACK: ParticleRouteStop[] = [0, "spawner"];

export const RoundTripExample = (props: ParticleSpawnerExampleProps) => {
    const [particleSrc] = useState(createTintableParticleSrc);
    const [legTints] = useState(createLegTints);

    const [targetRef, setTargetRef] = useState<HTMLElement | null>(null);

    return (
        <div className={styles.demoArea}>
            <div
                ref={setTargetRef}
                className={[styles.targetMarker, props.areTargetsHidden && styles.isHiddenMarker]
                    .filter(Boolean)
                    .join(" ")}
                style={{ left: "85%", top: "50%" }}
            />

            <div className={styles.spawnerRoot} style={{ left: "15%", top: "50%" }}>
                <div className={styles.spawnerMarker} />

                <ParticleSpawner
                    {...props}
                    targets={[targetRef ?? undefined]}
                    src={particleSrc}
                    computeRoute={() => OUT_AND_BACK}
                    computeParticleTint={(defs) => legTints[defs.legIndex % legTints.length]}
                    computeParticleAnimation={computeParticleAnimation}
                />
            </div>
        </div>
    );
};
