<script setup lang="ts">
import { computed, shallowRef, useModel } from "vue";

import * as styles from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellAnimationPage.css";
import knight_profile from "@thewaver/ss-playground/App/knight_profile.webp";

import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageFileField from "../../PageComponents/Field/PageFileField.vue";
import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import PagePlaybackScrubber from "../../PageComponents/PlaybackScrubber/PlaybackScrubber.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import type { CellAnimationExampleProps } from "./CellAnimationPage.types";
import DefaultExample from "./Examples/Default.vue";

const IMAGE_CONTAINER_SIZE = 480;

type Props = CellAnimationExampleProps & {
    "progress": number;
    "onUpdate:progress"?: (progress: number) => void;
};

const props = defineProps<Props>();

const playback = useModel(props, "playback");
const progress = useModel(props, "progress");

const src = shallowRef(knight_profile);

const sharedProps = computed(() => {
    const {
        "playback": _playback,
        "onUpdate:playback": _setPlayback,
        "progress": _progress,
        "onUpdate:progress": _setProgress,
        ...shared
    } = props;

    return shared;
});

const pick = (file: File) => {
    src.value = URL.createObjectURL(file);
};
</script>

<template>
    <div :class="styles.stack">
        <PageMeasureBox :width="IMAGE_CONTAINER_SIZE">
            <DefaultExample v-bind="sharedProps" v-model:playback="playback" v-model:progress="progress" :src="src" />
        </PageMeasureBox>

        <PagePlaybackScrubber
            id="cellAnimation"
            v-model:playback="playback"
            v-model:progress="progress"
            ariaLabel="Position in the pass"
        />
    </div>

    <PageExampleKnobs>
        <PageProp
            item-key="image"
            label="Image"
            hint="Swaps in a picture of your own, so the cells can be watched against something other than the sample."
        >
            <PageFileField accept="image/*" ariaLabel="Image" @pick="pick" />
        </PageProp>
    </PageExampleKnobs>
</template>
