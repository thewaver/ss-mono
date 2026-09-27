import { type PropsWithChildren, useState } from "react";

import { Modal, Popover } from "../../src";
import { Overlay, ScreenLayer } from "./ModalFixtures";

const TITLE_ID = "modal-title";
const ALERT_TITLE_ID = "modal-alert-title";
const ALERT_BODY_ID = "modal-alert-body";
const FOCUS_KEYS = ["focus-1", "focus-2", "focus-3"];
const COUNTRIES = ["Denmark", "Portugal", "Sweden"];
const LIST_ID = "modal-country-list";

const Panel = ({
    visibilityTarget,
    durationMs,
    children,
}: PropsWithChildren<{ visibilityTarget: 0 | 1; durationMs: number }>) => (
    <div
        style={{
            padding: 16,
            background: "white",
            opacity: visibilityTarget,
            transition: `opacity ${durationMs}ms`,
        }}
    >
        {children}
    </div>
);

export const Default = () => {
    const visibilityState = useState(false);
    const [isOpen, setIsOpen] = visibilityState;

    return (
        <ScreenLayer>
            <button type="button" data-testid="open" onClick={() => setIsOpen(true)}>
                Open
            </button>
            <output data-readout="open">{String(isOpen)}</output>
            <Modal
                visibilityState={visibilityState}
                ariaLabelledBy={TITLE_ID}
                renderOverlay={(visibilityTarget, durationMs) => (
                    <Overlay visibilityTarget={visibilityTarget} durationMs={durationMs} />
                )}
                renderContent={(visibilityTarget, durationMs) => (
                    <Panel visibilityTarget={visibilityTarget} durationMs={durationMs}>
                        <div id={TITLE_ID}>Title</div>
                        {FOCUS_KEYS.map((key) => (
                            <button key={key} type="button" data-testid={key}>
                                {key}
                            </button>
                        ))}
                    </Panel>
                )}
            />
        </ScreenLayer>
    );
};

export const TextOnly = () => {
    const visibilityState = useState(false);

    return (
        <ScreenLayer>
            <button type="button" data-testid="open" onClick={() => visibilityState[1](true)}>
                Open
            </button>
            <button type="button" data-testid="behind">
                Behind
            </button>
            <Modal
                visibilityState={visibilityState}
                ariaLabel="Text only"
                renderOverlay={(visibilityTarget, durationMs) => (
                    <Overlay visibilityTarget={visibilityTarget} durationMs={durationMs} />
                )}
                renderContent={(visibilityTarget, durationMs) => (
                    <Panel visibilityTarget={visibilityTarget} durationMs={durationMs}>
                        Nothing here can be focused.
                    </Panel>
                )}
            />
        </ScreenLayer>
    );
};

export const Alert = () => {
    const visibilityState = useState(false);
    const [outcome, setOutcome] = useState("none");
    const [cancelRef, setCancelRef] = useState<HTMLElement>();

    const decide = (next: string) => {
        setOutcome(next);
        visibilityState[1](false);
    };

    return (
        <ScreenLayer>
            <button type="button" data-testid="open" onClick={() => visibilityState[1](true)}>
                Open
            </button>
            <output data-readout="outcome">{outcome}</output>
            <Modal
                visibilityState={visibilityState}
                role="alertdialog"
                initialFocusRef={cancelRef}
                isDismissableOnOverlayClick={false}
                isDismissableOnEscape={false}
                ariaLabelledBy={ALERT_TITLE_ID}
                ariaDescribedBy={ALERT_BODY_ID}
                renderOverlay={(visibilityTarget, durationMs) => (
                    <Overlay visibilityTarget={visibilityTarget} durationMs={durationMs} />
                )}
                renderContent={(visibilityTarget, durationMs) => (
                    <Panel visibilityTarget={visibilityTarget} durationMs={durationMs}>
                        <div id={ALERT_TITLE_ID}>Delete?</div>
                        <div id={ALERT_BODY_ID}>An alert has to be answered.</div>
                        <button type="button" data-testid="delete" onClick={() => decide("deleted")}>
                            Delete
                        </button>
                        <button
                            type="button"
                            data-testid="cancel"
                            ref={(element) => setCancelRef(element ?? undefined)}
                            onClick={() => decide("canceled")}
                        >
                            Cancel
                        </button>
                    </Panel>
                )}
            />
        </ScreenLayer>
    );
};

const CountryPicker = ({ onPick }: { onPick: (country: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [anchor, setAnchor] = useState<HTMLElement>();

    return (
        <>
            <button
                type="button"
                data-testid="combobox"
                ref={(element) => setAnchor(element ?? undefined)}
                aria-expanded={isOpen}
                aria-controls={isOpen ? LIST_ID : undefined}
                onClick={() => setIsOpen((was) => !was)}
            >
                Pick one
            </button>
            <Popover
                id={LIST_ID}
                role="listbox"
                isOpen={isOpen}
                anchorRef={anchor}
                onDismiss={() => setIsOpen(false)}
                renderContent={() => (
                    <div style={{ background: "white" }}>
                        {COUNTRIES.map((country) => (
                            <div
                                key={country}
                                role="option"
                                aria-selected={false}
                                data-testid={country}
                                onClick={() => {
                                    onPick(country);
                                    setIsOpen(false);
                                }}
                            >
                                {country}
                            </div>
                        ))}
                    </div>
                )}
            />
        </>
    );
};

export const Layered = () => {
    const visibilityState = useState(false);
    const [country, setCountry] = useState("none");

    return (
        <ScreenLayer>
            <button type="button" data-testid="open" onClick={() => visibilityState[1](true)}>
                Open
            </button>
            <output data-readout="country">{country}</output>
            <Modal
                visibilityState={visibilityState}
                ariaLabelledBy={TITLE_ID}
                renderOverlay={(visibilityTarget, durationMs) => (
                    <Overlay visibilityTarget={visibilityTarget} durationMs={durationMs} />
                )}
                renderContent={(visibilityTarget, durationMs) => (
                    <Panel visibilityTarget={visibilityTarget} durationMs={durationMs}>
                        <div id={TITLE_ID} data-testid="title">
                            Where from?
                        </div>
                        <CountryPicker onPick={setCountry} />
                    </Panel>
                )}
            />
        </ScreenLayer>
    );
};
