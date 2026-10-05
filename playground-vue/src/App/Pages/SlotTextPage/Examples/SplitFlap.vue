<script setup lang="ts">
import { SlotText } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/SlotTextPage/SlotTextPage.css";

import type { SlotTextExampleProps } from "../SlotTextPage.types";

const CHARACTER_SIZE = { width: 34, height: 52 };

type Props = SlotTextExampleProps;

defineProps<Props>();
</script>

<template>
    <SlotText
        :text="text"
        mechanism="splitFlap"
        :character-size="CHARACTER_SIZE"
        :turn-duration-ms="turnDurationMs"
        :turn-delay-ms="turnDelayMs"
        ariaLabel="Departures"
    >
        <template #renderTurning="{ character: digit }">
            <div :class="styles.flapTile">{{ digit }}</div>
        </template>

        <template #renderFixed="{ character }">
            <div :class="styles.fixed">{{ character }}</div>
        </template>
    </SlotText>
</template>
