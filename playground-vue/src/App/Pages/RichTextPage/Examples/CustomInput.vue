<script setup lang="ts">
import { RichText } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/RichTextPage/RichTextPage.css";

type Props = {
    content: string;
    removeOtherTags: boolean;
};

defineProps<Props>();
</script>

<template>
    <div id="customInputPreview" :class="styles.previewText">
        <RichText :content="content" :remove-other-tags="removeOtherTags" />
    </div>
</template>
