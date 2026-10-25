import { useState } from "react";

import { Tabs } from "@thewaver/ss-components-react";
import type { TabLinkProps } from "@thewaver/ss-components-react";
import { LINK_TABS, ROW_TAB_GAP } from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";

import { PageTabContent, PageTabFloater, PageTabGutter } from "../../../StyledComponents/TabContent/TabContent";
import type { TabsLinksDocsExampleProps } from "../TabsPageReact.types";

const CustomTabLink = (props: TabLinkProps) => <a {...props} data-link-component />;

type Props = TabsLinksDocsExampleProps;

export const LinksDocsExample = (props: Props) => {
    const [selectedValue, setSelectedValue] = useState("Docs");

    return (
        <Tabs
            orientation={"horizontal"}
            tabGap={ROW_TAB_GAP}
            ariaLabel={"Linked destinations"}
            tabs={LINK_TABS}
            selectedValue={selectedValue}
            onSelectionChange={setSelectedValue}
            linkComponent={props.hasLinkComponent ? CustomTabLink : undefined}
            renderGutter={() => <PageTabGutter orientation={"horizontal"} />}
            renderSelectionFloater={(visibilityTarget, transitionDurationMs) => (
                <PageTabFloater
                    orientation={"horizontal"}
                    visibilityTarget={visibilityTarget}
                    transitionDurationMs={transitionDurationMs}
                />
            )}
            renderTab={(tab, flags) => (
                <PageTabContent flags={flags} orientation={"horizontal"} isSelected={tab.value === selectedValue}>
                    {tab.value}
                </PageTabContent>
            )}
        />
    );
};
