import { Tabs, access } from "@thewaver/ss-components-solid";
import type { MaybeAccessor, Tab } from "@thewaver/ss-components-solid";
import {
    PANEL_BODIES,
    ROW_TABS,
    ROW_TAB_GAP,
    getPanelId,
    getTabId,
} from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.css";

import { PageTabPanel } from "../../../PageComponents/TabPanel/TabPanel";
import { PageGlideFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageTabContent, PageTabFloater, PageTabGutter } from "../../../StyledComponents/TabContent/TabContent";
import type { TabsExampleProps } from "../TabsPage.types";

const DEFAULT_ID_PREFIX = "row";

type Props = TabsExampleProps & {
    tabs?: MaybeAccessor<Tab<string>[]>;
    idPrefix?: MaybeAccessor<string>;
    hasHoverPill?: boolean;
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
                renderSelectionFloater={(getVisibilityTarget, getTransitionDurationMs) => (
                    <PageTabFloater
                        orientation={"horizontal"}
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                    />
                )}
                renderHighlightFloater={
                    props.hasHoverPill
                        ? (getVisibilityTarget, getTransitionDurationMs) => (
                              <PageGlideFloater
                                  kind={"highlight"}
                                  visibilityTarget={getVisibilityTarget}
                                  transitionDurationMs={getTransitionDurationMs}
                              />
                          )
                        : undefined
                }
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
