import { createSignal } from "solid-js";

import { ParticleSpawner } from "@thewaver/ss-components";

import { computeParticleGlow } from "../ParticleSpawnerPage.const";
import type { ParticleSpawnerExampleProps } from "../ParticleSpawnerPage.types";

import * as styles from "../ParticleSpawnerPage.css";

export const DiagonalExample = (props: ParticleSpawnerExampleProps) => {
    const [getTargetRef, setTargetRef] = createSignal<HTMLElement>();

    return (
        <div class={styles.demoArea}>
            <div ref={setTargetRef} class={styles.targetMarker} style={{ left: "85%", top: "85%" }} />

            <div class={styles.spawnerRoot} style={{ left: "15%", top: "15%" }}>
                <div class={styles.spawnerMarker} />

                <ParticleSpawner
                    {...props}
                    targets={() => [getTargetRef()]}
                    renderParticle={(_index, getT) => {
                        const getGlow = () => computeParticleGlow(getT());

                        return (
                            <div
                                class={styles.particle}
                                style={{ opacity: getGlow().opacity, transform: `scale(${getGlow().scale})` }}
                            />
                        );
                    }}
                />
            </div>
        </div>
    );
};
