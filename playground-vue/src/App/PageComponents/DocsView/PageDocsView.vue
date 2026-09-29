<script setup lang="ts">
import type { ApiGroupKind } from "virtual:component-api";
import COMPONENT_API from "virtual:component-api";
import { computed } from "vue";

import * as styles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";

import type { PageDocsViewProps } from "./DocsView.types";
import PageDocsTable from "./PageDocsTable.vue";

const GROUP_TITLES: Record<ApiGroupKind, string> = {
    props: "Props",
    components: "Components",
    context: "Context",
    utilities: "Utilities",
    classes: "Classes",
    types: "Types",
};

const props = defineProps<PageDocsViewProps>();

const groups = computed(() => COMPONENT_API[props.name.toLowerCase()] ?? []);
</script>

<template>
    <div :class="styles.docsView" data-view="docs">
        <p :class="styles.docsLead">{{ description }}</p>

        <template v-if="groups.length">
            <section v-for="group in groups" :key="group.kind" :class="styles.docsGroup" :data-api-group="group.kind">
                <h2 :class="styles.docsGroupTitle">{{ GROUP_TITLES[group.kind] }}</h2>

                <PageDocsTable v-for="(table, index) in group.tables" :key="`${table.name}-${index}`" :table="table" />
            </section>
        </template>

        <p v-else :class="styles.docsEmpty">{{ `${name} exports nothing of its own, so there is nothing to list.` }}</p>
    </div>
</template>
