<script setup lang="ts">
import type { ApiGroup, ApiGroupKind } from "virtual:component-api";
import { type ComponentPublicInstance, computed, onBeforeUnmount, shallowRef, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import { TableOfContents, TableOfContentsUtils } from "@thewaver/ss-components-vue";
import type { TableOfContentsLink } from "@thewaver/ss-components-vue";
import {
    MIN_TABLE_OF_CONTENTS_LINKS,
    TABLE_OF_CONTENTS_GAP,
    TABLE_OF_CONTENTS_LABEL,
} from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.const";
import * as styles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
import type { DocsTableOfContentsEntry } from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.types";
import {
    loadApiGroups,
    toDocsGroupId,
    toDocsTableId,
    toDocsTableOfContents,
} from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.utils";

import PageTableOfContentsContent from "../../StyledComponents/TableOfContentsContent/TableOfContentsContent.vue";
import type { PageApiViewProps } from "./ApiViewVue.types";
import PageApiTable from "./PageApiTable.vue";

const GROUP_TITLES: Record<ApiGroupKind, string> = {
    props: "Props",
    components: "Components",
    context: "Context",
    utilities: "Utilities",
    classes: "Classes",
    types: "Types",
};

const getIsPlainClick = (e: MouseEvent) => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

const props = defineProps<PageApiViewProps>();

const route = useRoute();
const router = useRouter();

const groups = shallowRef<ApiGroup[]>();
const headingRefs = shallowRef<Record<string, HTMLElement>>({});

const links = computed((): TableOfContentsLink<DocsTableOfContentsEntry>[] =>
    toDocsTableOfContents(groups.value ?? [], GROUP_TITLES).map((entry) => ({
        value: entry,
        target: headingRefs.value[entry.id],
        href: `#${entry.id}`,
        depth: entry.depth,
    })),
);

const setHeadingRef = (id: string) => (element: Element | ComponentPublicInstance | null) => {
    if (!(element instanceof HTMLElement)) return;

    if (headingRefs.value[id] === element) return;

    headingRefs.value = { ...headingRefs.value, [id]: element };
};

let currentEntry: DocsTableOfContentsEntry | undefined;
let hasOpened = false;
let stopHashHold: (() => void) | undefined;

onBeforeUnmount(() => stopHashHold?.());

const replaceHash = (entry: DocsTableOfContentsEntry | undefined) => {
    void router.replace({ path: route.path, query: route.query, hash: entry ? `#${entry.id}` : "" });
};

const handleFragmentClick = (e: MouseEvent, href: string) => {
    const target = href.startsWith("#") ? document.getElementById(href.slice(1)) : null;

    if (!target || !getIsPlainClick(e)) return;

    e.preventDefault();
    stopHashHold?.();
    stopHashHold = TableOfContentsUtils.observeNextReaderInput(() => {
        stopHashHold = undefined;
        replaceHash(currentEntry);
    });
    void router.push({ path: route.path, query: route.query, hash: href });
    TableOfContentsUtils.goToTarget(target);
};

const handleCurrentChange = (entry: DocsTableOfContentsEntry | undefined) => {
    currentEntry = entry;

    if (!hasOpened) {
        hasOpened = true;

        return;
    }

    if (!stopHashHold) replaceHash(entry);
};

watch(
    () => props.name,
    (name, _previous, onCleanup) => {
        let isCurrent = true;

        onCleanup(() => {
            isCurrent = false;
        });

        groups.value = undefined;
        loadApiGroups(name).then((loaded) => {
            if (isCurrent) groups.value = loaded;
        });
    },
    { immediate: true },
);
</script>

<template>
    <div :class="styles.docsLayout" data-view="api">
        <div :class="styles.docsView">
            <template v-if="groups === undefined" />

            <template v-else-if="groups.length">
                <section
                    v-for="group in groups"
                    :key="group.kind"
                    :class="styles.docsGroup"
                    :data-api-group="group.kind"
                >
                    <h2
                        :id="toDocsGroupId(group.kind)"
                        :ref="setHeadingRef(toDocsGroupId(group.kind))"
                        :class="styles.docsGroupTitle"
                    >
                        {{ GROUP_TITLES[group.kind] }}
                    </h2>

                    <PageApiTable
                        v-for="(table, index) in group.tables"
                        :key="`${table.name}-${index}`"
                        :table="table"
                        :unit="name"
                        :heading-id="toDocsTableId(group.kind, table.name)"
                        :heading-ref="setHeadingRef(toDocsTableId(group.kind, table.name))"
                        @fragment-click="handleFragmentClick"
                    />
                </section>
            </template>

            <p v-else :class="styles.docsEmpty">
                {{ `${name} exports nothing of its own, so there is nothing to list.` }}
            </p>
        </div>

        <aside v-if="links.length >= MIN_TABLE_OF_CONTENTS_LINKS" :class="styles.docsTableOfContents">
            <TableOfContents
                :links="links"
                :gap="TABLE_OF_CONTENTS_GAP"
                :ariaLabel="TABLE_OF_CONTENTS_LABEL"
                @current-change="handleCurrentChange"
            >
                <template #renderLink="{ link, flags }">
                    <PageTableOfContentsContent :flags="flags" :depth="link.value.depth">{{
                        link.value.title
                    }}</PageTableOfContentsContent>
                </template>
            </TableOfContents>
        </aside>
    </div>
</template>
