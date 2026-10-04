<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import { Tabs } from "@thewaver/ss-components-vue";
import {
    PAGE_VIEW_KEYS,
    PAGE_VIEW_LABELS,
    toPageViewKey,
    toPageViewRoute,
} from "@thewaver/ss-playground/App/PageComponents/ViewTabs/ViewTabs.const";
import * as styles from "@thewaver/ss-playground/App/PageComponents/ViewTabs/ViewTabs.css";

import PageTabContent from "../../StyledComponents/TabContent/PageTabContent.vue";
import PageTabFloater from "../../StyledComponents/TabContent/PageTabFloater.vue";
import PageTabGutter from "../../StyledComponents/TabContent/PageTabGutter.vue";
import PageViewTabLink from "./PageViewTabLink.vue";
import type { PageViewKey, PageViewTabsProps } from "./ViewTabs.types";

const TAB_GAP = 20;
const TAB_ORIENTATION = "horizontal";
const EXAMPLES_VIEW: PageViewKey = "examples";

const props = defineProps<PageViewTabsProps>();

const route = useRoute();
const router = useRouter();

const selected = computed(() => toPageViewKey(route.path, props.baseRoute));

const tabs = computed(() =>
    PAGE_VIEW_KEYS.filter((key) => props.hasExamples || key !== EXAMPLES_VIEW).map((key) => ({
        value: key,
        href: toPageViewRoute(props.baseRoute, key),
    })),
);

const navigateTo = (key: PageViewKey) => {
    void router.push(toPageViewRoute(props.baseRoute, key));
};
</script>

<template>
    <div :class="styles.viewTabs" data-view-tabs="">
        <Tabs
            :orientation="TAB_ORIENTATION"
            :tab-gap="TAB_GAP"
            ariaLabel="Page views"
            :tabs="tabs"
            :selected-value="selected"
            :link-component="PageViewTabLink"
            @selection-change="navigateTo"
        >
            <template #renderGutter>
                <PageTabGutter :orientation="TAB_ORIENTATION" />
            </template>

            <template #renderSelectionFloater="{ visibilityTarget, transitionDurationMs }">
                <PageTabFloater
                    :orientation="TAB_ORIENTATION"
                    :visibility-target="visibilityTarget"
                    :transition-duration-ms="transitionDurationMs"
                />
            </template>

            <template #renderTab="{ tab, flags }">
                <PageTabContent :flags="flags" :orientation="TAB_ORIENTATION" :is-selected="tab.value === selected">{{
                    PAGE_VIEW_LABELS[tab.value as PageViewKey]
                }}</PageTabContent>
            </template>
        </Tabs>
    </div>
</template>
