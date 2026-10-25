import { createSignal } from "solid-js";

import { Scroller, Tabs } from "@thewaver/ss-components-solid";
import type { ScrollerController, Tab } from "@thewaver/ss-components-solid";
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
    const [getController, setController] = createSignal<ScrollerController>();
    const [getSelectedMonth, setSelectedMonth] = createSignal(MONTHS[0]);

    return (
        <div class={styles.tabbedDemo}>
            <div class={styles.tabbedStripLayout}>
                <PageScrollerButton id={"tabbedBack"} controller={getController} step={"previous"} />

                <div class={styles.scrollerCell}>
                    <Scroller padding={FOCUS_RING_WIDTH} onMount={setController}>
                        <Tabs
                            orientation={"horizontal"}
                            tabGap={TAB_GAP}
                            ariaLabel={"Months"}
                            tabs={MONTH_TABS}
                            selectedValue={getSelectedMonth}
                            onSelectionChange={setSelectedMonth}
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
                                    isSelected={() => getTab().value === getSelectedMonth()}
                                >
                                    {getTab().value}
                                </PageTabContent>
                            )}
                        />
                    </Scroller>
                </div>

                <PageScrollerButton id={"tabbedForward"} controller={getController} step={"next"} />
            </div>

            <PageTabPanel
                id={() => getMonthPanelId(getSelectedMonth())}
                tabId={() => getMonthTabId(getSelectedMonth())}
            >
                {getSelectedMonth()}
            </PageTabPanel>
        </div>
    );
};
