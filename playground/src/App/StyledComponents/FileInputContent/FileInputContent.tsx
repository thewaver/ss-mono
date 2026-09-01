import { access } from "@thewaver/ss-components";

import type { FileInputContentProps } from "./FileInputContent.types";

import * as styles from "./FileInputContent.css";

const NO_FILES = "none picked";
const PICK_FILE_MARK = "⬆️";

export const PageFileInputContent = (props: FileInputContentProps) => {
    return (
        <div
            class={styles.fileInputContent}
            classList={{
                [styles.isHovered]: access(props.renderProps).isHovered,
                [styles.isDisabled]: access(props.renderProps).isDisabled,
                [styles.hasError]: access(props.renderProps).hasError,
            }}
            aria-hidden="true"
        >
            <div class={styles.fileInputPrompt}>{PICK_FILE_MARK}</div>

            <div
                class={styles.fileInputNames}
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
