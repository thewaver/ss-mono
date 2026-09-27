import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/FileInputContent/FileInputContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { FileInputContentProps } from "./FileInputContent.types";

const NO_FILES = "none picked";
const PICK_FILE_MARK = "⬆️";

export const PageFileInputContent = (props: FileInputContentProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.fileInputContent,
                layerClass,
                props.renderProps.isHovered && styles.isHovered,
                props.renderProps.isDisabled && styles.isDisabled,
                props.renderProps.hasError && styles.hasError,
            ]
                .filter(Boolean)
                .join(" ")}
            aria-hidden="true"
        >
            <div className={styles.fileInputPrompt}>{PICK_FILE_MARK}</div>

            <div
                className={[styles.fileInputNames, !props.renderProps.files.length && styles.isEmpty]
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
