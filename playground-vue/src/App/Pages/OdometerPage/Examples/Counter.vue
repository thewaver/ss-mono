<script setup lang="ts">
import { Odometer } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/OdometerPage/OdometerPage.css";

import type { OdometerExampleProps } from "../OdometerPage.types";
import Fade from "./Fade.vue";

const DIGIT_SIZE = { width: 34, height: 52 };

type Props = OdometerExampleProps;

defineProps<Props>();
</script>

<template>
    <Odometer
        :text="text"
        :digit-size="DIGIT_SIZE"
        :turn-duration-ms="turnDurationMs"
        :cascade-delay-ms="cascadeDelayMs"
        ariaLabel="Score"
    >
        <template #renderDigit="{ digit, flags }">
            <Fade :class-name="styles.digit" :flags="flags" :duration-ms="turnDurationMs">{{ digit }}</Fade>
        </template>

        <template #renderFixed="{ character, flags }">
            <Fade :class-name="styles.fixed" :flags="flags" :duration-ms="turnDurationMs">{{ character }}</Fade>
        </template>
    </Odometer>
</template>
