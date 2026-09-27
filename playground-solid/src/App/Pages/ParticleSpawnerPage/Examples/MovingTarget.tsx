import { createSignal } from "solid-js";

import { ParticleSpawner, access } from "@thewaver/ss-components-solid";
import { computeParticleGlow } from "@thewaver/ss-playground-core/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";
import * as styles from "@thewaver/ss-playground-core/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.css";

import type { ParticleSpawnerExampleProps } from "../ParticleSpawnerPage.types";

export const MovingTargetExample = (props: ParticleSpawnerExampleProps) => {
    const [getTargetRef, setTargetRef] = createSignal<HTMLElement>();

    return (
        <div class={styles.demoArea}>
            <div
                ref={setTargetRef}
                class={styles.movingTargetMarker}
                classList={{ [styles.isHiddenMarker]: access(props.areTargetsHidden) }}
            />

            <div class={styles.spawnerRoot} style={{ left: "50%", top: "50%" }}>
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
