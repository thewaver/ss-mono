<script setup lang="ts">
import type { ApiTableKind } from "virtual:component-api";
import { computed } from "vue";

import * as styles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
import { toHighlightedType } from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.utils";

import type { PageDocsTableProps } from "./DocsView.types";

const NO_DESCRIPTION = "Not written yet.";
const REQUIRED_FLAG = "required";
const VALUE_FLAG = "value";
const SLOT_FLAG = "slot";
const SLOTS_SUFFIX = "Slots";
const USE_COLUMN = "Use";
const PASSING_COLUMN = "Passing";

const TABLE_COLUMNS: Record<ApiTableKind, [name: string, type: string]> = {
    props: ["Prop", "Type"],
    values: ["Name", "Signature"],
    aliases: ["Type", "Definition"],
    fields: ["Field", "Type"],
};

const props = defineProps<PageDocsTableProps>();

const hasPassing = computed(() => props.table.kind === "props");

const passingFlag = computed(() => (props.table.name.endsWith(SLOTS_SUFFIX) ? SLOT_FLAG : VALUE_FLAG));
</script>

<template>
    <div :class="styles.docsSection">
        <h3 v-if="table.heading" :class="styles.docsTableTitle">{{ table.heading }}</h3>

        <p v-if="table.description" :class="styles.docsDescription">{{ table.description }}</p>

        <div :class="styles.docsTableScroller">
            <table :class="styles.docsTable" :data-api-table="table.name">
                <thead>
                    <tr>
                        <th v-for="column in TABLE_COLUMNS[table.kind]" :key="column" :class="styles.docsHeadCell">
                            {{ column }}
                        </th>
                        <th v-if="hasPassing" :class="styles.docsHeadCell">{{ PASSING_COLUMN }}</th>
                        <th v-if="table.isDocumented" :class="styles.docsHeadCell">{{ USE_COLUMN }}</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="entry in table.entries" :key="entry.name" :data-api-row="entry.name">
                        <td :class="styles.docsNameCell">
                            {{ entry.name }}<span v-if="entry.isOptional" :class="styles.docsOptional">?</span>
                        </td>

                        <td :class="styles.docsTypeCell" v-html="toHighlightedType(entry.type)" />

                        <td v-if="hasPassing" :class="styles.docsCell">
                            <span>{{ passingFlag }}</span
                            ><template v-if="!entry.isOptional"
                                >{{ " " }}<span :class="styles.docsFlag">{{ REQUIRED_FLAG }}</span></template
                            >
                        </td>

                        <td v-if="table.isDocumented" :class="styles.docsCell">
                            <template v-if="entry.description">{{ entry.description }}</template>
                            <span v-else :class="styles.docsPending">{{ NO_DESCRIPTION }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
