<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { TableOfContents } from "@thewaver/ss-components-vue";
import type { TableOfContentsLink } from "@thewaver/ss-components-vue";
import { toDocsSectionId } from "@thewaver/ss-playground/App/PageComponents/DocsSection/DocsSection.utils";
import {
    DOCS_INTRO_TITLE,
    MIN_TABLE_OF_CONTENTS_LINKS,
    TABLE_OF_CONTENTS_GAP,
    TABLE_OF_CONTENTS_LABEL,
} from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.const";
import * as styles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
import type {
    DocsSectionRegistration,
    DocsTableOfContentsEntry,
} from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.types";

import PageTableOfContentsContent from "../../StyledComponents/TableOfContentsContent/TableOfContentsContent.vue";
import PageDocsProse from "../DocsProse/PageDocsProse.vue";
import { provideDocsViewContext } from "./DocsView.context";
import type { PageDocsViewProps, PageDocsViewSlots } from "./DocsViewVue.types";

const SECTION_DEPTH = 0;

defineProps<PageDocsViewProps>();

defineSlots<PageDocsViewSlots>();

const intro = shallowRef<HTMLElement>();
const sections = shallowRef<DocsSectionRegistration[]>([]);

provideDocsViewContext({
    register: (section) => {
        sections.value = [...sections.value, section];

        return () => {
            sections.value = sections.value.filter((candidate) => candidate !== section);
        };
    },
});

const links = computed((): TableOfContentsLink<DocsTableOfContentsEntry>[] =>
    [...(intro.value ? [{ title: DOCS_INTRO_TITLE, element: intro.value }] : []), ...sections.value].map(
        ({ title, element }) => {
            const id = toDocsSectionId(title);

            return {
                value: { id, title, depth: SECTION_DEPTH },
                target: element,
                href: `#${id}`,
                depth: SECTION_DEPTH,
            };
        },
    ),
);
</script>

<template>
    <div :class="styles.docsLayout" data-view="docs">
        <div :class="styles.docsView">
            <p ref="intro" :id="toDocsSectionId(DOCS_INTRO_TITLE)" :class="styles.docsLead">
                <PageDocsProse :content="description" />
            </p>

            <slot />
        </div>

        <aside v-if="links.length >= MIN_TABLE_OF_CONTENTS_LINKS" :class="styles.docsTableOfContents">
            <TableOfContents :links="links" :gap="TABLE_OF_CONTENTS_GAP" :ariaLabel="TABLE_OF_CONTENTS_LABEL">
                <template #renderLink="{ link, flags }">
                    <PageTableOfContentsContent :flags="flags" :depth="link.value.depth">{{
                        link.value.title
                    }}</PageTableOfContentsContent>
                </template>
            </TableOfContents>
        </aside>
    </div>
</template>
