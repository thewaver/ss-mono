import { Tabs } from "@thewaver/ss-components-react";
import { DISABLED_TABS, ROW_TAB_GAP } from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";

import { PageTabContent, PageTabFloater, PageTabGutter } from "../../../StyledComponents/TabContent/TabContent";
import type { TabsExampleProps } from "../TabsPage.types";

type Props = TabsExampleProps;

export const AllDisabledExample = (props: Props) => {
    return (
        <Tabs
            orientation={"horizontal"}
            tabGap={ROW_TAB_GAP}
            ariaLabel={"Unavailable views"}
            tabs={DISABLED_TABS}
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
                <PageTabContent flags={flags} orientation={"horizontal"} isSelected={tab.value === props.selectedValue}>
                    {tab.value}
                </PageTabContent>
            )}
        />
    );
};
