import { useState } from "react";

import { Tabs } from "@thewaver/ss-components-react";
import {
    HOVER_PILL_TABS,
    PANEL_BODIES,
    ROW_TAB_GAP,
    getPanelId,
    getTabId,
} from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.css";

import { PageTabPanel } from "../../../PageComponents/TabPanel/TabPanel";
import { PageGlideFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageTabContent, PageTabFloater, PageTabGutter } from "../../../StyledComponents/TabContent/TabContent";

const ID_PREFIX = "hoverPill";

export const HoverPillDocsExample = () => {
    const [selectedValue, setSelectedValue] = useState("Render");

    return (
        <div className={styles.tabsDemo}>
            <Tabs
                orientation={"horizontal"}
                tabGap={ROW_TAB_GAP}
                ariaLabel={"Hover pill views"}
                tabs={HOVER_PILL_TABS}
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
                renderHighlightFloater={(visibilityTarget, transitionDurationMs) => (
                    <PageGlideFloater
                        kind={"highlight"}
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
