<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef } from "vue";

import { toDocsSectionId } from "@thewaver/ss-playground/App/PageComponents/DocsSection/DocsSection.utils";
import * as styles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";

import PageDocsProse from "../DocsProse/PageDocsProse.vue";
import { useDocsViewContext } from "../DocsView/DocsView.context";
import { useIsPreview } from "../Preview/Preview.context";
import type { PageDocsSectionProps } from "./DocsSectionVue.types";

const props = defineProps<PageDocsSectionProps>();

const isPreview = useIsPreview();

const docsView = useDocsViewContext();

const heading = shallowRef<HTMLElement>();

let unregister: (() => void) | undefined;

onMounted(() => {
    if (heading.value) unregister = docsView?.register({ title: props.title, element: heading.value });
});

onBeforeUnmount(() => {
    unregister?.();
});
</script>

<template>
    <section v-if="!isPreview" :class="styles.docsGroup" data-docs-section="">
        <h2 ref="heading" :id="toDocsSectionId(title)" :class="styles.docsGroupTitle">{{ title }}</h2>

        <p :class="styles.docsLead"><PageDocsProse :content="content" /></p>
    </section>
</template>
