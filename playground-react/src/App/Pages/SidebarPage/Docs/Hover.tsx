import { useState } from "react";

import { Sidebar } from "@thewaver/ss-components-react";
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
import type { SidebarHoverDocsExampleProps } from "../SidebarPageReact.types";

const SIDEBAR_ID = "hoverSidebar";

type Props = SidebarHoverDocsExampleProps;

export const HoverDocsExample = (props: Props) => {
    const expanded = useState(false);

    const [isExpanded, setIsExpanded] = expanded;

    return (
        <>
            <PageSidebarFrame edge={"left"}>
                <Sidebar
                    id={SIDEBAR_ID}
                    layout={"overlay"}
                    isExpandedOnHover={props.isExpandedOnHover}
                    hoverShowDelayMs={props.hoverShowDelayMs}
                    collapsedSize={COLLAPSED_SIZE}
                    expandedSize={EXPANDED_SIZE}
                    expanded={expanded}
                    renderContent={(phase, transitionDurationMs) => (
                        <PageSidebarSurface width={EXPANDED_SIZE}>
                            <PageSidebarToggle
                                sidebarId={SIDEBAR_ID}
                                edge={"left"}
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
                    The content beside the sidebar. Rest the pointer on the sidebar to open it over this text.
                </PageSidebarNeighbor>
            </PageSidebarFrame>

            <div className={exampleStyles.exampleReadout} data-readout>{`Expanded: ${isExpanded ? "yes" : "no"}`}</div>
        </>
    );
};
