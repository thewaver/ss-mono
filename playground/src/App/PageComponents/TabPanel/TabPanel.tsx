import { TabPanel } from "@thewaver/ss-components";
import type { TabPanelProps } from "@thewaver/ss-components";

import { PageTabPanelContent } from "../../StyledComponents/TabContent/TabContent";

export const PageTabPanel = (props: TabPanelProps) => {
    return (
        <TabPanel id={props.id} tabId={props.tabId}>
            <PageTabPanelContent>{props.children}</PageTabPanelContent>
        </TabPanel>
    );
};
