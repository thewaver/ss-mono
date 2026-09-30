import type { PropsWithChildren } from "react";
import { NavLink } from "react-router";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/NavLinkContent/NavLinkContent.css";

import { useLayerClass } from "../../StyledComponents/Layer/Layer.context";
import type { PageNavLinkProps } from "./NavLink.types";

export const PageNavLink = (props: PropsWithChildren<PageNavLinkProps>) => {
    const layerClass = useLayerClass();

    return (
        <NavLink
            to={props.href}
            end={true}
            className={[styles.navLinkContent, layerClass, props.isSelected && styles.isSelected]
                .filter(Boolean)
                .join(" ")}
        >
            {props.children}
        </NavLink>
    );
};
