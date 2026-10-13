import type { NavMenuEntry, NavMenuLink } from "@thewaver/ss-playground/App/Pages/HoverCardPage/HoverCardPage.types";
import type { Point2d } from "@thewaver/ss-utils";

export type { NavMenuLink, NavMenuEntry } from "@thewaver/ss-playground/App/Pages/HoverCardPage/HoverCardPage.types";

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

export type NavFlyoutProps = NavigationMenuExampleProps & {
    entry: NavMenuEntry;
    links: NavMenuLink[];
};
