import { For, createSignal } from "solid-js";

import { ParticleSpawner } from "@thewaver/ss-components";

import { computeParticleGlow } from "../ParticleSpawnerPage.const";
import type { ParticleSpawnerExampleProps } from "../ParticleSpawnerPage.types";

import * as styles from "../ParticleSpawnerPage.css";

const SPAWNER_TOPS = ["20%", "50%", "80%"];
const TARGET_TOPS = ["20%", "50%", "80%"];

export const GridExample = (props: ParticleSpawnerExampleProps) => {
    const [getTargetRefs, setTargetRefs] = createSignal<(HTMLElement | undefined)[]>(TARGET_TOPS.map(() => undefined));

    const setTargetRefAt = (index: number, el: HTMLElement) =>
        setTargetRefs((refs) => refs.map((ref, refIndex) => (refIndex === index ? el : ref)));

    return (
        <div class={styles.demoArea}>
            <For each={TARGET_TOPS}>
                {(top, index) => (
                    <div
                        ref={(el) => setTargetRefAt(index(), el)}
                        class={styles.targetMarker}
                        style={{ left: "90%", top }}
                    />
                )}
            </For>

            <For each={SPAWNER_TOPS}>
                {(top) => (
                    <div class={styles.spawnerRoot} style={{ left: "10%", top }}>
                        <div class={styles.spawnerMarker} />

                        <ParticleSpawner
                            {...props}
                            targets={getTargetRefs}
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
