import type { Tab } from "@thewaver/ss-components";

export const ROW_TAB_GAP = 10;

export const getTabId = (prefix: string, value: string) => `${prefix}-tab-${value.toLocaleLowerCase()}`;

export const getPanelId = (prefix: string, value: string) => `${prefix}-panel-${value.toLocaleLowerCase()}`;

const withIds = (prefix: string, tabs: Tab<string>[]): Tab<string>[] =>
    tabs.map((tab) => ({
        ...tab,
        id: getTabId(prefix, tab.value),
        panelId: getPanelId(prefix, tab.value),
    }));

export const ROW_TABS = withIds("row", [
    { value: "Render" },
    { value: "Source" },
    { value: "Metrics", isDisabled: true },
    { value: "Export" },
]);

export const AUTOMATIC_TABS = withIds("automatic", [
    { value: "Render" },
    { value: "Source" },
    { value: "Metrics", isDisabled: true },
    { value: "Export" },
]);

export const HOVER_PILL_TABS = withIds("hoverPill", [
    { value: "Render" },
    { value: "Source" },
    { value: "Metrics", isDisabled: true },
    { value: "Export" },
]);

export const REACHABLE_TABS = withIds("reachable", [
    { value: "Render" },
    { value: "Source" },
    { value: "Metrics", isDisabled: true, isReachableWhenDisabled: true },
    { value: "Export" },
]);

export const RIGHT_TO_LEFT_TABS = withIds("rtl", [
    { value: "Render" },
    { value: "Source" },
    { value: "Metrics", isDisabled: true },
    { value: "Export" },
]);

export const SWITCHED_DIRECTION_TABS = withIds("switchedDirection", [
    { value: "Render" },
    { value: "Source" },
    { value: "Metrics", isDisabled: true },
    { value: "Export" },
]);

export const COLUMN_TABS = withIds("column", [
    { value: "Overview" },
    { value: "Details" },
    { value: "History", isDisabled: true },
    { value: "Settings" },
]);

export const HONEYCOMB_TABS = withIds("honeycomb", [
    { value: "Overview" },
    { value: "Layers" },
    { value: "Assets", isDisabled: true },
    { value: "Timing" },
    { value: "Output" },
    { value: "Notes" },
]);

export const LINK_TABS: Tab<string>[] = [
    { value: "Docs", href: "#tabs-docs" },
    { value: "Guides", href: "#tabs-guides" },
    { value: "Blog", href: "#tabs-blog" },
];

export const CLEARABLE_TABS = withIds("clearable", [{ value: "One" }, { value: "Two" }, { value: "Three" }]);

export const DISABLED_TABS = withIds("disabled", [
    { value: "Draft", isDisabled: true },
    { value: "Review", isDisabled: true },
    { value: "Publish", isDisabled: true },
]);

export const PANEL_BODIES: Record<string, string> = {
    Layers: "A honeycomb is a tab list too, and this is the panel behind one cell of it.",
    Assets: "Disabled, so the walk goes round it rather than through it.",
    Timing: "The keys still walk the list in order, whatever shape the list is in.",
    Output: "The floater sits behind the cell the layout put it on.",
    Notes: "The last cell of the second row, which is where the stagger shows.",
    Render: "The component itself, drawn with whatever the props panel currently says.",
    Source: "The code behind it, which is a second panel over the same tab list.",
    Metrics: "Disabled, so the keyboard walks past it and a click does nothing.",
    Export: "A copy of the source, ready to paste elsewhere.",
    Overview: "What the section is for, in one paragraph.",
    Details: "The long version, which is why this list is a column rather than a row.",
    History: "Disabled, so nothing reaches this panel.",
    Settings: "The knobs, which nobody reads until something goes wrong.",
    One: "The first of three, and the one the list starts on.",
    Two: "Clearing the selection leaves the strip with no panel at all.",
    Three: "Choosing any tab again brings its panel back.",
    Draft: "Disabled, so nothing can reach this panel; it is wired so that enabling the tab would not leave it unpaired.",
    Review: "Disabled as well, and wired for the same reason.",
    Publish: "Disabled as well, and wired for the same reason.",
};

export const EXAMPLE_NAMES = {
    row: "A row of tabs",
    column: "A column of tabs",
    automatic: "Arrows that select as they move",
    hoverPill: "A pill that follows the pointer",
    reachable: "A disabled tab the arrows still reach",
    rightToLeft: "Tabs in a right-to-left box",
    switchedDirection: "A direction switched while on screen",
    honeycomb: "A honeycomb of tabs",
    links: "Tabs that are links",
    linkComponent: "Links through a component",
    clearable: "A selection that can be cleared",
    disabled: "Every tab disabled",
};

export const EXAMPLES_ROOT = "/src/App/Pages/TabsPage/Examples";
