import { useState } from "react";

import type { Size2d } from "@thewaver/ss-utils";

import { ParticleField } from "../../src";

const LOZENGE = (size: Size2d) => [
    { x: size.width * 0.5, y: 0 },
    { x: size.width, y: size.height * 0.5 },
    { x: size.width * 0.5, y: size.height },
    { x: 0, y: size.height * 0.5 },
];

export const Default = ({
    spawnChance,
    isShaped = false,
    animationDurationMs = 1200,
}: {
    spawnChance?: number;
    isShaped?: boolean;
    animationDurationMs?: number;
}) => {
    const playbackState = useState(true);
    const progressState = useState(0);

    return (
        <>
            <div data-testid="field" style={{ width: 400, height: 200, margin: 40 }}>
                <ParticleField
                    cellCount={{ col: 8, row: 4 }}
                    spawnChance={spawnChance}
                    animationDurationMs={animationDurationMs}
                    particleLifetimeMs={300}
                    playbackState={playbackState}
                    progressState={progressState}
                    computeShapePoints={isShaped ? LOZENGE : undefined}
                    computeCellWeights={(count) =>
                        Array.from({ length: count.row }, () =>
                            Array.from({ length: count.col }, (_, col) => 1 - col / Math.max(count.col - 1, 1)),
                        )
                    }
                    computeParticleAnimation={(_defs, t) => ({ scale: 1 - t })}
                    renderParticle={(_defs, t) => (
                        <div data-life={t.toFixed(2)} style={{ width: 8, height: 8, background: "#f80" }} />
                    )}
                />
            </div>
            <button type="button" data-testid="playback" onClick={() => playbackState[1](!playbackState[0])}>
                {playbackState[0] ? "Pause" : "Play"}
            </button>
            <input
                data-testid="progress"
                type="range"
                min={0}
                max={100}
                step={1}
                value={Math.round(progressState[0] * 100)}
                onChange={(e) => progressState[1](Number(e.currentTarget.value) / 100)}
            />
        </>
    );
};
