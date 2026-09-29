<script setup lang="ts">
import { shallowRef } from "vue";

import { TABLE_OF_CONTENTS_DEFAULTS } from "@thewaver/ss-components-vue";
import {
    OUTLINE_SECTIONS,
    SECTIONS,
} from "@thewaver/ss-playground/App/Pages/TableOfContentsPage/TableOfContentsPage.const";
import type { TableOfContentsSection } from "@thewaver/ss-playground/App/Pages/TableOfContentsPage/TableOfContentsSection.types";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import TableOfContentsExample from "./Examples/TableOfContents.vue";

const EXAMPLES_ROOT = "/src/App/Pages/TableOfContentsPage/Examples";
const PERCENT = 100;

const titleOf = (sections: TableOfContentsSection[], id: string | undefined) =>
    sections.find((section) => section.id === id)?.title ?? "none";

const current = shallowRef<string | undefined>();
const outlineCurrent = shallowRef<string | undefined>();

const examples: ExampleDefs[] = [
    {
        key: "tableOfContents",
        name: "Following the page",
        readout: () =>
            `current: ${titleOf(SECTIONS, current.value)} — the last heading whose top has scrolled past a line ${TABLE_OF_CONTENTS_DEFAULTS.offsetRatio * PERCENT}% of the way down the window, and pressing a link scrolls to its heading and focuses it`,
        path: `${EXAMPLES_ROOT}/TableOfContents.vue`,
    },
    {
        key: "outline",
        name: "Sub-sections indented under their section",
        readout: () =>
            `current: ${titleOf(OUTLINE_SECTIONS, outlineCurrent.value)} — each link carries a depth the painter indents by, and the list stays flat for the keyboard and a screen reader`,
        path: `${EXAMPLES_ROOT}/TableOfContents.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples" layout="flow">
        <template #tableOfContents>
            <TableOfContentsExample
                :sections="SECTIONS"
                ariaLabel="On this page"
                @current-change="(id: string | undefined) => (current = id)"
            />
        </template>

        <template #outline>
            <TableOfContentsExample
                :sections="OUTLINE_SECTIONS"
                ariaLabel="Outline"
                @current-change="(id: string | undefined) => (outlineCurrent = id)"
            />
        </template>
    </PageExamples>
</template>
