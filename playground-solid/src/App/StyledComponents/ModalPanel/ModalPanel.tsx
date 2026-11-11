import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ModalPanel/ModalPanel.css";

import { PageLayer } from "../../PageComponents/Layer/Layer";
import { useNextLayerClass } from "../Layer/Layer.context";
import type { ModalHintProps, ModalPanelProps } from "./ModalPanelSolid.types";

export const PageModalPanel = (props: ParentProps<ModalPanelProps>) => {
    const getNextLayerClass = useNextLayerClass();

    return (
        <div
            class={[
                access(props.visibilityTarget) === 1 ? styles.modalPanelOn : styles.modalPanelOff,
                getNextLayerClass(),
            ].join(" ")}
            style={{ transition: `transform ${access(props.transitionDurationMs)}ms`, padding: access(props.padding) }}
        >
            <PageLayer>{props.children}</PageLayer>
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
