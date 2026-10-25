import { createSignal } from "solid-js";

import { Button, Tabs } from "@thewaver/ss-components-solid";
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
    const [getSelectedValue, setSelectedValue] = createSignal("Render");
    const [getIsRightToLeft, setIsRightToLeft] = createSignal(true);

    return (
        <div class={styles.tabsDemo}>
            <div class={styles.tabsDemo} dir={getIsRightToLeft() ? "rtl" : "ltr"}>
                <Tabs
                    orientation={"horizontal"}
                    tabGap={ROW_TAB_GAP}
                    ariaLabel={"Right-to-left views"}
                    tabs={RIGHT_TO_LEFT_TABS}
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

            <Button
                id={"switchDirection"}
                ariaLabel={"Switch the direction"}
                renderContent={(getFlags) => (
                    <PageControlButtonContent flags={getFlags}>Switch the direction</PageControlButtonContent>
                )}
                onClick={() => {
                    setIsRightToLeft((isRightToLeft) => !isRightToLeft);
                }}
            />
        </div>
    );
};
