<script setup lang="ts">
import { computed, shallowRef, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import { SharedTooltip, Sidebar, Tree, useViewportContext } from "@thewaver/ss-components-vue";
import type { TreeNode } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/App.css";
import { LAYOUT } from "@thewaver/ss-playground/App/Layout.const";
import { IS_BUILD_PROGRESS_SHOWN } from "@thewaver/ss-playground/App/PageComponents/BuildProgress/BuildProgress.utils";
import {
    DEFAULT_PAGE_VIEW,
    toBaseRoute,
    toPageViewKey,
} from "@thewaver/ss-playground/App/PageComponents/ViewTabs/ViewTabs.const";

import type { ComponentConfig, MenuNodeConfig } from "./App.types";
import { AppUtils } from "./App.utils";
import { GALLERY_ROUTE, GETTING_STARTED_ROUTE, MENU_EDGE, MENU_ID, SEARCH_FIELD_WIDTH } from "./AppVue.const";
import PageAppCommands from "./PageComponents/AppCommands/PageAppCommands.vue";
import PageBuildProgress from "./PageComponents/BuildProgress/PageBuildProgress.vue";
import PageTextField from "./PageComponents/Field/PageTextField.vue";
import PageFrameworkMenu from "./PageComponents/FrameworkMenu/FrameworkMenu.vue";
import PageLayer from "./PageComponents/Layer/Layer.vue";
import PageNavLink from "./PageComponents/NavLink/NavLink.vue";
import PageNavLinkGroup from "./PageComponents/NavLink/PageNavLinkGroup.vue";
import type { ViewportAnchor } from "./PageComponents/NavSettings/NavSettingsVue.types";
import PageNavSettings from "./PageComponents/NavSettings/PageNavSettings.vue";
import PageRouterLink from "./PageComponents/RouterLink/RouterLink.vue";
import PageSidebarToggle from "./PageComponents/SidebarToggle/SidebarToggle.vue";
import PageViewTabs from "./PageComponents/ViewTabs/PageViewTabs.vue";
import type { PageViewKey } from "./PageComponents/ViewTabs/ViewTabsVue.types";
import PageDependencies from "./PageDependencies.vue";
import PageGlideFloater from "./StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageTreeNodeContent from "./StyledComponents/TreeNodeContent/PageTreeNodeContent.vue";

const VISIBLE_COMPONENT_CONFIGS = AppUtils.flattenConfigs(AppUtils.VISIBLE_MENU_CONFIGS);

const VISIBLE_PAGE_NAMES = VISIBLE_COMPONENT_CONFIGS.map((config) => config.name);

const viewportAnchor = defineModel<ViewportAnchor>("viewportAnchor", { required: true });

const route = useRoute();
const router = useRouter();

const searchTerm = shallowRef("");
const showsDescriptionOnly = shallowRef(false);
const pageView = shallowRef<PageViewKey>(DEFAULT_PAGE_VIEW);
const isAutoHidden = shallowRef(false);
const browseExpanded = shallowRef<MenuNodeConfig[]>(AppUtils.VISIBLE_MENU_CONFIGS);
const searchExpanded = shallowRef<MenuNodeConfig[]>([]);

const selectedConfig = computed(() => AppUtils.COMPONENT_CONFIGS_BY_ROUTE[toBaseRoute(route.path)]);

watch(
    () => route.path,
    (path) => {
        const baseRoute = toBaseRoute(path);

        if (AppUtils.COMPONENT_CONFIGS_BY_ROUTE[baseRoute]) pageView.value = toPageViewKey(path, baseRoute);
    },
    { immediate: true },
);

const isAboutSelected = computed(() => route.path === "/");

const isGettingStartedSelected = computed(() => route.path === GETTING_STARTED_ROUTE);

const isGallerySelected = computed(() => route.path === GALLERY_ROUTE);

const isSearching = computed(() => searchTerm.value.trim().length > 0);

const filteredNodes = computed(() => {
    const menuNodes = AppUtils.MENU_NODES_BY_VIEW[pageView.value];

    if (!isSearching.value && showsDescriptionOnly.value) return menuNodes;

    const term = searchTerm.value.trim().toLocaleLowerCase();

    const getIsKept = (config: ComponentConfig) => {
        if (config === selectedConfig.value) return true;

        if (isSearching.value) return config.name.toLocaleLowerCase().includes(term);

        return showsDescriptionOnly.value || config.component !== undefined || config.docs !== undefined;
    };

    return menuNodes
        .map((node) => AppUtils.filterTreeNode(node, getIsKept))
        .filter((node): node is TreeNode<MenuNodeConfig> => node !== undefined);
});

const visibleNodes = computed(() =>
    filteredNodes.value.map((node) => AppUtils.withoutPreview(node, selectedConfig.value)),
);

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

const viewportContext = useViewportContext();

const menuGutter = computed(() => Math.max(0, (viewportContext.getSize().width - LAYOUT.pageMaxWidth) / 2));

const isMenuHideable = computed(() => viewportContext.getSize().width < LAYOUT.menuHideableBelow);

const isMenuAutoHidden = computed(() => isMenuHideable.value && isAutoHidden.value);

const isMenuExpanded = computed(() => !isMenuAutoHidden.value);

const setIsMenuExpanded = (isExpanded: boolean) => {
    isAutoHidden.value = !isExpanded;
};

const setExpanded = (next: unknown[]) => {
    if (isSearching.value) searchExpanded.value = next as MenuNodeConfig[];
    else browseExpanded.value = next as MenuNodeConfig[];
};

const expandAll = () => {
    setExpanded(AppUtils.collectBranchValues(filteredNodes.value));
};

const goToPage = (pageName: string) => {
    const config = VISIBLE_COMPONENT_CONFIGS.find((candidate) => candidate.name === pageName);

    if (config) void router.push(AppUtils.toPageHref(config, pageView.value));
};

const refuseSelection = () => undefined;

const computeNodeText = (node: TreeNode<MenuNodeConfig>) => node.value.name;
</script>

<template>
    <div :class="styles.appFrame">
        <PageAppCommands
            :page-names="VISIBLE_PAGE_NAMES"
            @go-to-about="() => void router.push('/')"
            @go-to-page="goToPage"
            @expand-all="expandAll"
            @collapse-all="() => setExpanded([])"
        />

        <PageBuildProgress v-if="IS_BUILD_PROGRESS_SHOWN" />

        <div :class="styles.appContent">
            <Sidebar
                :id="MENU_ID"
                :edge="MENU_EDGE"
                :collapsed-size="menuGutter + LAYOUT.menuCollapsedWidth"
                :expanded-size="menuGutter + LAYOUT.menuExpandedWidth"
                :is-expanded-on-hover="isMenuAutoHidden"
                :expanded="isMenuExpanded"
                @update:expanded="setIsMenuExpanded"
            >
                <template #renderContent="{ phase, transitionDurationMs }">
                    <nav :class="styles.leftMenu" :style="{ paddingLeft: `${menuGutter}px` }" aria-label="Library">
                        <PageLayer :level="1">
                            <div :class="styles.leftMenuContent">
                                <div :class="styles.searchContainer">
                                    <PageSidebarToggle
                                        :sidebar-id="MENU_ID"
                                        :edge="MENU_EDGE"
                                        :is-expanded="isMenuExpanded"
                                        :is-disabled="!isMenuHideable"
                                        :ariaLabel="isMenuExpanded ? 'Auto-hide the menu' : 'Keep the menu open'"
                                        @toggle="setIsMenuExpanded(!isMenuExpanded)"
                                    />

                                    <div
                                        :class="[
                                            styles.frameworkHeading,
                                            AppUtils.getIsMenuFaded(phase) && styles.isFaded,
                                            phase === 'collapsed' && styles.isHidden,
                                        ]"
                                        :style="{ transitionDuration: `${transitionDurationMs}ms` }"
                                    >
                                        <span :class="styles.frameworkHeadingLabel">ss-components for</span>

                                        <PageFrameworkMenu />
                                    </div>
                                </div>

                                <div :class="styles.searchContainer">
                                    <div :class="styles.navSettingsBox">
                                        <PageNavSettings
                                            v-model:shows-description-only="showsDescriptionOnly"
                                            v-model:viewport-anchor="viewportAnchor"
                                        />
                                    </div>

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
                                            clearAriaLabel="Clear search"
                                            @input="(value: string) => (searchTerm = value)"
                                        />
                                    </div>
                                </div>

                                <div
                                    :class="[
                                        styles.aboutLink,
                                        AppUtils.getIsMenuFaded(phase) && styles.isFaded,
                                        phase === 'collapsed' && styles.isHidden,
                                    ]"
                                    :style="{ transitionDuration: `${transitionDurationMs}ms` }"
                                >
                                    <PageNavLinkGroup>
                                        <PageNavLink href="/" :is-selected="isAboutSelected" is-gliding
                                            >About</PageNavLink
                                        >

                                        <PageNavLink
                                            :href="GETTING_STARTED_ROUTE"
                                            :is-selected="isGettingStartedSelected"
                                            is-gliding
                                        >
                                            Getting started
                                        </PageNavLink>

                                        <PageNavLink :href="GALLERY_ROUTE" :is-selected="isGallerySelected" is-gliding>
                                            Gallery
                                        </PageNavLink>
                                    </PageNavLinkGroup>
                                </div>

                                <div
                                    :class="[
                                        styles.menuTree,
                                        AppUtils.getIsMenuFaded(phase) && styles.isFaded,
                                        phase === 'collapsed' && styles.isHidden,
                                    ]"
                                    :style="{ transitionDuration: `${transitionDurationMs}ms` }"
                                >
                                    <SharedTooltip>
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
                                                    is-gliding
                                                    :render-props="renderProps"
                                                    :has-examples="
                                                        AppUtils.getIsBranchConfig(node.value) ||
                                                        node.value.component !== undefined ||
                                                        node.value.docs !== undefined
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

                                            <template #renderHighlightFloater="floater">
                                                <PageGlideFloater kind="highlight" v-bind="floater" />
                                            </template>
                                        </Tree>
                                    </SharedTooltip>
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
    </div>
</template>
