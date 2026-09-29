<script lang="ts">
    import { Router } from "sv-router";
    import { untrack } from "svelte";

    import { Sidebar, Tree } from "@thewaver/ss-components-svelte";
    import type { SidebarPhase, TreeNode } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/App.css";
    import {
        DEFAULT_PAGE_VIEW,
        PAGE_VIEW_KEYS,
        toBaseRoute,
    } from "@thewaver/ss-playground/App/PageComponents/ViewTabs/ViewTabs.const";

    import {
        MENU_COLLAPSED_WIDTH,
        MENU_CONFIGS,
        MENU_EDGE,
        MENU_EXPANDED_WIDTH,
        MENU_ID,
        SEARCH_FIELD_WIDTH,
    } from "./App.const";
    import {
        COMPONENT_CONFIGS_BY_ROUTE,
        componentToRouteName,
        flattenConfigs,
        getIsBranchConfig,
        route,
        toPageHref,
    } from "./App.router";
    import type { ComponentConfig, MenuBranchConfig, MenuNodeConfig } from "./App.types";
    import PageTextField from "./PageComponents/Field/PageTextField.svelte";
    import PageLayer from "./PageComponents/Layer/Layer.svelte";
    import type { ViewportAnchor } from "./PageComponents/NavSettings/NavSettings.types";
    import PageNavSettings from "./PageComponents/NavSettings/PageNavSettings.svelte";
    import PageRouterLink from "./PageComponents/RouterLink/RouterLink.svelte";
    import PageSidebarToggle from "./PageComponents/SidebarToggle/SidebarToggle.svelte";
    import PageViewTabs from "./PageComponents/ViewTabs/PageViewTabs.svelte";
    import type { PageViewKey } from "./PageComponents/ViewTabs/ViewTabs.types";
    import PageDependencies from "./PageDependencies.svelte";
    import PageTreeNodeContent from "./StyledComponents/TreeNodeContent/PageTreeNodeContent.svelte";

    const getIsMenuFaded = (phase: SidebarPhase) => phase === "collapsing" || phase === "collapsed";

    const toTreeNode =
        (view: PageViewKey) =>
        (node: MenuNodeConfig): TreeNode<MenuNodeConfig> =>
            getIsBranchConfig(node)
                ? { value: node, children: node.children.map(toTreeNode(view)) }
                : { value: node, href: toPageHref(node, view) };

    const collectAncestors = (
        nodes: MenuNodeConfig[],
        trail: MenuBranchConfig[],
        into: Map<MenuNodeConfig, MenuBranchConfig[]>,
    ) => {
        for (const node of nodes) {
            into.set(node, trail);

            if (getIsBranchConfig(node)) collectAncestors(node.children, [...trail, node], into);
        }
    };

    const filterTreeNode = (
        node: TreeNode<MenuNodeConfig>,
        getIsKept: (config: ComponentConfig) => boolean,
    ): TreeNode<MenuNodeConfig> | undefined => {
        if (!node.children) return getIsKept(node.value as ComponentConfig) ? node : undefined;

        const children = node.children
            .map((child) => filterTreeNode(child, getIsKept))
            .filter((child): child is TreeNode<MenuNodeConfig> => child !== undefined);

        return children.length > 0 ? { ...node, children } : undefined;
    };

    const collectBranchValues = (nodes: TreeNode<MenuNodeConfig>[]): MenuNodeConfig[] =>
        nodes.flatMap((node) => (node.children ? [node.value, ...collectBranchValues(node.children)] : []));

    const VISIBLE_MENU_CONFIGS = MENU_CONFIGS.filter((category) => !category.hidden);

    const MENU_NODES_BY_VIEW = Object.fromEntries(
        PAGE_VIEW_KEYS.map((view) => [view, VISIBLE_MENU_CONFIGS.map(toTreeNode(view))]),
    ) as Record<PageViewKey, TreeNode<MenuNodeConfig>[]>;

    const ANCESTORS_BY_CONFIG = new Map<MenuNodeConfig, MenuBranchConfig[]>();

    collectAncestors(VISIBLE_MENU_CONFIGS, [], ANCESTORS_BY_CONFIG);

    let { viewportAnchor = $bindable() }: { viewportAnchor: ViewportAnchor } = $props();

    let searchTerm = $state("");
    let showsDescriptionOnly = $state(false);
    let pageView = $state<PageViewKey>(DEFAULT_PAGE_VIEW);
    let isAutoHidden = $state(false);
    let browseExpanded = $state.raw<MenuNodeConfig[]>(VISIBLE_MENU_CONFIGS);

    const selectedConfig = $derived(COMPONENT_CONFIGS_BY_ROUTE[toBaseRoute(route.pathname)]);

    const isSearching = $derived(searchTerm.trim().length > 0);

    const visibleNodes = $derived.by(() => {
        const menuNodes = MENU_NODES_BY_VIEW[pageView];

        if (!isSearching && showsDescriptionOnly) return menuNodes;

        const term = searchTerm.trim().toLocaleLowerCase();

        const getIsKept = (config: ComponentConfig) => {
            if (config === selectedConfig) return true;

            if (isSearching) return config.name.toLocaleLowerCase().includes(term);

            return showsDescriptionOnly || config.component !== undefined;
        };

        return menuNodes
            .map((node) => filterTreeNode(node, getIsKept))
            .filter((node): node is TreeNode<MenuNodeConfig> => node !== undefined);
    });

    let searchExpanded = $derived(isSearching ? collectBranchValues(visibleNodes) : []);

    $effect.pre(() => {
        const config = selectedConfig;

        untrack(() => {
            const ancestors = config ? (ANCESTORS_BY_CONFIG.get(config) ?? []) : [];

            if (ancestors.length === 0) return;

            browseExpanded = [...browseExpanded, ...ancestors.filter((ancestor) => !browseExpanded.includes(ancestor))];
        });
    });

    const isMenuExpanded = $derived(!isAutoHidden);
</script>

<div class={styles.appContent}>
    <Sidebar
        id={MENU_ID}
        edge={MENU_EDGE}
        collapsedWidth={MENU_COLLAPSED_WIDTH}
        expandedWidth={MENU_EXPANDED_WIDTH}
        isExpandedOnHover={isAutoHidden}
        bind:expanded={
            () => isMenuExpanded,
            (isExpanded) => {
                isAutoHidden = !isExpanded;
            }
        }
    >
        {#snippet renderContent(phase, transitionDurationMs)}
            <nav class={styles.leftMenu} aria-label={"Library"}>
                <PageLayer level={1}>
                    <div class={styles.leftMenuContent}>
                        <div class={styles.searchContainer}>
                            <PageSidebarToggle
                                sidebarId={MENU_ID}
                                edge={MENU_EDGE}
                                isExpanded={isMenuExpanded}
                                ariaLabel={isMenuExpanded ? "Auto-hide the menu" : "Keep the menu open"}
                                onToggle={() => {
                                    isAutoHidden = isMenuExpanded;
                                }}
                            />

                            <div
                                class={[
                                    styles.searchFields,
                                    getIsMenuFaded(phase) && styles.isFaded,
                                    phase === "collapsed" && styles.isHidden,
                                ]}
                                style:transition-duration={`${transitionDurationMs}ms`}
                            >
                                <PageTextField
                                    value={searchTerm}
                                    width={SEARCH_FIELD_WIDTH}
                                    placeholder={"Search"}
                                    ariaLabel={"Search components"}
                                    onInput={(value) => {
                                        searchTerm = value;
                                    }}
                                />

                                <PageNavSettings bind:showsDescriptionOnly bind:pageView bind:viewportAnchor />
                            </div>
                        </div>

                        <div
                            class={[
                                styles.menuTree,
                                getIsMenuFaded(phase) && styles.isFaded,
                                phase === "collapsed" && styles.isHidden,
                            ]}
                            style:transition-duration={`${transitionDurationMs}ms`}
                        >
                            <Tree
                                nodes={visibleNodes}
                                bind:value={() => selectedConfig as MenuNodeConfig | undefined, () => undefined}
                                bind:expanded={
                                    () => (isSearching ? searchExpanded : browseExpanded),
                                    (next) => {
                                        if (isSearching) searchExpanded = next ?? [];
                                        else browseExpanded = next ?? [];
                                    }
                                }
                                ariaLabel={"Library"}
                                linkComponent={PageRouterLink}
                                computeCustomText={(node) => node.value.name}
                            >
                                {#snippet renderNode(node, renderProps)}
                                    <PageTreeNodeContent
                                        {renderProps}
                                        hasExamples={getIsBranchConfig(node.value) ||
                                            node.value.component !== undefined}
                                        detail={getIsBranchConfig(node.value)
                                            ? `${flattenConfigs(node.value.children).length}`
                                            : ""}
                                    >
                                        {node.value.name}
                                    </PageTreeNodeContent>
                                {/snippet}
                            </Tree>
                        </div>
                    </div>
                </PageLayer>
            </nav>
        {/snippet}
    </Sidebar>

    <main class={styles.pageColumn}>
        {#if selectedConfig}
            <div class={styles.pageBody}>
                <div class={styles.pageHeader}>
                    <h1 class={styles.pageTitle}>{selectedConfig.name}</h1>

                    <PageDependencies name={selectedConfig.name} view={pageView} />

                    <PageViewTabs
                        baseRoute={componentToRouteName(selectedConfig.name)}
                        hasExamples={selectedConfig.component !== undefined}
                    />
                </div>

                <Router />
            </div>
        {:else}
            <Router />
        {/if}
    </main>
</div>
