import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/Icon/Icon.css";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import type { IconProps } from "./IconSolid.types";

export const PageIcon = (props: IconProps) => (
    <span
        class={styles.icon}
        style={assignInlineVars({ [styles.iconSource]: `url("${access(props.src)}")` })}
        aria-hidden="true"
    />
);
