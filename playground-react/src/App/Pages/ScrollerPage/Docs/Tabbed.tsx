import { useState } from "react";

import { Scroller, Tabs } from "@thewaver/ss-components-react";
import type { ScrollerController, Tab } from "@thewaver/ss-components-react";
import {
    MONTHS,
    getMonthPanelId,
    getMonthTabId,
} from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

import { PageScrollerButton } from "../../../PageComponents/ScrollerButton/ScrollerButton";
import { PageTabPanel } from "../../../PageComponents/TabPanel/TabPanel";
import { PageTabContent, PageTabFloater, PageTabGutter } from "../../../StyledComponents/TabContent/TabContent";

const TAB_GAP = 10;

const MONTH_TABS: Tab<string>[] = MONTHS.map((month) => ({
    value: month,
    id: getMonthTabId(month),
    panelId: getMonthPanelId(month),
}));

export const TabbedDocsExample = () => {
    const [controller, setController] = useState<ScrollerController>();
    const [selectedMonth, setSelectedMonth] = useState(MONTHS[0]);

    return (
        <div className={styles.tabbedDemo}>
            <div className={styles.tabbedStripLayout}>
                <PageScrollerButton id={"tabbedBack"} controller={controller} step={"previous"} />

                <div className={styles.scrollerCell}>
                    <Scroller padding={FOCUS_RING_WIDTH} onMount={setController}>
                        <Tabs
                            orientation={"horizontal"}
                            tabGap={TAB_GAP}
                            ariaLabel={"Months"}
                            tabs={MONTH_TABS}
                            selectedValue={selectedMonth}
                            onSelectionChange={setSelectedMonth}
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
                                    isSelected={tab.value === selectedMonth}
                                >
                                    {tab.value}
                                </PageTabContent>
                            )}
                        />
                    </Scroller>
                </div>

                <PageScrollerButton id={"tabbedForward"} controller={controller} step={"next"} />
            </div>

            <PageTabPanel id={getMonthPanelId(selectedMonth)} tabId={getMonthTabId(selectedMonth)}>
                {selectedMonth}
            </PageTabPanel>
        </div>
    );
};
