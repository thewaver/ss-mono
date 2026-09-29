<script setup lang="ts">
import { computed, shallowRef, useModel } from "vue";

import { CellAnimationPlaybackUtils } from "@thewaver/ss-components-vue";
import type { SVGDefsSamples } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellAnimationPage.css";
import type { Size2d } from "@thewaver/ss-utils";

import { CellAnimationKnobs } from "../../Knobs/CellAnimations.const";
import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import { SVGDefsSources } from "../../PageComponents/SVGDefsSources/SVGDefsSources.const";
import type { CellAnimationExampleProps } from "./CellAnimationPage.types";
import DefaultExample from "./Examples/Default.vue";

const IMAGE_CONTAINER_SIZE = 480;

const computeContainerWidth = (size: Size2d) => (IMAGE_CONTAINER_SIZE * size.width) / Math.max(size.width, size.height);

type Props = CellAnimationExampleProps;

const props = defineProps<Props>();

const playback = useModel(props, "playback");

const key = shallowRef<SVGDefsSamples.Pattern.SampleKey>(CellAnimationKnobs.STARTING_PATTERN_KEY);
const ratio = shallowRef<SVGDefsSources.SourceRatio>(CellAnimationKnobs.DEFAULT_SOURCE_RATIO);

const sharedProps = computed(() => {
    const { "playback": _playback, "onUpdate:playback": _setPlayback, ...shared } = props;

    return shared;
});

const size = computed(() => SVGDefsSources.computeSourceSize(ratio.value));

const cycleDurationMs = computed(() =>
    CellAnimationPlaybackUtils.computeCycleDurationMs(props.animationDurationMs, props.playbackOpts),
);

const src = computed(() =>
    SVGDefsSources.computePatternSource(key.value, size.value, cycleDurationMs.value),
);
</script>

<template>
    <div :class="styles.exampleRoot">
        <PageMeasureBox :width="computeContainerWidth(size)">
            <DefaultExample v-bind="sharedProps" v-model:playback="playback" :src="src" />
        </PageMeasureBox>
    </div>

    <PageExampleKnobs>
        <PageProp
            item-key="pattern"
            label="Pattern"
            hint="Which repeating pattern is rendered into the picture the cells are cut from."
        >
            <PageSelectField
                :value="key"
                :values="SVGDefsSources.PATTERN_KEYS"
                ariaLabel="Pattern"
                @change="(next: SVGDefsSamples.Pattern.SampleKey) => (key = next)"
            />
        </PageProp>

        <PageProp
            item-key="patternRatio"
            label="Ratio"
            hint="The shape of the picture the pattern is drawn into, which decides how the cells are proportioned."
        >
            <PageSelectField
                :value="ratio"
                :values="SVGDefsSources.SOURCE_RATIOS"
                ariaLabel="Pattern ratio"
                @change="(next: SVGDefsSources.SourceRatio) => (ratio = next)"
            />
        </PageProp>
    </PageExampleKnobs>
</template>
