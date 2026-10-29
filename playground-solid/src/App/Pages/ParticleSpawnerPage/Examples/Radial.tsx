import { For, createSignal } from "solid-js";

import { ParticleSpawner, access } from "@thewaver/ss-components-solid";
import {
    computeParticleAnimation,
    createParticleSrc,
} from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";
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
    const particleSrc = createParticleSrc();

    const [getTargetRefs, setTargetRefs] = createSignal<(HTMLElement | undefined)[]>(
        TARGET_POSITIONS.map(() => undefined),
    );

    const setTargetRefAt = (index: number, el: HTMLElement) =>
        setTargetRefs((refs) => refs.map((ref, refIndex) => (refIndex === index ? el : ref)));

    return (
        <div class={styles.demoArea}>
            <For each={TARGET_POSITIONS}>
                {(position, index) => (
                    <div
                        ref={(el) => setTargetRefAt(index(), el)}
                        class={styles.targetMarker}
                        classList={{ [styles.isHiddenMarker]: access(props.areTargetsHidden) }}
                        style={position}
                    />
                )}
            </For>

            <div class={styles.spawnerRoot} style={{ left: "50%", top: "50%" }}>
                <div class={styles.spawnerMarker} />

                <ParticleSpawner
                    {...props}
                    targets={getTargetRefs}
                    src={particleSrc}
                    computeParticleAnimation={computeParticleAnimation}
                />
            </div>
        </div>
    );
};
