import { createMemo, createSignal } from "solid-js";

import { Tabs, access } from "@thewaver/ss-components-solid";
import type { Tab } from "@thewaver/ss-components-solid";
import {
    PANEL_BODIES,
    REACHABLE_TABS,
    ROW_TAB_GAP,
    getPanelId,
    getTabId,
} from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.css";

import { PageTabPanel } from "../../../PageComponents/TabPanel/TabPanel";
import { PageTabContent, PageTabFloater, PageTabGutter } from "../../../StyledComponents/TabContent/TabContent";
import type { TabsDisabledTabDocsExampleProps } from "../TabsPageSolid.types";

const ID_PREFIX = "reachable";

type Props = TabsDisabledTabDocsExampleProps;

export const DisabledTabDocsExample = (props: Props) => {
    const [getSelectedValue, setSelectedValue] = createSignal("Render");

    const getTabs = createMemo<Tab<string>[]>(() =>
        REACHABLE_TABS.map((tab) =>
            tab.isDisabled ? { ...tab, isReachableWhenDisabled: access(props.isReachableWhenDisabled) } : tab,
        ),
    );

    return (
        <div class={styles.tabsDemo}>
            <Tabs
                orientation={"horizontal"}
                tabGap={ROW_TAB_GAP}
                ariaLabel={"Partly disabled views"}
                tabs={getTabs}
                selectedValue={getSelectedValue}
                onSelectionChange={setSelectedValue}
                renderGutter={() => <PageTabGutter orientation={"horizontal"} />}
                renderSelectionFloater={(getVisibilityTarget, getTransitionDurationMs) => (
                    <PageTabFloater
                        orientation={"horizontal"}
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                    />
                )}
                renderTab={(getTab, getFlags) => (
                    <PageTabContent
                        flags={getFlags}
                        orientation={"horizontal"}
                        isSelected={() => getTab().value === getSelectedValue()}
                    >
                        {getTab().value}
                    </PageTabContent>
                )}
            />

            <PageTabPanel
                id={() => getPanelId(ID_PREFIX, getSelectedValue())}
                tabId={() => getTabId(ID_PREFIX, getSelectedValue())}
            >
                {PANEL_BODIES[getSelectedValue()]}
            </PageTabPanel>
        </div>
    );
};
