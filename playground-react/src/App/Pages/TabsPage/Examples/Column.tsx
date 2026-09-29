import { Tabs } from "@thewaver/ss-components-react";
import {
    COLUMN_TABS,
    PANEL_BODIES,
    getPanelId,
    getTabId,
} from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.css";

import { PageTabPanel } from "../../../PageComponents/TabPanel/TabPanel";
import { PageTabContent, PageTabFloater } from "../../../StyledComponents/TabContent/TabContent";
import type { TabsExampleProps } from "../TabsPage.types";

type Props = TabsExampleProps;

export const ColumnExample = (props: Props) => {
    return (
        <div className={styles.columnDemo}>
            <Tabs
                orientation={"vertical"}
                ariaLabel={"Example sections"}
                tabs={COLUMN_TABS}
                selectedValue={props.selectedValue}
                onSelectionChange={props.onSelectionChange}
                renderFloater={(visibilityTarget, transitionDurationMs) => (
                    <PageTabFloater
                        orientation={"vertical"}
                        visibilityTarget={visibilityTarget}
                        transitionDurationMs={transitionDurationMs}
                    />
                )}
                renderTab={(tab, flags) => (
                    <PageTabContent
                        flags={flags}
                        orientation={"vertical"}
                        isSelected={tab.value === props.selectedValue}
                    >
                        {tab.value}
                    </PageTabContent>
                )}
            />

            <div className={styles.columnDemoPanel}>
                <PageTabPanel
                    id={getPanelId("column", props.selectedValue ?? "")}
                    tabId={getTabId("column", props.selectedValue ?? "")}
                >
                    {PANEL_BODIES[props.selectedValue ?? ""]}
                </PageTabPanel>
            </div>
        </div>
    );
};
