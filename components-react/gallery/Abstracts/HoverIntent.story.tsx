import { useRef, useState } from "react";

import { HoverIntentUtils } from "@thewaver/ss-components";

import { HoverIntentReactUtils } from "../../src";

const DELAY_GROUP = HoverIntentUtils.createDelayGroup();

export const Default = () => {
    const shownState = useState(false);
    const anchorRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    HoverIntentReactUtils.useHoverIntent(anchorRef, shownState, {
        delayGroup: DELAY_GROUP,
        panelRef,
        hoverShowDelayMs: 150,
        skipDelayWindowMs: 0,
    });

    return (
        <div style={{ padding: 40 }}>
            <button ref={anchorRef} type="button" data-testid="anchor">
                Anchor
            </button>
            {shownState[0] && (
                <div ref={panelRef} data-testid="panel" style={{ width: 120, height: 60, background: "#eee" }}>
                    Panel
                </div>
            )}
            <div data-testid="away" style={{ marginTop: 200 }}>
                Away
            </div>
            <output data-readout="shown">{String(shownState[0])}</output>
        </div>
    );
};
