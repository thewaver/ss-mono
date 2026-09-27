import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/NavMenuContent/NavMenuContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { NavMenuTriggerProps } from "./NavMenuContent.types";

export const PageNavMenuTrigger = (props: PropsWithChildren<NavMenuTriggerProps>) => {
    const layerClass = useLayerClass();

    return (
        <span
            className={[
                styles.navMenuTrigger,
                layerClass,
                props.flags.isHovered && styles.isHovered,
                props.flags.isOpen && styles.isOpen,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {props.children}

            <span className={styles.navMenuChevron} aria-hidden="true">
                {"▾"}
            </span>
        </span>
    );
};
