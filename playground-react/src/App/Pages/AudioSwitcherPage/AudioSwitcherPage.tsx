import { useState } from "react";

import { AUDIO_SWITCHER_DEFAULTS } from "@thewaver/ss-components-react";
import { AudioSwitcherKnobs } from "@thewaver/ss-playground/App/Knobs/AudioSwitchers.const";
import {
    FIELD_WIDTH,
    PERCENT,
    TRACKS,
    TRACK_NAMES,
} from "@thewaver/ss-playground/App/Pages/AudioSwitcherPage/AudioSwitcherPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { DefaultExample } from "./Examples/Default";

const EXAMPLES_ROOT = "/src/App/Pages/AudioSwitcherPage/Examples";

export const AudioSwitcherPage = () => {
    const [crossfadeMs, setCrossfadeMs] = useState(AudioSwitcherKnobs.STARTING_CROSSFADE_MS);
    const [volumePercent, setVolumePercent] = useState(AUDIO_SWITCHER_DEFAULTS.volume * PERCENT);
    const [trackName, setTrackName] = useState(TRACKS[0].name);

    const playbackState = useState(false);

    const src = TRACKS.find((track) => track.name === trackName)?.src ?? TRACKS[0].src;

    const examples = [
        {
            key: "default",
            name: "Crossfading between two loops",
            readout: () =>
                `${trackName} — ${playbackState[0] ? "playing" : "stopped"}; nothing sounds until you ask, because a source arriving at mount does not start on its own — every switch after that does`,
            component: () => (
                <DefaultExample
                    src={src}
                    crossfadeMs={crossfadeMs}
                    volume={volumePercent / PERCENT}
                    playbackState={playbackState}
                />
            ),
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"track"}
                    label={"Track"}
                    hint={"Which piece is playing. Changing it is what the switcher crossfades between."}
                >
                    <PageSelectField
                        value={trackName}
                        values={TRACK_NAMES}
                        width={FIELD_WIDTH}
                        ariaLabel={"Track"}
                        onChange={(name) => setTrackName(name)}
                    />
                </PageProp>

                <PageProp
                    itemKey={"crossfadeMs"}
                    label={"Crossfade (ms)"}
                    hint={"How long the old track takes to fade out while the new one fades in."}
                >
                    <PageNumberField
                        value={crossfadeMs}
                        min={AudioSwitcherKnobs.MIN_CROSSFADE_MS}
                        max={AudioSwitcherKnobs.MAX_CROSSFADE_MS}
                        step={AudioSwitcherKnobs.CROSSFADE_STEP_MS}
                        width={FIELD_WIDTH}
                        ariaLabel={"Crossfade in milliseconds"}
                        onInput={setCrossfadeMs}
                    />
                </PageProp>

                <PageProp itemKey={"volume"} label={"Volume (%)"} hint={"How loud the playback is."}>
                    <PageNumberField
                        value={volumePercent}
                        min={AudioSwitcherKnobs.MIN_VOLUME_PERCENT}
                        max={AudioSwitcherKnobs.MAX_VOLUME_PERCENT}
                        step={AudioSwitcherKnobs.VOLUME_STEP_PERCENT}
                        width={FIELD_WIDTH}
                        ariaLabel={"Volume as a percentage"}
                        onInput={setVolumePercent}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} />
        </>
    );
};
