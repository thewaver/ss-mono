import { For, Show } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import {
    NO_FILES,
    PICK_FILE_MARK,
} from "@thewaver/ss-playground/App/StyledComponents/FileInputContent/FileInputContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/FileInputContent/FileInputContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { FileInputContentProps } from "./FileInputContentSolid.types";

export const PageFileInputContent = (props: FileInputContentProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.fileInputContent}
            classList={{
                [getLayerClass()]: true,
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
