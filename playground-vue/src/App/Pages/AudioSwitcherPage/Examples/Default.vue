<script setup lang="ts">
import { shallowRef, useModel } from "vue";

import { AudioSwitcher, Button } from "@thewaver/ss-components-vue";
import type { AudioSwitcherController } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/AudioSwitcherPage/AudioSwitcherPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.vue";
import type { AudioSwitcherExampleProps } from "../AudioSwitcherPage.types";

type Props = AudioSwitcherExampleProps;

const props = defineProps<Props>();

const controller = shallowRef<AudioSwitcherController>();

const isPlaying = useModel(props, "playback");

const togglePlayback = () => {
    isPlaying.value = !isPlaying.value;
};

const startOver = () => {
    controller.value?.reset();
};
</script>

<template>
    <div :class="styles.deck">
        <div :class="styles.row">
            <Button :ariaLabel="isPlaying ? 'Pause' : 'Play'" @click="togglePlayback">
                <template #renderContent="flags">
                    <PageControlButtonContent
                        :flags="flags"
                        :glyph="isPlaying ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play"
                    />
                </template>
            </Button>

            <Button ariaLabel="Start over" :is-disabled="!isPlaying" @click="startOver">
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
