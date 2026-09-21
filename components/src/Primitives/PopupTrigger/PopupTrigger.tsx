import { LabelUtils } from "../../Essentials/Input/Label/Label.utils";
import { access } from "../../Utils/propUtils";
import type { PopupTriggerProps } from "./PopupTrigger.types";

import * as styles from "./PopupTrigger.css";

export const PopupTrigger = (props: PopupTriggerProps) => {
    const getAriaLabel = LabelUtils.resolveAriaLabel(
        props.ariaLabel === undefined ? undefined : () => access(props.ariaLabel)!,
    );

    const getIsDisabled = () => access(props.flags).isDisabled ?? false;

    return (
        <button
            id={access(props.id)}
            ref={(element) => props.ref?.(element)}
            type="button"
            class={styles.popupTrigger}
            aria-label={getAriaLabel()}
            aria-haspopup="dialog"
            aria-expanded={access(props.isOpen)}
            aria-controls={access(props.isOpen) ? access(props.popupId) : undefined}
            aria-disabled={getIsDisabled() || undefined}
            onClick={() => {
                if (getIsDisabled()) return;

                props.onToggle();
            }}
        >
            {props.renderContent(() => access(props.flags))}
        </button>
    );
};
