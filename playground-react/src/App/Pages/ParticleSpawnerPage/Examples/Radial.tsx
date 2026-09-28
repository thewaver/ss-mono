import { useState } from "react";

import { ParticleSpawner } from "@thewaver/ss-components-react";
import { computeParticleGlow } from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.css";

import type { ParticleSpawnerExampleProps } from "../ParticleSpawnerPage.types";

const TARGET_POSITIONS = [
    { left: "50%", top: "15%" },
    { left: "80%", top: "30%" },
    { left: "80%", top: "70%" },
    { left: "50%", top: "85%" },
    { left: "20%", top: "70%" },
    { left: "20%", top: "30%" },
];

export const RadialExample = (props: ParticleSpawnerExampleProps) => {
    const [targetRefs, setTargetRefs] = useState<(HTMLElement | undefined)[]>(() =>
        TARGET_POSITIONS.map(() => undefined),
    );

    const [targetRefSetters] = useState(() =>
        TARGET_POSITIONS.map((_, index) => (el: HTMLElement | null) => {
            setTargetRefs((refs) => refs.map((ref, refIndex) => (refIndex === index ? (el ?? undefined) : ref)));
        }),
    );

    return (
        <div className={styles.demoArea}>
            {TARGET_POSITIONS.map((position, index) => (
                <div
                    key={index}
                    ref={targetRefSetters[index]}
                    className={[styles.targetMarker, props.areTargetsHidden && styles.isHiddenMarker]
                        .filter(Boolean)
                        .join(" ")}
                    style={position}
                />
            ))}

            <div className={styles.spawnerRoot} style={{ left: "50%", top: "50%" }}>
                <div className={styles.spawnerMarker} />

                <ParticleSpawner
                    {...props}
                    targets={targetRefs}
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
