import type { ParentProps } from "solid-js";
import { Show } from "solid-js";

import type { InteractionFlags, SelectFlags, TextFieldTextStyle } from "@thewaver/ss-components-solid";
import { access } from "@thewaver/ss-components-solid";
import { layerVars } from "@thewaver/ss-playground-core/App/StyledComponents/Layer/Layer.css";
import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/SelectContent/SelectContent.css";
import { themeVars } from "@thewaver/ss-playground-core/App/Theme.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { SelectContentProps } from "./SelectContent.types";

export const computePageSelectTextStyle = (getFlags: () => InteractionFlags<SelectFlags>): TextFieldTextStyle => ({
    "color": getFlags().isDisabled ? `rgb(from ${layerVars.contrast} r g b / 50%)` : layerVars.contrast,
    "caret-color": themeVars.color.primary.main,
    "font-size": styles.FIELD_FONT_SIZE,
    "line-height": styles.FIELD_LINE_HEIGHT,
});

export const PageSelectContent = (props: ParentProps<SelectContentProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.selectContent}
            style={{ width: props.width ? `${access(props.width)}px` : undefined }}
            classList={{
                [getLayerClass()]: true,
                [styles.isEmpty]: access(props.flags).isEmpty,
                [styles.isFiltering]: access(props.flags).isFiltering,
                [styles.isHovered]: access(props.flags).isHovered,
                [styles.isActive]: access(props.flags).isActive,
                [styles.isOpen]: access(props.flags).isOpen,
                [styles.isDisabled]: access(props.flags).isDisabled,
                [styles.hasError]: access(props.flags).hasError,
            }}
        >
            <div class={styles.selectValue}>{props.children}</div>
            <Show when={access(props.hasClearSpace) && !access(props.flags).isEmpty}>
                <div class={styles.selectClearSpace} />
            </Show>
            <div class={styles.selectChevron} />
        </div>
    );
};
