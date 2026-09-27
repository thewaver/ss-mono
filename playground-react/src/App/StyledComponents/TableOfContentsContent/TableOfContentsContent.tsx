import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/TableOfContentsContent/TableOfContentsContent.css";
import { themeVars } from "@thewaver/ss-playground-core/App/Theme.css";

import type { TableOfContentsContentProps } from "./TableOfContentsContent.types";

export const PageTableOfContentsContent = (props: PropsWithChildren<TableOfContentsContentProps>) => {
    return (
        <span
            className={[
                styles.tableOfContentsContent,
                props.flags.isCurrent && styles.isCurrent,
                props.flags.isHovered && styles.isHovered,
            ]
                .filter(Boolean)
                .join(" ")}
            style={{
                marginInlineStart: `calc(${themeVars.spacing.double} * ${props.depth})`,
            }}
        >
            {props.children}
        </span>
    );
};
