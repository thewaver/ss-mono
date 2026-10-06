<script setup lang="ts">
import { useModel } from "vue";

import { Button, Wraparound } from "@thewaver/ss-components-vue";
import { MARQUEE_WORDS } from "@thewaver/ss-playground/App/Pages/WraparoundPage/WraparoundPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/WraparoundPage/WraparoundPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.vue";
import type { WraparoundMarqueeExampleProps } from "../WraparoundPage.types";

type Props = WraparoundMarqueeExampleProps;

const props = defineProps<Props>();

const playback = useModel(props, "playback");

const togglePlayback = () => {
    playback.value = !playback.value;
};
</script>

<template>
    <div :class="styles.marqueeStack">
        <div :class="styles.marqueeStage">
            <Wraparound
                v-model:playback="playback"
                ariaLabel="Tools this library is built with, drifting past"
                :is-movable="false"
                :drift-px-per-second="driftPxPerSecond"
                :drift-degrees="driftDegrees"
            >
                <template #renderContent>
                    <div :class="styles.marqueeTile">
                        <span v-for="word in MARQUEE_WORDS" :key="word" :class="styles.marqueeWord">{{ word }}</span>
                    </div>
                </template>
            </Wraparound>
        </div>

        <Button id="marqueePlayback" :ariaLabel="playback ? 'Pause' : 'Play'" @click="togglePlayback">
            <template #renderContent="flags">
                <PageControlButtonContent
                    :flags="flags"
                    :glyph="playback ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play"
                />
            </template>
        </Button>
    </div>
</template>
