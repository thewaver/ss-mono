import { type CSSProperties, useState } from "react";

import type { DrawerEdge } from "@thewaver/ss-components";

import { Drawer } from "../../src";
import { Overlay, ScreenLayer } from "./ModalFixtures";

const DRAWER_THICKNESS = 320;
const DRAWER_DEPTH = 200;
const DRAWER_MAX_DEPTH = 400;
const FILLER_COUNT = 40;
const FILLERS = Array.from({ length: FILLER_COUNT }, (_, index) => `Filler ${index + 1}`);

const SIZES: Record<DrawerEdge, CSSProperties> = {
    left: { width: DRAWER_THICKNESS },
    right: { width: DRAWER_THICKNESS },
    top: { minHeight: DRAWER_DEPTH, maxHeight: DRAWER_MAX_DEPTH },
    bottom: { minHeight: DRAWER_DEPTH, maxHeight: DRAWER_MAX_DEPTH },
};

const SLIDE_OFF: Record<DrawerEdge, string> = {
    left: "translateX(-100%)",
    right: "translateX(100%)",
    top: "translateY(-100%)",
    bottom: "translateY(100%)",
};

export const Default = ({
    edge = "left",
    isDismissableOnOverlayClick = true,
}: {
    edge?: DrawerEdge;
    isDismissableOnOverlayClick?: boolean;
}) => {
    const visibilityState = useState(false);
    const [isOpen, setIsOpen] = visibilityState;

    return (
        <ScreenLayer>
            <button type="button" data-testid="open" onClick={() => setIsOpen(true)}>
                Open
            </button>
            <output data-readout="open">{String(isOpen)}</output>
            <Drawer
                visibilityState={visibilityState}
                edge={edge}
                isDismissableOnOverlayClick={isDismissableOnOverlayClick}
                ariaLabel={`${edge} drawer`}
                renderOverlay={(visibilityTarget, durationMs) => (
                    <Overlay visibilityTarget={visibilityTarget} durationMs={durationMs} />
                )}
                renderContent={(visibilityTarget, durationMs) => (
                    <div
                        style={{
                            ...SIZES[edge],
                            display: "flex",
                            flexDirection: "column",
                            gap: 16,
                            padding: 16,
                            overflow: "auto",
                            background: "white",
                            transform: visibilityTarget === 1 ? "translate(0, 0)" : SLIDE_OFF[edge],
                            transition: `transform ${durationMs}ms`,
                        }}
                    >
                        <div>Attached to the {edge} edge.</div>
                        <button type="button" data-testid="first">
                            First
                        </button>
                        <button type="button" data-testid="second">
                            Second
                        </button>
                        <button type="button" data-testid="close" onClick={() => setIsOpen(false)}>
                            Close
                        </button>
                        {FILLERS.map((caption) => (
                            <div key={caption}>{caption}</div>
                        ))}
                    </div>
                )}
            />
        </ScreenLayer>
    );
};
