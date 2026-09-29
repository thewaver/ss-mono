<script setup lang="ts">
import { shallowRef, useModel } from "vue";

import { AudioSwitcher, Button } from "@thewaver/ss-components-vue";
import type { AudioSwitcherController } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/AudioSwitcherPage/AudioSwitcherPage.css";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
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
            <Button @click="togglePlayback">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">{{ isPlaying ? "Stop" : "Play" }}</PageButtonContent>
                </template>
            </Button>

            <Button :is-disabled="!isPlaying" @click="startOver">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Start over</PageButtonContent>
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
