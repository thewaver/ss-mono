import { InteractionWrapper, access } from "@thewaver/ss-components";

import type { SidebarToggleProps } from "./SidebarToggle.types";

import * as styles from "./SidebarToggle.css";

const OPEN_TOWARDS_RIGHT = "›";
const OPEN_TOWARDS_LEFT = "‹";

export const PageSidebarToggle = (props: SidebarToggleProps) => {
    const getIsPointingRight = () => (access(props.edge) === "left") !== access(props.isExpanded);

    return (
        <InteractionWrapper
            renderControl={(setElementRef, getFlags) => (
                <button
                    ref={setElementRef}
                    type="button"
                    class={styles.sidebarToggle}
                    classList={{ [styles.isHovered]: getFlags().isHovered }}
                    aria-label={access(props.ariaLabel)}
                    aria-expanded={access(props.isExpanded)}
                    aria-controls={access(props.sidebarId)}
                    onClick={() => props.onToggle()}
                >
                    <span aria-hidden="true">{getIsPointingRight() ? OPEN_TOWARDS_RIGHT : OPEN_TOWARDS_LEFT}</span>
                </button>
            )}
        />
    );
};
