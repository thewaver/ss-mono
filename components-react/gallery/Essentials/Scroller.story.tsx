import { type KeyboardEvent, useState } from "react";

import type { ScrollerButtonPlacement, ScrollerStep, ScrollerStepper } from "@thewaver/ss-components";

import { Button, Scroller } from "../../src";

const STRIP_WIDTH = 400;
const CHIP_WIDTH = 90;
const GAP = 10;
const RING_WIDTH = 2;
const PERCENT = 100;
const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const StepButton = ({ step, stepper }: { step: ScrollerStep; stepper: ScrollerStepper }) => {
    const isPrevious = step === "previous";

    return (
        <Button
            isDisabled={isPrevious ? stepper.getIsAtStart() : stepper.getIsAtEnd()}
            ariaLabel={isPrevious ? "Scroll back" : "Scroll forward"}
            onClick={() => void (isPrevious ? stepper.stepToPrevious() : stepper.stepToNext())}
            renderContent={() => <span>{isPrevious ? "<" : ">"}</span>}
        />
    );
};

export const Chips = ({
    itemCount = 12,
    buttonPlacement,
}: {
    itemCount?: number;
    buttonPlacement?: ScrollerButtonPlacement;
}) => {
    const [count, setCount] = useState(itemCount);
    const progressState = useState(0);
    const [progress, setProgress] = progressState;

    return (
        <>
            <div data-strip style={{ width: STRIP_WIDTH }}>
                <Scroller
                    gap={GAP}
                    padding={RING_WIDTH}
                    buttonPlacement={buttonPlacement}
                    progressState={progressState}
                    renderButton={(step, stepper) => <StepButton step={step} stepper={stepper} />}
                >
                    {Array.from({ length: count }, (_, index) => (
                        <div key={index} style={{ flex: `0 0 ${CHIP_WIDTH}px`, marginRight: GAP }}>
                            {`Chip ${index + 1}`}
                        </div>
                    ))}
                </Scroller>
            </div>
            <input
                aria-label="Item count"
                data-testid="itemCount"
                type="number"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
            />
            <input
                aria-label="Position"
                data-testid="position"
                type="number"
                value={Math.round(progress * PERCENT)}
                onChange={(e) => setProgress(Number(e.target.value) / PERCENT)}
            />
            <output data-readout="progress">{`${Math.round(progress * PERCENT)}% along`}</output>
        </>
    );
};

const TabList = () => {
    const [focusIndex, setFocusIndex] = useState(0);

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;

        if (!step) return;

        e.preventDefault();

        const next = Math.min(Math.max(focusIndex + step, 0), MONTHS.length - 1);
        const tabs = e.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]');

        setFocusIndex(next);
        tabs[next]?.focus();
    };

    return (
        <div role="tablist" aria-label="Months" style={{ display: "flex", gap: GAP }} onKeyDown={handleKeyDown}>
            {MONTHS.map((month, index) => (
                <button
                    key={month}
                    type="button"
                    role="tab"
                    aria-selected={index === focusIndex}
                    tabIndex={index === focusIndex ? 0 : -1}
                    style={{ flex: `0 0 ${CHIP_WIDTH}px` }}
                    onFocus={() => setFocusIndex(index)}
                >
                    {month}
                </button>
            ))}
        </div>
    );
};

export const Tabbed = () => (
    <div data-strip style={{ width: STRIP_WIDTH }}>
        <Scroller
            gap={GAP}
            padding={RING_WIDTH}
            renderButton={(step, stepper) => <StepButton step={step} stepper={stepper} />}
        >
            <TabList />
        </Scroller>
    </div>
);
