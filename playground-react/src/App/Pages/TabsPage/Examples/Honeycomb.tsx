import { PlacementLayoutUtils, Tabs } from "@thewaver/ss-components-react";
import type { HoneycombDefs } from "@thewaver/ss-components-react";
import {
    HONEYCOMB_TABS,
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
import type { TabsExampleProps } from "../TabsPage.types";

const HONEYCOMB_DEFS: HoneycombDefs = { perRow: 3, gapRatio: 0 };

const HONEYCOMB_LAYOUT = PlacementLayoutUtils.createHoneycomb(HONEYCOMB_DEFS);

const HONEYCOMB_WIDTH = "294px";

const ID_PREFIX = "honeycomb";

type Props = TabsExampleProps;

export const HoneycombExample = (props: Props) => {
    return (
        <div className={styles.rowDemo}>
            <div style={{ width: HONEYCOMB_WIDTH }}>
                <Tabs
                    ariaLabel={"Honeycomb views"}
                    tabs={HONEYCOMB_TABS}
                    selectedValue={props.selectedValue}
                    computeLayout={HONEYCOMB_LAYOUT}
                    onSelectionChange={props.onSelectionChange}
                    renderSelectionFloater={(visibilityTarget, transitionDurationMs) => (
                        <PageTabHexFloater
                            orientation={"horizontal"}
                            visibilityTarget={visibilityTarget}
                            transitionDurationMs={transitionDurationMs}
                        />
                    )}
                    renderHighlightFloater={(visibilityTarget, transitionDurationMs) => (
                        <PageTabHexHighlightFloater
                            orientation={"horizontal"}
                            visibilityTarget={visibilityTarget}
                            transitionDurationMs={transitionDurationMs}
                        />
                    )}
                    renderTab={(tab, flags) => (
                        <PageTabCell flags={flags} isSelected={tab.value === props.selectedValue}>
                            {tab.value}
                        </PageTabCell>
                    )}
                />
            </div>

            <PageTabPanel
                id={getPanelId(ID_PREFIX, props.selectedValue ?? "")}
                tabId={getTabId(ID_PREFIX, props.selectedValue ?? "")}
            >
                {PANEL_BODIES[props.selectedValue ?? ""]}
            </PageTabPanel>
        </div>
    );
};
