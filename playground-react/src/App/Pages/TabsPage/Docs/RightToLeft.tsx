import { useState } from "react";

import { Button, Tabs } from "@thewaver/ss-components-react";
import {
    PANEL_BODIES,
    RIGHT_TO_LEFT_TABS,
    ROW_TAB_GAP,
    getPanelId,
    getTabId,
} from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.css";

import { PageTabPanel } from "../../../PageComponents/TabPanel/TabPanel";
import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import { PageTabContent, PageTabFloater, PageTabGutter } from "../../../StyledComponents/TabContent/TabContent";

const ID_PREFIX = "rtl";

export const RightToLeftDocsExample = () => {
    const [selectedValue, setSelectedValue] = useState("Render");
    const [isRightToLeft, setIsRightToLeft] = useState(true);

    return (
        <div className={styles.tabsDemo}>
            <div className={styles.tabsDemo} dir={isRightToLeft ? "rtl" : "ltr"}>
                <Tabs
                    orientation={"horizontal"}
                    tabGap={ROW_TAB_GAP}
                    ariaLabel={"Right-to-left views"}
                    tabs={RIGHT_TO_LEFT_TABS}
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
                        <PageTabContent
                            flags={flags}
                            orientation={"horizontal"}
                            isSelected={tab.value === selectedValue}
                        >
                            {tab.value}
                        </PageTabContent>
                    )}
                />

                <PageTabPanel id={getPanelId(ID_PREFIX, selectedValue)} tabId={getTabId(ID_PREFIX, selectedValue)}>
                    {PANEL_BODIES[selectedValue]}
                </PageTabPanel>
            </div>

            <Button
                id={"switchDirection"}
                ariaLabel={"Switch the direction"}
                renderContent={(flags) => (
                    <PageControlButtonContent flags={flags}>Switch the direction</PageControlButtonContent>
                )}
                onClick={() => {
                    setIsRightToLeft((previous) => !previous);
                }}
            />
        </div>
    );
};
