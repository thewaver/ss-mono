import type { ParentProps } from "solid-js";
import { Show } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/SelectContent/SelectContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { SelectContentProps } from "./SelectContentSolid.types";

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
