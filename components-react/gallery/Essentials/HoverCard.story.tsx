import { useId, useState } from "react";

import { HoverCard } from "../../src";

const SHOW_DELAY_MS = 300;
const OFFSET = { x: 0, y: 12 };

export const Default = () => {
    const nameId = useId();
    const [anchor, setAnchor] = useState<HTMLElement>();
    const visibilityState = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    return (
        <div data-testid="demo" style={{ padding: 40 }}>
            <button type="button" id="profileSource">
                Source
            </button>
            <p>
                Written by{" "}
                <button type="button" data-testid="anchor" ref={(element) => setAnchor(element ?? undefined)}>
                    Ada Lovelace
                </button>{" "}
                in 1843.
            </p>
            <button type="button" id="afterAnchor">
                After
            </button>
            <HoverCard
                ariaLabelledBy={nameId}
                anchorRef={anchor}
                offset={OFFSET}
                hoverShowDelayMs={SHOW_DELAY_MS}
                focusShowDelayMs={SHOW_DELAY_MS}
                visibilityState={visibilityState}
                renderContent={(visibilityTarget, durationMs) => (
                    <div
                        style={{
                            padding: 12,
                            background: "white",
                            border: "1px solid black",
                            opacity: visibilityTarget,
                            transition: `opacity ${durationMs}ms`,
                        }}
                    >
                        <h4 id={nameId}>Ada Lovelace</h4>
                        <button type="button" data-testid="follow" onClick={() => setIsFollowing((was) => !was)}>
                            Follow
                        </button>
                        <button type="button" data-testid="message">
                            Message
                        </button>
                    </div>
                )}
            />
            <output data-readout="profile">
                {`open: ${String(visibilityState[0])}, following: ${String(isFollowing)}`}
            </output>
        </div>
    );
};

export const Uncontrolled = () => {
    const [anchor, setAnchor] = useState<HTMLElement>();

    return (
        <div style={{ padding: 40 }}>
            <button type="button" data-testid="anchor" ref={(element) => setAnchor(element ?? undefined)}>
                Anchor
            </button>
            <HoverCard
                ariaLabel="Details"
                anchorRef={anchor}
                hoverShowDelayMs={0}
                renderContent={() => <div style={{ padding: 12, background: "white" }}>Details</div>}
            />
        </div>
    );
};
