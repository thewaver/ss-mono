import { useState } from "react";

import type { CornerKey } from "@thewaver/ss-components";

import { Corners } from "../../src";

export const Default = ({ visibleCorners }: { visibleCorners?: CornerKey[] }) => {
    const [color, setColor] = useState("#FF00FF");

    return (
        <>
            <div data-testid="frame" style={{ width: 200, height: 120, margin: 40 }}>
                <Corners
                    color={color}
                    cornerLength={{ width: 24, height: 16 }}
                    strokeThickness={3}
                    transitionDurationMs={300}
                    visibleCorners={visibleCorners && new Set(visibleCorners)}
                >
                    <span data-testid="content">Framed</span>
                </Corners>
            </div>
            <button data-action="color" onClick={() => setColor("#00FFFF")}>
                color
            </button>
        </>
    );
};

export const Bare = () => (
    <div data-testid="frame" style={{ width: 200, height: 120, margin: 40, color: "#00FF00" }}>
        <Corners>
            <span data-testid="content">Framed</span>
        </Corners>
    </div>
);
