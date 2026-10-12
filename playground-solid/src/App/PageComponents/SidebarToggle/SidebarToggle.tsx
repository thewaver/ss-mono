import { InteractionWrapper, access } from "@thewaver/ss-components-solid";

import { PageSidebarToggleButton } from "../../StyledComponents/SidebarToggleButton/SidebarToggleButton";
import type { SidebarToggleProps } from "./SidebarToggle.types";

export const PageSidebarToggle = (props: SidebarToggleProps) => {
    const getIsDisabled = () => access(props.isDisabled) ?? false;

    return (
        <InteractionWrapper
            isDisabled={getIsDisabled}
            renderControl={(setElementRef, getFlags) => (
                <PageSidebarToggleButton
                    ref={setElementRef}
                    flags={getFlags}
                    edge={props.edge}
                    isExpanded={props.isExpanded}
                    aria-label={access(props.ariaLabel)}
                    aria-expanded={access(props.isExpanded)}
                    aria-controls={access(props.sidebarId)}
                    aria-disabled={getIsDisabled() || undefined}
                    onClick={() => {
                        if (!getIsDisabled()) props.onToggle();
                    }}
                />
            )}
        />
    );
};
