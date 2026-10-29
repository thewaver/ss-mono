import { useState } from "react";

import { ParticleSpawner } from "@thewaver/ss-components-react";
import {
    computeParticleAnimation,
    createParticleSrc,
} from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.css";

import type { ParticleSpawnerExampleProps } from "../ParticleSpawnerPage.types";

export const VerticalExample = (props: ParticleSpawnerExampleProps) => {
    const [particleSrc] = useState(createParticleSrc);

    const [targetRef, setTargetRef] = useState<HTMLElement | null>(null);

    return (
        <div className={styles.demoArea}>
            <div
                ref={setTargetRef}
                className={[styles.targetMarker, props.areTargetsHidden && styles.isHiddenMarker]
                    .filter(Boolean)
                    .join(" ")}
                style={{ left: "50%", top: "85%" }}
            />

            <div className={styles.spawnerRoot} style={{ left: "50%", top: "15%" }}>
                <div className={styles.spawnerMarker} />

                <ParticleSpawner
                    {...props}
                    targets={[targetRef ?? undefined]}
                    src={particleSrc}
                    computeParticleAnimation={computeParticleAnimation}
                />
            </div>
        </div>
    );
};
