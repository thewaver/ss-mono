<script lang="ts">
    import { Router } from "sv-router";
    import { untrack } from "svelte";

    import { SharedTooltip, Sidebar, Tree, getViewportContext } from "@thewaver/ss-components-svelte";
    import type {
        AnchorPlacement,
        InteractionFlags,
        InteractionTooltipDefs,
        SidebarPhase,
        TreeNode,
        TreeNodeRenderProps,
    } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/App.css";
    import { LAYOUT } from "@thewaver/ss-playground/App/Layout.const";
    import { restoreRootSlash } from "@thewaver/ss-playground/App/PageComponents/FrameworkSwitch/FrameworkSwitch.const";
    import type { ShapeArrowAim } from "@thewaver/ss-utils";
    import { IS_BUILD_PROGRESS_SHOWN } from "@thewaver/ss-playground/App/PageComponents/BuildProgress/BuildProgress.utils";
    import {
        DEFAULT_PAGE_VIEW,
        PAGE_VIEW_KEYS,
        toBaseRoute,
    } from "@thewaver/ss-playground/App/PageComponents/ViewTabs/ViewTabs.const";

    import { MENU_CONFIGS, MENU_EDGE, MENU_ID, SEARCH_FIELD_WIDTH } from "./AppSvelte.const";
    import {
        COMPONENT_CONFIGS_BY_ROUTE,
        GALLERY_ROUTE,
        GETTING_STARTED_ROUTE,
        componentToRouteName,
        flattenConfigs,
        getHasPreview,
        getIsBranchConfig,
        navigate,
        route,
        toPageHref,
    } from "./App.router";
    import type { ComponentConfig, MenuBranchConfig, MenuNodeConfig, RoutePath } from "./App.types";
    import PageAppCommands from "./PageComponents/AppCommands/AppCommands.svelte";
    import PageTextField from "./PageComponents/Field/PageTextField.svelte";
    import PageBuildProgress from "./PageComponents/BuildProgress/PageBuildProgress.svelte";
    import PageFrameworkMenu from "./PageComponents/FrameworkMenu/FrameworkMenu.svelte";
    import PageLayer from "./PageComponents/Layer/Layer.svelte";
    import PageNavLink from "./PageComponents/NavLink/NavLink.svelte";
    import PageNavLinkGroup from "./PageComponents/NavLink/PageNavLinkGroup.svelte";
    import type { ViewportAnchor } from "./PageComponents/NavSettings/NavSettingsSvelte.types";
    import PageNavSettings from "./PageComponents/NavSettings/PageNavSettings.svelte";
    import PagePreview from "./PageComponents/Preview/Preview.svelte";
    import PageRouterLink from "./PageComponents/RouterLink/RouterLink.svelte";
    import PageSidebarToggle from "./PageComponents/SidebarToggle/SidebarToggle.svelte";
    import PageViewTabs from "./PageComponents/ViewTabs/PageViewTabs.svelte";
    import type { PageViewKey } from "./PageComponents/ViewTabs/ViewTabsSvelte.types";
    import PageDependencies from "./PageDependencies.svelte";
    import { renderPageHighlightFloater } from "./StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageTooltipContent from "./StyledComponents/TooltipContent/TooltipContent.svelte";
    import PageTreeNodeContent from "./StyledComponents/TreeNodeContent/PageTreeNodeContent.svelte";
    import { NAV_PREVIEW_ARROW, NAV_PREVIEW_OFFSET, NAV_PREVIEW_PLACEMENT } from "@thewaver/ss-playground/App/App.const";

    const getIsMenuFaded = (phase: SidebarPhase) => phase === "collapsing" || phase === "collapsed";

    const NAV_PREVIEW_TOOLTIP_DEFS: InteractionTooltipDefs<TreeNodeRenderProps<MenuNodeConfig>> = {
        placement: NAV_PREVIEW_PLACEMENT,
        offset: NAV_PREVIEW_OFFSET,
        renderContent: renderNavPreview,
    };

    const toTreeNode =
        (view: PageViewKey) =>
        (node: MenuNodeConfig): TreeNode<MenuNodeConfig> =>
            getIsBranchConfig(node)
                ? { value: node, children: node.children.map(toTreeNode(view)) }
                : {
                      value: node,
                      href: toPageHref(node, view),
                      tooltipDefs: getHasPreview(node) ? NAV_PREVIEW_TOOLTIP_DEFS : undefined,
                  };

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

    const withoutPreview = (node: TreeNode<MenuNodeConfig>, config: MenuNodeConfig | undefined): TreeNode<MenuNodeConfig> => {
        if (node.children) return { ...node, children: node.children.map((child) => withoutPreview(child, config)) };

        return node.value === config ? { ...node, tooltipDefs: undefined } : node;
    };

    const collectBranchValues = (nodes: TreeNode<MenuNodeConfig>[]): MenuNodeConfig[] =>
        nodes.flatMap((node) => (node.children ? [node.value, ...collectBranchValues(node.children)] : []));

    const VISIBLE_MENU_CONFIGS = MENU_CONFIGS.filter((category) => !category.hidden);

    const MENU_NODES_BY_VIEW = Object.fromEntries(
        PAGE_VIEW_KEYS.map((view) => [view, VISIBLE_MENU_CONFIGS.map(toTreeNode(view))]),
    ) as Record<PageViewKey, TreeNode<MenuNodeConfig>[]>;

    const VISIBLE_COMPONENT_CONFIGS = flattenConfigs(VISIBLE_MENU_CONFIGS);

    const VISIBLE_PAGE_NAMES = VISIBLE_COMPONENT_CONFIGS.map((config) => config.name);

    const ANCESTORS_BY_CONFIG = new Map<MenuNodeConfig, MenuBranchConfig[]>();

    collectAncestors(VISIBLE_MENU_CONFIGS, [], ANCESTORS_BY_CONFIG);

    let { viewportAnchor = $bindable() }: { viewportAnchor: ViewportAnchor } = $props();

    let searchTerm = $state("");
    let showsDescriptionOnly = $state(false);
    let pageView = $state<PageViewKey>(DEFAULT_PAGE_VIEW);
    let isAutoHidden = $state(false);
    let browseExpanded = $state.raw<MenuNodeConfig[]>(VISIBLE_MENU_CONFIGS);

    const selectedConfig = $derived(COMPONENT_CONFIGS_BY_ROUTE[toBaseRoute(route.pathname)]);

    const isAboutSelected = $derived(route.pathname === "/");

    const isGettingStartedSelected = $derived(route.pathname === GETTING_STARTED_ROUTE);

    const isGallerySelected = $derived(route.pathname === GALLERY_ROUTE);

    $effect(() => {
        void route.pathname;

        restoreRootSlash();
    });

    const isSearching = $derived(searchTerm.trim().length > 0);

    const filteredNodes = $derived.by(() => {
        const menuNodes = MENU_NODES_BY_VIEW[pageView];

        if (!isSearching && showsDescriptionOnly) return menuNodes;

        const term = searchTerm.trim().toLocaleLowerCase();

        const getIsKept = (config: ComponentConfig) => {
            if (config === selectedConfig) return true;

            if (isSearching) return config.name.toLocaleLowerCase().includes(term);

            return showsDescriptionOnly || config.component !== undefined || config.docs !== undefined;
        };

        return menuNodes
            .map((node) => filterTreeNode(node, getIsKept))
            .filter((node): node is TreeNode<MenuNodeConfig> => node !== undefined);
    });

    const visibleNodes = $derived(filteredNodes.map((node) => withoutPreview(node, selectedConfig)));

    let searchExpanded = $derived(isSearching ? collectBranchValues(visibleNodes) : []);

    $effect.pre(() => {
        const config = selectedConfig;

        untrack(() => {
            const ancestors = config ? (ANCESTORS_BY_CONFIG.get(config) ?? []) : [];

            if (ancestors.length === 0) return;

            browseExpanded = [...browseExpanded, ...ancestors.filter((ancestor) => !browseExpanded.includes(ancestor))];
        });
    });

    const setExpanded = (next: MenuNodeConfig[]) => {
        if (isSearching) searchExpanded = next;
        else browseExpanded = next;
    };

    const goToPage = (pageName: string) => {
        const config = VISIBLE_COMPONENT_CONFIGS.find((candidate) => candidate.name === pageName);

        if (config) void navigate(toPageHref(config, pageView) as RoutePath);
    };

    const viewportContext = getViewportContext();

    const menuGutter = $derived(Math.max(0, (viewportContext.getSize().width - LAYOUT.pageMaxWidth) / 2));

    const isMenuHideable = $derived(viewportContext.getSize().width < LAYOUT.menuHideableBelow);

    const isMenuAutoHidden = $derived(isMenuHideable && isAutoHidden);

    const isMenuExpanded = $derived(!isMenuAutoHidden);
</script>

{#snippet renderNavPreview(
    visibilityTarget: 0 | 1,
    transitionDurationMs: number,
    _placement: AnchorPlacement,
    flags: InteractionFlags<TreeNodeRenderProps<MenuNodeConfig>>,
    arrowAim: ShapeArrowAim | undefined,
)}
    {#if !getIsBranchConfig(flags.value) && flags.value.component}
        <PageTooltipContent
            {visibilityTarget}
            {transitionDurationMs}
            arrow={NAV_PREVIEW_ARROW}
            {arrowAim}
            isWide={true}
        >
            <div class={styles.navPreview} aria-hidden="true" inert>
                <PageLayer level={1}>
                    <PagePreview component={flags.value.component} />
                </PageLayer>
            </div>
        </PageTooltipContent>
    {/if}
{/snippet}

<div class={styles.appFrame}>
    <PageAppCommands
        pageNames={VISIBLE_PAGE_NAMES}
        onGoToAbout={() => void navigate("/")}
        onGoToPage={goToPage}
        onExpandAll={() => setExpanded(collectBranchValues(filteredNodes))}
        onCollapseAll={() => setExpanded([])}
    />

    {#if IS_BUILD_PROGRESS_SHOWN}
        <PageBuildProgress />
    {/if}

    <div class={styles.appContent}>
        <Sidebar
            id={MENU_ID}
            edge={MENU_EDGE}
            collapsedSize={menuGutter + LAYOUT.menuCollapsedWidth}
            expandedSize={menuGutter + LAYOUT.menuExpandedWidth}
            isExpandedOnHover={isMenuAutoHidden}
            bind:expanded={
                () => isMenuExpanded,
                (isExpanded) => {
                    isAutoHidden = !isExpanded;
                }
            }
        >
            {#snippet renderContent(phase, transitionDurationMs)}
                <nav class={styles.leftMenu} style:padding-left={`${menuGutter}px`} aria-label={"Library"}>
                    <PageLayer level={1}>
                        <div class={styles.leftMenuContent}>
                            <div class={styles.searchContainer}>
                                <PageSidebarToggle
                                    sidebarId={MENU_ID}
                                    edge={MENU_EDGE}
                                    isExpanded={isMenuExpanded}
                                    isDisabled={!isMenuHideable}
                                    ariaLabel={isMenuExpanded ? "Auto-hide the menu" : "Keep the menu open"}
                                    onToggle={() => {
                                        isAutoHidden = isMenuExpanded;
                                    }}
                                />

                                <div
                                    class={[
                                        styles.frameworkHeading,
                                        getIsMenuFaded(phase) && styles.isFaded,
                                        phase === "collapsed" && styles.isHidden,
                                    ]}
                                    style:transition-duration={`${transitionDurationMs}ms`}
                                >
                                    <span class={styles.frameworkHeadingLabel}>ss-components for</span>

                                    <PageFrameworkMenu />
                                </div>
                            </div>

                            <div class={styles.searchContainer}>
                                <div class={styles.navSettingsBox}>
                                    <PageNavSettings bind:showsDescriptionOnly bind:pageView bind:viewportAnchor />
                                </div>

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
                                        clearAriaLabel={"Clear search"}
                                        onInput={(value) => {
                                            searchTerm = value;
                                        }}
                                    />
                                </div>
                            </div>

                            <div
                                class={[
                                    styles.aboutLink,
                                    getIsMenuFaded(phase) && styles.isFaded,
                                    phase === "collapsed" && styles.isHidden,
                                ]}
                                style:transition-duration={`${transitionDurationMs}ms`}
                            >
                                <PageNavLinkGroup>
                                    <PageNavLink href={"/"} isSelected={isAboutSelected} isGliding={true}>
                                        About
                                    </PageNavLink>

                                    <PageNavLink
                                        href={GETTING_STARTED_ROUTE}
                                        isSelected={isGettingStartedSelected}
                                        isGliding={true}
                                    >
                                        Getting started
                                    </PageNavLink>

                                    <PageNavLink href={GALLERY_ROUTE} isSelected={isGallerySelected} isGliding={true}>
                                        Gallery
                                    </PageNavLink>
                                </PageNavLinkGroup>
                            </div>

                            <div
                                class={[
                                    styles.menuTree,
                                    getIsMenuFaded(phase) && styles.isFaded,
                                    phase === "collapsed" && styles.isHidden,
                                ]}
                                style:transition-duration={`${transitionDurationMs}ms`}
                            >
                                <SharedTooltip>
                                    <Tree
                                        renderHighlightFloater={renderPageHighlightFloater}
                                        nodes={visibleNodes}
                                        bind:value={() => selectedConfig as MenuNodeConfig | undefined, () => undefined}
                                        bind:expanded={
                                            () => (isSearching ? searchExpanded : browseExpanded),
                                            (next) => setExpanded(next ?? [])
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
                                </SharedTooltip>
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
</div>
