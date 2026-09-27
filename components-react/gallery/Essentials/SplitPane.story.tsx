import { useState } from "react";

import type { SplitPaneEntry, SplitPaneOrientation } from "@thewaver/ss-components";

import { SplitPane } from "../../src";

const PERCENT = 100;
const BOX_WIDTH = 800;
const BOX_HEIGHT = 300;
const CRAMPED_WIDTH = 600;
const BOUNDED_WIDTH = 380;

const PRESETS: Record<
    string,
    { panes: SplitPaneEntry[]; ratios: number[]; orientation?: SplitPaneOrientation; width?: number; dir?: "rtl" }
> = {
    pair: {
        panes: [{ id: "split-pair-start", gutterAriaLabel: "Resize navigation" }, { id: "split-pair-end" }],
        ratios: [0.3, 0.7],
    },
    rtl: {
        panes: [{ id: "split-rtl-start", gutterAriaLabel: "Resize navigation" }, { id: "split-rtl-end" }],
        ratios: [0.3, 0.7],
        dir: "rtl",
    },
    bounded: {
        panes: [
            { id: "split-bounded-start", minPx: 120, maxPx: 220, gutterAriaLabel: "Resize sidebar" },
            { id: "split-bounded-end", minPx: 160 },
        ],
        ratios: [0.3, 0.7],
        width: BOUNDED_WIDTH,
    },
    cramped: {
        panes: [
            { id: "split-cramped-start", minPx: 250, gutterAriaLabel: "Resize left" },
            { id: "split-cramped-end", minPx: 400 },
        ],
        ratios: [0.5, 0.5],
        width: CRAMPED_WIDTH,
    },
    triple: {
        panes: [
            { id: "split-triple-start", minPx: 80, gutterAriaLabel: "Resize first" },
            { id: "split-triple-middle", minPx: 80, gutterAriaLabel: "Resize second" },
            { id: "split-triple-end", minPx: 80 },
        ],
        ratios: [0.25, 0.5, 0.25],
    },
    stacked: {
        panes: [{ id: "split-column-start", gutterAriaLabel: "Resize top" }, { id: "split-column-end" }],
        ratios: [0.4, 0.6],
        orientation: "vertical",
    },
};

export const Default = ({ preset = "pair", isDisabled = false }: { preset?: string; isDisabled?: boolean }) => {
    const { panes, ratios: startingRatios, orientation, width, dir } = PRESETS[preset];
    const ratiosState = useState(startingRatios);
    const [ratios, setRatios] = ratiosState;

    return (
        <>
            <div data-box dir={dir} style={{ width: width ?? BOX_WIDTH, height: BOX_HEIGHT, overflowX: "auto" }}>
                <SplitPane
                    ariaLabel="Panes"
                    orientation={orientation}
                    isDisabled={isDisabled}
                    panes={panes}
                    ratiosState={ratiosState}
                    renderPane={(pane) => <div data-pane={pane.id}>{pane.id}</div>}
                    renderGutter={(flags) => <span data-dragging={String(flags.isDragging)} />}
                />
            </div>
            <output data-readout="ratios">
                {`ratios: ${ratios.map((ratio) => `${Math.round(ratio * PERCENT)}%`).join(" / ")}`}
            </output>
            <button type="button" data-testid="reset" onClick={() => setRatios([0.5, 0.5])}>
                Even
            </button>
        </>
    );
};
