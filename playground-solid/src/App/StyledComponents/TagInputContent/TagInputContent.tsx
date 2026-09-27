import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/TagInputContent/TagInputContent.css";
import * as fieldStyles from "@thewaver/ss-playground-core/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TagContentProps, TagInputContentProps } from "./TagInputContent.types";

export const PageTagInputContent = (props: TagInputContentProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.tagInputContent}
            classList={{
                [getLayerClass()]: true,
                [fieldStyles.isHovered]: access(props.flags).isHovered,
                [fieldStyles.isDisabled]: access(props.flags).isDisabled,
                [fieldStyles.hasError]: access(props.flags).hasError,
            }}
        />
    );
};

export const PageTagContent = (props: ParentProps<TagContentProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.tagContent}
            classList={{
                [getLayerClass()]: true,
                [styles.isHovered]: access(props.flags).isHovered,
                [styles.isFocused]: access(props.flags).isFocusVisible,
                [styles.isDisabled]: access(props.flags).isDisabled,
            }}
        >
            {props.children}

            <span class={styles.tagRemove} aria-hidden="true">
                ✕
            </span>
        </div>
    );
};

export const PageTagInputPlaceholder = (props: ParentProps) => {
    const getLayerClass = useLayerClass();

    return <span class={[styles.tagInputPlaceholder, getLayerClass()].join(" ")}>{props.children}</span>;
};
