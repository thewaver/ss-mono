import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/ButtonPage/ButtonPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { ButtonContentProps } from "../../../StyledComponents/ButtonContent/ButtonContentSolid.types";

export const PressedButtonContent = (props: ParentProps<ButtonContentProps>) => (
    <div class={styles.pressedContent} classList={{ [styles.isPressed]: access(props.flags).isPressed }}>
        <PageButtonContent flags={props.flags}>{props.children}</PageButtonContent>
    </div>
);
