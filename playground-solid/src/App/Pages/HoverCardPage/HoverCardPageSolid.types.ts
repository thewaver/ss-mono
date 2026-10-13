import type { Signal } from "solid-js";

import type { AccessorProps } from "@thewaver/ss-components-solid";
import type { NavMenuEntry, NavMenuLink } from "@thewaver/ss-playground/App/Pages/HoverCardPage/HoverCardPage.types";
import type { Point2d } from "@thewaver/ss-utils";

export type { NavMenuLink, NavMenuEntry } from "@thewaver/ss-playground/App/Pages/HoverCardPage/HoverCardPage.types";

export type HoverCardExampleProps = AccessorProps<{
    offset: Point2d;
    transitionDurationMs: number;
    focusShowDelayMs: number;
    hoverShowDelayMs: number;
    skipDelayWindowMs: number;
    visibility: Signal<boolean>;
    following: Signal<boolean>;
}>;

export type NavigationMenuExampleProps = AccessorProps<{
    hoverShowDelayMs: number;
    skipDelayWindowMs: number;
    openKey: Signal<string | undefined>;
}>;

export type NavFlyoutProps = NavigationMenuExampleProps &
    AccessorProps<{
        entry: NavMenuEntry;
        links: NavMenuLink[];
    }>;
