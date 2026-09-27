import { useState } from "react";

import type { ScratchCardController } from "@thewaver/ss-components";

import { ScratchCard } from "../../src";

const CARD_STYLE = { width: 400, height: 200 };

export const Default = ({
    clearThreshold = 1,
    brushRadius = 20,
    precision = 16,
    finerPrecision = 64,
}: {
    clearThreshold?: number;
    brushRadius?: number;
    precision?: number;
    finerPrecision?: number;
}) => {
    const [controller, setController] = useState<ScratchCardController>();
    const [cleared, setCleared] = useState(0);
    const [frosted, setFrosted] = useState(0);
    const [clears, setClears] = useState(0);
    const [currentPrecision, setCurrentPrecision] = useState(precision);

    return (
        <>
            <div data-testid="ticket" style={{ ...CARD_STYLE, margin: 40 }}>
                <ScratchCard
                    ariaLabel="Scratch to reveal the ticket"
                    brushRadius={brushRadius}
                    precision={currentPrecision}
                    clearThreshold={clearThreshold}
                    clearDurationMs={50}
                    renderContent={() => <div style={{ ...CARD_STYLE, background: "#fff" }}>You won 10</div>}
                    renderCover={(maskStyle) => (
                        <div data-testid="foil" style={{ ...CARD_STYLE, background: "#999", ...maskStyle }} />
                    )}
                    renderBrush={(isRubbing) => <div data-testid="brush" data-rubbing={String(isRubbing)} />}
                    onMount={setController}
                    onScratch={setCleared}
                    onClear={() => setClears((count) => count + 1)}
                />
            </div>
            <div data-testid="frosted" style={{ ...CARD_STYLE, margin: 40 }}>
                <ScratchCard
                    ariaLabel="Wipe the frost away"
                    clearThreshold={1}
                    renderContent={() => <div style={{ ...CARD_STYLE, background: "#adf" }}>Frosted</div>}
                    renderCover={(maskStyle) => <div style={{ ...CARD_STYLE, background: "#eef", ...maskStyle }} />}
                    onScratch={setFrosted}
                />
            </div>
            <button type="button" data-testid="newTicket" onClick={() => controller?.reset()}>
                New ticket
            </button>
            <button type="button" data-testid="clear" onClick={() => controller?.clear()}>
                Clear
            </button>
            <button type="button" data-testid="finer" onClick={() => setCurrentPrecision(finerPrecision)}>
                Finer
            </button>
            <output data-readout="ticket">{(cleared * 100).toFixed(1)}</output>
            <output data-readout="frosted">{(frosted * 100).toFixed(1)}</output>
            <output data-readout="clears">{clears}</output>
        </>
    );
};
