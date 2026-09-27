import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/FormFieldContent/FormFieldContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { FormFieldMessageProps } from "./FormFieldContent.types";

export const PageFormFieldCaption = (props: PropsWithChildren) => {
    const layerClass = useLayerClass();

    return <div className={[styles.formFieldCaption, layerClass].join(" ")}>{props.children}</div>;
};

export const PageFormFieldMessage = (props: PropsWithChildren<FormFieldMessageProps>) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[styles.formFieldMessage, layerClass, props.state.hasError && styles.hasError]
                .filter(Boolean)
                .join(" ")}
        >
            {props.children}
        </div>
    );
};

export const PageFormSectionCaption = (props: PropsWithChildren) => {
    const layerClass = useLayerClass();

    return <div className={[styles.formSectionCaption, layerClass].join(" ")}>{props.children}</div>;
};

export const PageFormSectionBody = (props: PropsWithChildren) => {
    const layerClass = useLayerClass();

    return <div className={[styles.formSectionBody, layerClass].join(" ")}>{props.children}</div>;
};

export const PageFormStack = (props: PropsWithChildren) => {
    const layerClass = useLayerClass();

    return <div className={[styles.formFieldStack, layerClass].join(" ")}>{props.children}</div>;
};

export const PageFormButtons = (props: PropsWithChildren) => {
    const layerClass = useLayerClass();

    return <div className={[styles.formFieldButtons, layerClass].join(" ")}>{props.children}</div>;
};
