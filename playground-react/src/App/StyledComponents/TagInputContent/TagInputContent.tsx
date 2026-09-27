import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/TagInputContent/TagInputContent.css";
import * as fieldStyles from "@thewaver/ss-playground-core/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TagContentProps, TagInputContentProps } from "./TagInputContent.types";

export const PageTagInputContent = (props: TagInputContentProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.tagInputContent,
                layerClass,
                props.flags.isHovered && fieldStyles.isHovered,
                props.flags.isDisabled && fieldStyles.isDisabled,
                props.flags.hasError && fieldStyles.hasError,
            ]
                .filter(Boolean)
                .join(" ")}
        />
    );
};

export const PageTagContent = (props: PropsWithChildren<TagContentProps>) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.tagContent,
                layerClass,
                props.flags.isHovered && styles.isHovered,
                props.flags.isFocusVisible && styles.isFocused,
                props.flags.isDisabled && styles.isDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {props.children}

            <span className={styles.tagRemove} aria-hidden="true">
                ✕
            </span>
        </div>
    );
};

export const PageTagInputPlaceholder = (props: PropsWithChildren) => {
    const layerClass = useLayerClass();

    return <span className={[styles.tagInputPlaceholder, layerClass].join(" ")}>{props.children}</span>;
};
