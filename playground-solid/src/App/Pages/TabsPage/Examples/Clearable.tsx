import { Show } from "solid-js";

import { Button, Tabs, access } from "@thewaver/ss-components-solid";
import {
    CLEARABLE_TABS,
    PANEL_BODIES,
    ROW_TAB_GAP,
    getPanelId,
    getTabId,
} from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";

import { PageControlColumn } from "../../../PageComponents/ControlRow/ControlRow";
import { PageTabPanel } from "../../../PageComponents/TabPanel/TabPanel";
import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import { PageTabContent, PageTabFloater, PageTabGutter } from "../../../StyledComponents/TabContent/TabContent";
import type { TabsExampleProps } from "../TabsPageSolid.types";

export const CLEARABLE_TRANSITION_DURATION_MS = 600;

type Props = TabsExampleProps & { onClear: () => void };

export const ClearableExample = (props: Props) => {
    return (
        <PageControlColumn>
            <Tabs
                orientation={"horizontal"}
                tabGap={ROW_TAB_GAP}
                ariaLabel={"Clearable views"}
                transitionDurationMs={CLEARABLE_TRANSITION_DURATION_MS}
                tabs={CLEARABLE_TABS}
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

            <Show when={access(props.selectedValue)}>
                {(getValue) => (
                    <PageTabPanel
                        id={() => getPanelId("clearable", getValue())}
                        tabId={() => getTabId("clearable", getValue())}
                    >
                        {PANEL_BODIES[getValue()]}
                    </PageTabPanel>
                )}
            </Show>

            <Button
                ariaLabel={"Clear the selection"}
                renderContent={(getFlags) => (
                    <PageControlButtonContent flags={getFlags}>Clear</PageControlButtonContent>
                )}
                onClick={async () => props.onClear()}
            />
        </PageControlColumn>
    );
};
