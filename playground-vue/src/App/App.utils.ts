import COMPONENT_DEPENDENCIES from "virtual:component-dependencies";
import type { DependencyNames } from "virtual:component-dependencies";
import { type Component, defineAsyncComponent, h } from "vue";

import type {
    AnchorPlacement,
    InteractionTooltipDefs,
    SidebarPhase,
    TreeNode,
    TreeNodeRenderProps,
} from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/App.css";
import { PAGE_VIEW_KEYS, toPageViewRoute } from "@thewaver/ss-playground/App/PageComponents/ViewTabs/ViewTabs.const";
import { StringUtils } from "@thewaver/ss-utils";

import { DEPENDENCY_GROUPS, LIST_PAGELESS_COMPONENTS, MENU_CONFIGS, PREVIEW_EXCLUDED_PAGES } from "./App.const";
import type { ComponentConfig, MenuBranchConfig, MenuNodeConfig } from "./App.types";
import PageLayer from "./PageComponents/Layer/Layer.vue";
import PagePreview from "./PageComponents/Preview/Preview.vue";
import type { PageViewKey } from "./PageComponents/ViewTabs/ViewTabs.types";
import type { GallerySection } from "./Pages/GalleryPage/GalleryPage.types";
import PageTooltipContent from "./StyledComponents/TooltipContent/TooltipContent.vue";

export namespace AppUtils {
    export const getIsBranchConfig = (node: MenuNodeConfig): node is MenuBranchConfig => "children" in node;

    export const componentToRouteName = (name: string) => `/${StringUtils.camelToKebabCase(name)}`;

    export const getIsMenuFaded = (phase: SidebarPhase) => phase === "collapsing" || phase === "collapsed";

    export const flattenConfigs = (nodes: MenuNodeConfig[]): ComponentConfig[] =>
        nodes.flatMap((node) => (getIsBranchConfig(node) ? flattenConfigs(node.children) : [node]));

    export const toPageHref = (config: ComponentConfig, view: PageViewKey) =>
        toPageViewRoute(componentToRouteName(config.name), config.component === undefined ? "docs" : view);

    const GALLERY_NAME_SEPARATOR = " / ";
    const NAV_PREVIEW_PLACEMENT: AnchorPlacement = { x: "right-out", y: "center" };
    const NAV_PREVIEW_OFFSET = { x: 10, y: 0 };
    const NAV_PREVIEW_ARROW = "triangle";

    type PreviewableConfig = ComponentConfig & Required<Pick<ComponentConfig, "component">>;

    const PREVIEW_COMPONENTS = new Map<PreviewableConfig, Component>();

    const getHasPreview = (config: ComponentConfig): config is PreviewableConfig =>
        config.component !== undefined && !PREVIEW_EXCLUDED_PAGES.includes(config.name);

    const getPreviewComponent = (config: PreviewableConfig) => {
        const cached = PREVIEW_COMPONENTS.get(config);

        if (cached) return cached;

        const component = defineAsyncComponent(config.component);

        PREVIEW_COMPONENTS.set(config, component);

        return component;
    };

    const toPreviewTooltipDefs = (config: PreviewableConfig): InteractionTooltipDefs<TreeNodeRenderProps> => ({
        placement: NAV_PREVIEW_PLACEMENT,
        offset: NAV_PREVIEW_OFFSET,
        renderContent: ({ visibilityTarget, transitionDurationMs, arrowAim }) =>
            h(
                PageTooltipContent,
                { visibilityTarget, transitionDurationMs, arrow: NAV_PREVIEW_ARROW, arrowAim, isWide: true },
                () =>
                    h("div", { "class": styles.navPreview, "aria-hidden": "true", "inert": true }, [
                        h(PageLayer, { level: 1 }, () => h(PagePreview, { component: getPreviewComponent(config) })),
                    ]),
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
                      tooltipDefs: getHasPreview(node) ? toPreviewTooltipDefs(node) : undefined,
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

    export const filterTreeNode = (
        node: TreeNode<MenuNodeConfig>,
        getIsKept: (config: ComponentConfig) => boolean,
    ): TreeNode<MenuNodeConfig> | undefined => {
        if (!node.children) return getIsKept(node.value as ComponentConfig) ? node : undefined;

        const children = node.children
            .map((child) => filterTreeNode(child, getIsKept))
            .filter((child): child is TreeNode<MenuNodeConfig> => child !== undefined);

        return children.length > 0 ? { ...node, children } : undefined;
    };

    export const collectBranchValues = (nodes: TreeNode<MenuNodeConfig>[]): MenuNodeConfig[] =>
        nodes.flatMap((node) => (node.children ? [node.value, ...collectBranchValues(node.children)] : []));

    export const VISIBLE_MENU_CONFIGS = MENU_CONFIGS.filter((category) => !category.hidden);

    export const MENU_NODES_BY_VIEW = Object.fromEntries(
        PAGE_VIEW_KEYS.map((view) => [view, VISIBLE_MENU_CONFIGS.map(toTreeNode(view))]),
    ) as Record<PageViewKey, TreeNode<MenuNodeConfig>[]>;

    export const COMPONENT_CONFIGS = flattenConfigs(MENU_CONFIGS);

    export const ANCESTORS_BY_CONFIG = new Map<MenuNodeConfig, MenuBranchConfig[]>();

    collectAncestors(VISIBLE_MENU_CONFIGS, [], ANCESTORS_BY_CONFIG);

    const toGalleryName = (config: ComponentConfig) =>
        [...(ANCESTORS_BY_CONFIG.get(config) ?? []).slice(1), config]
            .map((node) => node.name)
            .join(GALLERY_NAME_SEPARATOR);

    export const GALLERY_SECTIONS: GallerySection[] = VISIBLE_MENU_CONFIGS.map((category) => ({
        name: category.name,
        description: category.description,
        items: flattenConfigs([category]).flatMap((config) =>
            getHasPreview(config)
                ? [
                      {
                          name: toGalleryName(config),
                          href: componentToRouteName(config.name),
                          component: getPreviewComponent(config),
                      },
                  ]
                : [],
        ),
    })).filter((section) => section.items.length > 0);

    export const COMPONENT_CONFIGS_BY_ROUTE: Record<string, ComponentConfig | undefined> = Object.fromEntries(
        COMPONENT_CONFIGS.map((config) => [componentToRouteName(config.name), config]),
    );

    export const CONFIGS_BY_KEY = new Map(COMPONENT_CONFIGS.map((config) => [config.name.toLowerCase(), config]));

    const listNames = (names: string[]) =>
        LIST_PAGELESS_COMPONENTS ? names : names.filter((name) => CONFIGS_BY_KEY.has(name.toLowerCase()));

    const listDependencyNames = (names: DependencyNames): DependencyNames => ({
        abstracts: listNames(names.abstracts),
        generators: listNames(names.generators),
        primitives: listNames(names.primitives),
        components: listNames(names.components),
    });

    export const DEPENDENCIES_BY_KEY = new Map(
        Object.entries(COMPONENT_DEPENDENCIES).map(([name, dependencies]) => [
            name.toLowerCase(),
            { uses: listDependencyNames(dependencies.uses), usedBy: listDependencyNames(dependencies.usedBy) },
        ]),
    );

    export const computeDependencySummary = (names: DependencyNames) =>
        DEPENDENCY_GROUPS.filter((group) => names[group.key].length > 0)
            .map(
                (group) => `${names[group.key].length} ${names[group.key].length === 1 ? group.singular : group.label}`,
            )
            .join(" and ");
}
