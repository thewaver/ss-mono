import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/TableOfContentsContent/TableOfContentsContent.css";
import { themeVars } from "@thewaver/ss-playground-core/App/Theme.css";

import type { TableOfContentsContentProps } from "./TableOfContentsContent.types";

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
