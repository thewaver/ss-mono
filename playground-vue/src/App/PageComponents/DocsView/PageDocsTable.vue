<script setup lang="ts">
import type { ApiTableKind } from "virtual:component-api";

import { NO_DESCRIPTION, USE_COLUMN } from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.const";
import * as styles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
import {
    DOCS_INCLUDES_LEAD,
    DOCS_INCLUDES_SEPARATOR,
    toDocsIncludeHref,
    toHighlightedType,
} from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.utils";

import type { PageDocsTableProps } from "./DocsViewVue.types";

const TABLE_COLUMNS: Record<ApiTableKind, [name: string, type: string]> = {
    props: ["Prop", "Type"],
    values: ["Name", "Signature"],
    aliases: ["Type", "Definition"],
    fields: ["Field", "Type"],
};

defineProps<PageDocsTableProps>();
</script>

<template>
    <div :class="styles.docsSection" :data-api-table="table.name">
        <h3 v-if="table.heading" :id="headingId" :ref="headingRef" :class="styles.docsTableTitle">
            {{ table.heading }}
        </h3>

        <p v-if="table.description" :class="styles.docsDescription">{{ table.description }}</p>

        <p v-if="table.includes.length" :class="styles.docsDescription" data-api-includes>
            {{ DOCS_INCLUDES_LEAD
            }}<template v-for="(include, index) in table.includes" :key="include.text"
                >{{ index ? DOCS_INCLUDES_SEPARATOR : ""
                }}<a v-if="toDocsIncludeHref(include, unit)" :href="toDocsIncludeHref(include, unit)"
                    ><code>{{ include.text }}</code></a
                ><code v-else>{{ include.text }}</code></template
            >
        </p>

        <div v-if="table.entries.length" :class="styles.docsTableScroller">
            <table :class="styles.docsTable">
                <thead>
                    <tr>
                        <th v-for="column in TABLE_COLUMNS[table.kind]" :key="column" :class="styles.docsHeadCell">
                            {{ column }}
                        </th>
                        <th v-if="table.isDocumented" :class="styles.docsHeadCell">{{ USE_COLUMN }}</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="entry in table.entries" :key="entry.name" :data-api-row="entry.name">
                        <td :class="styles.docsNameCell">
                            {{ entry.name }}<span v-if="entry.isOptional" :class="styles.docsOptional">?</span>
                        </td>

                        <td :class="styles.docsTypeCell" v-html="toHighlightedType(entry.type)" />

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
