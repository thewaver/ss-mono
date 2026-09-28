import * as styles from "@thewaver/ss-playground/App/StyledComponents/FileDropZoneContent/FileDropZoneContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { FileDropZoneContentProps } from "./FileDropZoneContent.types";

const NO_FILES = "none picked";

export const PageFileDropZoneContent = (props: FileDropZoneContentProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.fileDropZoneContent,
                layerClass,
                props.renderProps.isHovered && styles.isHovered,
                props.renderProps.isDragOver && styles.isDragOver,
                props.renderProps.isDisabled && styles.isDisabled,
                props.renderProps.hasError && styles.hasError,
            ]
                .filter(Boolean)
                .join(" ")}
            aria-hidden="true"
        >
            <div className={styles.fileDropZonePrompt}>{props.prompt}</div>

            <div
                className={[styles.fileDropZoneNames, !props.renderProps.files.length && styles.isEmpty]
                    .filter(Boolean)
                    .join(" ")}
            >
                {props.renderProps.files.length
                    ? props.renderProps.files.map((file) => file.name).join(", ")
                    : NO_FILES}
            </div>
        </div>
    );
};
