import { createMemo, createSignal } from "solid-js";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageNumberField, PageSelectField } from "../../StyledComponents/Field/Field";
import {
    CROSSFADE_STEP_MS,
    FIELD_WIDTH,
    MAX_CROSSFADE_MS,
    MAX_VOLUME_PERCENT,
    MIN_CROSSFADE_MS,
    MIN_VOLUME_PERCENT,
    PERCENT,
    STARTING_CROSSFADE_MS,
    STARTING_VOLUME_PERCENT,
    TRACKS,
    TRACK_NAMES,
    VOLUME_STEP_PERCENT,
} from "./AudioSwitcherPage.const";
import { DefaultExample } from "./Examples/Default";

const EXAMPLES_ROOT = "/src/App/Pages/AudioSwitcherPage/Examples";

export const AudioSwitcherPage = () => {
    const [getCrossfadeMs, setCrossfadeMs] = createSignal(STARTING_CROSSFADE_MS);
    const [getVolumePercent, setVolumePercent] = createSignal(STARTING_VOLUME_PERCENT);
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
                <PageProp key={"track"} label={"Track"}>
                    <PageSelectField
                        value={getTrackName}
                        values={() => TRACK_NAMES}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Track"}
                        onChange={(name) => setTrackName(() => name)}
                    />
                </PageProp>

                <PageProp key={"crossfadeMs"} label={"Crossfade (ms)"}>
                    <PageNumberField
                        value={getCrossfadeMs}
                        min={() => MIN_CROSSFADE_MS}
                        max={() => MAX_CROSSFADE_MS}
                        step={() => CROSSFADE_STEP_MS}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Crossfade in milliseconds"}
                        onInput={setCrossfadeMs}
                    />
                </PageProp>

                <PageProp key={"volume"} label={"Volume (%)"}>
                    <PageNumberField
                        value={getVolumePercent}
                        min={() => MIN_VOLUME_PERCENT}
                        max={() => MAX_VOLUME_PERCENT}
                        step={() => VOLUME_STEP_PERCENT}
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
