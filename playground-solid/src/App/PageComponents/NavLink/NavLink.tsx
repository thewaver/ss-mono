import { type ParentProps, Show, createSelector, createSignal } from "solid-js";

import { A } from "@solidjs/router";
import {
    FloaterSolidUtils,
    FloaterStyles,
    InteractionTrackerUtils,
    TREE_DEFAULTS,
    access,
} from "@thewaver/ss-components-solid";
import { LINK_SELECTOR } from "@thewaver/ss-playground/App/PageComponents/NavLink/NavLink.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/NavLinkContent/NavLinkContent.css";

import { renderPageHighlightFloater } from "../../StyledComponents/GlideFloater/GlideFloater";
import { useLayerClass } from "../../StyledComponents/Layer/Layer.context";
import { NavLinkGroupContextProvider, useNavLinkGroupContext } from "./NavLink.context";
import type { PageNavLinkProps } from "./NavLinkSolid.types";

const getTransitionDurationMs = () => TREE_DEFAULTS.floaterTransitionDurationMs;

export const PageNavLink = (props: ParentProps<PageNavLinkProps>) => {
    const getLayerClass = useLayerClass();
    const groupContext = useNavLinkGroupContext();
    const [getRef, setRef] = createSignal<HTMLElement>();

    return (
        <A ref={setRef} href={access(props.href)} end={true} class={styles.navLink}>
            <div
                class={styles.navLinkContent}
                classList={{
                    [getLayerClass()]: true,
                    [styles.hasHoverFloater]: access(props.hasHoverFloater) ?? false,
                    [styles.hasNoHoverFloater]: !(access(props.hasHoverFloater) ?? false),
                    [styles.hasSelectionFloater]: access(props.hasSelectionFloater) ?? false,
                    [styles.isHovered]: groupContext?.getIsHighlighted(getRef()) ?? false,
                    [styles.isSelected]: access(props.isSelected),
                }}
            >
                {props.children}
            </div>
        </A>
    );
};

export const PageNavLinkGroup = (props: ParentProps) => {
    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getHoveredLink, setHoveredLink] = createSignal<HTMLElement>();
    const [getFocusVisibleLink, setFocusVisibleLink] = createSignal<HTMLElement>();

    const findLink = (target: EventTarget | null) => {
        const link = target instanceof Element ? target.closest(LINK_SELECTOR) : null;

        return link instanceof HTMLElement && getRootRef()?.contains(link) ? link : undefined;
    };

    const readFocusVisibleLink = (target: EventTarget | null) => {
        const link = findLink(target);

        return link && InteractionTrackerUtils.computeIsFocusVisible(link) ? link : undefined;
    };

    const getHighlightedLink = () => getHoveredLink() ?? getFocusVisibleLink();
    const getIsHighlighted = createSelector<HTMLElement | undefined, HTMLElement | undefined>(getHighlightedLink);

    const floater = FloaterSolidUtils.create({
        getIsEnabled: () => true,
        getContainer: getRootRef,
        getTarget: getHighlightedLink,
        getTransitionDurationMs,
    });

    return (
        <div
            ref={setRootRef}
            class={styles.navLinkGroup}
            onPointerOver={(e) => setHoveredLink(findLink(e.target))}
            onPointerLeave={() => setHoveredLink(undefined)}
            onFocusIn={(e) => setFocusVisibleLink(readFocusVisibleLink(e.target))}
            onFocusOut={() => setFocusVisibleLink(undefined)}
        >
            <Show when={floater.getIsRendered()}>
                <div
                    ref={floater.setRef}
                    class={FloaterStyles.floater}
                    style={{ ...floater.getBounds(), "transition-duration": `${getTransitionDurationMs()}ms` }}
                >
                    {renderPageHighlightFloater(floater.getVisibilityTarget, getTransitionDurationMs)}
                </div>
            </Show>

            <NavLinkGroupContextProvider
                value={{ getIsHighlighted: (link) => link !== undefined && getIsHighlighted(link) }}
            >
                {props.children}
            </NavLinkGroupContextProvider>
        </div>
    );
};
