import { createSignal } from "solid-js";

import { type ParticleRouteStop, ParticleSpawner, access } from "@thewaver/ss-components-solid";
import {
    computeParticleAnimation,
    createLegTints,
    createTintableParticleSrc,
} from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.css";

import type { ParticleSpawnerExampleProps } from "../ParticleSpawnerPage.types";

const OUT_AND_BACK: ParticleRouteStop[] = [0, "spawner"];

export const RoundTripExample = (props: ParticleSpawnerExampleProps) => {
    const particleSrc = createTintableParticleSrc();
    const legTints = createLegTints();

    const [getTargetRef, setTargetRef] = createSignal<HTMLElement>();

    return (
        <div class={styles.demoArea}>
            <div
                ref={setTargetRef}
                class={styles.targetMarker}
                classList={{ [styles.isHiddenMarker]: access(props.areTargetsHidden) }}
                style={{ left: "85%", top: "50%" }}
            />

            <div class={styles.spawnerRoot} style={{ left: "15%", top: "50%" }}>
                <div class={styles.spawnerMarker} />

                <ParticleSpawner
                    {...props}
                    targets={() => [getTargetRef()]}
                    src={particleSrc}
                    computeRoute={() => OUT_AND_BACK}
                    computeParticleTint={(defs) => legTints[defs.legIndex % legTints.length]}
                    computeParticleAnimation={computeParticleAnimation}
                />
            </div>
        </div>
    );
};
