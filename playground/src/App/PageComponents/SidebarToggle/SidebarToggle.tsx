import { InteractionWrapper, access } from "@thewaver/ss-components";

import { PageSidebarToggleButton } from "../../StyledComponents/SidebarToggleButton/SidebarToggleButton";
import type { SidebarToggleProps } from "./SidebarToggle.types";

export const PageSidebarToggle = (props: SidebarToggleProps) => {
    return (
        <InteractionWrapper
            renderControl={(setElementRef, getFlags) => (
                <PageSidebarToggleButton
                    ref={setElementRef}
                    flags={getFlags}
                    edge={props.edge}
                    isExpanded={props.isExpanded}
                    aria-label={access(props.ariaLabel)}
                    aria-expanded={access(props.isExpanded)}
                    aria-controls={access(props.sidebarId)}
                    onClick={() => props.onToggle()}
                />
            )}
        />
    );
};
