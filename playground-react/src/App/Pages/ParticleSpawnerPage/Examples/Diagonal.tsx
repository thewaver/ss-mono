import { useState } from "react";

import { ParticleSpawner } from "@thewaver/ss-components-react";
import { computeParticleGlow } from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.css";

import type { ParticleSpawnerExampleProps } from "../ParticleSpawnerPage.types";

export const DiagonalExample = (props: ParticleSpawnerExampleProps) => {
    const [targetRef, setTargetRef] = useState<HTMLElement | null>(null);

    return (
        <div className={styles.demoArea}>
            <div
                ref={setTargetRef}
                className={[styles.targetMarker, props.areTargetsHidden && styles.isHiddenMarker]
                    .filter(Boolean)
                    .join(" ")}
                style={{ left: "85%", top: "85%" }}
            />

            <div className={styles.spawnerRoot} style={{ left: "15%", top: "15%" }}>
                <div className={styles.spawnerMarker} />

                <ParticleSpawner
                    {...props}
                    targets={[targetRef ?? undefined]}
                    renderParticle={(_index, t) => {
                        const glow = computeParticleGlow(t);

                        return (
                            <div
                                className={styles.particle}
                                style={{ opacity: glow.opacity, transform: `scale(${glow.scale})` }}
                            />
                        );
                    }}
                />
            </div>
        </div>
    );
};
