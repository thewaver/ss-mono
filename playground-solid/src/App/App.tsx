import { Index, type JSX, Show, createEffect, createMemo, createSignal, lazy, on, onCleanup, onMount } from "solid-js";
import COMPONENT_DEPENDENCIES from "virtual:component-dependencies";
import type { DependencyNames } from "virtual:component-dependencies";

import { A, Navigate, Route, type RouteSectionProps, Router } from "@solidjs/router";
import { Collapsible, Sidebar, Tree, ViewportWrapper } from "@thewaver/ss-components-solid";
import type {
    AnchorPlacement,
    InteractionTooltipDefs,
    SidebarPhase,
    SignalPair,
    TreeNode,
    TreeNodeRenderProps,
} from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/App.css";
import { IS_BUILD_PROGRESS_SHOWN } from "@thewaver/ss-playground/App/PageComponents/BuildProgress/BuildProgress.utils";
import {
    restoreRootSlash,
    toRoutePath,
    toRouterBase,
} from "@thewaver/ss-playground/App/PageComponents/FrameworkSwitch/FrameworkSwitch.const";
import {
    DEFAULT_PAGE_VIEW,
    PAGE_VIEW_KEYS,
    toBaseRoute,
    toPageViewRoute,
} from "@thewaver/ss-playground/App/PageComponents/ViewTabs/ViewTabs.const";
import { FunctionUtils, Size2d, StringUtils } from "@thewaver/ss-utils";

import {
    DEPENDENCY_GROUPS,
    DEPENDENCY_SECTIONS,
    EMPTY_DEPENDENCY_NAMES,
    FIXED_ANCHOR_RATIO,
    LIST_PAGELESS_COMPONENTS,
    MENU_COLLAPSED_WIDTH,
    MENU_CONFIGS,
    MENU_EDGE,
    MENU_EXPANDED_WIDTH,
    MENU_ID,
    PREVIEW_EXCLUDED_PAGES,
    SEARCH_FIELD_WIDTH,
} from "./App.const";
import type { ComponentConfig, MenuBranchConfig, MenuNodeConfig } from "./App.types";
import { PageBuildProgress } from "./PageComponents/BuildProgress/BuildProgress";
import { PageTextField } from "./PageComponents/Field/Field";
import { PageFrameworkMenu } from "./PageComponents/FrameworkMenu/FrameworkMenu";
import { PageLayer } from "./PageComponents/Layer/Layer";
import { PageNavLink } from "./PageComponents/NavLink/NavLink";
import { PageNavSettings } from "./PageComponents/NavSettings/NavSettings";
import { DEFAULT_VIEWPORT_ANCHOR } from "./PageComponents/NavSettings/NavSettings.const";
import type { ViewportAnchor } from "./PageComponents/NavSettings/NavSettings.types";
import { PagePreview } from "./PageComponents/Preview/Preview";
import { PageSidebarToggle } from "./PageComponents/SidebarToggle/SidebarToggle";
import { PageViewTabs } from "./PageComponents/ViewTabs/ViewTabs";
import type { PageViewKey } from "./PageComponents/ViewTabs/ViewTabs.types";
import type { GallerySection } from "./Pages/GalleryPage/GalleryPage.types";
import { renderPageHighlightFloater } from "./StyledComponents/GlideFloater/GlideFloater";
import { useLayerClass } from "./StyledComponents/Layer/Layer.context";
import { PageTooltipContent } from "./StyledComponents/TooltipContent/TooltipContent";
import { PageTreeNodeContent } from "./StyledComponents/TreeNodeContent/TreeNodeContent";

const PageDocsView = lazy(() =>
    import("./PageComponents/DocsView/DocsView").then((module) => ({ default: module.PageDocsView })),
);

const PageAboutPage = lazy(() =>
    import("./Pages/AboutPage/AboutPage").then((module) => ({ default: module.AboutPage })),
);

const PageGettingStartedPage = lazy(() =>
    import("./Pages/GettingStartedPage/GettingStartedPage").then((module) => ({ default: module.GettingStartedPage })),
);

const PageGalleryPage = lazy(() =>
    import("./Pages/GalleryPage/GalleryPage").then((module) => ({ default: module.GalleryPage })),
);

const PassThroughPage = (props: RouteSectionProps) => <>{props.children}</>;

const GETTING_STARTED_ROUTE = "/getting-started";
const GALLERY_ROUTE = "/gallery";
const GALLERY_NAME_SEPARATOR = " / ";
const NAV_PREVIEW_PLACEMENT: AnchorPlacement = { x: "right-out", y: "center" };
const NAV_PREVIEW_OFFSET = { x: 10, y: 0 };
const NAV_PREVIEW_ARROW = "triangle";

const getIsBranchConfig = (node: MenuNodeConfig): node is MenuBranchConfig => "children" in node;

const componentToRouteName = (name: string) => `/${StringUtils.camelToKebabCase(name)}`;

const getIsMenuFaded = (phase: SidebarPhase) => phase === "collapsing" || phase === "collapsed";

const flattenConfigs = (nodes: MenuNodeConfig[]): ComponentConfig[] =>
    nodes.flatMap((node) => (getIsBranchConfig(node) ? flattenConfigs(node.children) : [node]));

const toPageHref = (config: ComponentConfig, view: PageViewKey) =>
    toPageViewRoute(componentToRouteName(config.name), config.component === undefined ? "docs" : view);

const getHasPreview = (config: ComponentConfig): config is Required<ComponentConfig> =>
    config.component !== undefined && !PREVIEW_EXCLUDED_PAGES.includes(config.name);

const toPreviewTooltipDefs = (component: () => JSX.Element): InteractionTooltipDefs<TreeNodeRenderProps> => ({
    placement: NAV_PREVIEW_PLACEMENT,
    offset: NAV_PREVIEW_OFFSET,
    renderContent: (getVisibilityTarget, getTransitionDurationMs, _getPlacement, _getFlags, getArrowAim) => (
        <PageTooltipContent
            visibilityTarget={getVisibilityTarget}
            transitionDurationMs={getTransitionDurationMs}
            arrow={NAV_PREVIEW_ARROW}
            arrowAim={getArrowAim}
            isWide={true}
        >
            <div class={styles.navPreview} aria-hidden="true" inert>
                <PageLayer level={1}>
                    <PagePreview component={component} />
                </PageLayer>
            </div>
        </PageTooltipContent>
    ),
});

const toTreeNode =
    (view: PageViewKey) =>
    (node: MenuNodeConfig): TreeNode<MenuNodeConfig> =>
        getIsBranchConfig(node)
            ? { value: node, children: node.children.map(toTreeNode(view)) }
            : {
                  value: node,
                  href: toPageHref(node, view),
                  tooltipDefs: getHasPreview(node) ? toPreviewTooltipDefs(node.component) : undefined,
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

const collectBranchValues = (nodes: TreeNode<MenuNodeConfig>[]): MenuNodeConfig[] =>
    nodes.flatMap((node) => (node.children ? [node.value, ...collectBranchValues(node.children)] : []));

const VISIBLE_MENU_CONFIGS = MENU_CONFIGS.filter((category) => !category.hidden);

const MENU_NODES_BY_VIEW = Object.fromEntries(
    PAGE_VIEW_KEYS.map((view) => [view, VISIBLE_MENU_CONFIGS.map(toTreeNode(view))]),
) as Record<PageViewKey, TreeNode<MenuNodeConfig>[]>;

const COMPONENT_CONFIGS = flattenConfigs(MENU_CONFIGS);

const ANCESTORS_BY_CONFIG = new Map<MenuNodeConfig, MenuBranchConfig[]>();

collectAncestors(VISIBLE_MENU_CONFIGS, [], ANCESTORS_BY_CONFIG);

const toGalleryName = (config: ComponentConfig) =>
    [...(ANCESTORS_BY_CONFIG.get(config) ?? []).slice(1), config].map((node) => node.name).join(GALLERY_NAME_SEPARATOR);

const GALLERY_SECTIONS: GallerySection[] = VISIBLE_MENU_CONFIGS.map((category) => ({
    name: category.name,
    description: category.description,
    items: flattenConfigs([category]).flatMap((config) =>
        getHasPreview(config)
            ? [{ name: toGalleryName(config), href: componentToRouteName(config.name), component: config.component }]
            : [],
    ),
})).filter((section) => section.items.length > 0);

const COMPONENT_CONFIGS_BY_ROUTE = Object.fromEntries(
    COMPONENT_CONFIGS.map((config) => [componentToRouteName(config.name), config]),
);

const CONFIGS_BY_KEY = new Map(COMPONENT_CONFIGS.map((config) => [config.name.toLowerCase(), config]));

const listNames = (names: string[]) =>
    LIST_PAGELESS_COMPONENTS ? names : names.filter((name) => CONFIGS_BY_KEY.has(name.toLowerCase()));

const listDependencyNames = (names: DependencyNames): DependencyNames => ({
    abstracts: listNames(names.abstracts),
    generators: listNames(names.generators),
    primitives: listNames(names.primitives),
    components: listNames(names.components),
});

const DEPENDENCIES_BY_KEY = new Map(
    Object.entries(COMPONENT_DEPENDENCIES).map(([name, dependencies]) => [
        name.toLowerCase(),
        { uses: listDependencyNames(dependencies.uses), usedBy: listDependencyNames(dependencies.usedBy) },
    ]),
);

const computeDependencySummary = (names: DependencyNames) =>
    DEPENDENCY_GROUPS.filter((group) => names[group.key].length > 0)
        .map((group) => `${names[group.key].length} ${names[group.key].length === 1 ? group.singular : group.label}`)
        .join(" and ");

const PageDependencies = (props: { name: string; view: PageViewKey }) => {
    const [getExpandedSections, setExpandedSections] = createSignal<string[]>([]);

    const getLayerClass = useLayerClass();

    const getDependencies = () => DEPENDENCIES_BY_KEY.get(props.name.toLowerCase());

    createEffect(
        on(
            () => props.name,
            () => setExpandedSections([]),
        ),
    );

    return (
        <div class={[styles.pageDependencies, getLayerClass()].join(" ")}>
            <Index each={DEPENDENCY_SECTIONS}>
                {(getSection) => {
                    const getSectionNames = () => getDependencies()?.[getSection().key] ?? EMPTY_DEPENDENCY_NAMES;

                    const expandedSignal: SignalPair<boolean> = [
                        () => getExpandedSections().includes(getSection().key),
                        (next) =>
                            setExpandedSections((previous) =>
                                next
                                    ? [...previous, getSection().key]
                                    : previous.filter((key) => key !== getSection().key),
                            ),
                    ];

                    return (
                        <Show when={DEPENDENCY_GROUPS.some((group) => getSectionNames()[group.key].length)}>
                            <span class={styles.dependencySectionLabel}>{getSection().label}</span>

                            <div class={styles.dependencyDisclosure}>
                                <Collapsible
                                    expanded={expandedSignal}
                                    sizing={"fill"}
                                    isPanelBuiltOnExpand={true}
                                    renderTrigger={(getFlags) => (
                                        <div
                                            class={styles.dependencySummary}
                                            classList={{
                                                [styles.isExpanded]: getFlags().isExpanded,
                                                [styles.isHovered]: getFlags().isHovered,
                                            }}
                                        >
                                            <span>{computeDependencySummary(getSectionNames())}</span>

                                            <span class={styles.dependencySummaryMarker} aria-hidden="true">
                                                {"\u25B6"}
                                            </span>
                                        </div>
                                    )}
                                    renderPanel={(getVisibilityTarget, getTransitionDurationMs) => (
                                        <div
                                            class={styles.dependencyGroups}
                                            style={{
                                                opacity: getVisibilityTarget(),
                                                transition: `opacity ${getTransitionDurationMs()}ms`,
                                            }}
                                        >
                                            <Index each={DEPENDENCY_GROUPS}>
                                                {(getGroup) => (
                                                    <Show when={getSectionNames()[getGroup().key].length}>
                                                        <div class={styles.dependencyGroup}>
                                                            <span class={styles.dependencyLabel}>
                                                                {getGroup().label}
                                                            </span>

                                                            <Index each={getSectionNames()[getGroup().key]}>
                                                                {(getName) => {
                                                                    const getPageConfig = () =>
                                                                        CONFIGS_BY_KEY.get(getName().toLowerCase());

                                                                    return (
                                                                        <Show
                                                                            when={getPageConfig()}
                                                                            fallback={
                                                                                <span class={styles.dependencyName}>
                                                                                    {getName()}
                                                                                </span>
                                                                            }
                                                                        >
                                                                            {(getFound) => (
                                                                                <A
                                                                                    class={styles.dependencyLink}
                                                                                    href={toPageHref(
                                                                                        getFound(),
                                                                                        props.view,
                                                                                    )}
                                                                                >
                                                                                    {getName()}
                                                                                </A>
                                                                            )}
                                                                        </Show>
                                                                    );
                                                                }}
                                                            </Index>
                                                        </div>
                                                    </Show>
                                                )}
                                            </Index>
                                        </div>
                                    )}
                                />
                            </div>
                        </Show>
                    );
                }}
            </Index>
        </div>
    );
};

export function AppContent(props: RouteSectionProps & { viewportAnchor: SignalPair<ViewportAnchor> }) {
    const [getSelectedConfig, setSelectedConfig] = createSignal<ComponentConfig>();
    const [getSearchTerm, setSearchTerm] = createSignal("");
    const showsDescriptionOnlySignal = createSignal(false);
    const pageViewSignal = createSignal<PageViewKey>(DEFAULT_PAGE_VIEW);
    const isAutoHiddenSignal = createSignal(false);
    const [getBrowseExpanded, setBrowseExpanded] = createSignal<MenuNodeConfig[]>(VISIBLE_MENU_CONFIGS);
    const [getSearchExpanded, setSearchExpanded] = createSignal<MenuNodeConfig[]>([]);

    const getIsAboutSelected = () => toRoutePath(props.location.pathname) === "/";

    const getIsGettingStartedSelected = () => toRoutePath(props.location.pathname) === GETTING_STARTED_ROUTE;

    const getIsGallerySelected = () => toRoutePath(props.location.pathname) === GALLERY_ROUTE;

    const getIsSearching = createMemo(() => getSearchTerm().trim().length > 0);

    const getVisibleNodes = createMemo(() => {
        const isSearching = getIsSearching();
        const showsDescriptionOnly = showsDescriptionOnlySignal[0]();
        const menuNodes = MENU_NODES_BY_VIEW[pageViewSignal[0]()];

        if (!isSearching && showsDescriptionOnly) return menuNodes;

        const searchTerm = getSearchTerm().trim().toLocaleLowerCase();
        const selectedConfig = getSelectedConfig();

        const getIsKept = (config: ComponentConfig) => {
            if (config === selectedConfig) return true;

            if (isSearching) return config.name.toLocaleLowerCase().includes(searchTerm);

            return showsDescriptionOnly || config.component !== undefined;
        };

        return menuNodes
            .map((node) => filterTreeNode(node, getIsKept))
            .filter((node): node is TreeNode<MenuNodeConfig> => node !== undefined);
    });

    createEffect(() => {
        if (!getIsSearching()) return;

        const branches = collectBranchValues(getVisibleNodes());

        setSearchExpanded(() => branches);
    });

    createEffect(on(() => props.location.pathname, restoreRootSlash));

    createEffect(() => {
        const pathName = toBaseRoute(toRoutePath(props.location.pathname));
        const config = COMPONENT_CONFIGS_BY_ROUTE[pathName];

        setSelectedConfig(() => config);

        if (!config) return;

        const ancestors = ANCESTORS_BY_CONFIG.get(config) ?? [];

        setBrowseExpanded((previous) => [...previous, ...ancestors.filter((ancestor) => !previous.includes(ancestor))]);
    });

    const expandedSignal: SignalPair<MenuNodeConfig[]> = [
        () => (getIsSearching() ? getSearchExpanded() : getBrowseExpanded()),
        (next) => (getIsSearching() ? setSearchExpanded(() => next) : setBrowseExpanded(() => next)),
    ];

    const selectedSignal: SignalPair<MenuNodeConfig | undefined> = [getSelectedConfig, () => undefined];

    const menuExpandedSignal: SignalPair<boolean> = [
        () => !isAutoHiddenSignal[0](),
        (isExpanded) => isAutoHiddenSignal[1](!isExpanded),
    ];

    return (
        <div class={styles.appFrame}>
            <Show when={IS_BUILD_PROGRESS_SHOWN}>
                <PageBuildProgress />
            </Show>

            <div class={styles.appContent}>
                <Sidebar
                    id={() => MENU_ID}
                    edge={() => MENU_EDGE}
                    collapsedSize={() => MENU_COLLAPSED_WIDTH}
                    expandedSize={() => MENU_EXPANDED_WIDTH}
                    isExpandedOnHover={isAutoHiddenSignal[0]}
                    expanded={menuExpandedSignal}
                    renderContent={(getPhase, getTransitionDurationMs) => (
                        <nav class={styles.leftMenu} aria-label={"Library"}>
                            <PageLayer level={1}>
                                <div class={styles.leftMenuContent}>
                                    <div class={styles.searchContainer}>
                                        <PageSidebarToggle
                                            sidebarId={() => MENU_ID}
                                            edge={() => MENU_EDGE}
                                            isExpanded={menuExpandedSignal[0]}
                                            ariaLabel={() =>
                                                menuExpandedSignal[0]() ? "Auto-hide the menu" : "Keep the menu open"
                                            }
                                            onToggle={() => menuExpandedSignal[1](!menuExpandedSignal[0]())}
                                        />

                                        <div
                                            class={styles.frameworkHeading}
                                            classList={{
                                                [styles.isFaded]: getIsMenuFaded(getPhase()),
                                                [styles.isHidden]: getPhase() === "collapsed",
                                            }}
                                            style={{ "transition-duration": `${getTransitionDurationMs()}ms` }}
                                        >
                                            <span class={styles.frameworkHeadingLabel}>{"ss-components for"}</span>

                                            <PageFrameworkMenu />
                                        </div>
                                    </div>

                                    <div class={styles.searchContainer}>
                                        <div class={styles.navSettingsBox}>
                                            <PageNavSettings
                                                showsDescriptionOnly={showsDescriptionOnlySignal}
                                                pageView={pageViewSignal}
                                                viewportAnchor={props.viewportAnchor}
                                            />
                                        </div>

                                        <div
                                            class={styles.searchFields}
                                            classList={{
                                                [styles.isFaded]: getIsMenuFaded(getPhase()),
                                                [styles.isHidden]: getPhase() === "collapsed",
                                            }}
                                            style={{ "transition-duration": `${getTransitionDurationMs()}ms` }}
                                        >
                                            <PageTextField
                                                value={getSearchTerm}
                                                width={() => SEARCH_FIELD_WIDTH}
                                                placeholder={"Search"}
                                                ariaLabel={"Search components"}
                                                onInput={setSearchTerm}
                                            />
                                        </div>
                                    </div>

                                    <div
                                        class={styles.aboutLink}
                                        classList={{
                                            [styles.isFaded]: getIsMenuFaded(getPhase()),
                                            [styles.isHidden]: getPhase() === "collapsed",
                                        }}
                                        style={{ "transition-duration": `${getTransitionDurationMs()}ms` }}
                                    >
                                        <PageNavLink href={"/"} isSelected={getIsAboutSelected()}>
                                            {"About"}
                                        </PageNavLink>

                                        <PageNavLink
                                            href={GETTING_STARTED_ROUTE}
                                            isSelected={getIsGettingStartedSelected()}
                                        >
                                            {"Getting started"}
                                        </PageNavLink>

                                        <PageNavLink href={GALLERY_ROUTE} isSelected={getIsGallerySelected()}>
                                            {"Gallery"}
                                        </PageNavLink>
                                    </div>

                                    <div
                                        class={styles.menuTree}
                                        classList={{
                                            [styles.isFaded]: getIsMenuFaded(getPhase()),
                                            [styles.isHidden]: getPhase() === "collapsed",
                                        }}
                                        style={{ "transition-duration": `${getTransitionDurationMs()}ms` }}
                                    >
                                        <Tree
                                            renderHighlightFloater={renderPageHighlightFloater}
                                            nodes={getVisibleNodes}
                                            value={selectedSignal}
                                            expanded={expandedSignal}
                                            ariaLabel={"Library"}
                                            linkComponent={A}
                                            computeCustomText={(node) => node.value.name}
                                            renderNode={(getNode, getRenderProps) => (
                                                <PageTreeNodeContent
                                                    isGliding
                                                    renderProps={getRenderProps}
                                                    hasExamples={() => {
                                                        const node = getNode().value;

                                                        return getIsBranchConfig(node) || node.component !== undefined;
                                                    }}
                                                    detail={() => {
                                                        const node = getNode().value;

                                                        return getIsBranchConfig(node)
                                                            ? `${flattenConfigs(node.children).length}`
                                                            : "";
                                                    }}
                                                >
                                                    {getNode().value.name}
                                                </PageTreeNodeContent>
                                            )}
                                        />
                                    </div>
                                </div>
                            </PageLayer>
                        </nav>
                    )}
                />

                <main class={styles.pageColumn}>
                    <Show when={getSelectedConfig()} fallback={props.children}>
                        {(getConfig) => (
                            <div class={styles.pageBody}>
                                <div class={styles.pageHeader}>
                                    <h1 class={styles.pageTitle}>{getConfig().name}</h1>

                                    <PageDependencies name={getConfig().name} view={pageViewSignal[0]()} />

                                    <PageViewTabs
                                        baseRoute={componentToRouteName(getConfig().name)}
                                        hasExamples={getConfig().component !== undefined}
                                    />
                                </div>

                                {props.children}
                            </div>
                        )}
                    </Show>
                </main>
            </div>
        </div>
    );
}

const SCREEN_HEIGHT = window.screen.height;

const getWindowInnerSize = () => ({ width: window.innerWidth, height: window.innerHeight });

export function App() {
    const [getWindowSize, setWindowSize] = createSignal<Size2d>(getWindowInnerSize());
    const viewportAnchorSignal = createSignal<ViewportAnchor>(DEFAULT_VIEWPORT_ANCHOR);

    const getViewportSize = createMemo(() => {
        const windowSize = getWindowSize();
        const anchor = viewportAnchorSignal[0]();

        if (anchor === "none") return windowSize;

        if (anchor !== "auto") {
            return {
                width: Math.round((anchor * FIXED_ANCHOR_RATIO.width) / FIXED_ANCHOR_RATIO.height),
                height: anchor,
            };
        }

        const ratio = windowSize.width / windowSize.height;
        const next =
            ratio >= 1
                ? { width: Math.round(SCREEN_HEIGHT * ratio), height: SCREEN_HEIGHT }
                : { width: SCREEN_HEIGHT, height: Math.round(SCREEN_HEIGHT / ratio) };

        return next;
    });

    const throttleResize = FunctionUtils.trailingThrottle(() => setWindowSize(getWindowInnerSize()), 10);

    onMount(() => {
        onCleanup(() => {
            window.removeEventListener("resize", throttleResize);
        });

        window.addEventListener("resize", throttleResize);
    });

    return (
        <div id="app" class={styles.appRoot}>
            <Router base={toRouterBase(import.meta.env.BASE_URL)}>
                <Route
                    path="/"
                    component={(props: RouteSectionProps) => (
                        <ViewportWrapper size={getViewportSize}>
                            <AppContent {...props} viewportAnchor={viewportAnchorSignal} />
                        </ViewportWrapper>
                    )}
                >
                    <Route path="/" component={PageAboutPage} />
                    <Route path={GETTING_STARTED_ROUTE} component={PageGettingStartedPage} />
                    <Route path={GALLERY_ROUTE} component={() => <PageGalleryPage sections={GALLERY_SECTIONS} />} />
                    {COMPONENT_CONFIGS.map((config) => (
                        <Route path={componentToRouteName(config.name)} component={PassThroughPage}>
                            <Route
                                path="/"
                                component={
                                    config.component ??
                                    (() => (
                                        <Navigate href={toPageViewRoute(componentToRouteName(config.name), "docs")} />
                                    ))
                                }
                            />
                            <Route
                                path="/docs"
                                component={() => <PageDocsView name={config.name} description={config.description} />}
                            />
                        </Route>
                    ))}
                </Route>
            </Router>
        </div>
    );
}
