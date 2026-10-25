import { createSignal } from "solid-js";

import { Tabs } from "@thewaver/ss-components-solid";
import {
    HONEYCOMB_LAYOUT,
    HONEYCOMB_TABS,
    HONEYCOMB_WIDTH,
    PANEL_BODIES,
    getPanelId,
    getTabId,
} from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.css";

import { PageTabPanel } from "../../../PageComponents/TabPanel/TabPanel";
import {
    PageTabCell,
    PageTabHexFloater,
    PageTabHexHighlightFloater,
} from "../../../StyledComponents/TabContent/TabContent";

const ID_PREFIX = "honeycomb";

export const HoneycombDocsExample = () => {
    const [getSelectedValue, setSelectedValue] = createSignal("Overview");

    return (
        <div class={styles.tabsDemo}>
            <div style={{ width: HONEYCOMB_WIDTH }}>
                <Tabs
                    ariaLabel={"Honeycomb views"}
                    tabs={HONEYCOMB_TABS}
                    selectedValue={getSelectedValue}
                    computeLayout={HONEYCOMB_LAYOUT}
                    onSelectionChange={setSelectedValue}
                    renderSelectionFloater={(getVisibilityTarget, getTransitionDurationMs) => (
                        <PageTabHexFloater
                            orientation={"horizontal"}
                            visibilityTarget={getVisibilityTarget}
                            transitionDurationMs={getTransitionDurationMs}
                        />
                    )}
                    renderHighlightFloater={(getVisibilityTarget, getTransitionDurationMs) => (
                        <PageTabHexHighlightFloater
                            orientation={"horizontal"}
                            visibilityTarget={getVisibilityTarget}
                            transitionDurationMs={getTransitionDurationMs}
                        />
                    )}
                    renderTab={(getTab, getFlags) => (
                        <PageTabCell flags={getFlags} isSelected={() => getTab().value === getSelectedValue()}>
                            {getTab().value}
                        </PageTabCell>
                    )}
                />
            </div>

            <PageTabPanel
                id={() => getPanelId(ID_PREFIX, getSelectedValue())}
                tabId={() => getTabId(ID_PREFIX, getSelectedValue())}
            >
                {PANEL_BODIES[getSelectedValue()]}
            </PageTabPanel>
        </div>
    );
};
