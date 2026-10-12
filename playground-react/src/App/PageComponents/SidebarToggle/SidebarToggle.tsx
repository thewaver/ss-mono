import { InteractionWrapper } from "@thewaver/ss-components-react";

import { PageSidebarToggleButton } from "../../StyledComponents/SidebarToggleButton/SidebarToggleButton";
import type { SidebarToggleProps } from "./SidebarToggle.types";

export const PageSidebarToggle = (props: SidebarToggleProps) => {
    const isDisabled = props.isDisabled ?? false;

    return (
        <InteractionWrapper
            isDisabled={isDisabled}
            renderControl={(setElementRef, flags) => (
                <PageSidebarToggleButton
                    ref={setElementRef}
                    flags={flags}
                    edge={props.edge}
                    isExpanded={props.isExpanded}
                    aria-label={props.ariaLabel}
                    aria-expanded={props.isExpanded}
                    aria-controls={props.sidebarId}
                    aria-disabled={isDisabled || undefined}
                    onClick={() => {
                        if (!isDisabled) props.onToggle();
                    }}
                />
            )}
        />
    );
};
