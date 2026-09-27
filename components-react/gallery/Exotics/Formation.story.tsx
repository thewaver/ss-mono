import { useState } from "react";

import { type PlacementLayoutFn, PlacementLayoutUtils } from "@thewaver/ss-components";

import { Formation } from "../../src";

const NAMES = [
    "Aurora",
    "Basalt",
    "Cinder",
    "Drift",
    "Ember",
    "Fathom",
    "Glimmer",
    "Hollow",
    "Iris",
    "Jetty",
    "Kelp",
    "Loam",
];
const HOST_STYLE = { width: "380px" };
const ITEM_STYLE = { width: "100%", height: "100%", background: "lightsteelblue" };

const LAYOUTS: Record<"cliff" | "ring", PlacementLayoutFn> = {
    cliff: PlacementLayoutUtils.toLayoutFn({ family: "cliff" }),
    ring: PlacementLayoutUtils.toLayoutFn({ family: "ring" }),
};

type DefaultProps = {
    itemCount?: number;
    isStackedInReverse?: boolean;
    transitionDurationMs?: number;
};

export const Default = ({ itemCount = 6, isStackedInReverse = false, transitionDurationMs = 0 }: DefaultProps) => {
    const [skippedCount, setSkippedCount] = useState(0);
    const [layoutKey, setLayoutKey] = useState<keyof typeof LAYOUTS>("cliff");

    return (
        <>
            <button type="button" data-testid="skip" onClick={() => setSkippedCount(1)}>
                Skip one
            </button>
            <button type="button" data-testid="ring" onClick={() => setLayoutKey("ring")}>
                Ring
            </button>
            <div data-testid="default" style={HOST_STYLE}>
                <Formation<string>
                    items={NAMES.slice(skippedCount, skippedCount + itemCount)}
                    computeLayout={LAYOUTS[layoutKey]}
                    isStackedInReverse={isStackedInReverse}
                    transitionDurationMs={transitionDurationMs}
                    renderItem={(item, state) => <div style={ITEM_STYLE}>{`${state.index + 1} ${item}`}</div>}
                />
            </div>
        </>
    );
};
