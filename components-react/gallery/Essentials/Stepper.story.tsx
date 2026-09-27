import { useState } from "react";

import { PlacementLayoutUtils, PlacementUtils, type Step, type StepperConnectorDefs } from "@thewaver/ss-components";

import { Stepper, type StepperProps } from "../../src";

type StepValue = "details" | "address" | "payment" | "review";
type StepState = "done" | "current" | "failed" | "skipped" | "ahead";

const ORDER: StepValue[] = ["details", "address", "payment", "review"];

const LABELS: Record<StepValue, string> = {
    details: "Details",
    address: "Address",
    payment: "Payment",
    review: "Review",
};

const STATE_WORDS: Record<StepState, string> = {
    done: "completed",
    current: "current step",
    failed: "needs attention",
    skipped: "skipped",
    ahead: "not started",
};

const REASONS: Partial<Record<StepState, string>> = {
    failed: "The card was declined, so this step has to be repeated before the order can be reviewed.",
    ahead: "Review opens once payment succeeds, so there is nothing to look at here yet.",
};

const ARC_LAYOUT = PlacementLayoutUtils.createArc({
    curveHeightRatio: 1,
    spreadDegrees: 135,
    itemWidthRatio: 0.302,
    itemHeightRatio: 0.418,
});

const computeState = (value: StepValue, current: StepValue): StepState => {
    if (value === current) return "current";

    return ORDER.indexOf(value) < ORDER.indexOf(current) ? "done" : "ahead";
};

const buildSteps = (
    current: StepValue,
    isFreeNavigation: boolean,
    overrides: Partial<Record<StepValue, StepState>> = {},
): Step<StepValue, StepState>[] =>
    ORDER.map((value) => {
        const state = overrides[value] ?? computeState(value, current);

        return { value, state, isNavigable: isFreeNavigation || state === "done" || state === "failed" };
    });

const describe = (step: Step<StepValue, StepState>, index: number) =>
    `Step ${index + 1} of ${ORDER.length}, ${LABELS[step.value]}, ${STATE_WORDS[step.state]}`;

const Connector = ({ isColumn }: { isColumn: boolean }) => (
    <span style={{ display: "block", width: isColumn ? 2 : 20, height: isColumn ? 20 : 2, background: "#999" }} />
);

const ArcConnector = ({ defs }: { defs: StepperConnectorDefs }) =>
    defs.from === undefined || defs.to === undefined ? null : (
        <svg
            viewBox="0 0 1 1"
            aria-hidden="true"
            style={{ position: "absolute", top: 0, left: 0, width: "100cqw", height: "100cqw", overflow: "visible" }}
        >
            <path
                d={PlacementUtils.getLinkPath(defs.from, defs.to, defs.origin, defs.radii)}
                fill="none"
                stroke="#999"
            />
        </svg>
    );

type StripProps = {
    scope: string;
    start: StepValue;
    isFreeNavigation: boolean;
    overrides?: Partial<Record<StepValue, StepState>>;
    width?: number;
} & Partial<StepperProps<StepValue, StepState>>;

const Strip = ({ scope, start, isFreeNavigation, overrides, width = 420, ...rest }: StripProps) => {
    const [current, setCurrent] = useState(start);
    const isColumn = rest.orientation === "vertical";

    return (
        <div data-testid={scope} data-example style={{ width, padding: 10 }}>
            <Stepper<StepValue, StepState>
                gap={5}
                ariaLabel={"Checkout"}
                renderStep={(step) => (
                    <span style={{ display: "flex", gap: 4, padding: 4, whiteSpace: "nowrap" }}>
                        <span aria-hidden="true">{ORDER.indexOf(step.value) + 1}</span>
                        {LABELS[step.value]}
                    </span>
                )}
                renderConnector={() => <Connector isColumn={isColumn} />}
                {...rest}
                steps={buildSteps(current, isFreeNavigation, overrides)}
                currentValue={current}
                computeStepAriaLabel={describe}
                onCurrentChange={setCurrent}
            />
            <output data-readout="current">{`current: ${current}`}</output>
        </div>
    );
};

export const Default = ({ isFreeNavigation = false }: { isFreeNavigation?: boolean }) => (
    <>
        <Strip scope="linear" start="address" isFreeNavigation={isFreeNavigation} />
        <Strip
            scope="failed"
            start="payment"
            isFreeNavigation={isFreeNavigation}
            ariaLabel={"Checkout with a failure"}
            overrides={{ address: "failed", details: "skipped" }}
            computeTooltipDefs={(step) => {
                const reason = REASONS[step.state];

                if (!reason) return undefined;

                return {
                    placement: { x: "center", y: "top-out" },
                    offset: { x: 0, y: 10 },
                    hoverShowDelayMs: 0,
                    renderContent: () => <span>{reason}</span>,
                };
            }}
        />
        <Strip
            scope="stacked"
            start="address"
            isFreeNavigation={isFreeNavigation}
            orientation={"vertical"}
            ariaLabel={"Stacked checkout"}
        />
        <Strip scope="bare" start="address" isFreeNavigation={isFreeNavigation} renderConnector={undefined} />
        <Strip
            scope="arc"
            start="address"
            width={600}
            isFreeNavigation={isFreeNavigation}
            ariaLabel={"Checkout, on an arc"}
            computeLayout={ARC_LAYOUT}
            renderConnector={(defs) => <ArcConnector defs={defs} />}
        />
    </>
);
