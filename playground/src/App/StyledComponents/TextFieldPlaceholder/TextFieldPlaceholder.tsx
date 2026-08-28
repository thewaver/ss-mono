import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components";

import type { TextFieldPlaceholderProps } from "./TextFieldPlaceholder.types";

import * as styles from "../TextFieldContent/TextFieldContent.css";

export const PageTextFieldPlaceholder = (props: ParentProps<TextFieldPlaceholderProps>) => {
    return (
        <div
            class={styles.textFieldPlaceholder}
            classList={{
                [styles.isTopAligned]: access(props.isTopAligned),
                [styles.isEmpty]: access(props.flags).isEmpty,
            }}
            aria-hidden="true"
        >
            {props.children}
        </div>
    );
};
