import { useState } from "react";

import type { CellAnimationFinalFrame } from "@thewaver/ss-components";

import { CellAnimation, ScanlineAnimation } from "../../src";

const DRAWN_SOURCE = `data:image/svg+xml,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect width="400" height="200" fill="rgb(200, 30, 60)"/></svg>',
)}`;

const FILED_SOURCE = "/crimson.png";

export const Default = ({
    animationIterationCount,
    animationDurationMs = 600,
    animationIterationDelayMs = 100,
    finalFrame,
    ariaLabel,
    isPlaying = true,
}: {
    animationIterationCount?: number;
    animationDurationMs?: number;
    animationIterationDelayMs?: number;
    finalFrame?: CellAnimationFinalFrame;
    ariaLabel?: string;
    isPlaying?: boolean;
}) => {
    const [src, setSrc] = useState(DRAWN_SOURCE);
    const playbackState = useState(isPlaying);
    const progressState = useState(0);
    const [passes, setPasses] = useState(0);
    const [ended, setEnded] = useState(false);

    return (
        <>
            <div data-testid="animation" style={{ width: 400, margin: 40 }}>
                <CellAnimation
                    src={src}
                    ariaLabel={ariaLabel}
                    cellCount={{ col: 8, row: 4 }}
                    animationDurationMs={animationDurationMs}
                    animationIterationCount={animationIterationCount}
                    animationIterationDelayMs={animationIterationDelayMs}
                    finalFrame={finalFrame}
                    playbackState={playbackState}
                    progressState={progressState}
                    computeCellWeights={(count) =>
                        Array.from({ length: count.row }, () =>
                            Array.from({ length: count.col }, (_, col) => col / Math.max(count.col - 1, 1)),
                        )
                    }
                    computeCellAnimation={(defs, t) => ({ scale: 0.5 + t * 0.5, rotateZ: (1 - t) * defs.weight * 90 })}
                    onIterationEnd={() => setPasses((count) => count + 1)}
                    onAnimationEnd={() => setEnded(true)}
                />
            </div>
            <button type="button" data-testid="filed" onClick={() => setSrc(FILED_SOURCE)}>
                Photograph
            </button>
            <button type="button" data-testid="pause" onClick={() => playbackState[1](false)}>
                Pause
            </button>
            <button type="button" data-testid="play" onClick={() => playbackState[1](true)}>
                Play
            </button>
            <button type="button" data-testid="scrub" onClick={() => progressState[1](0.5)}>
                Halfway
            </button>
            <output data-readout="progress">{progressState[0].toFixed(3)}</output>
            <output data-readout="passes">{passes}</output>
            <output data-readout="ended">{String(ended)}</output>
        </>
    );
};

export const Scanlines = ({ orientation }: { orientation?: "horizontal" | "vertical" }) => (
    <div data-testid="animation" style={{ width: 400, margin: 40 }}>
        <ScanlineAnimation
            src={DRAWN_SOURCE}
            lineCount={10}
            orientation={orientation}
            computeScanlineAnimation={(_defs, t) => ({ scale: t })}
        />
    </div>
);
