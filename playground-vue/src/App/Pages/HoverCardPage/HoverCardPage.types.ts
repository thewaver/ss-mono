import type { Point2d } from "@thewaver/ss-utils";

export type HoverCardExampleProps = {
    "offset": Point2d;
    "transitionDurationMs": number;
    "focusShowDelayMs": number;
    "hoverShowDelayMs": number;
    "skipDelayWindowMs": number;
    "visibility": boolean;
    "onUpdate:visibility"?: (isVisible: boolean) => void;
    "following": boolean;
    "onUpdate:following"?: (isFollowing: boolean) => void;
};

export type NavigationMenuExampleProps = {
    "hoverShowDelayMs": number;
    "skipDelayWindowMs": number;
    "openKey": string | undefined;
    "onUpdate:openKey"?: (openKey: string | undefined) => void;
};

export type NavMenuLink = { key: string; label: string };

export type NavMenuEntry = { key: string; label: string; links?: NavMenuLink[] };

export type NavFlyoutProps = NavigationMenuExampleProps & {
    entry: NavMenuEntry;
    links: NavMenuLink[];
};
