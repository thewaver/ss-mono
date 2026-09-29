import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/NumberInputStepperContent/NumberInputStepperContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { NumberInputStepperContentProps } from "./NumberInputStepperContent.types";

export const PageNumberInputStepperFrame = (props: PropsWithChildren) => (
    <div className={styles.numberInputStepper}>{props.children}</div>
);

export const PageNumberInputStepperContent = (props: PropsWithChildren<NumberInputStepperContentProps>) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.numberInputStepperButton,
                layerClass,
                props.flags.isHovered && styles.isHovered,
                props.flags.isDisabled && styles.isDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <span aria-hidden="true">{props.direction === "up" ? "▲" : "▼"}</span>
            <span className={styles.numberInputStepperName}>{props.children}</span>
        </div>
    );
};
