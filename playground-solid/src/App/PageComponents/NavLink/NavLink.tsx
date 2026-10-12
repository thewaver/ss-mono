import { type ParentProps, Show, createSignal } from "solid-js";

import { A } from "@solidjs/router";
import {
    FloaterSolidUtils,
    FloaterStyles,
    InteractionTrackerUtils,
    TREE_DEFAULTS,
    access,
} from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/NavLinkContent/NavLinkContent.css";

import { renderPageHighlightFloater } from "../../StyledComponents/GlideFloater/GlideFloater";
import { useLayerClass } from "../../StyledComponents/Layer/Layer.context";
import type { PageNavLinkProps } from "./NavLink.types";

const LINK_SELECTOR = "a";

const getTransitionDurationMs = () => TREE_DEFAULTS.floaterTransitionDurationMs;

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
                [styles.isGliding]: access(props.isGliding) ?? false,
            }}
        >
            {props.children}
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

    const floater = FloaterSolidUtils.create({
        getIsEnabled: () => true,
        getContainer: getRootRef,
        getTarget: () => getHoveredLink() ?? getFocusVisibleLink(),
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

            {props.children}
        </div>
    );
};
