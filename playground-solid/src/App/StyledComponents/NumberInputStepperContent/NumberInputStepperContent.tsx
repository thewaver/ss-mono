import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/NumberInputStepperContent/NumberInputStepperContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { NumberInputStepperContentProps } from "./NumberInputStepperContent.types";

export const PageNumberInputStepperFrame = (props: ParentProps) => (
    <div class={styles.numberInputStepper}>{props.children}</div>
);

export const PageNumberInputStepperContent = (props: ParentProps<NumberInputStepperContentProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.numberInputStepperButton}
            classList={{
                [getLayerClass()]: true,
                [styles.isHovered]: access(props.flags).isHovered,
                [styles.isDisabled]: access(props.flags).isDisabled,
            }}
        >
            <span aria-hidden="true">{access(props.direction) === "up" ? "▲" : "▼"}</span>
            <span class={styles.numberInputStepperName}>{props.children}</span>
        </div>
    );
};
