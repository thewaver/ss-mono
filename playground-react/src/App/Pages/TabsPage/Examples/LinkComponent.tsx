import { Tabs } from "@thewaver/ss-components-react";
import type { TabLinkProps } from "@thewaver/ss-components-react";
import { LINK_TABS, ROW_TAB_GAP } from "@thewaver/ss-playground-core/App/Pages/TabsPage/TabsPage.const";

import { PageTabContent, PageTabFloater, PageTabGutter } from "../../../StyledComponents/TabContent/TabContent";
import type { TabsExampleProps } from "../TabsPage.types";

const PageTabLink = (props: TabLinkProps) => <a {...props} data-link-component />;

type Props = TabsExampleProps;

export const LinkComponentExample = (props: Props) => {
    return (
        <Tabs
            orientation={"horizontal"}
            tabGap={ROW_TAB_GAP}
            ariaLabel={"Routed destinations"}
            tabs={LINK_TABS}
            selectedValue={props.selectedValue}
            onSelectionChange={props.onSelectionChange}
            linkComponent={PageTabLink}
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
