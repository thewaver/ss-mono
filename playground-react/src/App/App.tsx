import type { ReactNode } from "react";
import { Fragment, Suspense, lazy, useEffect, useMemo, useState } from "react";
import { BrowserRouter, Link, Navigate, Outlet, Route, Routes, useLocation } from "react-router";
import COMPONENT_DEPENDENCIES from "virtual:component-dependencies";
import type { DependencyNames } from "virtual:component-dependencies";

import { Collapsible, Sidebar, Tree, ViewportWrapper } from "@thewaver/ss-components-react";
import type {
    AnchorPlacement,
    InteractionTooltipDefs,
    SidebarPhase,
    TreeNode,
    TreeNodeRenderProps,
} from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/App.css";
import { IS_BUILD_PROGRESS_SHOWN } from "@thewaver/ss-playground/App/PageComponents/BuildProgress/BuildProgress.utils";
import {
    restoreRootSlash,
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
import { PageRouterLink } from "./PageComponents/RouterLink/RouterLink";
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

const toPreviewTooltipDefs = (component: () => ReactNode): InteractionTooltipDefs<TreeNodeRenderProps> => ({
    placement: NAV_PREVIEW_PLACEMENT,
    offset: NAV_PREVIEW_OFFSET,
    renderContent: (visibilityTarget, transitionDurationMs, _placement, _flags, arrowAim) => (
        <PageTooltipContent
            visibilityTarget={visibilityTarget}
            transitionDurationMs={transitionDurationMs}
            arrow={NAV_PREVIEW_ARROW}
            arrowAim={arrowAim}
            isWide={true}
        >
            <div className={styles.navPreview} aria-hidden="true" inert={true}>
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

const COMPONENT_CONFIGS_BY_ROUTE: Record<string, ComponentConfig | undefined> = Object.fromEntries(
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
    const [expandedSections, setExpandedSections] = useState<string[]>([]);
    const [previousName, setPreviousName] = useState(props.name);

    if (previousName !== props.name) {
        setPreviousName(props.name);
        setExpandedSections([]);
    }

    const layerClass = useLayerClass();

    const dependencies = DEPENDENCIES_BY_KEY.get(props.name.toLowerCase());

    return (
        <div className={[styles.pageDependencies, layerClass].join(" ")}>
            {DEPENDENCY_SECTIONS.map((section) => {
                const sectionNames = dependencies?.[section.key] ?? EMPTY_DEPENDENCY_NAMES;

                if (!DEPENDENCY_GROUPS.some((group) => sectionNames[group.key].length)) return null;

                const expandedState = [
                    expandedSections.includes(section.key),
                    (next: boolean) =>
                        setExpandedSections((previous) =>
                            next ? [...previous, section.key] : previous.filter((key) => key !== section.key),
                        ),
                ] as const;

                return (
                    <Fragment key={section.key}>
                        <span className={styles.dependencySectionLabel}>{section.label}</span>

                        <div className={styles.dependencyDisclosure}>
                            <Collapsible
                                expanded={expandedState}
                                sizing={"fill"}
                                isPanelBuiltOnExpand={true}
                                renderTrigger={(flags) => (
                                    <div
                                        className={[
                                            styles.dependencySummary,
                                            flags.isExpanded && styles.isExpanded,
                                            flags.isHovered && styles.isHovered,
                                        ]
                                            .filter(Boolean)
                                            .join(" ")}
                                    >
                                        <span>{computeDependencySummary(sectionNames)}</span>

                                        <span className={styles.dependencySummaryMarker} aria-hidden="true">
                                            {"▶"}
                                        </span>
                                    </div>
                                )}
                                renderPanel={(visibilityTarget, transitionDurationMs) => (
                                    <div
                                        className={styles.dependencyGroups}
                                        style={{
                                            opacity: visibilityTarget,
                                            transition: `opacity ${transitionDurationMs}ms`,
                                        }}
                                    >
                                        {DEPENDENCY_GROUPS.map((group) =>
                                            sectionNames[group.key].length ? (
                                                <div key={group.key} className={styles.dependencyGroup}>
                                                    <span className={styles.dependencyLabel}>{group.label}</span>

                                                    {sectionNames[group.key].map((name) => {
                                                        const pageConfig = CONFIGS_BY_KEY.get(name.toLowerCase());

                                                        return pageConfig ? (
                                                            <Link
                                                                key={name}
                                                                className={styles.dependencyLink}
                                                                to={toPageHref(pageConfig, props.view)}
                                                            >
                                                                {name}
                                                            </Link>
                                                        ) : (
                                                            <span key={name} className={styles.dependencyName}>
                                                                {name}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            ) : null,
                                        )}
                                    </div>
                                )}
                            />
                        </div>
                    </Fragment>
                );
            })}
        </div>
    );
};

export function AppContent(props: { viewportAnchor: readonly [ViewportAnchor, (value: ViewportAnchor) => void] }) {
    const location = useLocation();

    const [searchTerm, setSearchTerm] = useState("");
    const showsDescriptionOnlyState = useState(false);
    const pageViewState = useState<PageViewKey>(DEFAULT_PAGE_VIEW);
    const [isAutoHidden, setIsAutoHidden] = useState(false);
    const [browseExpanded, setBrowseExpanded] = useState<MenuNodeConfig[]>(VISIBLE_MENU_CONFIGS);
    const [searchExpanded, setSearchExpanded] = useState<MenuNodeConfig[]>([]);

    const selectedConfig = COMPONENT_CONFIGS_BY_ROUTE[toBaseRoute(location.pathname)];

    const isAboutSelected = location.pathname === "/";
    const isGettingStartedSelected = location.pathname === GETTING_STARTED_ROUTE;
    const isGallerySelected = location.pathname === GALLERY_ROUTE;

    useEffect(restoreRootSlash, [location.pathname]);

    const isSearching = searchTerm.trim().length > 0;
    const showsDescriptionOnly = showsDescriptionOnlyState[0];
    const pageView = pageViewState[0];

    const visibleNodes = useMemo(() => {
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
    }, [isSearching, showsDescriptionOnly, pageView, searchTerm, selectedConfig]);

    const [previousSearchNodes, setPreviousSearchNodes] = useState<TreeNode<MenuNodeConfig>[]>();
    const searchNodes = isSearching ? visibleNodes : undefined;

    if (previousSearchNodes !== searchNodes) {
        setPreviousSearchNodes(searchNodes);

        if (searchNodes) setSearchExpanded(collectBranchValues(searchNodes));
    }

    const [previousSelectedConfig, setPreviousSelectedConfig] = useState<ComponentConfig>();

    if (previousSelectedConfig !== selectedConfig) {
        setPreviousSelectedConfig(selectedConfig);

        const ancestors = selectedConfig ? (ANCESTORS_BY_CONFIG.get(selectedConfig) ?? []) : [];

        if (ancestors.length > 0) {
            setBrowseExpanded((previous) => [
                ...previous,
                ...ancestors.filter((ancestor) => !previous.includes(ancestor)),
            ]);
        }
    }

    const expandedState = [
        isSearching ? searchExpanded : browseExpanded,
        (next: MenuNodeConfig[]) => (isSearching ? setSearchExpanded(next) : setBrowseExpanded(next)),
    ] as const;

    const selectedState = [selectedConfig as MenuNodeConfig | undefined, () => undefined] as const;

    const isMenuExpanded = !isAutoHidden;

    const menuExpandedState = [isMenuExpanded, (isExpanded: boolean) => setIsAutoHidden(!isExpanded)] as const;

    return (
        <div className={styles.appFrame}>
            {IS_BUILD_PROGRESS_SHOWN && <PageBuildProgress />}

            <div className={styles.appContent}>
                <Sidebar
                    id={MENU_ID}
                    edge={MENU_EDGE}
                    collapsedSize={MENU_COLLAPSED_WIDTH}
                    expandedSize={MENU_EXPANDED_WIDTH}
                    isExpandedOnHover={isAutoHidden}
                    expanded={menuExpandedState}
                    renderContent={(phase, transitionDurationMs) => (
                        <nav className={styles.leftMenu} aria-label={"Library"}>
                            <PageLayer level={1}>
                                <div className={styles.leftMenuContent}>
                                    <div className={styles.searchContainer}>
                                        <PageSidebarToggle
                                            sidebarId={MENU_ID}
                                            edge={MENU_EDGE}
                                            isExpanded={isMenuExpanded}
                                            ariaLabel={isMenuExpanded ? "Auto-hide the menu" : "Keep the menu open"}
                                            onToggle={() => menuExpandedState[1](!isMenuExpanded)}
                                        />

                                        <div
                                            className={[
                                                styles.frameworkHeading,
                                                getIsMenuFaded(phase) && styles.isFaded,
                                                phase === "collapsed" && styles.isHidden,
                                            ]
                                                .filter(Boolean)
                                                .join(" ")}
                                            style={{ transitionDuration: `${transitionDurationMs}ms` }}
                                        >
                                            <span className={styles.frameworkHeadingLabel}>{"ss-components for"}</span>

                                            <PageFrameworkMenu />
                                        </div>
                                    </div>

                                    <div className={styles.searchContainer}>
                                        <div className={styles.navSettingsBox}>
                                            <PageNavSettings
                                                showsDescriptionOnly={showsDescriptionOnlyState}
                                                pageView={pageViewState}
                                                viewportAnchor={props.viewportAnchor}
                                            />
                                        </div>

                                        <div
                                            className={[
                                                styles.searchFields,
                                                getIsMenuFaded(phase) && styles.isFaded,
                                                phase === "collapsed" && styles.isHidden,
                                            ]
                                                .filter(Boolean)
                                                .join(" ")}
                                            style={{ transitionDuration: `${transitionDurationMs}ms` }}
                                        >
                                            <PageTextField
                                                value={searchTerm}
                                                width={SEARCH_FIELD_WIDTH}
                                                placeholder={"Search"}
                                                ariaLabel={"Search components"}
                                                onInput={setSearchTerm}
                                            />
                                        </div>
                                    </div>

                                    <div
                                        className={[
                                            styles.aboutLink,
                                            getIsMenuFaded(phase) && styles.isFaded,
                                            phase === "collapsed" && styles.isHidden,
                                        ]
                                            .filter(Boolean)
                                            .join(" ")}
                                        style={{ transitionDuration: `${transitionDurationMs}ms` }}
                                    >
                                        <PageNavLink href={"/"} isSelected={isAboutSelected}>
                                            {"About"}
                                        </PageNavLink>

                                        <PageNavLink href={GETTING_STARTED_ROUTE} isSelected={isGettingStartedSelected}>
                                            {"Getting started"}
                                        </PageNavLink>

                                        <PageNavLink href={GALLERY_ROUTE} isSelected={isGallerySelected}>
                                            {"Gallery"}
                                        </PageNavLink>
                                    </div>

                                    <div
                                        className={[
                                            styles.menuTree,
                                            getIsMenuFaded(phase) && styles.isFaded,
                                            phase === "collapsed" && styles.isHidden,
                                        ]
                                            .filter(Boolean)
                                            .join(" ")}
                                        style={{ transitionDuration: `${transitionDurationMs}ms` }}
                                    >
                                        <Tree
                                            renderHighlightFloater={renderPageHighlightFloater}
                                            nodes={visibleNodes}
                                            value={selectedState}
                                            expanded={expandedState}
                                            ariaLabel={"Library"}
                                            linkComponent={PageRouterLink}
                                            computeCustomText={(node) => node.value.name}
                                            renderNode={(node, renderProps) => (
                                                <PageTreeNodeContent
                                                    isGliding
                                                    renderProps={renderProps}
                                                    hasExamples={
                                                        getIsBranchConfig(node.value) ||
                                                        node.value.component !== undefined
                                                    }
                                                    detail={
                                                        getIsBranchConfig(node.value)
                                                            ? `${flattenConfigs(node.value.children).length}`
                                                            : ""
                                                    }
                                                >
                                                    {node.value.name}
                                                </PageTreeNodeContent>
                                            )}
                                        />
                                    </div>
                                </div>
                            </PageLayer>
                        </nav>
                    )}
                />

                <main className={styles.pageColumn}>
                    {selectedConfig ? (
                        <div className={styles.pageBody}>
                            <div className={styles.pageHeader}>
                                <h1 className={styles.pageTitle}>{selectedConfig.name}</h1>

                                <PageDependencies name={selectedConfig.name} view={pageView} />

                                <PageViewTabs
                                    baseRoute={componentToRouteName(selectedConfig.name)}
                                    hasExamples={selectedConfig.component !== undefined}
                                />
                            </div>

                            <Suspense>
                                <Outlet />
                            </Suspense>
                        </div>
                    ) : (
                        <Suspense>
                            <Outlet />
                        </Suspense>
                    )}
                </main>
            </div>
        </div>
    );
}

const SCREEN_HEIGHT = window.screen.height;

const getWindowInnerSize = () => ({ width: window.innerWidth, height: window.innerHeight });

export function App() {
    const [windowSize, setWindowSize] = useState<Size2d>(getWindowInnerSize);
    const viewportAnchorState = useState<ViewportAnchor>(DEFAULT_VIEWPORT_ANCHOR);

    const anchor = viewportAnchorState[0];

    const viewportSize = useMemo(() => {
        if (anchor === "none") return windowSize;

        if (anchor !== "auto") {
            return {
                width: Math.round((anchor * FIXED_ANCHOR_RATIO.width) / FIXED_ANCHOR_RATIO.height),
                height: anchor,
            };
        }

        const ratio = windowSize.width / windowSize.height;

        return ratio >= 1
            ? { width: Math.round(SCREEN_HEIGHT * ratio), height: SCREEN_HEIGHT }
            : { width: SCREEN_HEIGHT, height: Math.round(SCREEN_HEIGHT / ratio) };
    }, [windowSize, anchor]);

    useEffect(() => {
        const throttleResize = FunctionUtils.trailingThrottle(() => setWindowSize(getWindowInnerSize()), 10);

        window.addEventListener("resize", throttleResize);

        return () => {
            window.removeEventListener("resize", throttleResize);
            throttleResize.cancel();
        };
    }, []);

    return (
        <div id="app" className={styles.appRoot}>
            <BrowserRouter basename={toRouterBase(import.meta.env.BASE_URL)}>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <ViewportWrapper size={viewportSize}>
                                <AppContent viewportAnchor={viewportAnchorState} />
                            </ViewportWrapper>
                        }
                    >
                        <Route index={true} element={<PageAboutPage />} />
                        <Route path={GETTING_STARTED_ROUTE} element={<PageGettingStartedPage />} />
                        <Route path={GALLERY_ROUTE} element={<PageGalleryPage sections={GALLERY_SECTIONS} />} />
                        {COMPONENT_CONFIGS.map((config) => (
                            <Route key={config.name} path={componentToRouteName(config.name)}>
                                <Route
                                    index={true}
                                    element={
                                        config.component ? (
                                            config.component()
                                        ) : (
                                            <Navigate
                                                to={toPageViewRoute(componentToRouteName(config.name), "docs")}
                                                replace={true}
                                            />
                                        )
                                    }
                                />
                                <Route
                                    path={"docs"}
                                    element={<PageDocsView name={config.name} description={config.description} />}
                                />
                            </Route>
                        ))}
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}
