import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground/App/Pages/ButtonPage/ButtonPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { ButtonContentProps } from "../../../StyledComponents/ButtonContent/ButtonContentReact.types";

export const PressedButtonContent = (props: PropsWithChildren<ButtonContentProps>) => (
    <div className={[styles.pressedContent, props.flags.isPressed && styles.isPressed].filter(Boolean).join(" ")}>
        <PageButtonContent flags={props.flags}>{props.children}</PageButtonContent>
    </div>
);
