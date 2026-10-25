import { useState } from "react";

import { Tabs } from "@thewaver/ss-components-react";
import {
    HONEYCOMB_LAYOUT,
    HONEYCOMB_TABS,
    HONEYCOMB_WIDTH,
    PANEL_BODIES,
    getPanelId,
    getTabId,
} from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.css";

import { PageTabPanel } from "../../../PageComponents/TabPanel/TabPanel";
import {
    PageTabCell,
    PageTabHexFloater,
    PageTabHexHighlightFloater,
} from "../../../StyledComponents/TabContent/TabContent";

const ID_PREFIX = "honeycomb";

export const HoneycombDocsExample = () => {
    const [selectedValue, setSelectedValue] = useState("Overview");

    return (
        <div className={styles.tabsDemo}>
            <div style={{ width: HONEYCOMB_WIDTH }}>
                <Tabs
                    ariaLabel={"Honeycomb views"}
                    tabs={HONEYCOMB_TABS}
                    selectedValue={selectedValue}
                    computeLayout={HONEYCOMB_LAYOUT}
                    onSelectionChange={setSelectedValue}
                    renderSelectionFloater={(visibilityTarget, transitionDurationMs) => (
                        <PageTabHexFloater
                            orientation={"horizontal"}
                            visibilityTarget={visibilityTarget}
                            transitionDurationMs={transitionDurationMs}
                        />
                    )}
                    renderHighlightFloater={(visibilityTarget, transitionDurationMs) => (
                        <PageTabHexHighlightFloater
                            orientation={"horizontal"}
                            visibilityTarget={visibilityTarget}
                            transitionDurationMs={transitionDurationMs}
                        />
                    )}
                    renderTab={(tab, flags) => (
                        <PageTabCell flags={flags} isSelected={tab.value === selectedValue}>
                            {tab.value}
                        </PageTabCell>
                    )}
                />
            </div>

            <PageTabPanel id={getPanelId(ID_PREFIX, selectedValue)} tabId={getTabId(ID_PREFIX, selectedValue)}>
                {PANEL_BODIES[selectedValue]}
            </PageTabPanel>
        </div>
    );
};
