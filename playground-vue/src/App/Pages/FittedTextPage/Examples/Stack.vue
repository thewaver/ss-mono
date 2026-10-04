<script setup lang="ts">
import { FittedText } from "@thewaver/ss-components-vue";
import { STACK_LINES } from "@thewaver/ss-playground/App/Pages/FittedTextPage/FittedTextPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/FittedTextPage/FittedTextPage.css";

import type { FittedTextExampleProps } from "../FittedTextPage.types";

type Props = FittedTextExampleProps;

defineProps<Props>();
</script>

<template>
    <div :class="styles.stackBox">
        <FittedText :lines="STACK_LINES" :line-height-ratio="lineHeightRatio" />
    </div>
</template>
