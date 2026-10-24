<script setup lang="ts">
import { computed, defineAsyncComponent } from "vue";

import type { DocsRouteProps } from "./DocsRoute.types";
import PageDocsView from "./PageComponents/DocsView/PageDocsView.vue";

const props = defineProps<DocsRouteProps>();

const docsComponent = computed(() => (props.docs ? defineAsyncComponent(props.docs) : undefined));
</script>

<template>
    <PageDocsView :description="description">
        <component :is="docsComponent" v-if="docsComponent" />
    </PageDocsView>
</template>
