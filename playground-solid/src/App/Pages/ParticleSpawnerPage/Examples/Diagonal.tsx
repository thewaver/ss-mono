import { createSignal } from "solid-js";

import { ParticleSpawner, access } from "@thewaver/ss-components-solid";
import {
    computeParticleAnimation,
    createParticleSrc,
} from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.css";

import type { ParticleSpawnerExampleProps } from "../ParticleSpawnerPage.types";

export const DiagonalExample = (props: ParticleSpawnerExampleProps) => {
    const particleSrc = createParticleSrc();

    const [getTargetRef, setTargetRef] = createSignal<HTMLElement>();

    return (
        <div class={styles.demoArea}>
            <div
                ref={setTargetRef}
                class={styles.targetMarker}
                classList={{ [styles.isHiddenMarker]: access(props.areTargetsHidden) }}
                style={{ left: "85%", top: "85%" }}
            />

            <div class={styles.spawnerRoot} style={{ left: "15%", top: "15%" }}>
                <div class={styles.spawnerMarker} />

                <ParticleSpawner
                    {...props}
                    targets={() => [getTargetRef()]}
                    src={particleSrc}
                    computeParticleAnimation={computeParticleAnimation}
                />
            </div>
        </div>
    );
};
