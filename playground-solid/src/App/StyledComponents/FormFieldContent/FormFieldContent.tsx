import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/FormFieldContent/FormFieldContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { FormFieldMessageProps } from "./FormFieldContent.types";

export const PageFormFieldCaption = (props: ParentProps) => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.formFieldCaption, getLayerClass()].join(" ")}>{props.children}</div>;
};

export const PageFormFieldMessage = (props: ParentProps<FormFieldMessageProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.formFieldMessage}
            classList={{ [getLayerClass()]: true, [styles.hasError]: access(props.state).hasError }}
        >
            {props.children}
        </div>
    );
};

export const PageFormSectionCaption = (props: ParentProps) => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.formSectionCaption, getLayerClass()].join(" ")}>{props.children}</div>;
};

export const PageFormSectionBody = (props: ParentProps) => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.formSectionBody, getLayerClass()].join(" ")}>{props.children}</div>;
};

export const PageFormStack = (props: ParentProps) => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.formFieldStack, getLayerClass()].join(" ")}>{props.children}</div>;
};

export const PageFormButtons = (props: ParentProps) => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.formFieldButtons, getLayerClass()].join(" ")}>{props.children}</div>;
};
