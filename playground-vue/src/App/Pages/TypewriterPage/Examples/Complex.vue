<script setup lang="ts">
import { Typewriter } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.css";
import knight from "@thewaver/ss-playground/App/knight.webp";

import type { TypewriterExampleProps } from "../TypewriterPage.types";

type Props = TypewriterExampleProps;

defineProps<Props>();
</script>

<template>
    <Typewriter :animation-name="animationName" :compute-character-weights="computeCharacterWeights"
        >{{ "This is a bit of " }}<b
            >text that appears<div :class="styles.textHighlight" :style="{ color: 'red' }" title="ONE MEANS ONE!">
                <i>one</i>
            </div></b
        ><span>single</span>{{ " text character\tat a time," }}<br /><br /><div
            :style="{ width: '100%', height: '0.5em', borderBottom: '2px solid currentColor' }"
        />{{ "and has\nescaped " }}<img :src="knight" :height="24" :style="{ verticalAlign: 'middle' }" /><a
            href="http://www.google.com"
            >characters.</a
        ></Typewriter
    >
</template>
