import { Button, Tabs } from "@thewaver/ss-components-react";
import { CLEARABLE_TABS, ROW_TAB_GAP } from "@thewaver/ss-playground-core/App/Pages/TabsPage/TabsPage.const";

import { PageControlColumn } from "../../../PageComponents/ControlRow/ControlRow";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageTabContent, PageTabFloater, PageTabGutter } from "../../../StyledComponents/TabContent/TabContent";
import type { TabsExampleProps } from "../TabsPage.types";

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

            <Button
                ariaLabel={"Clear the selection"}
                renderContent={(flags) => <PageButtonContent flags={flags}>Clear</PageButtonContent>}
                onClick={async () => props.onClear()}
            />
        </PageControlColumn>
    );
};
