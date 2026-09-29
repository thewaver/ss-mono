import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/ModalPanel/ModalPanel.css";

import { PageLayer } from "../../PageComponents/Layer/Layer";
import type { ModalHintProps, ModalPanelProps } from "./ModalPanel.types";

export const PageModalPanel = (props: PropsWithChildren<ModalPanelProps>) => {
    return (
        <div
            className={props.visibilityTarget === 1 ? styles.modalPanelOn : styles.modalPanelOff}
            style={{ transition: `transform ${props.transitionDurationMs}ms`, padding: props.padding }}
        >
            <PageLayer level={1}>{props.children}</PageLayer>
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
