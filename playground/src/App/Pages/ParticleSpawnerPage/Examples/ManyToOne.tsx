import { For, createSignal } from "solid-js";

import { ParticleSpawner, access } from "@thewaver/ss-components";

import { computeParticleGlow } from "../ParticleSpawnerPage.const";
import type { ParticleSpawnerExampleProps } from "../ParticleSpawnerPage.types";

import * as styles from "../ParticleSpawnerPage.css";

const SPAWNER_POSITIONS = [
    { left: "50%", top: "15%" },
    { left: "80%", top: "30%" },
    { left: "80%", top: "70%" },
    { left: "50%", top: "85%" },
    { left: "20%", top: "70%" },
    { left: "20%", top: "30%" },
];

export const ManyToOneExample = (props: ParticleSpawnerExampleProps) => {
    const [getTargetRef, setTargetRef] = createSignal<HTMLElement>();

    return (
        <div class={styles.demoArea}>
            <div
                ref={setTargetRef}
                class={styles.targetMarker}
                classList={{ [styles.isHiddenMarker]: access(props.areTargetsHidden) }}
                style={{ left: "50%", top: "50%" }}
            />

            <For each={SPAWNER_POSITIONS}>
                {(position) => (
                    <div class={styles.spawnerRoot} style={position}>
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
                )}
            </For>
        </div>
    );
};
