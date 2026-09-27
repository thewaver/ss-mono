import { type CSSProperties, useState } from "react";

import { Button, SpotlightGuide, SpotlightHint, SpotlightPrompt } from "../../src";
import { ScreenLayer } from "./ModalFixtures";

const PADDING = 6;
const STEP_HEIGHT = 80;
const STRIP_PADDING = 10;
const CORNER = 12;

const TOUR_STEPS = [
    { title: "This is a potato", text: "It grows underground." },
    { title: "This is a turnip", text: "It grows underground too." },
];

const renderOverlay = (visibilityTarget: 0 | 1, durationMs: number, maskStyle: CSSProperties) => (
    <div
        data-testid="cover"
        style={{
            ...maskStyle,
            background: "rgba(0, 0, 0, 0.5)",
            opacity: visibilityTarget,
            transition: `opacity ${durationMs}ms`,
        }}
    />
);

const CORNER_POINTS = [
    `0,0 ${CORNER},0 0,${CORNER}`,
    `${CORNER},0 ${CORNER * 2},0 ${CORNER * 2},${CORNER}`,
    `0,${CORNER} 0,${CORNER * 2} ${CORNER},${CORNER * 2}`,
    `${CORNER * 2},${CORNER} ${CORNER * 2},${CORNER * 2} ${CORNER},${CORNER * 2}`,
];

const renderHighlight = () => (
    <svg width="100%" height="100%" style={{ overflow: "visible" }} aria-hidden="true">
        {CORNER_POINTS.map((points) => (
            <polygon key={points} points={points} />
        ))}
    </svg>
);

const TOOLTIP_DEFS = {
    placement: { x: "center", y: "top-out" },
    hoverShowDelayMs: 0,
    renderContent: () => <span style={{ background: "white" }}>Lights up the page</span>,
} as const;

export const Hint = () => {
    const visibilityState = useState(false);
    const [element, setElement] = useState<HTMLElement>();

    return (
        <ScreenLayer>
            <div data-testid="demo" style={{ padding: 40 }}>
                <Button
                    ref={(next) => setElement(next ?? undefined)}
                    tooltipDefs={TOOLTIP_DEFS}
                    renderContent={() => <span>Highlight Me</span>}
                    onClick={() => visibilityState[1](true)}
                />
                <output data-readout="hint">{`open: ${String(visibilityState[0])}`}</output>
            </div>
            <SpotlightHint
                elementRef={element}
                padding={PADDING}
                visibilityState={visibilityState}
                renderHighlight={renderHighlight}
                renderOverlay={renderOverlay}
            />
        </ScreenLayer>
    );
};

export const Prompt = () => {
    const visibilityState = useState(false);
    const [element, setElement] = useState<HTMLElement>();
    const [bought, setBought] = useState(0);

    return (
        <ScreenLayer>
            <div data-testid="demo" style={{ padding: 40 }}>
                <Button renderContent={() => <span>Insist</span>} onClick={() => visibilityState[1](true)} />
                <Button
                    ref={(next) => setElement(next ?? undefined)}
                    renderContent={() => <span>Buy the potato</span>}
                    onClick={() => {
                        setBought((count) => count + 1);
                        visibilityState[1](false);
                    }}
                />
                <output data-readout="prompt">{`bought: ${bought}`}</output>
            </div>
            <SpotlightPrompt
                elementRef={element}
                padding={PADDING}
                visibilityState={visibilityState}
                renderOverlay={renderOverlay}
            />
        </ScreenLayer>
    );
};

export const Guide = () => {
    const visibilityState = useState(false);
    const [stepElements, setStepElements] = useState<(HTMLElement | undefined)[]>([]);
    const [step, setStep] = useState(0);
    const [status, setStatus] = useState("not started");

    const isLastStep = step >= TOUR_STEPS.length - 1;

    const end = (next: string) => {
        setStatus(next);
        visibilityState[1](false);
    };

    return (
        <ScreenLayer>
            <div data-testid="demo" style={{ padding: 40 }}>
                <div
                    data-scroll-box
                    style={{ height: STEP_HEIGHT + STRIP_PADDING * 2, overflowY: "auto", padding: STRIP_PADDING }}
                >
                    {TOUR_STEPS.map((entry, index) => (
                        <div
                            key={entry.title}
                            ref={(next) => {
                                if (!next || stepElements[index] === next) return;

                                setStepElements((previous) => {
                                    const copy = [...previous];

                                    copy[index] = next;

                                    return copy;
                                });
                            }}
                            style={{ height: STEP_HEIGHT + STRIP_PADDING * 3, border: "1px solid black" }}
                        >
                            {entry.title}
                        </div>
                    ))}
                </div>
                <Button
                    renderContent={() => <span>Take the tour</span>}
                    onClick={() => {
                        setStatus("touring");
                        visibilityState[1](true);
                    }}
                />
                <button type="button" data-testid="outsideControl">
                    Elsewhere
                </button>
                <output data-readout="guide">{`step: ${step + 1} of ${TOUR_STEPS.length}, ${status}`}</output>
            </div>
            <SpotlightGuide
                elementRef={stepElements[step]}
                padding={PADDING}
                ariaLabel={"Product tour"}
                announcement={`Step ${step + 1} of ${TOUR_STEPS.length}. ${TOUR_STEPS[step].title}.`}
                visibilityState={visibilityState}
                renderHighlight={renderHighlight}
                renderOverlay={renderOverlay}
                renderPopup={(visibilityTarget, durationMs) => (
                    <div
                        style={{
                            padding: 12,
                            background: "white",
                            opacity: visibilityTarget,
                            transition: `opacity ${durationMs}ms`,
                        }}
                    >
                        <div>{TOUR_STEPS[step].title}</div>
                        <div>{TOUR_STEPS[step].text}</div>
                        <Button renderContent={() => <span>Skip all</span>} onClick={() => end("skipped")} />
                        <Button
                            renderContent={() => <span>{isLastStep ? "Done" : "Next"}</span>}
                            onClick={() => {
                                if (!isLastStep) {
                                    setStep(step + 1);

                                    return;
                                }

                                end("finished");
                            }}
                        />
                    </div>
                )}
            />
        </ScreenLayer>
    );
};
