import { access } from "@thewaver/ss-components";

import { useLayerClass } from "../Layer/Layer.context";
import type { FileDropZoneContentProps } from "./FileDropZoneContent.types";

import * as styles from "./FileDropZoneContent.css";

const NO_FILES = "none picked";

export const PageFileDropZoneContent = (props: FileDropZoneContentProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.fileDropZoneContent}
            classList={{
                [getLayerClass()]: true,
                [styles.isHovered]: access(props.renderProps).isHovered,
                [styles.isDragOver]: access(props.renderProps).isDragOver,
                [styles.isDisabled]: access(props.renderProps).isDisabled,
                [styles.hasError]: access(props.renderProps).hasError,
            }}
            aria-hidden="true"
        >
            <div class={styles.fileDropZonePrompt}>{access(props.prompt)}</div>

            <div
                class={styles.fileDropZoneNames}
                classList={{ [styles.isEmpty]: !access(props.renderProps).files.length }}
            >
                {access(props.renderProps).files.length
                    ? access(props.renderProps)
                          .files.map((file) => file.name)
                          .join(", ")
                    : NO_FILES}
            </div>
        </div>
    );
};
