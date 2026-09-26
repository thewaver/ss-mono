import { Tabs, access } from "@thewaver/ss-components";
import type { MaybeAccessor, Tab } from "@thewaver/ss-components";

import { PageTabPanel } from "../../../PageComponents/TabPanel/TabPanel";
import { PageTabContent, PageTabFloater, PageTabGutter } from "../../../StyledComponents/TabContent/TabContent";
import { PANEL_BODIES, ROW_TABS, ROW_TAB_GAP, getPanelId, getTabId } from "../TabsPage.const";
import type { TabsExampleProps } from "../TabsPage.types";

import * as styles from "../TabsPage.css";

const DEFAULT_ID_PREFIX = "row";

type Props = TabsExampleProps & {
    tabs?: MaybeAccessor<Tab<string>[]>;
    idPrefix?: MaybeAccessor<string>;
};

export const RowExample = (props: Props) => {
    const getIdPrefix = () => access(props.idPrefix) ?? DEFAULT_ID_PREFIX;

    return (
        <div class={styles.rowDemo}>
            <Tabs
                orientation={"horizontal"}
                tabGap={() => ROW_TAB_GAP}
                ariaLabel={"Example views"}
                hasAutoActivation={props.hasAutoActivation}
                tabs={() => access(props.tabs) ?? ROW_TABS}
                selectedValue={props.selectedValue}
                onSelectionChange={props.onSelectionChange}
                renderGutter={() => <PageTabGutter orientation={"horizontal"} />}
                renderFloater={(getVisibilityTarget, getTransitionDurationMs) => (
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
                        isSelected={() => getTab().value === access(props.selectedValue)}
                    >
                        {getTab().value}
                    </PageTabContent>
                )}
            />

            <PageTabPanel
                id={() => getPanelId(getIdPrefix(), access(props.selectedValue) ?? "")}
                tabId={() => getTabId(getIdPrefix(), access(props.selectedValue) ?? "")}
            >
                {PANEL_BODIES[access(props.selectedValue) ?? ""]}
            </PageTabPanel>
        </div>
    );
};
