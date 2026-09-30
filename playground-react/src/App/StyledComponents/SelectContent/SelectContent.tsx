import type { PropsWithChildren } from "react";

import type { InteractionFlags, SelectFlags, TextFieldTextStyle } from "@thewaver/ss-components-react";
import { layerVars } from "@thewaver/ss-playground/App/StyledComponents/Layer/Layer.css";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/SelectContent/SelectContent.css";
import { themeVars } from "@thewaver/ss-playground/App/Theme.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { SelectContentProps } from "./SelectContent.types";

export const computePageSelectTextStyle = (flags: InteractionFlags<SelectFlags>): TextFieldTextStyle => ({
    color: flags.isDisabled ? `rgb(from ${layerVars.contrast} r g b / 50%)` : layerVars.contrast,
    caretColor: themeVars.color.primary.main,
    fontSize: styles.FIELD_FONT_SIZE,
});

export const PageSelectContent = (props: PropsWithChildren<SelectContentProps>) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.selectContent,
                layerClass,
                props.flags.isEmpty && styles.isEmpty,
                props.flags.isFiltering && styles.isFiltering,
                props.flags.isHovered && styles.isHovered,
                props.flags.isActive && styles.isActive,
                props.flags.isOpen && styles.isOpen,
                props.flags.isDisabled && styles.isDisabled,
                props.flags.hasError && styles.hasError,
            ]
                .filter(Boolean)
                .join(" ")}
            style={{ width: props.width ? `${props.width}px` : undefined }}
        >
            <div className={styles.selectValue}>{props.children}</div>
            {props.hasClearSpace && !props.flags.isEmpty && <div className={styles.selectClearSpace} />}
            <div className={styles.selectChevron} />
        </div>
    );
};
