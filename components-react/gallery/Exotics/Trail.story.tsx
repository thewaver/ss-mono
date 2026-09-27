import { useState, useSyncExternalStore } from "react";

import { Trail, type TrailController } from "../../src";

const SIZE = { width: 400, height: 200 };
const CIRCUIT_PATH = "M 50 100 C 50 10, 350 10, 350 100 C 350 190, 50 190, 50 100";
const TIMELINE_PATH = "M 10 100 Q 100 10 200 100 T 390 100";
const NO_SUBSCRIPTION = () => () => {};

const useProgressReadout = (controller: TrailController | undefined) =>
    useSyncExternalStore(controller?.subscribe ?? NO_SUBSCRIPTION, () =>
        controller ? Math.round(controller.getPlace().progress * 100) : -1,
    );

export const Circuit = ({
    isLooping = true,
    followerOffsets,
    durationMs = 3000,
}: {
    isLooping?: boolean;
    followerOffsets?: number[];
    durationMs?: number;
}) => {
    const playbackState = useState(true);
    const [controller, setController] = useState<TrailController>();
    const progress = useProgressReadout(controller);
    const [laps, setLaps] = useState(0);

    return (
        <>
            <div data-testid="circuit" style={{ margin: 40 }}>
                <Trail
                    path={CIRCUIT_PATH}
                    size={SIZE}
                    durationMs={durationMs}
                    isLooping={isLooping}
                    isTurning
                    followerOffsets={followerOffsets}
                    playbackState={playbackState}
                    renderTrack={(path) => <path d={path} fill="none" stroke="#999" data-testid="track" />}
                    renderTraveler={(_place, index) => (
                        <div id={`vehicle${index}`} style={{ width: 24, height: 10, background: "#c33" }} />
                    )}
                    onLap={() => setLaps((count) => count + 1)}
                    onMount={setController}
                />
            </div>
            <button type="button" id="play" onClick={() => playbackState[1](true)}>
                Play
            </button>
            <button type="button" id="pause" onClick={() => playbackState[1](false)}>
                Pause
            </button>
            <button type="button" id="rewind" onClick={() => controller?.seek(0)}>
                Rewind
            </button>
            <output data-readout="progress">{progress}</output>
            <output data-readout="playing">{String(playbackState[0])}</output>
            <output data-readout="laps">{laps}</output>
        </>
    );
};

export const Timeline = () => {
    const [progress, setProgress] = useState(0);

    return (
        <>
            <div data-testid="timeline" style={{ margin: 40 }}>
                <Trail
                    path={TIMELINE_PATH}
                    size={SIZE}
                    progressState={[progress, setProgress]}
                    playbackState={[false, () => {}]}
                    renderTraveler={() => <div id="marker" style={{ width: 12, height: 12, background: "#36c" }} />}
                />
            </div>
            <input
                id="scrubber"
                type="range"
                min={0}
                max={100}
                step={1}
                value={Math.round(progress * 100)}
                onChange={(e) => setProgress(Number(e.currentTarget.value) / 100)}
            />
            <output data-readout="progress">{Math.round(progress * 100)}</output>
        </>
    );
};
