import { useState } from "react";

import { ParticleSpawner } from "@thewaver/ss-components-react";
import { computeParticleGlow } from "@thewaver/ss-playground-core/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";
import * as styles from "@thewaver/ss-playground-core/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.css";

import type { ParticleSpawnerExampleProps } from "../ParticleSpawnerPage.types";

const TARGET_TOPS = ["20%", "40%", "60%", "80%"];

export const MultipleTargetsExample = (props: ParticleSpawnerExampleProps) => {
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
                    style={{ left: "85%", top }}
                />
            ))}

            <div className={styles.spawnerRoot} style={{ left: "15%", top: "50%" }}>
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
