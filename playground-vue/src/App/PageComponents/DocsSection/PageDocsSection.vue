<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef } from "vue";

import { toDocsSectionId } from "@thewaver/ss-playground/App/PageComponents/DocsSection/DocsSection.utils";
import * as styles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";

import { useDocsViewContext } from "../DocsView/DocsView.context";
import type { PageDocsSectionProps, PageDocsSectionSlots } from "./DocsSectionVue.types";

const props = defineProps<PageDocsSectionProps>();

defineSlots<PageDocsSectionSlots>();

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
    <section :class="styles.docsGroup" data-docs-section="">
        <h2 ref="heading" :id="toDocsSectionId(title)" :class="styles.docsGroupTitle">{{ title }}</h2>

        <p :class="styles.docsLead"><slot /></p>
    </section>
</template>
