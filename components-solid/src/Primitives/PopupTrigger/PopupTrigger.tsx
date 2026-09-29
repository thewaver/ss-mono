import { PopupTriggerStyles as styles } from "@thewaver/ss-components";

import { LabelSolidUtils } from "../../Essentials/Input/Label/LabelSolid.utils";
import { access } from "../../Utils/propUtils";
import type { PopupTriggerProps } from "./PopupTriggerSolid.types";

export const PopupTrigger = (props: PopupTriggerProps) => {
    const getAriaLabel = LabelSolidUtils.resolveAriaLabel(
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
