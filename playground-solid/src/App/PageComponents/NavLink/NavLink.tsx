import type { ParentProps } from "solid-js";

import { A } from "@solidjs/router";
import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/NavLinkContent/NavLinkContent.css";

import { useLayerClass } from "../../StyledComponents/Layer/Layer.context";
import type { PageNavLinkProps } from "./NavLink.types";

export const PageNavLink = (props: ParentProps<PageNavLinkProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <A
            href={access(props.href)}
            end={true}
            class={styles.navLinkContent}
            classList={{
                [getLayerClass()]: true,
                [styles.isSelected]: access(props.isSelected),
            }}
        >
            {props.children}
        </A>
    );
};
