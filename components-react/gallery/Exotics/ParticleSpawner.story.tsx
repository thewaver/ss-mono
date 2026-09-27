import { type ReactNode, useLayoutEffect, useRef, useState } from "react";

import type { ParticleSpawnerController, ParticleTravelDefs } from "@thewaver/ss-components";

import { ParticleSpawner } from "../../src";

const STAGE_STYLE = { position: "relative", width: 600, height: 400, margin: 40 } as const;
const REPEATING = [{ count: 1, nextIndex: 0, beginDelayMs: 100 }];

const lerp = (travel: ParticleTravelDefs, t: number) => ({
    x: travel.from.x + (travel.to.x - travel.from.x) * t,
    y: travel.from.y + (travel.to.y - travel.from.y) * t,
});

const renderParticle = (index: number, t: number) => (
    <div data-index={index} data-t={t.toFixed(2)} style={{ width: 6, height: 6, background: "#e33" }} />
);

const Box = ({ x, y, children, ...rest }: { x: number; y: number; children?: ReactNode; [key: string]: unknown }) => (
    <div {...rest} style={{ position: "absolute", left: x, top: y, width: 40, height: 40, outline: "1px solid #999" }}>
        {children}
    </div>
);

const useTargets = () => {
    const stageRef = useRef<HTMLDivElement | null>(null);
    const [targets, setTargets] = useState<(HTMLElement | undefined)[]>([]);

    useLayoutEffect(() => {
        setTargets(Array.from(stageRef.current!.querySelectorAll<HTMLElement>("[data-target]")));
    }, []);

    return { stageRef, targets };
};

const RING = Array.from({ length: 6 }, (_, index) => ({
    x: 280 + Math.cos((index / 6) * Math.PI * 2) * 160,
    y: 180 + Math.sin((index / 6) * Math.PI * 2) * 160,
}));

export const Burst = ({ particleCount = 6, retentionMs = 300 }: { particleCount?: number; retentionMs?: number }) => {
    const { stageRef, targets } = useTargets();
    const playbackState = useState(false);
    const [arrivals, setArrivals] = useState(0);
    const [rounds, setRounds] = useState(0);

    return (
        <>
            <div ref={stageRef} data-testid="stage" style={STAGE_STYLE}>
                {RING.map((point, index) => (
                    <Box key={index} x={point.x} y={point.y} data-target="" />
                ))}
                <Box x={280} y={180}>
                    <ParticleSpawner
                        targets={targets}
                        particleCount={particleCount}
                        retentionMs={retentionMs}
                        travelDurationMs={600}
                        spawnDelayMs={40}
                        playbackState={playbackState}
                        computeTarget={(index, targetCount) => index % targetCount}
                        computeParticlePos={lerp}
                        renderParticle={renderParticle}
                        onParticleArrive={() => setArrivals((count) => count + 1)}
                        onIterationEnd={() => setRounds((count) => count + 1)}
                        onAnimationEnd={() => playbackState[1](false)}
                    />
                </Box>
            </div>
            <button type="button" id="burst" onClick={() => playbackState[1](true)}>
                Burst
            </button>
            <output data-readout="arrivals">{arrivals}</output>
            <output data-readout="rounds">{rounds}</output>
            <output data-readout="playing">{String(playbackState[0])}</output>
        </>
    );
};

export const ManyToOne = () => {
    const { stageRef, targets } = useTargets();
    const origins = [
        { x: 20, y: 20 },
        { x: 540, y: 20 },
        { x: 280, y: 340 },
    ];

    return (
        <div ref={stageRef} data-testid="stage" style={STAGE_STYLE}>
            <Box x={280} y={180} data-target="" />
            {origins.map((origin, index) => (
                <Box key={index} x={origin.x} y={origin.y}>
                    <ParticleSpawner
                        targets={targets}
                        particleCount={3}
                        retentionMs={300}
                        travelDurationMs={500}
                        spawnIterationPatterns={REPEATING}
                        computeParticlePos={lerp}
                        renderParticle={renderParticle}
                    />
                </Box>
            ))}
        </div>
    );
};

export const RoundTrip = () => {
    const stageRef = useRef<HTMLDivElement | null>(null);
    const [boxes, setBoxes] = useState<(HTMLElement | undefined)[]>([]);
    const [returner, setReturner] = useState<ParticleSpawnerController>();
    const [emitted, setEmitted] = useState(0);

    useLayoutEffect(() => {
        setBoxes(Array.from(stageRef.current!.querySelectorAll<HTMLElement>("[data-end]")));
    }, []);

    return (
        <>
            <div ref={stageRef} data-testid="stage" style={STAGE_STYLE}>
                <Box x={20} y={180} data-end="outbound">
                    <ParticleSpawner
                        targets={boxes.slice(1, 2)}
                        particleCount={2}
                        retentionMs={300}
                        travelDurationMs={500}
                        spawnIterationPatterns={REPEATING}
                        computeParticlePos={lerp}
                        renderParticle={renderParticle}
                        onParticleArrive={() => {
                            if (returner?.emit(1)) setEmitted((count) => count + 1);
                        }}
                    />
                </Box>
                <Box x={540} y={180} data-end="return">
                    <ParticleSpawner
                        targets={boxes.slice(0, 1)}
                        particleCount={1}
                        retentionMs={300}
                        travelDurationMs={500}
                        playbackState={[false, () => {}]}
                        computeParticlePos={lerp}
                        renderParticle={renderParticle}
                        onMount={setReturner}
                    />
                </Box>
            </div>
            <output data-readout="emitted">{emitted}</output>
        </>
    );
};
