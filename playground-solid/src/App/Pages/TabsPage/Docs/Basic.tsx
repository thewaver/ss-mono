import { createMemo, createSignal } from "solid-js";

import { Tabs, access } from "@thewaver/ss-components-solid";
import type { Tab } from "@thewaver/ss-components-solid";
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
import type { TabsBasicDocsExampleProps } from "../TabsPageSolid.types";

const ID_PREFIX = "basic";

type Props = TabsBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const [getSelectedValue, setSelectedValue] = createSignal("Render");

    const getTabs = createMemo<Tab<string>[]>(() =>
        BASIC_TABS.map((tab) => ({ ...tab, isDisabled: access(props.isDisabled) })),
    );

    return (
        <div class={styles.tabsDemo} data-orientation={access(props.orientation)}>
            <Tabs
                orientation={props.orientation}
                tabGap={ROW_TAB_GAP}
                ariaLabel={"Example views"}
                tabs={getTabs}
                selectedValue={getSelectedValue}
                onSelectionChange={setSelectedValue}
                renderGutter={() => <PageTabGutter orientation={props.orientation} />}
                renderSelectionFloater={(getVisibilityTarget, getTransitionDurationMs) => (
                    <PageTabFloater
                        orientation={props.orientation}
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                    />
                )}
                renderTab={(getTab, getFlags) => (
                    <PageTabContent
                        flags={getFlags}
                        orientation={props.orientation}
                        isSelected={() => getTab().value === getSelectedValue()}
                    >
                        {getTab().value}
                    </PageTabContent>
                )}
            />

            <div class={styles.tabsDemoPanel}>
                <PageTabPanel
                    id={() => getPanelId(ID_PREFIX, getSelectedValue())}
                    tabId={() => getTabId(ID_PREFIX, getSelectedValue())}
                >
                    {PANEL_BODIES[getSelectedValue()]}
                </PageTabPanel>
            </div>
        </div>
    );
};
