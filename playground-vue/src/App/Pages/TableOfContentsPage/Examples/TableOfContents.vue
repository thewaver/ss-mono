<script setup lang="ts">
import { type ComponentPublicInstance, computed, shallowRef } from "vue";

import { TableOfContents } from "@thewaver/ss-components-vue";
import type { TableOfContentsLink } from "@thewaver/ss-components-vue";
import {
    HEADING_LEVEL,
    TOC_GAP,
} from "@thewaver/ss-playground/App/Pages/TableOfContentsPage/TableOfContentsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TableOfContentsPage/TableOfContentsPage.css";

import PageTableOfContentsContent from "../../../StyledComponents/TableOfContentsContent/TableOfContentsContent.vue";
import type { TableOfContentsExampleProps } from "../TableOfContentsPage.types";

const TOP_DEPTH = 0;

type Props = TableOfContentsExampleProps;

const props = defineProps<Props>();

const headingRefs = shallowRef<(HTMLElement | undefined)[]>([]);

const links = computed((): TableOfContentsLink<string>[] =>
    props.sections.map((section, index) => ({
        value: section.id,
        target: headingRefs.value[index],
        href: `#${section.id}`,
        depth: section.depth,
        id: `${section.id}Link`,
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
                :ariaLabel="ariaLabel"
                @current-change="props.onCurrentChange"
            >
                <template #renderLink="{ link, flags }">
                    <PageTableOfContentsContent :flags="flags" :depth="link.depth ?? TOP_DEPTH">{{
                        sections.find((section) => section.id === link.value)?.title
                    }}</PageTableOfContentsContent>
                </template>
            </TableOfContents>
        </div>

        <article :class="styles.tocArticle">
            <section
                v-for="(section, index) in sections"
                :key="section.id"
                :class="styles.tocSection"
                :aria-labelledby="section.id"
            >
                <component
                    :is="`h${HEADING_LEVEL + (section.depth ?? TOP_DEPTH)}`"
                    :id="section.id"
                    :ref="(element: Element | ComponentPublicInstance | null) => setHeadingRef(index, element)"
                    :class="styles.tocHeading"
                >
                    {{ section.title }}
                </component>

                <p>{{ section.text }}</p>
            </section>
        </article>
    </div>
</template>
