import { useState } from "react";

import { Button, Tabs } from "@thewaver/ss-components-react";
import {
    CLEARABLE_TABS,
    PANEL_BODIES,
    ROW_TAB_GAP,
    getPanelId,
    getTabId,
} from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.css";

import { PageTabPanel } from "../../../PageComponents/TabPanel/TabPanel";
import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import { PageTabContent, PageTabFloater, PageTabGutter } from "../../../StyledComponents/TabContent/TabContent";

const ID_PREFIX = "clearable";

const TRANSITION_DURATION_MS = 600;

export const ClearableDocsExample = () => {
    const [selectedValue, setSelectedValue] = useState<string | undefined>("One");

    return (
        <div className={styles.tabsDemo}>
            <Tabs
                orientation={"horizontal"}
                tabGap={ROW_TAB_GAP}
                ariaLabel={"Clearable views"}
                transitionDurationMs={TRANSITION_DURATION_MS}
                tabs={CLEARABLE_TABS}
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

            {selectedValue && (
                <PageTabPanel id={getPanelId(ID_PREFIX, selectedValue)} tabId={getTabId(ID_PREFIX, selectedValue)}>
                    {PANEL_BODIES[selectedValue]}
                </PageTabPanel>
            )}

            <Button
                id={"clearSelection"}
                ariaLabel={"Clear the selection"}
                renderContent={(flags) => <PageControlButtonContent flags={flags}>Clear</PageControlButtonContent>}
                onClick={() => {
                    setSelectedValue(undefined);
                }}
            />
        </div>
    );
};
