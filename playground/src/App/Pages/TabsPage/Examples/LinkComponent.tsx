import { Tabs, access } from "@thewaver/ss-components";
import type { TabLinkProps } from "@thewaver/ss-components";

import { PageTabContent, PageTabFloater, PageTabGutter } from "../../../StyledComponents/TabContent/TabContent";
import { LINK_TABS, ROW_TAB_GAP } from "../TabsPage.const";
import type { TabsExampleProps } from "../TabsPage.types";

const PageTabLink = (props: TabLinkProps) => <a {...props} data-link-component />;

type Props = TabsExampleProps;

export const LinkComponentExample = (props: Props) => {
    return (
        <Tabs
            orientation={"horizontal"}
            tabGap={() => ROW_TAB_GAP}
            ariaLabel={"Routed destinations"}
            tabs={() => LINK_TABS}
            selectedValue={props.selectedValue}
            onSelectionChange={props.onSelectionChange}
            linkComponent={PageTabLink}
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
    );
};
