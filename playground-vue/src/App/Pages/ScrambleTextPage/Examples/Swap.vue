<script setup lang="ts">
import { shallowRef } from "vue";

import { Button, ScrambleText } from "@thewaver/ss-components-vue";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrambleTextPage/ScrambleTextPage.css";

import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.vue";
import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { ScrambleTextExampleProps } from "../ScrambleTextPage.types";

const STATUSES = ["CONNECTING", "HANDSHAKE", "AUTHORIZED", "STREAMING", "IDLE"];
const BOX_WIDTH = 320;
const FIRST_STATUS = 0;

type Props = ScrambleTextExampleProps;

defineProps<Props>();

const statusIndex = shallowRef(FIRST_STATUS);

const next = () => {
    statusIndex.value = (statusIndex.value + 1) % STATUSES.length;
};
</script>

<template>
    <div :class="styles.stack">
        <PageMeasureBox :width="BOX_WIDTH" :padding="MEASURE_BOX_PADDING">
            <div :class="styles.headline">
                <ScrambleText
                    :text="STATUSES[statusIndex]"
                    :compute-glyphs="computeGlyphs"
                    :settle-duration-ms="settleDurationMs"
                    :scramble-interval-ms="scrambleIntervalMs"
                    :compute-character-weights="computeCharacterWeights"
                />
            </div>
        </PageMeasureBox>

        <Button id="nextStatus" @click="next">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">Next status</PageButtonContent>
            </template>
        </Button>
    </div>
</template>
