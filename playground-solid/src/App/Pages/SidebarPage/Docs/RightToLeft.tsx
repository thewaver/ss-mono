import { For, createSignal } from "solid-js";

import { Sidebar } from "@thewaver/ss-components-solid";
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
    const expanded = createSignal(false);

    const [getIsExpanded, setIsExpanded] = expanded;

    return (
        <div dir={"rtl"}>
            <PageSidebarFrame edge={EDGE}>
                <Sidebar
                    id={SIDEBAR_ID}
                    edge={EDGE}
                    collapsedSize={COLLAPSED_SIZE}
                    expandedSize={EXPANDED_SIZE}
                    expanded={expanded}
                    renderContent={(getPhase, getTransitionDurationMs) => (
                        <PageSidebarSurface width={EXPANDED_SIZE}>
                            <PageSidebarToggle
                                sidebarId={SIDEBAR_ID}
                                edge={EDGE}
                                isExpanded={getIsExpanded}
                                ariaLabel={() => (getIsExpanded() ? "Collapse mailboxes" : "Expand mailboxes")}
                                onToggle={() => setIsExpanded((isExpanded) => !isExpanded)}
                            />

                            <PageSidebarFade phase={getPhase} transitionDurationMs={getTransitionDurationMs}>
                                <PageSidebarPhase>{getPhase()}</PageSidebarPhase>

                                <For each={MAILBOXES}>{(mailbox) => <div>{mailbox}</div>}</For>
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
