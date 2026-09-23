import type { SwipeDirection } from "@thewaver/ss-utils";

export const CARD_STACK_DEFAULTS = {
    commitRatio: 0.25,
    transitionDurationMs: 250,
    mountedCount: 5,
    cardGap: 4,
    funnelRatio: 0.05,
    allowedDirections: ["left", "right", "up", "down"] as SwipeDirection[],
    roleDescription: "card stack",
    cardRoleDescription: "card",
};
