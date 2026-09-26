import { createMemo, createSignal } from "solid-js";

import { AUDIO_SWITCHER_DEFAULTS } from "@thewaver/ss-components";

import { AudioSwitcherKnobs } from "../../Knobs/AudioSwitchers.const";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { FIELD_WIDTH, PERCENT, TRACKS, TRACK_NAMES } from "./AudioSwitcherPage.const";
import { DefaultExample } from "./Examples/Default";

const EXAMPLES_ROOT = "/src/App/Pages/AudioSwitcherPage/Examples";

export const AudioSwitcherPage = () => {
    const [getCrossfadeMs, setCrossfadeMs] = createSignal(AudioSwitcherKnobs.STARTING_CROSSFADE_MS);
    const [getVolumePercent, setVolumePercent] = createSignal(AUDIO_SWITCHER_DEFAULTS.volume * PERCENT);
    const [getTrackName, setTrackName] = createSignal(TRACKS[0].name);

    const playbackSignal = createSignal(false);

    const getSrc = createMemo(() => TRACKS.find((track) => track.name === getTrackName())?.src ?? TRACKS[0].src);

    const getExamples = createMemo(() => [
        {
            key: "default",
            name: "Crossfading between two loops",
            readout: () =>
                `${getTrackName()} — ${playbackSignal[0]() ? "playing" : "stopped"}; nothing sounds until you ask, because a source arriving at mount does not start on its own — every switch after that does`,
            component: () => (
                <DefaultExample
                    src={getSrc}
                    crossfadeMs={getCrossfadeMs}
                    volume={() => getVolumePercent() / PERCENT}
                    playbackSignal={playbackSignal}
                />
            ),
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
    ]);

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"track"}
                    label={"Track"}
                    hint={"Which piece is playing. Changing it is what the switcher crossfades between."}
                >
                    <PageSelectField
                        value={getTrackName}
                        values={() => TRACK_NAMES}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Track"}
                        onChange={(name) => setTrackName(() => name)}
                    />
                </PageProp>

                <PageProp
                    key={"crossfadeMs"}
                    label={"Crossfade (ms)"}
                    hint={"How long the old track takes to fade out while the new one fades in."}
                >
                    <PageNumberField
                        value={getCrossfadeMs}
                        min={() => AudioSwitcherKnobs.MIN_CROSSFADE_MS}
                        max={() => AudioSwitcherKnobs.MAX_CROSSFADE_MS}
                        step={() => AudioSwitcherKnobs.CROSSFADE_STEP_MS}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Crossfade in milliseconds"}
                        onInput={setCrossfadeMs}
                    />
                </PageProp>

                <PageProp key={"volume"} label={"Volume (%)"} hint={"How loud the playback is."}>
                    <PageNumberField
                        value={getVolumePercent}
                        min={() => AudioSwitcherKnobs.MIN_VOLUME_PERCENT}
                        max={() => AudioSwitcherKnobs.MAX_VOLUME_PERCENT}
                        step={() => AudioSwitcherKnobs.VOLUME_STEP_PERCENT}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Volume as a percentage"}
                        onInput={setVolumePercent}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
