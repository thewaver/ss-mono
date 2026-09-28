import { useState } from "react";

import { ParticleSpawner } from "@thewaver/ss-components-react";
import { computeParticleGlow } from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.css";

import type { ParticleSpawnerExampleProps } from "../ParticleSpawnerPage.types";

const SPAWNER_TOPS = ["20%", "50%", "80%"];
const TARGET_TOPS = ["20%", "50%", "80%"];

export const GridExample = (props: ParticleSpawnerExampleProps) => {
    const [targetRefs, setTargetRefs] = useState<(HTMLElement | undefined)[]>(() => TARGET_TOPS.map(() => undefined));

    const [targetRefSetters] = useState(() =>
        TARGET_TOPS.map((_, index) => (el: HTMLElement | null) => {
            setTargetRefs((refs) => refs.map((ref, refIndex) => (refIndex === index ? (el ?? undefined) : ref)));
        }),
    );

    return (
        <div className={styles.demoArea}>
            {TARGET_TOPS.map((top, index) => (
                <div
                    key={index}
                    ref={targetRefSetters[index]}
                    className={[styles.targetMarker, props.areTargetsHidden && styles.isHiddenMarker]
                        .filter(Boolean)
                        .join(" ")}
                    style={{ left: "90%", top }}
                />
            ))}

            {SPAWNER_TOPS.map((top, index) => (
                <div key={index} className={styles.spawnerRoot} style={{ left: "10%", top }}>
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
            ))}
        </div>
    );
};
