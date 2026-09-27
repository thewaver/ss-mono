import { useId, useState } from "react";

import type { SidebarEdge, SidebarLayout } from "@thewaver/ss-components";

import { Sidebar } from "../../src";

const COLLAPSED_WIDTH = 48;
const EXPANDED_WIDTH = 200;
const FRAME_WIDTH = 600;
const FRAME_HEIGHT = 300;
const HOVER_DELAY_MS = 0;
const ENTRIES = ["Inbox", "Drafts", "Sent", "Archive"];

type DefaultProps = {
    edge?: SidebarEdge;
    layout?: SidebarLayout;
    isExpandedOnHover?: boolean;
    isInitiallyExpanded?: boolean;
};

export const Default = ({ edge, layout, isExpandedOnHover = false, isInitiallyExpanded = false }: DefaultProps) => {
    const sidebarId = useId();
    const popupId = useId();
    const expandedState = useState(isInitiallyExpanded);
    const [isExpanded, setIsExpanded] = expandedState;
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    return (
        <>
            <div
                data-testid="frame"
                style={{
                    display: "flex",
                    flexDirection: edge === "right" ? "row-reverse" : "row",
                    width: FRAME_WIDTH,
                    height: FRAME_HEIGHT,
                }}
            >
                <Sidebar
                    id={sidebarId}
                    edge={edge}
                    layout={layout}
                    collapsedWidth={COLLAPSED_WIDTH}
                    expandedWidth={EXPANDED_WIDTH}
                    isExpandedOnHover={isExpandedOnHover}
                    hoverShowDelayMs={HOVER_DELAY_MS}
                    expandedState={expandedState}
                    renderContent={(phase, durationMs) => (
                        <div
                            data-testid="surface"
                            data-duration={durationMs}
                            style={{ width: "100%", height: "100%", overflow: "hidden", background: "#ddd" }}
                        >
                            <button
                                type="button"
                                data-testid="toggle"
                                aria-controls={sidebarId}
                                aria-expanded={isExpanded}
                                onClick={() => setIsExpanded(!isExpanded)}
                            >
                                Toggle
                            </button>
                            <button
                                type="button"
                                data-testid="popupTrigger"
                                aria-controls={popupId}
                                aria-expanded={isPopupOpen}
                                onClick={() => setIsPopupOpen(!isPopupOpen)}
                            >
                                Settings
                            </button>
                            <div data-readout="phase">{phase}</div>
                            {ENTRIES.map((entry) => (
                                <div key={entry}>{entry}</div>
                            ))}
                        </div>
                    )}
                />
                <div data-testid="neighbor" style={{ flexGrow: 1, minWidth: 0 }}>
                    The content beside the sidebar.
                </div>
            </div>
            {isPopupOpen && (
                <div id={popupId} data-testid="popup">
                    <button type="button" data-testid="closePopup" onClick={() => setIsPopupOpen(false)}>
                        Close
                    </button>
                </div>
            )}
            <output data-readout="expanded">{`expanded: ${String(isExpanded)}`}</output>
        </>
    );
};
