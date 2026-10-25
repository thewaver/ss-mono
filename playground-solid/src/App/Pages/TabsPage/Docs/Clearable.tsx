import { Show, createSignal } from "solid-js";

import { Button, Tabs } from "@thewaver/ss-components-solid";
import {
    CLEARABLE_TABS,
    PANEL_BODIES,
    ROW_TAB_GAP,
    getPanelId,
    getTabId,
} from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.css";

import { PageTabPanel } from "../../../PageComponents/TabPanel/TabPanel";
import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import { PageTabContent, PageTabFloater, PageTabGutter } from "../../../StyledComponents/TabContent/TabContent";

const ID_PREFIX = "clearable";

const TRANSITION_DURATION_MS = 600;

export const ClearableDocsExample = () => {
    const [getSelectedValue, setSelectedValue] = createSignal<string | undefined>("One");

    return (
        <div class={styles.tabsDemo}>
            <Tabs
                orientation={"horizontal"}
                tabGap={ROW_TAB_GAP}
                ariaLabel={"Clearable views"}
                transitionDurationMs={TRANSITION_DURATION_MS}
                tabs={CLEARABLE_TABS}
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

            <Show when={getSelectedValue()}>
                {(getValue) => (
                    <PageTabPanel
                        id={() => getPanelId(ID_PREFIX, getValue())}
                        tabId={() => getTabId(ID_PREFIX, getValue())}
                    >
                        {PANEL_BODIES[getValue()]}
                    </PageTabPanel>
                )}
            </Show>

            <Button
                id={"clearSelection"}
                ariaLabel={"Clear the selection"}
                renderContent={(getFlags) => (
                    <PageControlButtonContent flags={getFlags}>Clear</PageControlButtonContent>
                )}
                onClick={() => {
                    setSelectedValue(undefined);
                }}
            />
        </div>
    );
};
