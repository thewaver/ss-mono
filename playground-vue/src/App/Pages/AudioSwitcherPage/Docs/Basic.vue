<script setup lang="ts">
import { shallowRef } from "vue";

import { AudioSwitcher, Button } from "@thewaver/ss-components-vue";
import type { AudioSwitcherController } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/AudioSwitcherPage/AudioSwitcherPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.vue";
import type { AudioSwitcherBasicDocsExampleProps } from "../AudioSwitcherPageVue.types";

type Props = AudioSwitcherBasicDocsExampleProps;

defineProps<Props>();

const controller = shallowRef<AudioSwitcherController>();
const isPlaying = shallowRef(false);
</script>

<template>
    <div :class="styles.deck">
        <div :class="styles.row">
            <Button
                id="playPause"
                :ariaLabel="isPlaying ? 'Pause' : 'Play'"
                @click="() => void (isPlaying = !isPlaying)"
            >
                <template #renderContent="flags">
                    <PageControlButtonContent
                        :flags="flags"
                        :glyph="isPlaying ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play"
                    />
                </template>
            </Button>

            <Button
                id="startOver"
                :is-disabled="!isPlaying"
                ariaLabel="Start over"
                @click="() => void controller?.reset()"
            >
                <template #renderContent="flags">
                    <PageControlButtonContent :flags="flags" :glyph="CONTROL_GLYPHS.replay" />
                </template>
            </Button>
        </div>

        <AudioSwitcher
            v-model:playback="isPlaying"
            :src="src"
            :crossfade-ms="crossfadeMs"
            :volume="volume"
            @mount="(next: AudioSwitcherController) => (controller = next)"
        />
    </div>
</template>
