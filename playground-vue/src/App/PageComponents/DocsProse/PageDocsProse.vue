<script setup lang="ts">
import { RichText } from "@thewaver/ss-components-vue";
import {
    DOCS_PROSE_ALLOWED_ATTRIBUTES,
    DOCS_PROSE_WCAG_TAG,
} from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
import { toDocsProseClasses, toWcagHref } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.utils";

import type { PageDocsProseProps } from "./DocsProseVue.types";

defineProps<PageDocsProseProps>();
</script>

<template>
    <RichText
        :content="content"
        :allowedAttributes="DOCS_PROSE_ALLOWED_ATTRIBUTES"
        :computeClassNames="toDocsProseClasses"
    >
        <template #renderTag="{ tag, renderChildren, attributes }">
            <a
                v-if="tag === DOCS_PROSE_WCAG_TAG && toWcagHref(attributes.id) !== undefined"
                :href="toWcagHref(attributes.id)"
                ><component :is="renderChildren"
            /></a>
        </template>
    </RichText>
</template>
