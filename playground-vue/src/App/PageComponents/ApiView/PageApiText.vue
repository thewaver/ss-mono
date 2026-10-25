<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";

import type { PageApiTextProps } from "./ApiViewVue.types";

defineProps<PageApiTextProps>();
</script>

<template>
    <template v-for="(part, index) in text" :key="index"
        ><span v-if="part.kind === 'prop'" :class="styles.docsPropName">{{ part.text }}</span
        ><a v-else-if="part.kind === 'link'" :href="part.href">{{ part.text }}</a
        ><template v-else>{{ part.text }}</template></template
    >
</template>
