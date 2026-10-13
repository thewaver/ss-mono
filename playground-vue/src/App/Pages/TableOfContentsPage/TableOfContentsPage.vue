<script setup lang="ts">
import { shallowRef } from "vue";

import { TABLE_OF_CONTENTS_DEFAULTS } from "@thewaver/ss-components-vue";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    PERCENT,
    SECTIONS,
} from "@thewaver/ss-playground/App/Pages/TableOfContentsPage/TableOfContentsPage.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import TableOfContentsExample from "./Examples/TableOfContents.vue";

const current = shallowRef<string | undefined>();

const examples: ExampleDefs[] = [
    {
        key: "tableOfContents",
        name: EXAMPLE_NAMES.tableOfContents,
        readout: () =>
            `current: ${SECTIONS.find((section) => section.id === current.value)?.title ?? "none"} — the last heading whose top has scrolled past a line ${TABLE_OF_CONTENTS_DEFAULTS.offsetRatio * PERCENT}% of the way down the box it scrolls in. Pressing a link scrolls only that box to its heading and focuses it, and each link's depth is indented by the painter while the list stays flat for the keyboard and a screen reader`,
        path: `${EXAMPLES_ROOT}/TableOfContents.vue`,
    },
];
</script>

<template>
    <PageExamples :items="examples" :min-column-width="520">
        <template #tableOfContents>
            <TableOfContentsExample
                :sections="SECTIONS"
                ariaLabel="Outline"
                @current-change="(id: string | undefined) => (current = id)"
            />
        </template>
    </PageExamples>
</template>
