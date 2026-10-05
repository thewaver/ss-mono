<script setup lang="ts">
import { SlotText, SlotTextReels } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/SlotTextPage/SlotTextPage.css";

import type { SlotTextReelsExampleProps } from "../SlotTextPage.types";

const DIGIT_SIZE = { width: 34, height: 52 };

type Props = SlotTextReelsExampleProps;

const props = defineProps<Props>();

const computeReel = (digitIndex: number, digitCount: number) =>
    SlotTextReels.SAMPLE_REELS[props.reelKey](digitIndex, digitCount);
</script>

<template>
    <SlotText :text="text" :character-size="DIGIT_SIZE" ariaLabel="Slot machine" :compute-reel="computeReel">
        <template #renderTurning="{ character: digit }">
            <div :class="styles.digit">{{ digit }}</div>
        </template>
    </SlotText>
</template>
