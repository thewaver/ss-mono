<script setup lang="ts">
import { type ComponentPublicInstance, computed, shallowRef, useId } from "vue";

import { TableOfContents } from "@thewaver/ss-components-vue";
import type { TableOfContentsLink } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import {
    HEADING_LEVEL,
    SECTIONS,
    TOC_GAP,
} from "@thewaver/ss-playground/App/Pages/TableOfContentsPage/TableOfContentsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TableOfContentsPage/TableOfContentsPage.css";

import PageTableOfContentsContent from "../../../StyledComponents/TableOfContentsContent/TableOfContentsContent.vue";
import type { TableOfContentsBasicDocsExampleProps } from "../TableOfContentsPageVue.types";

const TOP_DEPTH = 0;

type Props = TableOfContentsBasicDocsExampleProps;

defineProps<Props>();

const idPrefix = useId();

const headingRefs = shallowRef<(HTMLElement | undefined)[]>([]);
const current = shallowRef<string>();

const toHeadingId = (sectionId: string) => `${idPrefix}-${sectionId}`;

const links = computed((): TableOfContentsLink<string>[] =>
    SECTIONS.map((section, index) => ({
        value: section.id,
        target: headingRefs.value[index],
        href: `#${toHeadingId(section.id)}`,
        depth: section.depth,
    })),
);

const setHeadingRef = (index: number, element: Element | ComponentPublicInstance | null) => {
    if (!(element instanceof HTMLElement)) return;

    if (headingRefs.value[index] === element) return;

    const next = [...headingRefs.value];

    next[index] = element;

    headingRefs.value = next;
};
</script>

<template>
    <div :class="styles.tocRoot">
        <div :class="styles.tocNav">
            <TableOfContents
                :links="links"
                :gap="TOC_GAP"
                :offset-ratio="offsetRatio"
                ariaLabel="Outline"
                @current-change="(id: string | undefined) => (current = id)"
            >
                <template #renderLink="{ link, flags }">
                    <PageTableOfContentsContent :flags="flags" :depth="link.depth ?? TOP_DEPTH">{{
                        SECTIONS.find((section) => section.id === link.value)?.title
                    }}</PageTableOfContentsContent>
                </template>
            </TableOfContents>
        </div>

        <article :class="styles.tocArticle">
            <section
                v-for="(section, index) in SECTIONS"
                :key="section.id"
                :class="styles.tocSection"
                :aria-labelledby="toHeadingId(section.id)"
            >
                <component
                    :is="`h${HEADING_LEVEL + (section.depth ?? TOP_DEPTH)}`"
                    :id="toHeadingId(section.id)"
                    :ref="(element: Element | ComponentPublicInstance | null) => setHeadingRef(index, element)"
                    :class="styles.tocHeading"
                >
                    {{ section.title }}
                </component>

                <p :class="styles.tocText">{{ section.text }}</p>
            </section>
        </article>
    </div>

    <div :class="exampleStyles.exampleReadout" data-readout>
        {{ `Current: ${SECTIONS.find((section) => section.id === current)?.title ?? "none"}` }}
    </div>
</template>
