import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components";

import { useLayerClass } from "../Layer/Layer.context";
import type { InlineEditContentProps } from "./InlineEditContent.types";

import * as styles from "./InlineEditContent.css";

export const PageInlineEditContent = (props: ParentProps<InlineEditContentProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.inlineEditContent}
            classList={{
                [getLayerClass()]: true,
                [styles.isHinted]:
                    !access(props.flags).isDisabled &&
                    (access(props.flags).isHovered === true || access(props.flags).isFocusVisible === true),
                [styles.isDisabled]: access(props.flags).isDisabled,
            }}
        >
            <span class={styles.inlineEditText}>{props.children}</span>

            <span class={styles.inlineEditGlyph} aria-hidden="true">
                ✎
            </span>
        </div>
    );
};
