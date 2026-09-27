import { useState } from "react";

import { type ArcDefs, type InteractionFlags, PlacementLayoutUtils } from "@thewaver/ss-components";

import { Radio, RadioGroup } from "../../src";

type SizeOption = { value: string; label: string };

const SIZE_OPTIONS: SizeOption[] = [
    { value: "small", label: "Small" },
    { value: "medium", label: "Medium" },
    { value: "large", label: "Large" },
];

const RADIO_GROUP_GAP = 10;
const REACHABLE_VALUE = "medium";
const RATING_OPTIONS = [1, 2, 3, 4, 5];
const STARTING_RATING = 3;
const ARC_WIDTH = 300;

const ARC_DEFS: ArcDefs = {
    curveHeightRatio: 0.3867,
    spreadDegrees: 160,
    itemWidthRatio: 0.11,
    itemHeightRatio: 1.0909,
};

const ARC_LAYOUT = PlacementLayoutUtils.createArc(ARC_DEFS);

const TOOLTIP_DEFS = {
    placement: { x: "center", y: "top-out" },
    hoverShowDelayMs: 0,
    renderContent: () => <span>Arrow keys land here, but it cannot be picked.</span>,
} as const;

const starLabel = (rating: number) => (rating === 1 ? "1 star" : `${rating} stars`);

const Dot = ({ flags, children }: { flags: InteractionFlags; children: string }) => (
    <span style={{ display: "block", padding: "4px 8px", opacity: flags.isDisabled ? 0.5 : 1 }}>{children}</span>
);

const Star = ({ isFilled }: { isFilled: boolean }) => (
    <span style={{ display: "block", width: "100%", aspectRatio: "1", background: isFilled ? "gold" : "#ccc" }} />
);

const Floater = () => <div data-floater style={{ width: "100%", height: "100%", background: "#ddd" }} />;

const SizeGroup = ({
    ariaLabel,
    isReachable = false,
    isAllDisabled = false,
    hasFloater = false,
}: {
    ariaLabel: string;
    isReachable?: boolean;
    isAllDisabled?: boolean;
    hasFloater?: boolean;
}) => {
    const valueState = useState("small");

    return (
        <>
            <RadioGroup
                valueState={valueState}
                ariaLabel={ariaLabel}
                gap={hasFloater ? 0 : RADIO_GROUP_GAP}
                renderFloater={hasFloater ? () => <Floater /> : undefined}
            >
                {SIZE_OPTIONS.map((option) => {
                    const isDisabled = isAllDisabled || (isReachable && option.value === REACHABLE_VALUE);

                    return (
                        <Radio
                            key={option.value}
                            value={option.value}
                            ariaLabel={option.label}
                            isDisabled={isDisabled}
                            isReachableWhenDisabled={isReachable && isDisabled}
                            tooltipDefs={isReachable && isDisabled ? TOOLTIP_DEFS : undefined}
                            renderContent={(flags) => <Dot flags={flags}>{option.label}</Dot>}
                        />
                    );
                })}
            </RadioGroup>
            <output data-readout="value">{`value: ${valueState[0]}`}</output>
        </>
    );
};

const RatingGroup = ({ isArc }: { isArc: boolean }) => {
    const valueState = useState(STARTING_RATING);
    const [hovered, setHovered] = useState<number>();

    const shown = hovered ?? valueState[0];

    return (
        <div style={{ width: `${ARC_WIDTH}px` }}>
            <RadioGroup
                valueState={valueState}
                ariaLabel={isArc ? "Rating on an arc" : "Rating"}
                computeLayout={isArc ? ARC_LAYOUT : undefined}
            >
                {RATING_OPTIONS.map((rating) => (
                    <Radio
                        key={rating}
                        value={rating}
                        ariaLabel={starLabel(rating)}
                        onMouseEnter={() => setHovered(rating)}
                        onMouseLeave={() => setHovered(undefined)}
                        renderContent={() => (
                            <span style={{ display: "block", width: isArc ? "100%" : "24px" }}>
                                <Star isFilled={rating <= shown} />
                            </span>
                        )}
                    />
                ))}
            </RadioGroup>
            <output data-readout="value">{`value: ${valueState[0]}`}</output>
        </div>
    );
};

export const Default = () => (
    <div data-testid="default">
        <SizeGroup ariaLabel="Default size" />
    </div>
);

export const Reachable = () => (
    <div data-testid="reachable">
        <SizeGroup ariaLabel="Partly disabled size" isReachable />
    </div>
);

export const Disabled = () => (
    <div data-testid="disabled">
        <SizeGroup ariaLabel="Disabled size" isAllDisabled />
    </div>
);

export const Segmented = () => (
    <>
        <div data-testid="default">
            <SizeGroup ariaLabel="Default size" />
        </div>
        <div data-testid="segmented">
            <SizeGroup ariaLabel="Segmented size" hasFloater />
        </div>
    </>
);

export const Ratings = () => (
    <>
        <div data-testid="arc">
            <RatingGroup isArc />
        </div>
        <div data-testid="rating">
            <RatingGroup isArc={false} />
        </div>
    </>
);

export const Page = () => (
    <>
        <SizeGroup ariaLabel="Default size" />
        <SizeGroup ariaLabel="Partly disabled size" isReachable />
        <SizeGroup ariaLabel="Segmented size" hasFloater />
        <RatingGroup isArc />
    </>
);

export const RightToLeft = () => (
    <div data-testid="rightToLeft" dir="rtl">
        <SizeGroup ariaLabel="Right to left size" />
    </div>
);
