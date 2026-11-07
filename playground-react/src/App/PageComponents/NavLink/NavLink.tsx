import type { PropsWithChildren } from "react";
import { useState } from "react";
import { NavLink } from "react-router";

import {
    FloaterReactUtils,
    FloaterStyles,
    InteractionTrackerUtils,
    TREE_DEFAULTS,
} from "@thewaver/ss-components-react";
import { LINK_SELECTOR } from "@thewaver/ss-playground/App/PageComponents/NavLink/NavLink.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/NavLinkContent/NavLinkContent.css";

import { renderPageHighlightFloater } from "../../StyledComponents/GlideFloater/GlideFloater";
import { useLayerClass } from "../../StyledComponents/Layer/Layer.context";
import { NavLinkGroupContextProvider, useNavLinkGroupContext } from "./NavLink.context";
import type { PageNavLinkProps } from "./NavLinkReact.types";

const TRANSITION_DURATION_MS = TREE_DEFAULTS.floaterTransitionDurationMs;

export const PageNavLink = (props: PropsWithChildren<PageNavLinkProps>) => {
    const layerClass = useLayerClass();
    const groupContext = useNavLinkGroupContext();
    const [link, setLink] = useState<HTMLElement | null>(null);
    const isHovered = link !== null && groupContext?.highlightedLink === link;

    return (
        <NavLink ref={setLink} to={props.href} end={true} className={styles.navLink}>
            <div
                className={[
                    styles.navLinkContent,
                    layerClass,
                    (props.hasHoverFloater ?? false) ? styles.hasHoverFloater : styles.hasNoHoverFloater,
                    props.hasSelectionFloater && styles.hasSelectionFloater,
                    isHovered && styles.isHovered,
                    props.isSelected && styles.isSelected,
                ]
                    .filter(Boolean)
                    .join(" ")}
            >
                {props.children}
            </div>
        </NavLink>
    );
};

export const PageNavLinkGroup = (props: PropsWithChildren) => {
    const [root, setRoot] = useState<HTMLDivElement | null>(null);
    const [hoveredLink, setHoveredLink] = useState<HTMLElement>();
    const [focusVisibleLink, setFocusVisibleLink] = useState<HTMLElement>();

    const findLink = (target: EventTarget | null) => {
        const link = target instanceof Element ? target.closest(LINK_SELECTOR) : null;

        return link instanceof HTMLElement && root?.contains(link) ? link : undefined;
    };

    const readFocusVisibleLink = (target: EventTarget | null) => {
        const link = findLink(target);

        return link && InteractionTrackerUtils.computeIsFocusVisible(link) ? link : undefined;
    };

    const highlightedLink = hoveredLink ?? focusVisibleLink;

    const floater = FloaterReactUtils.useFloater({
        isEnabled: true,
        container: root ?? undefined,
        target: highlightedLink,
        transitionDurationMs: TRANSITION_DURATION_MS,
    });

    return (
        <div
            ref={setRoot}
            className={styles.navLinkGroup}
            onPointerOver={(e) => setHoveredLink(findLink(e.target))}
            onPointerLeave={() => setHoveredLink(undefined)}
            onFocus={(e) => setFocusVisibleLink(readFocusVisibleLink(e.target))}
            onBlur={() => setFocusVisibleLink(undefined)}
        >
            {floater.isRendered && (
                <div
                    ref={floater.ref}
                    className={FloaterStyles.floater}
                    style={{ ...floater.bounds, transitionDuration: `${TRANSITION_DURATION_MS}ms` }}
                >
                    {renderPageHighlightFloater(floater.visibilityTarget, TRANSITION_DURATION_MS)}
                </div>
            )}

            <NavLinkGroupContextProvider value={{ highlightedLink }}>{props.children}</NavLinkGroupContextProvider>
        </div>
    );
};
