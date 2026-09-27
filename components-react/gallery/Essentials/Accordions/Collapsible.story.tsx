import { useState } from "react";

import type { CollapsibleSide } from "@thewaver/ss-components";

import { Collapsible } from "../../../src";

const SIDEWAYS_WIDTH = 200;

export const Panel = ({ side, headingLevel }: { side?: CollapsibleSide; headingLevel?: number }) => {
    const expandedState = useState(false);

    return (
        <div data-testid="demo">
            <div>Orders leave the warehouse within two working days.</div>
            <Collapsible
                expandedState={expandedState}
                sizing={"fit-content"}
                side={side}
                headingLevel={headingLevel}
                renderTrigger={(flags) => <span>{flags.isExpanded ? "Show less" : "Show more"}</span>}
                renderPanel={(visibilityTarget, durationMs) => (
                    <div
                        style={{
                            width: side === "left" || side === "right" ? SIDEWAYS_WIDTH : undefined,
                            opacity: visibilityTarget,
                            transition: `opacity ${durationMs}ms`,
                        }}
                    >
                        Deliveries to the islands take a further two days.
                    </div>
                )}
            />
            <output data-readout="expanded">{`expanded: ${String(expandedState[0])}`}</output>
        </div>
    );
};
