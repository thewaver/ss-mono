import { useState } from "react";

import type { PlacementLayout, ProximityEffectFn } from "@thewaver/ss-components";

import { PlacementBox, PlacementItem } from "../../src";

const ITEM_SHARE = 0.2;

const ROW: PlacementLayout = {
    heightRatio: 0.25,
    placements: [1, 3, 5].map((sixth) => ({
        leftShare: sixth / 6,
        topShare: 0.125,
        widthShare: ITEM_SHARE,
        heightShare: ITEM_SHARE,
    })),
};

const COLUMN: PlacementLayout = {
    heightRatio: 1,
    placements: [1, 3, 5].map((sixth) => ({
        leftShare: 0.5,
        topShare: sixth / 6,
        widthShare: ITEM_SHARE,
        heightShare: ITEM_SHARE,
    })),
};

const DEEP_ROW: PlacementLayout = {
    ...ROW,
    placements: ROW.placements.map((placement, index) => (index === 0 ? { ...placement, depth: 9 } : placement)),
};

const GROW_UNDER_POINTER: ProximityEffectFn = (defs) => ({ scale: defs.ratio < 1 ? [200, 200] : [100, 100] });

type DefaultProps = {
    transitionDurationMs?: number;
    staggerMs?: number;
    hasEffect?: boolean;
    hasDepth?: boolean;
    isStacked?: boolean;
};

export const Default = ({
    transitionDurationMs,
    staggerMs = 0,
    hasEffect = false,
    hasDepth = false,
    isStacked = false,
}: DefaultProps) => {
    const [isColumn, setIsColumn] = useState(false);
    const [renderCount, setRenderCount] = useState(0);
    const [boxTag, setBoxTag] = useState("none");

    const layout = isColumn ? COLUMN : hasDepth ? DEEP_ROW : ROW;

    return (
        <>
            <div style={{ width: 600 }}>
                <PlacementBox
                    layout={layout}
                    transitionDurationMs={transitionDurationMs}
                    computeEffect={hasEffect ? GROW_UNDER_POINTER : undefined}
                    ref={(element) => setBoxTag(element?.tagName.toLowerCase() ?? "none")}
                >
                    {layout.placements.map((placement, index) => (
                        <PlacementItem
                            key={index}
                            placement={placement}
                            stackAt={isStacked ? index + 1 : undefined}
                            transitionDelayMs={staggerMs * index}
                        >
                            <span data-item={index}>{`Item ${index}`}</span>
                        </PlacementItem>
                    ))}
                </PlacementBox>
            </div>
            <button type="button" data-testid="rearrange" onClick={() => setIsColumn((was) => !was)}>
                Rearrange
            </button>
            <button type="button" data-testid="rerender" onClick={() => setRenderCount((count) => count + 1)}>
                Rerender
            </button>
            <output data-readout="renders">{renderCount}</output>
            <output data-readout="boxRef">{boxTag}</output>
        </>
    );
};

export const Loose = () => (
    <div style={{ position: "relative", width: 600, height: 150, containerType: "inline-size" }}>
        <PlacementItem placement={ROW.placements[1]}>
            <span data-item="loose">Loose</span>
        </PlacementItem>
    </div>
);
