import { For, createSignal } from "solid-js";

import { Sidebar } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
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
import type { SidebarHoverDocsExampleProps } from "../SidebarPageSolid.types";

const SIDEBAR_ID = "hoverSidebar";

type Props = SidebarHoverDocsExampleProps;

export const HoverDocsExample = (props: Props) => {
    const expanded = createSignal(false);

    const [getIsExpanded, setIsExpanded] = expanded;

    return (
        <>
            <PageSidebarFrame edge={"left"}>
                <Sidebar
                    id={SIDEBAR_ID}
                    layout={"overlay"}
                    collapsedSize={COLLAPSED_SIZE}
                    expandedSize={EXPANDED_SIZE}
                    isExpandedOnHover={props.isExpandedOnHover}
                    hoverShowDelayMs={props.hoverShowDelayMs}
                    expanded={expanded}
                    renderContent={(getPhase, getTransitionDurationMs) => (
                        <PageSidebarSurface width={EXPANDED_SIZE}>
                            <PageSidebarToggle
                                sidebarId={SIDEBAR_ID}
                                edge={"left"}
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
                    The content beside the sidebar. Rest the pointer on the sidebar to open it over this text.
                </PageSidebarNeighbor>
            </PageSidebarFrame>

            <div class={exampleStyles.exampleReadout} data-readout>{`Expanded: ${getIsExpanded() ? "yes" : "no"}`}</div>
        </>
    );
};
