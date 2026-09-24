import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components";

import type { TableOfContentsContentProps } from "./TableOfContentsContent.types";

import { themeVars } from "../../Theme.css";
import * as styles from "./TableOfContentsContent.css";

export const PageTableOfContentsContent = (props: ParentProps<TableOfContentsContentProps>) => {
    return (
        <span
            class={styles.tableOfContentsContent}
            style={{
                "margin-inline-start": `calc(${themeVars.spacing.double} * ${access(props.depth)})`,
            }}
            classList={{
                [styles.isCurrent]: access(props.flags).isCurrent,
                [styles.isHovered]: access(props.flags).isHovered,
            }}
        >
            {props.children}
        </span>
    );
};
