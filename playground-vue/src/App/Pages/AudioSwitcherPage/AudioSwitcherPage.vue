<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { AUDIO_SWITCHER_DEFAULTS } from "@thewaver/ss-components-vue";
import { AudioSwitcherKnobs } from "@thewaver/ss-playground/App/Knobs/AudioSwitchers.const";
import {
    FIELD_WIDTH,
    PERCENT,
    TRACKS,
    TRACK_NAMES,
} from "@thewaver/ss-playground/App/Pages/AudioSwitcherPage/AudioSwitcherPage.const";

import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import DefaultExample from "./Examples/Default.vue";

const EXAMPLES_ROOT = "/src/App/Pages/AudioSwitcherPage/Examples";

const crossfadeMs = shallowRef(AudioSwitcherKnobs.STARTING_CROSSFADE_MS);
const volumePercent = shallowRef(AUDIO_SWITCHER_DEFAULTS.volume * PERCENT);
const trackName = shallowRef(TRACKS[0].name);

const playback = shallowRef(false);

const src = computed(() => TRACKS.find((track) => track.name === trackName.value)?.src ?? TRACKS[0].src);

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: "Crossfading between two loops",
        readout: () =>
            `${trackName.value} — ${playback.value ? "playing" : "stopped"}; nothing sounds until you ask, because a source arriving at mount does not start on its own — every switch after that does`,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="track"
            label="Track"
            hint="Which piece is playing. Changing it is what the switcher crossfades between."
        >
            <PageSelectField
                :value="trackName"
                :values="TRACK_NAMES"
                :width="FIELD_WIDTH"
                ariaLabel="Track"
                @change="(name: string) => (trackName = name)"
            />
        </PageProp>

        <PageProp
            item-key="crossfadeMs"
            label="Crossfade (ms)"
            hint="How long the old track takes to fade out while the new one fades in."
        >
            <PageNumberField
                :value="crossfadeMs"
                :min="AudioSwitcherKnobs.MIN_CROSSFADE_MS"
                :max="AudioSwitcherKnobs.MAX_CROSSFADE_MS"
                :step="AudioSwitcherKnobs.CROSSFADE_STEP_MS"
                :width="FIELD_WIDTH"
                ariaLabel="Crossfade in milliseconds"
                @input="(value: number) => (crossfadeMs = value)"
            />
        </PageProp>

        <PageProp item-key="volume" label="Volume (%)" hint="How loud the playback is.">
            <PageNumberField
                :value="volumePercent"
                :min="AudioSwitcherKnobs.MIN_VOLUME_PERCENT"
                :max="AudioSwitcherKnobs.MAX_VOLUME_PERCENT"
                :step="AudioSwitcherKnobs.VOLUME_STEP_PERCENT"
                :width="FIELD_WIDTH"
                ariaLabel="Volume as a percentage"
                @input="(value: number) => (volumePercent = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples">
        <template #default>
            <DefaultExample
                v-model:playback="playback"
                :src="src"
                :crossfade-ms="crossfadeMs"
                :volume="volumePercent / PERCENT"
            />
        </template>
    </PageExamples>
</template>
