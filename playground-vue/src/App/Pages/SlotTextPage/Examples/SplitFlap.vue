<script setup lang="ts">
import { SlotText } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/SlotTextPage/SlotTextPage.css";

import type { SlotTextExampleProps } from "../SlotTextPage.types";

const DIGIT_SIZE = { width: 40, height: 60 };

type Props = SlotTextExampleProps;

defineProps<Props>();
</script>

<template>
    <div :class="styles.board">
        <SlotText
            :text="text"
            mechanism="splitFlap"
            :character-size="DIGIT_SIZE"
            :turn-duration-ms="turnDurationMs"
            :turn-delay-ms="turnDelayMs"
            ariaLabel="Departures"
        >
            <template #renderTurning="{ character: digit }">
                <div :class="styles.flapTile">{{ digit }}</div>
            </template>

            <template #renderFixed="{ character }">
                <div :class="styles.flapFixed">{{ character }}</div>
            </template>
        </SlotText>
    </div>
</template>
