import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components";

import { PageLayer } from "../../PageComponents/Layer/Layer";
import type { ModalHintProps, ModalPanelProps } from "./ModalPanel.types";

import * as styles from "./ModalPanel.css";

export const PageModalPanel = (props: ParentProps<ModalPanelProps>) => {
    return (
        <div
            class={access(props.visibilityTarget) === 1 ? styles.modalPanelOn : styles.modalPanelOff}
            style={{ transition: `transform ${access(props.transitionDurationMs)}ms`, padding: access(props.padding) }}
        >
            <PageLayer level={1}>{props.children}</PageLayer>
        </div>
    );
};

export const PageModalHint = (props: ParentProps<ModalHintProps>) => {
    return (
        <div id={access(props.id)} class={styles.modalHint}>
            {props.children}
        </div>
    );
};
