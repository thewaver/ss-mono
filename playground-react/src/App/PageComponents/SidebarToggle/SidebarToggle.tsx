import { InteractionWrapper } from "@thewaver/ss-components-react";

import { PageSidebarToggleButton } from "../../StyledComponents/SidebarToggleButton/SidebarToggleButton";
import type { SidebarToggleProps } from "./SidebarToggle.types";

export const PageSidebarToggle = (props: SidebarToggleProps) => {
    return (
        <InteractionWrapper
            renderControl={(setElementRef, flags) => (
                <PageSidebarToggleButton
                    ref={setElementRef}
                    flags={flags}
                    edge={props.edge}
                    isExpanded={props.isExpanded}
                    aria-label={props.ariaLabel}
                    aria-expanded={props.isExpanded}
                    aria-controls={props.sidebarId}
                    onClick={() => props.onToggle()}
                />
            )}
        />
    );
};
