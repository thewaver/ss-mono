import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/ModalPanel/ModalPanel.css";

import { PageLayer } from "../../PageComponents/Layer/Layer";
import { useNextLayerClass } from "../Layer/Layer.context";
import type { ModalHintProps, ModalPanelProps } from "./ModalPanelReact.types";

export const PageModalPanel = (props: PropsWithChildren<ModalPanelProps>) => {
    const nextLayerClass = useNextLayerClass();

    return (
        <div
            className={[props.visibilityTarget === 1 ? styles.modalPanelOn : styles.modalPanelOff, nextLayerClass].join(
                " ",
            )}
            style={{ transition: `transform ${props.transitionDurationMs}ms`, padding: props.padding }}
        >
            <PageLayer>{props.children}</PageLayer>
        </div>
    );
};

export const PageModalHint = (props: PropsWithChildren<ModalHintProps>) => {
    return (
        <div id={props.id} className={styles.modalHint}>
            {props.children}
        </div>
    );
};
