<script setup lang="ts">
import { RichText } from "@thewaver/ss-components-vue";
import { GLOSSARY_CONTENT } from "@thewaver/ss-playground/App/Pages/RichTextPage/RichTextPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/RichTextPage/RichTextPage.css";

import GlossaryTerm from "./GlossaryTerm.vue";

const GLOSSARY_ATTRIBUTES = { term: ["tip"] };
</script>

<template>
    <div :class="styles.proseText">
        <RichText :content="GLOSSARY_CONTENT" :allowed-attributes="GLOSSARY_ATTRIBUTES">
            <template #renderTag="{ tag, renderChildren, attributes }">
                <GlossaryTerm v-if="tag === 'term' && attributes.tip !== undefined" :tip="attributes.tip">
                    <component :is="renderChildren" />
                </GlossaryTerm>
            </template>
        </RichText>
    </div>
</template>
