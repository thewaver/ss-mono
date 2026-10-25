import { PopupTriggerStyles } from "@thewaver/ss-components";

import type { PopupTriggerProps } from "./PopupTrigger.types";

export const PopupTrigger = (props: PopupTriggerProps) => {
    const isDisabled = props.flags.isDisabled ?? false;

    return (
        <button
            id={props.id}
            ref={props.ref}
            type="button"
            className={PopupTriggerStyles.popupTrigger}
            aria-label={props.ariaLabel}
            aria-haspopup="dialog"
            aria-expanded={props.isOpen}
            aria-controls={props.isOpen ? props.popupId : undefined}
            aria-disabled={isDisabled || undefined}
            onClick={() => {
                if (isDisabled) return;

                props.onToggle();
            }}
        >
            {props.renderContent(props.flags)}
        </button>
    );
};
