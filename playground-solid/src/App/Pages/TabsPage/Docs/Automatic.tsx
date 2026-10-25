import { createSignal } from "solid-js";

import { Tabs } from "@thewaver/ss-components-solid";
import {
    AUTOMATIC_TABS,
    PANEL_BODIES,
    ROW_TAB_GAP,
    getPanelId,
    getTabId,
} from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.css";

import { PageTabPanel } from "../../../PageComponents/TabPanel/TabPanel";
import { PageTabContent, PageTabFloater, PageTabGutter } from "../../../StyledComponents/TabContent/TabContent";
import type { TabsAutomaticDocsExampleProps } from "../TabsPageSolid.types";

const ID_PREFIX = "automatic";

type Props = TabsAutomaticDocsExampleProps;

export const AutomaticDocsExample = (props: Props) => {
    const [getSelectedValue, setSelectedValue] = createSignal("Render");

    return (
        <div class={styles.tabsDemo}>
            <Tabs
                orientation={"horizontal"}
                tabGap={ROW_TAB_GAP}
                ariaLabel={"Automatic views"}
                hasAutoActivation={props.hasAutoActivation}
                tabs={AUTOMATIC_TABS}
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
    );
};
