import { useState } from "react";

import { ParticleSpawner } from "@thewaver/ss-components-react";
import { computeParticleGlow } from "@thewaver/ss-playground-core/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";
import * as styles from "@thewaver/ss-playground-core/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.css";

import type { ParticleSpawnerExampleProps } from "../ParticleSpawnerPage.types";

const SPAWNER_POSITIONS = [
    { left: "50%", top: "15%" },
    { left: "80%", top: "30%" },
    { left: "80%", top: "70%" },
    { left: "50%", top: "85%" },
    { left: "20%", top: "70%" },
    { left: "20%", top: "30%" },
];

export const ManyToOneExample = (props: ParticleSpawnerExampleProps) => {
    const [targetRef, setTargetRef] = useState<HTMLElement | null>(null);

    return (
        <div className={styles.demoArea}>
            <div
                ref={setTargetRef}
                className={[styles.targetMarker, props.areTargetsHidden && styles.isHiddenMarker]
                    .filter(Boolean)
                    .join(" ")}
                style={{ left: "50%", top: "50%" }}
            />

            {SPAWNER_POSITIONS.map((position, index) => (
                <div key={index} className={styles.spawnerRoot} style={position}>
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
            ))}
        </div>
    );
};
