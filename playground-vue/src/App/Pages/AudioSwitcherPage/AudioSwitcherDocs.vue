<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { AUDIO_SWITCHER_DEFAULTS } from "@thewaver/ss-components-vue";
import { AudioSwitcherKnobs } from "@thewaver/ss-playground/App/Knobs/AudioSwitchers.const";
import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
import * as docsStyles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
import {
    DOCS_ROOT,
    FIELD_WIDTH,
    PERCENT,
    TRACKS,
    TRACK_NAMES,
} from "@thewaver/ss-playground/App/Pages/AudioSwitcherPage/AudioSwitcherPage.const";

import PageDocsAlert from "../../PageComponents/DocsAlert/PageDocsAlert.vue";
import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";

const trackName = shallowRef(TRACKS[0].name);
const crossfadeMs = shallowRef(AudioSwitcherKnobs.STARTING_CROSSFADE_MS);
const volumePercent = shallowRef(AUDIO_SWITCHER_DEFAULTS.volume * PERCENT);

const src = computed(() => TRACKS.find((track) => track.name === trackName.value)?.src ?? TRACKS[0].src);
</script>

<template>
    <PageDocsAlert severity="alert">
        The switcher draws nothing, so the buttons that play and pause it are yours to build. It starts on its own only
        when you set <span :class="docsStyles.docsPropName">shouldAutoPlayOnMount</span>; if you do, and the sound lasts
        longer than three seconds, the page needs a control that pauses or stops it (<a :href="WCAG_URLS['1.4.2']"
            >WCAG 1.4.2</a
        >), or the sound drowns out a screen reader.
    </PageDocsAlert>

    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :src="src" :crossfade-ms="crossfadeMs" :volume="volumePercent / PERCENT" />

        <template #renderKnobs>
            <PageProp
                item-key="track"
                label="Track"
                hint="Which piece is playing. Changing it while it plays is what the switcher crossfades."
                controls="Picks the example track sent to AudioSwitcherProps.src"
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
                controls="Sets AudioSwitcherProps.crossfadeMs"
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

            <PageProp
                item-key="volume"
                label="Volume (%)"
                hint="How loud the playback is, apart from the system's own volume."
                controls="Sets AudioSwitcherProps.volume, sent as a share of 1"
            >
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
        </template>
    </PageDocsExample>
</template>
