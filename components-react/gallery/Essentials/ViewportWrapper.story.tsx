import { useState } from "react";

import { Popover, ViewportWrapper, useViewportContext } from "../../src";

const STAGE_SIDE = 400;
const PERCENT = 100;
const LIST_HEIGHT = 240;
const OPTIONS = ["Belgium", "Denmark", "Estonia", "Finland", "Germany", "Iceland"];

const InnerReadout = () => {
    const context = useViewportContext();

    return (
        <output data-inner-readout style={{ position: "absolute", right: 0, bottom: 0 }}>
            {`${context.getScale().toFixed(2)}× of ${Math.round(context.getSize().width)}×${Math.round(context.getSize().height)}`}
        </output>
    );
};

export const Nested = ({ scalePercent = PERCENT, anchorTop = 0 }: { scalePercent?: number; anchorTop?: number }) => {
    const [windowSize] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }));
    const [isOpen, setIsOpen] = useState(false);
    const [anchor, setAnchor] = useState<HTMLElement>();

    const side = Math.round((STAGE_SIDE * PERCENT) / scalePercent);

    return (
        <ViewportWrapper size={windowSize}>
            <div
                data-stage
                style={{ position: "absolute", top: 100, left: 100, width: STAGE_SIDE, height: STAGE_SIDE }}
            >
                <ViewportWrapper size={{ width: side, height: side }}>
                    <button
                        type="button"
                        id="anchor"
                        ref={(element) => setAnchor(element ?? undefined)}
                        style={{ position: "absolute", top: `${anchorTop}%`, left: "50%", height: 32 }}
                        onClick={() => setIsOpen((was) => !was)}
                    >
                        Country
                    </button>
                    <Popover
                        id="list"
                        role="listbox"
                        ariaAttributes={{ "aria-label": "Countries" }}
                        placement={{ x: "center", y: "bottom-out" }}
                        isOpen={isOpen}
                        anchorRef={anchor}
                        transitionDurationMs={0}
                        onDismiss={() => setIsOpen(false)}
                        renderContent={() => (
                            <div style={{ height: LIST_HEIGHT, width: 160, background: "white" }}>
                                {OPTIONS.map((option) => (
                                    <div key={option}>{option}</div>
                                ))}
                            </div>
                        )}
                    />
                    <InnerReadout />
                </ViewportWrapper>
            </div>
        </ViewportWrapper>
    );
};
