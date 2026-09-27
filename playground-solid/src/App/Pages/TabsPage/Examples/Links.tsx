import { Tabs, access } from "@thewaver/ss-components-solid";
import { LINK_TABS, ROW_TAB_GAP } from "@thewaver/ss-playground-core/App/Pages/TabsPage/TabsPage.const";

import { PageTabContent, PageTabFloater, PageTabGutter } from "../../../StyledComponents/TabContent/TabContent";
import type { TabsExampleProps } from "../TabsPage.types";

type Props = TabsExampleProps;

export const LinksExample = (props: Props) => {
    return (
        <Tabs
            orientation={"horizontal"}
            tabGap={() => ROW_TAB_GAP}
            ariaLabel={"Linked destinations"}
            tabs={() => LINK_TABS}
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
    );
};
