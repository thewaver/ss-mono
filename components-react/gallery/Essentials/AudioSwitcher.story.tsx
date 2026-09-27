import { useEffect, useState } from "react";

import lofiHipHop from "../../../playground-core/src/App/lofi_hiphop_10s.mp3";
import synthwave from "../../../playground-core/src/App/synthwave_10s.mp3";
import { AudioSwitcher, Button } from "../../src";
import type { AudioSwitcherController } from "../../src";

const TRACKS = [
    { name: "Lo-fi hip hop", src: lofiHipHop },
    { name: "Synthwave", src: synthwave },
];

const VOLUME = 0.5;
const CROSSFADE_MS = 250;

export const Default = () => {
    const [trackName, setTrackName] = useState(TRACKS[0].name);
    const [controller, setController] = useState<AudioSwitcherController>();
    const playbackState = useState(false);
    const [isPlaying, setIsPlaying] = playbackState;

    const [notifications, setNotifications] = useState(0);

    useEffect(() => controller?.subscribe(() => setNotifications((count) => count + 1)), [controller]);

    const src = TRACKS.find((track) => track.name === trackName)?.src ?? TRACKS[0].src;

    return (
        <>
            <label>
                Track
                <select value={trackName} onChange={(e) => setTrackName(e.target.value)}>
                    {TRACKS.map((track) => (
                        <option key={track.name} value={track.name}>
                            {track.name}
                        </option>
                    ))}
                </select>
            </label>
            <output data-testid="volume">{VOLUME}</output>

            <Button
                renderContent={() => <span>{isPlaying ? "Stop" : "Play"}</span>}
                onClick={() => setIsPlaying(!isPlaying)}
            />
            <Button
                isDisabled={!isPlaying}
                renderContent={() => <span>Start over</span>}
                onClick={() => {
                    controller?.reset();
                }}
            />

            <AudioSwitcher
                src={src}
                crossfadeMs={CROSSFADE_MS}
                volume={VOLUME}
                playbackState={playbackState}
                onMount={setController}
            />
            <output data-readout="notifications">{notifications}</output>
            <output data-readout="playback">{`${trackName} — ${isPlaying ? "playing" : "stopped"}`}</output>
        </>
    );
};
