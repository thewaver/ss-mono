import { For, Show } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import { NO_FILES } from "@thewaver/ss-playground/App/StyledComponents/FileDropZoneContent/FileDropZoneContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/FileDropZoneContent/FileDropZoneContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { FileDropZoneContentProps } from "./FileDropZoneContentSolid.types";

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
                <Show when={access(props.renderProps).files.length} fallback={NO_FILES}>
                    <For each={access(props.renderProps).files}>
                        {(file, getIndex) => (
                            <>
                                {getIndex() > 0 && ", "}
                                <bdi>{file.name}</bdi>
                            </>
                        )}
                    </For>
                </Show>
            </div>
        </div>
    );
};
