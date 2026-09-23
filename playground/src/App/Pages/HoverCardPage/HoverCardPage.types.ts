import type { Signal } from "solid-js";

import type { AccessorProps } from "@thewaver/ss-components";
import type { Point2d } from "@thewaver/ss-utils";

export type HoverCardExampleProps = AccessorProps<{
    offset: Point2d;
    transitionDurationMs: number;
    focusShowDelayMs: number;
    hoverShowDelayMs: number;
    skipDelayWindowMs: number;
    visibilitySignal: Signal<boolean>;
    followingSignal: Signal<boolean>;
}>;

export type NavigationMenuExampleProps = AccessorProps<{
    hoverShowDelayMs: number;
    skipDelayWindowMs: number;
    openKeySignal: Signal<string | undefined>;
}>;

export type NavMenuLink = { key: string; label: string };

export type NavMenuEntry = { key: string; label: string; links?: NavMenuLink[] };

export type NavFlyoutProps = NavigationMenuExampleProps &
    AccessorProps<{
        entry: NavMenuEntry;
        links: NavMenuLink[];
    }>;
