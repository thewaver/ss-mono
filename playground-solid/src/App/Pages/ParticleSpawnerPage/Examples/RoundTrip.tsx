import { type Accessor, createSignal } from "solid-js";

import { ParticleSpawner } from "@thewaver/ss-components-solid";
import type { ParticleSpawnerController } from "@thewaver/ss-components-solid";
import { computeParticleGlow } from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.css";

import type { ParticleSpawnerExampleProps } from "../ParticleSpawnerPage.types";

const RETURN_COUNT = 1;

export const RoundTripExample = (props: ParticleSpawnerExampleProps) => {
    const [getOutboundMarker, setOutboundMarker] = createSignal<HTMLElement>();
    const [getReturnMarker, setReturnMarker] = createSignal<HTMLElement>();
    const [getRelay, setRelay] = createSignal<ParticleSpawnerController>();
    const relayPlayback = createSignal(false);

    const renderParticle = (getT: Accessor<number>, particleClass: string) => {
        const getGlow = () => computeParticleGlow(getT());

        return (
            <div class={particleClass} style={{ opacity: getGlow().opacity, transform: `scale(${getGlow().scale})` }} />
        );
    };

    return (
        <div class={styles.demoArea}>
            <div class={styles.spawnerRoot} style={{ left: "15%", top: "50%" }}>
                <div ref={setOutboundMarker} class={styles.spawnerMarker} />

                <ParticleSpawner
                    {...props}
                    targets={() => [getReturnMarker()]}
                    renderParticle={(_index, getT) => renderParticle(getT, styles.particle)}
                    onParticleArrive={() => getRelay()?.emit(RETURN_COUNT)}
                />
            </div>

            <div class={styles.spawnerRoot} style={{ left: "85%", top: "50%" }}>
                <div ref={setReturnMarker} class={styles.spawnerMarker} />

                <ParticleSpawner
                    {...props}
                    playback={relayPlayback}
                    targets={() => [getOutboundMarker()]}
                    renderParticle={(_index, getT) => renderParticle(getT, styles.particleReturn)}
                    onMount={setRelay}
                />
            </div>
        </div>
    );
};
