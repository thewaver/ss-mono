import { Tabs } from "@thewaver/ss-components-react";
import type { Tab } from "@thewaver/ss-components-react";
import {
    PANEL_BODIES,
    ROW_TABS,
    ROW_TAB_GAP,
    getPanelId,
    getTabId,
} from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.css";

import { PageTabPanel } from "../../../PageComponents/TabPanel/TabPanel";
import { PageTabContent, PageTabFloater, PageTabGutter } from "../../../StyledComponents/TabContent/TabContent";
import type { TabsExampleProps } from "../TabsPage.types";

const DEFAULT_ID_PREFIX = "row";

type Props = TabsExampleProps & {
    tabs?: Tab<string>[];
    idPrefix?: string;
};

export const RowExample = (props: Props) => {
    const idPrefix = props.idPrefix ?? DEFAULT_ID_PREFIX;

    return (
        <div className={styles.rowDemo}>
            <Tabs
                orientation={"horizontal"}
                tabGap={ROW_TAB_GAP}
                ariaLabel={"Example views"}
                hasAutoActivation={props.hasAutoActivation}
                tabs={props.tabs ?? ROW_TABS}
                selectedValue={props.selectedValue}
                onSelectionChange={props.onSelectionChange}
                renderGutter={() => <PageTabGutter orientation={"horizontal"} />}
                renderFloater={(visibilityTarget, transitionDurationMs) => (
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
                id={getPanelId(idPrefix, props.selectedValue ?? "")}
                tabId={getTabId(idPrefix, props.selectedValue ?? "")}
            >
                {PANEL_BODIES[props.selectedValue ?? ""]}
            </PageTabPanel>
        </div>
    );
};
