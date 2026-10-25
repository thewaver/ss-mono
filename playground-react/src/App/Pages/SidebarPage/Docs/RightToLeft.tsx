import { useState } from "react";

import { Sidebar } from "@thewaver/ss-components-react";
import {
    COLLAPSED_SIZE,
    EXPANDED_SIZE,
    MAILBOXES,
} from "@thewaver/ss-playground/App/Pages/SidebarPage/SidebarPage.const";

import { PageSidebarToggle } from "../../../PageComponents/SidebarToggle/SidebarToggle";
import {
    PageSidebarFade,
    PageSidebarFrame,
    PageSidebarNeighbor,
    PageSidebarPhase,
    PageSidebarSurface,
} from "../../../StyledComponents/SidebarContent/SidebarContent";

const SIDEBAR_ID = "rightToLeftSidebar";

const EDGE = "left";

export const RightToLeftDocsExample = () => {
    const expanded = useState(false);

    const [isExpanded, setIsExpanded] = expanded;

    return (
        <div dir={"rtl"}>
            <PageSidebarFrame edge={EDGE}>
                <Sidebar
                    id={SIDEBAR_ID}
                    edge={EDGE}
                    collapsedSize={COLLAPSED_SIZE}
                    expandedSize={EXPANDED_SIZE}
                    expanded={expanded}
                    renderContent={(phase, transitionDurationMs) => (
                        <PageSidebarSurface width={EXPANDED_SIZE}>
                            <PageSidebarToggle
                                sidebarId={SIDEBAR_ID}
                                edge={EDGE}
                                isExpanded={isExpanded}
                                ariaLabel={isExpanded ? "Collapse mailboxes" : "Expand mailboxes"}
                                onToggle={() => setIsExpanded((wasExpanded) => !wasExpanded)}
                            />

                            <PageSidebarFade phase={phase} transitionDurationMs={transitionDurationMs}>
                                <PageSidebarPhase>{phase}</PageSidebarPhase>

                                {MAILBOXES.map((mailbox) => (
                                    <div key={mailbox}>{mailbox}</div>
                                ))}
                            </PageSidebarFade>
                        </PageSidebarSurface>
                    )}
                />

                <PageSidebarNeighbor>
                    The content beside the sidebar, which narrows as the sidebar grows.
                </PageSidebarNeighbor>
            </PageSidebarFrame>
        </div>
    );
};
