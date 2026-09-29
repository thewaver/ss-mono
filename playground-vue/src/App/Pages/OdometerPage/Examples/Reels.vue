<script setup lang="ts">
import { Odometer, OdometerReels } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/OdometerPage/OdometerPage.css";

import type { OdometerReelsExampleProps } from "../OdometerPage.types";

const DIGIT_SIZE = { width: 34, height: 52 };

type Props = OdometerReelsExampleProps;

const props = defineProps<Props>();

const computeReel = (digitIndex: number, digitCount: number) =>
    OdometerReels.SAMPLE_REELS[props.reelKey](digitIndex, digitCount);
</script>

<template>
    <Odometer :text="text" :digit-size="DIGIT_SIZE" ariaLabel="Slot machine" :compute-reel="computeReel">
        <template #renderDigit="{ digit }">
            <div :class="styles.digit">{{ digit }}</div>
        </template>
    </Odometer>
</template>
