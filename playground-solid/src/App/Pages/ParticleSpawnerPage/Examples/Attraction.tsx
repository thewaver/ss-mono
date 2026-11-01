import { createMemo, createSignal } from "solid-js";

import { ParticleModifierUtils, ParticleSpawner, access } from "@thewaver/ss-components-solid";
import {
    computeParticleAnimation,
    createParticleSrc,
} from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.css";

import type { AttractionExampleProps } from "../ParticleSpawnerPage.types";

export const AttractionExample = (props: AttractionExampleProps) => {
    const particleSrc = createParticleSrc();

    const [getTargetRef, setTargetRef] = createSignal<HTMLElement>();
    const [getAttractorRef, setAttractorRef] = createSignal<HTMLElement>();

    const getModifiers = createMemo(() => [
        ParticleModifierUtils.createAttraction({
            modMarkerIndex: 0,
            strengthRatio: access(props.attractionStrengthRatio),
            reachPixels: access(props.attractionReachPixels),
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

            <div ref={setAttractorRef} class={styles.attractorMarker} />

            <div class={styles.spawnerRoot} style={{ left: "15%", top: "50%" }}>
                <div class={styles.spawnerMarker} />

                <ParticleSpawner
                    {...props}
                    targets={() => [getTargetRef()]}
                    modMarkers={() => [getAttractorRef()]}
                    src={particleSrc}
                    particleModifiers={getModifiers()}
                    computeParticleAnimation={computeParticleAnimation}
                />
            </div>
        </div>
    );
};
