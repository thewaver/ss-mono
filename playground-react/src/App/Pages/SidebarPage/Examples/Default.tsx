import { useId } from "react";

import { Sidebar } from "@thewaver/ss-components-react";

import { PageSidebarToggle } from "../../../PageComponents/SidebarToggle/SidebarToggle";
import {
    PageSidebarFade,
    PageSidebarFrame,
    PageSidebarNeighbor,
    PageSidebarPhase,
    PageSidebarSurface,
} from "../../../StyledComponents/SidebarContent/SidebarContent";
import type { SidebarExampleProps } from "../SidebarPage.types";

type Props = SidebarExampleProps;

const COLLAPSED_WIDTH = 48;
const EXPANDED_WIDTH = 200;
const ENTRIES = ["Inbox", "Drafts", "Sent", "Archive", "Spam"];

export const DefaultExample = (props: Props) => {
    const sidebarId = useId();

    const [isExpanded, setIsExpanded] = props.expanded;

    return (
        <PageSidebarFrame edge={props.edge}>
            <Sidebar
                id={sidebarId}
                edge={props.edge}
                layout={props.layout}
                collapsedWidth={COLLAPSED_WIDTH}
                expandedWidth={EXPANDED_WIDTH}
                isExpandedOnHover={props.isExpandedOnHover}
                expanded={props.expanded}
                renderContent={(phase, transitionDurationMs) => (
                    <PageSidebarSurface width={EXPANDED_WIDTH}>
                        <PageSidebarToggle
                            sidebarId={sidebarId}
                            edge={props.edge}
                            isExpanded={isExpanded}
                            ariaLabel={isExpanded ? "Collapse mailboxes" : "Expand mailboxes"}
                            onToggle={() => setIsExpanded(!isExpanded)}
                        />

                        <PageSidebarFade phase={phase} transitionDurationMs={transitionDurationMs}>
                            <PageSidebarPhase>{phase}</PageSidebarPhase>

                            {ENTRIES.map((entry) => (
                                <div key={entry}>{entry}</div>
                            ))}
                        </PageSidebarFade>
                    </PageSidebarSurface>
                )}
            />

            <PageSidebarNeighbor>
                The content beside the sidebar. Pushed, it narrows as the sidebar grows; overlaid, it stays where it is
                and the sidebar grows over it.
            </PageSidebarNeighbor>
        </PageSidebarFrame>
    );
};
