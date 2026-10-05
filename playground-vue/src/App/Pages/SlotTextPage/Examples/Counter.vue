<script setup lang="ts">
import { SlotText } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/SlotTextPage/SlotTextPage.css";

import type { SlotTextExampleProps } from "../SlotTextPage.types";
import Fade from "./Fade.vue";

const DIGIT_SIZE = { width: 34, height: 52 };

type Props = SlotTextExampleProps;

defineProps<Props>();
</script>

<template>
    <SlotText
        :text="text"
        :character-size="DIGIT_SIZE"
        :turn-duration-ms="turnDurationMs"
        :turn-delay-ms="turnDelayMs"
        ariaLabel="Score"
    >
        <template #renderTurning="{ character: digit, flags }">
            <Fade :class-name="styles.digit" :flags="flags" :duration-ms="turnDurationMs">{{ digit }}</Fade>
        </template>

        <template #renderFixed="{ character, flags }">
            <Fade :class-name="styles.fixed" :flags="flags" :duration-ms="turnDurationMs">{{ character }}</Fade>
        </template>
    </SlotText>
</template>
