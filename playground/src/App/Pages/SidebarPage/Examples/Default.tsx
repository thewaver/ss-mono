import { For, createUniqueId } from "solid-js";

import { Sidebar } from "@thewaver/ss-components";

import {
    PageSidebarFade,
    PageSidebarFrame,
    PageSidebarNeighbor,
    PageSidebarPhase,
    PageSidebarSurface,
} from "../../../StyledComponents/SidebarContent/SidebarContent";
import { PageSidebarToggle } from "../../../StyledComponents/SidebarToggle/SidebarToggle";
import type { SidebarExampleProps } from "../SidebarPage.types";

type Props = SidebarExampleProps;

const COLLAPSED_WIDTH = 48;
const EXPANDED_WIDTH = 200;
const ENTRIES = ["Inbox", "Drafts", "Sent", "Archive", "Spam"];

export const DefaultExample = (props: Props) => {
    const sidebarId = createUniqueId();

    const [getIsExpanded, setIsExpanded] = props.expandedSignal;

    return (
        <PageSidebarFrame edge={props.edge}>
            <Sidebar
                id={() => sidebarId}
                edge={props.edge}
                layout={props.layout}
                collapsedWidth={() => COLLAPSED_WIDTH}
                expandedWidth={() => EXPANDED_WIDTH}
                isExpandedOnHover={props.isExpandedOnHover}
                expandedSignal={props.expandedSignal}
                renderContent={(getPhase, getTransitionDurationMs) => (
                    <PageSidebarSurface width={() => EXPANDED_WIDTH}>
                        <PageSidebarToggle
                            sidebarId={() => sidebarId}
                            edge={props.edge}
                            isExpanded={getIsExpanded}
                            ariaLabel={() => (getIsExpanded() ? "Collapse mailboxes" : "Expand mailboxes")}
                            onToggle={() => setIsExpanded((isExpanded) => !isExpanded)}
                        />

                        <PageSidebarFade phase={getPhase} transitionDurationMs={getTransitionDurationMs}>
                            <PageSidebarPhase>{getPhase()}</PageSidebarPhase>

                            <For each={ENTRIES}>{(entry) => <div>{entry}</div>}</For>
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
