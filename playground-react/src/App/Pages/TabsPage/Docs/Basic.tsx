import { useMemo, useState } from "react";

import { Tabs } from "@thewaver/ss-components-react";
import type { Tab } from "@thewaver/ss-components-react";
import {
    BASIC_TABS,
    PANEL_BODIES,
    ROW_TAB_GAP,
    getPanelId,
    getTabId,
} from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.css";

import { PageTabPanel } from "../../../PageComponents/TabPanel/TabPanel";
import { PageTabContent, PageTabFloater, PageTabGutter } from "../../../StyledComponents/TabContent/TabContent";
import type { TabsBasicDocsExampleProps } from "../TabsPageReact.types";

const ID_PREFIX = "basic";

type Props = TabsBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const [selectedValue, setSelectedValue] = useState("Render");

    const tabs = useMemo<Tab<string>[]>(
        () => BASIC_TABS.map((tab) => ({ ...tab, isDisabled: props.isDisabled })),
        [props.isDisabled],
    );

    return (
        <div className={styles.tabsDemo} data-orientation={props.orientation}>
            <Tabs
                orientation={props.orientation}
                tabGap={ROW_TAB_GAP}
                ariaLabel={"Example views"}
                tabs={tabs}
                selectedValue={selectedValue}
                onSelectionChange={setSelectedValue}
                renderGutter={() => <PageTabGutter orientation={props.orientation} />}
                renderSelectionFloater={(visibilityTarget, transitionDurationMs) => (
                    <PageTabFloater
                        orientation={props.orientation}
                        visibilityTarget={visibilityTarget}
                        transitionDurationMs={transitionDurationMs}
                    />
                )}
                renderTab={(tab, flags) => (
                    <PageTabContent
                        flags={flags}
                        orientation={props.orientation}
                        isSelected={tab.value === selectedValue}
                    >
                        {tab.value}
                    </PageTabContent>
                )}
            />

            <div className={styles.tabsDemoPanel}>
                <PageTabPanel id={getPanelId(ID_PREFIX, selectedValue)} tabId={getTabId(ID_PREFIX, selectedValue)}>
                    {PANEL_BODIES[selectedValue]}
                </PageTabPanel>
            </div>
        </div>
    );
};
