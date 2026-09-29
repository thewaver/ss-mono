<script setup lang="ts">
import { computed, shallowRef, watch } from "vue";
import { useRoute } from "vue-router";

import { Sidebar, Tree } from "@thewaver/ss-components-vue";
import type { TreeNode } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/App.css";
import { DEFAULT_PAGE_VIEW, toBaseRoute } from "@thewaver/ss-playground/App/PageComponents/ViewTabs/ViewTabs.const";

import { MENU_COLLAPSED_WIDTH, MENU_EDGE, MENU_EXPANDED_WIDTH, MENU_ID, SEARCH_FIELD_WIDTH } from "./App.const";
import type { ComponentConfig, MenuNodeConfig } from "./App.types";
import { AppUtils } from "./App.utils";
import PageTextField from "./PageComponents/Field/PageTextField.vue";
import PageLayer from "./PageComponents/Layer/Layer.vue";
import type { ViewportAnchor } from "./PageComponents/NavSettings/NavSettings.types";
import PageNavSettings from "./PageComponents/NavSettings/PageNavSettings.vue";
import PageRouterLink from "./PageComponents/RouterLink/RouterLink.vue";
import PageSidebarToggle from "./PageComponents/SidebarToggle/SidebarToggle.vue";
import PageViewTabs from "./PageComponents/ViewTabs/PageViewTabs.vue";
import type { PageViewKey } from "./PageComponents/ViewTabs/ViewTabs.types";
import PageDependencies from "./PageDependencies.vue";
import PageTreeNodeContent from "./StyledComponents/TreeNodeContent/PageTreeNodeContent.vue";

const viewportAnchor = defineModel<ViewportAnchor>("viewportAnchor", { required: true });

const route = useRoute();

const searchTerm = shallowRef("");
const showsDescriptionOnly = shallowRef(false);
const pageView = shallowRef<PageViewKey>(DEFAULT_PAGE_VIEW);
const isAutoHidden = shallowRef(false);
const browseExpanded = shallowRef<MenuNodeConfig[]>(AppUtils.VISIBLE_MENU_CONFIGS);
const searchExpanded = shallowRef<MenuNodeConfig[]>([]);

const selectedConfig = computed(() => AppUtils.COMPONENT_CONFIGS_BY_ROUTE[toBaseRoute(route.path)]);

const isSearching = computed(() => searchTerm.value.trim().length > 0);

const visibleNodes = computed(() => {
    const menuNodes = AppUtils.MENU_NODES_BY_VIEW[pageView.value];

    if (!isSearching.value && showsDescriptionOnly.value) return menuNodes;

    const term = searchTerm.value.trim().toLocaleLowerCase();

    const getIsKept = (config: ComponentConfig) => {
        if (config === selectedConfig.value) return true;

        if (isSearching.value) return config.name.toLocaleLowerCase().includes(term);

        return showsDescriptionOnly.value || config.component !== undefined;
    };

    return menuNodes
        .map((node) => AppUtils.filterTreeNode(node, getIsKept))
        .filter((node): node is TreeNode<MenuNodeConfig> => node !== undefined);
});

watch(
    () => (isSearching.value ? visibleNodes.value : undefined),
    (searchNodes) => {
        if (searchNodes) searchExpanded.value = AppUtils.collectBranchValues(searchNodes);
    },
    { immediate: true },
);

watch(
    selectedConfig,
    (config) => {
        const ancestors = config ? (AppUtils.ANCESTORS_BY_CONFIG.get(config) ?? []) : [];

        if (ancestors.length === 0) return;

        const previous = browseExpanded.value;

        browseExpanded.value = [...previous, ...ancestors.filter((ancestor) => !previous.includes(ancestor))];
    },
    { immediate: true },
);

const isMenuExpanded = computed(() => !isAutoHidden.value);

const setIsMenuExpanded = (isExpanded: boolean) => {
    isAutoHidden.value = !isExpanded;
};

const setExpanded = (next: unknown[]) => {
    if (isSearching.value) searchExpanded.value = next as MenuNodeConfig[];
    else browseExpanded.value = next as MenuNodeConfig[];
};

const refuseSelection = () => undefined;

const computeNodeText = (node: TreeNode<unknown>) => (node.value as MenuNodeConfig).name;
</script>

<template>
    <div :class="styles.appContent">
        <Sidebar
            :id="MENU_ID"
            :edge="MENU_EDGE"
            :collapsed-width="MENU_COLLAPSED_WIDTH"
            :expanded-width="MENU_EXPANDED_WIDTH"
            :is-expanded-on-hover="isAutoHidden"
            :expanded="isMenuExpanded"
            @update:expanded="setIsMenuExpanded"
        >
            <template #renderContent="{ phase, transitionDurationMs }">
                <nav :class="styles.leftMenu" aria-label="Library">
                    <PageLayer :level="1">
                        <div :class="styles.leftMenuContent">
                            <div :class="styles.searchContainer">
                                <PageSidebarToggle
                                    :sidebar-id="MENU_ID"
                                    :edge="MENU_EDGE"
                                    :is-expanded="isMenuExpanded"
                                    :ariaLabel="isMenuExpanded ? 'Auto-hide the menu' : 'Keep the menu open'"
                                    @toggle="setIsMenuExpanded(!isMenuExpanded)"
                                />

                                <div
                                    :class="[
                                        styles.searchFields,
                                        AppUtils.getIsMenuFaded(phase) && styles.isFaded,
                                        phase === 'collapsed' && styles.isHidden,
                                    ]"
                                    :style="{ transitionDuration: `${transitionDurationMs}ms` }"
                                >
                                    <PageTextField
                                        :value="searchTerm"
                                        :width="SEARCH_FIELD_WIDTH"
                                        placeholder="Search"
                                        ariaLabel="Search components"
                                        @input="(value: string) => (searchTerm = value)"
                                    />

                                    <PageNavSettings
                                        v-model:shows-description-only="showsDescriptionOnly"
                                        v-model:page-view="pageView"
                                        v-model:viewport-anchor="viewportAnchor"
                                    />
                                </div>
                            </div>

                            <div
                                :class="[
                                    styles.menuTree,
                                    AppUtils.getIsMenuFaded(phase) && styles.isFaded,
                                    phase === 'collapsed' && styles.isHidden,
                                ]"
                                :style="{ transitionDuration: `${transitionDurationMs}ms` }"
                            >
                                <Tree
                                    :nodes="visibleNodes"
                                    :value="selectedConfig"
                                    :expanded="isSearching ? searchExpanded : browseExpanded"
                                    ariaLabel="Library"
                                    :link-component="PageRouterLink"
                                    :compute-custom-text="computeNodeText"
                                    @update:value="refuseSelection"
                                    @update:expanded="setExpanded"
                                >
                                    <template #renderNode="{ node, renderProps }">
                                        <PageTreeNodeContent
                                            :render-props="renderProps"
                                            :has-examples="
                                                AppUtils.getIsBranchConfig(node.value) ||
                                                node.value.component !== undefined
                                            "
                                            :detail="
                                                AppUtils.getIsBranchConfig(node.value)
                                                    ? `${AppUtils.flattenConfigs(node.value.children).length}`
                                                    : ''
                                            "
                                        >
                                            {{ node.value.name }}
                                        </PageTreeNodeContent>
                                    </template>
                                </Tree>
                            </div>
                        </div>
                    </PageLayer>
                </nav>
            </template>
        </Sidebar>

        <main :class="styles.pageColumn">
            <div v-if="selectedConfig" :class="styles.pageBody">
                <div :class="styles.pageHeader">
                    <h1 :class="styles.pageTitle">{{ selectedConfig.name }}</h1>

                    <PageDependencies :name="selectedConfig.name" :view="pageView" />

                    <PageViewTabs
                        :base-route="AppUtils.componentToRouteName(selectedConfig.name)"
                        :has-examples="selectedConfig.component !== undefined"
                    />
                </div>

                <RouterView />
            </div>

            <RouterView v-else />
        </main>
    </div>
</template>
