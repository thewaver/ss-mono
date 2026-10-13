import type { NavMenuEntry, NavMenuLink } from "@thewaver/ss-playground/App/Pages/HoverCardPage/HoverCardPage.types";
import type { Point2d } from "@thewaver/ss-utils";

export type { NavMenuLink, NavMenuEntry } from "@thewaver/ss-playground/App/Pages/HoverCardPage/HoverCardPage.types";

export type HoverCardExampleProps = {
    offset: Point2d;
    transitionDurationMs: number;
    focusShowDelayMs: number;
    hoverShowDelayMs: number;
    skipDelayWindowMs: number;
    visibility: readonly [boolean, (isVisible: boolean) => void];
    following: readonly [boolean, (isFollowing: boolean) => void];
};

export type NavigationMenuExampleProps = {
    hoverShowDelayMs: number;
    skipDelayWindowMs: number;
    openKey: readonly [string | undefined, (openKey: string | undefined) => void];
};

export type NavFlyoutProps = NavigationMenuExampleProps & {
    entry: NavMenuEntry;
    links: NavMenuLink[];
};
