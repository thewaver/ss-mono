<script setup lang="ts">
import { computed } from "vue";

import { SlotText } from "@thewaver/ss-components-vue";
import { WORD_LETTERS } from "@thewaver/ss-playground/App/Pages/SlotTextPage/SlotTextPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SlotTextPage/SlotTextPage.css";

import type { SlotTextWordsExampleProps } from "../SlotTextPage.types";

const CHARACTER_SIZE = { width: 34, height: 52 };

type Props = SlotTextWordsExampleProps;

const props = defineProps<Props>();

const tileClass = computed(() => (props.mechanism === "splitFlap" ? styles.flapTile : styles.digit));
</script>

<template>
    <SlotText
        :text="text"
        :letters="WORD_LETTERS"
        :letter-route="letterRoute"
        :mechanism="mechanism"
        :character-size="CHARACTER_SIZE"
        :turn-duration-ms="turnDurationMs"
        :turn-delay-ms="turnDelayMs"
        ariaLabel="Destination"
    >
        <template #renderTurning="{ character }">
            <div :class="tileClass">{{ character }}</div>
        </template>
    </SlotText>
</template>
