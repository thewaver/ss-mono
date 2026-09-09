import { Tabs, access, createHoneycomb } from "@thewaver/ss-components";
import type { HoneycombDefs } from "@thewaver/ss-components";

import { PageTabCell, PageTabHexFloater, PageTabPanel } from "../../../StyledComponents/TabContent/TabContent";
import { HONEYCOMB_TABS, PANEL_BODIES, getPanelId, getTabId } from "../TabsPage.const";
import type { TabsExampleProps } from "../TabsPage.types";

import * as styles from "../TabsPage.css";

const HONEYCOMB_DEFS: HoneycombDefs = { cellWidthPx: 84, perRow: 3, gapPx: 6 };

const HONEYCOMB_LAYOUT = createHoneycomb(HONEYCOMB_DEFS);

const ID_PREFIX = "honeycomb";

type Props = TabsExampleProps;

export const HoneycombExample = (props: Props) => {
    return (
        <div class={styles.rowDemo}>
            <Tabs
                ariaLabel={"Honeycomb views"}
                tabs={() => HONEYCOMB_TABS}
                selectedValue={props.selectedValue}
                computeLayout={HONEYCOMB_LAYOUT}
                onSelectionChange={props.onSelectionChange}
                renderFloater={(getVisibilityTarget, getTransitionDurationMs) => (
                    <PageTabHexFloater
                        dir={"row"}
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                    />
                )}
                renderTab={(getTab, getFlags) => (
                    <PageTabCell flags={getFlags} isSelected={() => getTab().value === access(props.selectedValue)}>
                        {getTab().value}
                    </PageTabCell>
                )}
            />

            <PageTabPanel
                id={() => getPanelId(ID_PREFIX, access(props.selectedValue) ?? "")}
                tabId={() => getTabId(ID_PREFIX, access(props.selectedValue) ?? "")}
            >
                {PANEL_BODIES[access(props.selectedValue) ?? ""]}
            </PageTabPanel>
        </div>
    );
};
