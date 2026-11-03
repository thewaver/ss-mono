import * as styles from "@thewaver/ss-playground/App/StyledComponents/Icon/Icon.css";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import type { IconProps } from "./IconReact.types";

export const PageIcon = (props: IconProps) => (
    <span
        className={styles.icon}
        style={assignInlineVars({ [styles.iconSource]: `url("${props.src}")` })}
        aria-hidden="true"
    />
);
