<script setup lang="ts">
import { RichText } from "@thewaver/ss-components-vue";
import { DIFF_CONTENT } from "@thewaver/ss-playground/App/Pages/RichTextPage/RichTextPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/RichTextPage/RichTextPage.css";

const computeDiffClassNames = (defaultClasses: Record<string, string>) => ({
    ...defaultClasses,
    add: styles.addedText,
    sub: styles.removedText,
});
</script>

<template>
    <div :class="styles.diffText">
        <RichText :content="DIFF_CONTENT" :compute-class-names="computeDiffClassNames" />
    </div>
</template>
