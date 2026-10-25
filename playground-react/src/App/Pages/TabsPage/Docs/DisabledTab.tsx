import { useMemo, useState } from "react";

import { Tabs } from "@thewaver/ss-components-react";
import type { Tab } from "@thewaver/ss-components-react";
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
import type { TabsDisabledTabDocsExampleProps } from "../TabsPageReact.types";

const ID_PREFIX = "reachable";

type Props = TabsDisabledTabDocsExampleProps;

export const DisabledTabDocsExample = (props: Props) => {
    const [selectedValue, setSelectedValue] = useState("Render");

    const tabs = useMemo<Tab<string>[]>(
        () =>
            REACHABLE_TABS.map((tab) =>
                tab.isDisabled ? { ...tab, isReachableWhenDisabled: props.isReachableWhenDisabled } : tab,
            ),
        [props.isReachableWhenDisabled],
    );

    return (
        <div className={styles.tabsDemo}>
            <Tabs
                orientation={"horizontal"}
                tabGap={ROW_TAB_GAP}
                ariaLabel={"Partly disabled views"}
                tabs={tabs}
                selectedValue={selectedValue}
                onSelectionChange={setSelectedValue}
                renderGutter={() => <PageTabGutter orientation={"horizontal"} />}
                renderSelectionFloater={(visibilityTarget, transitionDurationMs) => (
                    <PageTabFloater
                        orientation={"horizontal"}
                        visibilityTarget={visibilityTarget}
                        transitionDurationMs={transitionDurationMs}
                    />
                )}
                renderTab={(tab, flags) => (
                    <PageTabContent flags={flags} orientation={"horizontal"} isSelected={tab.value === selectedValue}>
                        {tab.value}
                    </PageTabContent>
                )}
            />

            <PageTabPanel id={getPanelId(ID_PREFIX, selectedValue)} tabId={getTabId(ID_PREFIX, selectedValue)}>
                {PANEL_BODIES[selectedValue]}
            </PageTabPanel>
        </div>
    );
};
