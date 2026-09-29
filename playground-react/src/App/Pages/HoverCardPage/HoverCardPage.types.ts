import type { Point2d } from "@thewaver/ss-utils";

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

export type NavMenuLink = { key: string; label: string };

export type NavMenuEntry = { key: string; label: string; links?: NavMenuLink[] };

export type NavFlyoutProps = NavigationMenuExampleProps & {
    entry: NavMenuEntry;
    links: NavMenuLink[];
};
