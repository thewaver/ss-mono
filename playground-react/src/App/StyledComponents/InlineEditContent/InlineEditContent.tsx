import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/InlineEditContent/InlineEditContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { InlineEditContentProps } from "./InlineEditContent.types";

export const PageInlineEditContent = (props: PropsWithChildren<InlineEditContentProps>) => {
    const layerClass = useLayerClass();

    const isHinted = !props.flags.isDisabled && (props.flags.isHovered === true || props.flags.isFocusVisible === true);

    return (
        <div
            className={[
                styles.inlineEditContent,
                layerClass,
                isHinted && styles.isHinted,
                props.flags.isDisabled && styles.isDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <span className={styles.inlineEditText}>{props.children}</span>

            <span className={styles.inlineEditGlyph} aria-hidden="true">
                ✎
            </span>
        </div>
    );
};
