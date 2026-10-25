import { createSignal } from "solid-js";

import { Tabs, access } from "@thewaver/ss-components-solid";
import type { TabLinkProps } from "@thewaver/ss-components-solid";
import { LINK_TABS, ROW_TAB_GAP } from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";

import { PageTabContent, PageTabFloater, PageTabGutter } from "../../../StyledComponents/TabContent/TabContent";
import type { TabsLinksDocsExampleProps } from "../TabsPageSolid.types";

const CustomTabLink = (props: TabLinkProps) => <a {...props} data-link-component />;

type Props = TabsLinksDocsExampleProps;

export const LinksDocsExample = (props: Props) => {
    const [getSelectedValue, setSelectedValue] = createSignal("Docs");

    return (
        <Tabs
            orientation={"horizontal"}
            tabGap={ROW_TAB_GAP}
            ariaLabel={"Linked destinations"}
            tabs={LINK_TABS}
            selectedValue={getSelectedValue}
            onSelectionChange={setSelectedValue}
            linkComponent={access(props.hasLinkComponent) ? CustomTabLink : undefined}
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
    );
};
