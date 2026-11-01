import { useMemo, useState } from "react";

import { ParticleModifierUtils, ParticleSpawner } from "@thewaver/ss-components-react";
import {
    computeParticleAnimation,
    createParticleSrc,
} from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.css";

import type { AttractionExampleProps } from "../ParticleSpawnerPage.types";

export const AttractionExample = (props: AttractionExampleProps) => {
    const [particleSrc] = useState(createParticleSrc);

    const [targetRef, setTargetRef] = useState<HTMLElement | null>(null);
    const [attractorRef, setAttractorRef] = useState<HTMLElement | null>(null);

    const modifiers = useMemo(
        () => [
            ParticleModifierUtils.createAttraction({
                modMarkerIndex: 0,
                strengthRatio: props.attractionStrengthRatio,
                reachPixels: props.attractionReachPixels,
            }),
        ],
        [props.attractionStrengthRatio, props.attractionReachPixels],
    );

    return (
        <div className={styles.demoArea}>
            <div
                ref={setTargetRef}
                className={[styles.targetMarker, props.areTargetsHidden && styles.isHiddenMarker]
                    .filter(Boolean)
                    .join(" ")}
                style={{ left: "85%", top: "50%" }}
            />

            <div ref={setAttractorRef} className={styles.attractorMarker} />

            <div className={styles.spawnerRoot} style={{ left: "15%", top: "50%" }}>
                <div className={styles.spawnerMarker} />

                <ParticleSpawner
                    {...props}
                    targets={[targetRef ?? undefined]}
                    modMarkers={[attractorRef ?? undefined]}
                    src={particleSrc}
                    particleModifiers={modifiers}
                    computeParticleAnimation={computeParticleAnimation}
                />
            </div>
        </div>
    );
};
