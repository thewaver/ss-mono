import type { Point2d } from "@thewaver/ss-utils";

export type HoverCardExampleProps = {
    offset: Point2d;
    transitionDurationMs: number;
    focusShowDelayMs: number;
    hoverShowDelayMs: number;
    skipDelayWindowMs: number;
    visibilityState: readonly [boolean, (isVisible: boolean) => void];
    followingState: readonly [boolean, (isFollowing: boolean) => void];
};

export type NavigationMenuExampleProps = {
    hoverShowDelayMs: number;
    skipDelayWindowMs: number;
    openKeyState: readonly [string | undefined, (openKey: string | undefined) => void];
};

export type NavMenuLink = { key: string; label: string };

export type NavMenuEntry = { key: string; label: string; links?: NavMenuLink[] };

export type NavFlyoutProps = NavigationMenuExampleProps & {
    entry: NavMenuEntry;
    links: NavMenuLink[];
};
