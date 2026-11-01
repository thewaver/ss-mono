import { createMemo, createSignal } from "solid-js";

import { ParticleModifierUtils, ParticleSpawner, access } from "@thewaver/ss-components-solid";
import {
    computeParticleAnimation,
    createParticleSrc,
} from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.css";

import type { WindExampleProps } from "../ParticleSpawnerPage.types";

export const WindExample = (props: WindExampleProps) => {
    const particleSrc = createParticleSrc();

    const [getTargetRef, setTargetRef] = createSignal<HTMLElement>();

    const getModifiers = createMemo(() => [
        ParticleModifierUtils.createWind({
            directionDegrees: access(props.windDirectionDegrees),
            strengthPixels: access(props.windStrengthPixels),
            gustRatio: access(props.windGustRatio),
        }),
    ]);

    return (
        <div class={styles.demoArea}>
            <div
                ref={setTargetRef}
                class={styles.targetMarker}
                classList={{ [styles.isHiddenMarker]: access(props.areTargetsHidden) }}
                style={{ left: "85%", top: "50%" }}
            />

            <div
                class={styles.windArrow}
                style={{
                    width: `${access(props.windStrengthPixels)}px`,
                    transform: `rotate(${access(props.windDirectionDegrees)}deg)`,
                }}
            />

            <div class={styles.spawnerRoot} style={{ left: "15%", top: "50%" }}>
                <div class={styles.spawnerMarker} />

                <ParticleSpawner
                    {...props}
                    targets={() => [getTargetRef()]}
                    src={particleSrc}
                    particleModifiers={getModifiers()}
                    computeParticleAnimation={computeParticleAnimation}
                />
            </div>
        </div>
    );
};
