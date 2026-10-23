import { Tabs } from "@thewaver/ss-components-react";
import {
    DISABLED_TABS,
    PANEL_BODIES,
    ROW_TAB_GAP,
    getPanelId,
    getTabId,
} from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.css";

import { PageTabPanel } from "../../../PageComponents/TabPanel/TabPanel";
import { PageTabContent, PageTabFloater, PageTabGutter } from "../../../StyledComponents/TabContent/TabContent";
import type { TabsExampleProps } from "../TabsPageReact.types";

type Props = TabsExampleProps;

export const AllDisabledExample = (props: Props) => {
    return (
        <div className={styles.rowDemo}>
            <Tabs
                orientation={"horizontal"}
                tabGap={ROW_TAB_GAP}
                ariaLabel={"Unavailable views"}
                tabs={DISABLED_TABS}
                selectedValue={props.selectedValue}
                onSelectionChange={props.onSelectionChange}
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
                        isSelected={tab.value === props.selectedValue}
                    >
                        {tab.value}
                    </PageTabContent>
                )}
            />

            <PageTabPanel
                id={getPanelId("disabled", props.selectedValue ?? "")}
                tabId={getTabId("disabled", props.selectedValue ?? "")}
            >
                {PANEL_BODIES[props.selectedValue ?? ""]}
            </PageTabPanel>
        </div>
    );
};
