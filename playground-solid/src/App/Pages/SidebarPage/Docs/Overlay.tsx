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
import type { SidebarOverlayDocsExampleProps } from "../SidebarPageSolid.types";

const SIDEBAR_ID = "overlaySidebar";

type Props = SidebarOverlayDocsExampleProps;

export const OverlayDocsExample = (props: Props) => {
    const expanded = createSignal(false);

    const [getIsExpanded, setIsExpanded] = expanded;

    return (
        <PageSidebarFrame edge={"right"}>
            <Sidebar
                id={SIDEBAR_ID}
                edge={"right"}
                layout={props.layout}
                collapsedSize={COLLAPSED_SIZE}
                expandedSize={EXPANDED_SIZE}
                expanded={expanded}
                renderContent={(getPhase, getTransitionDurationMs) => (
                    <PageSidebarSurface width={EXPANDED_SIZE}>
                        <PageSidebarToggle
                            sidebarId={SIDEBAR_ID}
                            edge={"right"}
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
                The content beside the sidebar. Overlaid, it stays where it is and the sidebar grows over it; pushed, it
                narrows as the sidebar grows.
            </PageSidebarNeighbor>
        </PageSidebarFrame>
    );
};
