import { useState } from "react";

import { type InteractionFlags, PlacementLayoutUtils, type Tab } from "@thewaver/ss-components";

import { type TabLinkProps, TabPanel, Tabs, type TabsProps } from "../../src";

const TAB_GAP = 10;
const CLEARABLE_TRANSITION_DURATION_MS = 600;
const HONEYCOMB_LAYOUT = PlacementLayoutUtils.createHoneycomb({ perRow: 3, gapRatio: 0 });
const HONEYCOMB_WIDTH = 294;

const tabId = (prefix: string, value: string) => `${prefix}-tab-${value.toLowerCase()}`;
const panelId = (prefix: string, value: string) => `${prefix}-panel-${value.toLowerCase()}`;

const withIds = (prefix: string, tabs: Tab<string>[]): Tab<string>[] =>
    tabs.map((tab) => ({ ...tab, id: tabId(prefix, tab.value), panelId: panelId(prefix, tab.value) }));

const rowTabs = (prefix: string, isReachable = false) =>
    withIds(prefix, [
        { value: "Render" },
        { value: "Source" },
        { value: "Metrics", isDisabled: true, isReachableWhenDisabled: isReachable },
        { value: "Export" },
    ]);

const COLUMN_TABS = withIds("column", [
    { value: "Overview" },
    { value: "Details" },
    { value: "History", isDisabled: true },
    { value: "Settings" },
]);

const HONEYCOMB_TABS = withIds("honeycomb", [
    { value: "Overview" },
    { value: "Layers" },
    { value: "Assets", isDisabled: true },
    { value: "Timing" },
    { value: "Output" },
    { value: "Notes" },
]);

const LINK_TABS: Tab<string>[] = [
    { value: "Docs", href: "#tabs-docs" },
    { value: "Guides", href: "#tabs-guides" },
    { value: "Blog", href: "#tabs-blog" },
];

const CLEARABLE_TABS: Tab<string>[] = [{ value: "One" }, { value: "Two" }, { value: "Three" }];

const DISABLED_TABS: Tab<string>[] = [
    { value: "Draft", isDisabled: true },
    { value: "Review", isDisabled: true },
    { value: "Publish", isDisabled: true },
];

const Gutter = () => <div data-gutter style={{ width: "100%", height: "100%", borderBottom: "1px solid #999" }} />;

const Floater = ({
    visibilityTarget,
    transitionDurationMs,
}: {
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
}) => (
    <div
        data-floater
        style={{
            width: "100%",
            height: "100%",
            background: "#cde",
            transform: visibilityTarget === 1 ? "scaleX(1)" : "scaleX(0)",
            transition: `transform ${transitionDurationMs}ms`,
        }}
    />
);

const TabLabel = ({ tab, flags }: { tab: Tab<string>; flags: InteractionFlags }) => (
    <span style={{ display: "block", padding: "8px 12px", opacity: flags.isDisabled ? 0.5 : 1 }}>{tab.value}</span>
);

const HexCell = ({ tab }: { tab: Tab<string> }) => (
    <span style={{ display: "grid", placeItems: "center", width: "100%", height: "100%", background: "#eee" }}>
        {tab.value}
    </span>
);

const LinkComponent = (props: TabLinkProps) => <a {...props} data-link-component />;

const FreshRefLinkComponent = ({ ref, ...props }: TabLinkProps) => (
    <a
        {...props}
        ref={(element) => {
            if (typeof ref === "function") ref(element);
            else if (ref) ref.current = element;
        }}
        data-fresh-ref-link
    />
);

type ListProps = Partial<TabsProps<string>> & { scope: string; initial: string | undefined; tabs: Tab<string>[] };

const TabList = ({ scope, initial, tabs, ...rest }: ListProps) => {
    const [selected, setSelected] = useState(initial);

    return (
        <div data-testid={scope} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Tabs
                orientation={"horizontal"}
                tabGap={TAB_GAP}
                ariaLabel={"Example views"}
                renderGutter={() => <Gutter />}
                renderFloater={(visibilityTarget, transitionDurationMs) => (
                    <Floater visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs} />
                )}
                renderTab={(tab, flags) => <TabLabel tab={tab} flags={flags} />}
                {...rest}
                tabs={tabs}
                selectedValue={selected}
                onSelectionChange={setSelected}
            />

            {selected !== undefined && tabs.some((tab) => tab.value === selected && tab.panelId) && (
                <TabPanel
                    id={tabs.find((tab) => tab.value === selected)!.panelId!}
                    tabId={tabs.find((tab) => tab.value === selected)!.id!}
                >
                    {`The ${selected} panel.`}
                </TabPanel>
            )}

            <output data-readout="selected">{`selected: ${selected ?? "nothing"}`}</output>

            {rest.transitionDurationMs !== undefined && (
                <button type="button" data-testid="clear" onClick={() => setSelected(undefined)}>
                    Clear
                </button>
            )}
        </div>
    );
};

export const Row = () => <TabList scope="row" initial="Render" tabs={rowTabs("row")} />;

export const Automatic = () => (
    <>
        <TabList scope="automatic" initial="Render" tabs={rowTabs("automatic")} hasAutoActivation={true} />
        <TabList scope="row" initial="Render" tabs={rowTabs("row")} />
    </>
);

export const Reachable = () => <TabList scope="reachable" initial="Render" tabs={rowTabs("reachable", true)} />;

export const Column = () => (
    <>
        <TabList
            scope="column"
            initial="Overview"
            tabs={COLUMN_TABS}
            orientation={"vertical"}
            ariaLabel={"Example sections"}
            renderGutter={undefined}
        />
        <TabList scope="row" initial="Render" tabs={rowTabs("row")} />
    </>
);

export const RightToLeft = () => (
    <>
        <div dir="rtl">
            <TabList scope="rtl" initial="Render" tabs={rowTabs("rtl")} />
        </div>
        <TabList scope="row" initial="Render" tabs={rowTabs("row")} />
    </>
);

export const Honeycomb = () => (
    <div style={{ width: HONEYCOMB_WIDTH }}>
        <TabList
            scope="honeycomb"
            initial="Overview"
            tabs={HONEYCOMB_TABS}
            orientation={undefined}
            tabGap={undefined}
            ariaLabel={"Honeycomb views"}
            computeLayout={HONEYCOMB_LAYOUT}
            renderGutter={undefined}
            renderTab={(tab) => <HexCell tab={tab} />}
        />
    </div>
);

export const Links = () => (
    <>
        <TabList scope="links" initial="Docs" tabs={LINK_TABS} ariaLabel={"Linked destinations"} />
        <TabList scope="linkComponent" initial="Docs" tabs={LINK_TABS} linkComponent={LinkComponent} />
        <TabList scope="freshRefLink" initial="Docs" tabs={LINK_TABS} linkComponent={FreshRefLinkComponent} />
        <TabList scope="row" initial="Render" tabs={rowTabs("row")} />
    </>
);

export const Clearable = () => (
    <TabList
        scope="clearable"
        initial="One"
        tabs={CLEARABLE_TABS}
        ariaLabel={"Clearable views"}
        transitionDurationMs={CLEARABLE_TRANSITION_DURATION_MS}
    />
);

export const AllDisabled = () => (
    <TabList scope="disabled" initial="Draft" tabs={DISABLED_TABS} ariaLabel={"Unavailable views"} />
);
