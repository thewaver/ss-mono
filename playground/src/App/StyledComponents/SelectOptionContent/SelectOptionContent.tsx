import type { ParentProps } from "solid-js";
import { Show } from "solid-js";

import { access } from "@thewaver/ss-components";

import { useLayerClass } from "../Layer/Layer.context";
import type { SelectOptionContentProps } from "./SelectOptionContent.types";

import * as styles from "./SelectOptionContent.css";

export const PageSelectOptionContent = (props: ParentProps<SelectOptionContentProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.selectOptionContent}
            classList={{
                [getLayerClass()]: true,
                [styles.isHovered]: access(props.flags).isHovered,
                [styles.isHighlighted]: access(props.flags).isHighlighted,
                [styles.isSelected]: access(props.flags).isSelected,
                [styles.isDisabled]: access(props.flags).isDisabled,
            }}
        >
            <div class={styles.selectOptionText}>
                <div>{props.children}</div>

                <Show when={access(props.description)}>
                    {(getDescription) => <div class={styles.selectOptionDescription}>{getDescription()}</div>}
                </Show>
            </div>

            <div class={styles.selectOptionMark} aria-hidden="true">
                ✓
            </div>
        </div>
    );
};
