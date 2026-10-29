import { useState } from "react";

import { ParticleSpawner } from "@thewaver/ss-components-react";
import type { ParticleSpawnerController } from "@thewaver/ss-components-react";
import {
    computeParticleAnimation,
    createParticleSrc,
    createReturnParticleSrc,
} from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.css";

import type { ParticleSpawnerExampleProps } from "../ParticleSpawnerPage.types";

const RETURN_COUNT = 1;

export const RoundTripExample = (props: ParticleSpawnerExampleProps) => {
    const [outboundMarker, setOutboundMarker] = useState<HTMLElement | null>(null);
    const [returnMarker, setReturnMarker] = useState<HTMLElement | null>(null);
    const [relay, setRelay] = useState<ParticleSpawnerController>();
    const relayPlayback = useState(false);

    const [particleSrc] = useState(createParticleSrc);
    const [returnParticleSrc] = useState(createReturnParticleSrc);

    return (
        <div className={styles.demoArea}>
            <div className={styles.spawnerRoot} style={{ left: "15%", top: "50%" }}>
                <div ref={setOutboundMarker} className={styles.spawnerMarker} />

                <ParticleSpawner
                    {...props}
                    targets={[returnMarker ?? undefined]}
                    src={particleSrc}
                    computeParticleAnimation={computeParticleAnimation}
                    onParticleArrive={() => relay?.emit(RETURN_COUNT)}
                />
            </div>

            <div className={styles.spawnerRoot} style={{ left: "85%", top: "50%" }}>
                <div ref={setReturnMarker} className={styles.spawnerMarkerReturn} />

                <ParticleSpawner
                    {...props}
                    playback={relayPlayback}
                    targets={[outboundMarker ?? undefined]}
                    src={returnParticleSrc}
                    computeParticleAnimation={computeParticleAnimation}
                    onMount={setRelay}
                />
            </div>
        </div>
    );
};
