<script setup lang="ts">
import { shallowRef } from "vue";

import { Button, ScrambleText } from "@thewaver/ss-components-vue";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrambleTextPage/ScrambleTextPage.css";

import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.vue";
import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.vue";
import type { ScrambleTextExampleProps } from "../ScrambleTextPage.types";

const BUILDS = ["Build 1.4.2 ready", "Build 1.4.3 ready", "Build 1.4.3 RC1 ready", "Build 1.5.0 ready"];
const BOX_WIDTH = 320;
const FIRST_BUILD = 0;

type Props = ScrambleTextExampleProps;

defineProps<Props>();

const buildIndex = shallowRef(FIRST_BUILD);

const next = () => {
    buildIndex.value = (buildIndex.value + 1) % BUILDS.length;
};
</script>

<template>
    <div :class="styles.stack">
        <PageMeasureBox :width="BOX_WIDTH" :padding="MEASURE_BOX_PADDING">
            <div :class="styles.headline">
                <ScrambleText
                    :text="BUILDS[buildIndex]"
                    changed-only
                    :compute-glyphs="computeGlyphs"
                    :settle-duration-ms="settleDurationMs"
                    :scramble-interval-ms="scrambleIntervalMs"
                    :compute-character-weights="computeCharacterWeights"
                />
            </div>
        </PageMeasureBox>

        <Button id="nextBuild" ariaLabel="Next build" @click="next">
            <template #renderContent="flags">
                <PageControlButtonContent :flags="flags">Next</PageControlButtonContent>
            </template>
        </Button>
    </div>
</template>
