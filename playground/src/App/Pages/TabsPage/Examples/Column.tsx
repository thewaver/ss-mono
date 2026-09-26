import { Tabs, access } from "@thewaver/ss-components";

import { PageTabPanel } from "../../../PageComponents/TabPanel/TabPanel";
import { PageTabContent, PageTabFloater } from "../../../StyledComponents/TabContent/TabContent";
import { COLUMN_TABS, PANEL_BODIES, getPanelId, getTabId } from "../TabsPage.const";
import type { TabsExampleProps } from "../TabsPage.types";

import * as styles from "../TabsPage.css";

type Props = TabsExampleProps;

export const ColumnExample = (props: Props) => {
    return (
        <div class={styles.columnDemo}>
            <Tabs
                orientation={"vertical"}
                ariaLabel={"Example sections"}
                tabs={() => COLUMN_TABS}
                selectedValue={props.selectedValue}
                onSelectionChange={props.onSelectionChange}
                renderFloater={(getVisibilityTarget, getTransitionDurationMs) => (
                    <PageTabFloater
                        orientation={"vertical"}
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                    />
                )}
                renderTab={(getTab, getFlags) => (
                    <PageTabContent
                        flags={getFlags}
                        orientation={"vertical"}
                        isSelected={() => getTab().value === access(props.selectedValue)}
                    >
                        {getTab().value}
                    </PageTabContent>
                )}
            />

            <div class={styles.columnDemoPanel}>
                <PageTabPanel
                    id={() => getPanelId("column", access(props.selectedValue) ?? "")}
                    tabId={() => getTabId("column", access(props.selectedValue) ?? "")}
                >
                    {PANEL_BODIES[access(props.selectedValue) ?? ""]}
                </PageTabPanel>
            </div>
        </div>
    );
};
