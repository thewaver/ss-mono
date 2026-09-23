import { For, createSignal } from "solid-js";

import { Button, ParticleSpawner, access } from "@thewaver/ss-components";
import type { ParticleSpawnIterationPattern } from "@thewaver/ss-components";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { computeParticleGlow } from "../ParticleSpawnerPage.const";
import type { ParticleSpawnerExampleProps } from "../ParticleSpawnerPage.types";

import * as styles from "../ParticleSpawnerPage.css";

const ONE_ROUND: ParticleSpawnIterationPattern[] = [{ count: 1 }];

const TARGET_POSITIONS = [
    { left: "50%", top: "15%" },
    { left: "80%", top: "30%" },
    { left: "80%", top: "70%" },
    { left: "50%", top: "85%" },
    { left: "20%", top: "70%" },
    { left: "20%", top: "30%" },
];

export const BurstExample = (props: ParticleSpawnerExampleProps) => {
    const playback = createSignal(false);
    const [, setIsPlaying] = playback;

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

            <div class={styles.burstRoot} style={{ left: "50%", top: "50%" }}>
                <Button
                    id={"particleBurst"}
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Burst</PageButtonContent>}
                    onClick={() => {
                        setIsPlaying(true);
                    }}
                />

                <div class={styles.spawnerOverlay}>
                    <ParticleSpawner
                        {...props}
                        playbackSignal={playback}
                        spawnIterationPatterns={ONE_ROUND}
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
                        onAnimationEnd={() => setIsPlaying(false)}
                    />
                </div>
            </div>
        </div>
    );
};
