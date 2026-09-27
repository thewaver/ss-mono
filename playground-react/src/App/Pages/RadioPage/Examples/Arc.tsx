import { PlacementLayoutUtils, Radio, RadioGroup } from "@thewaver/ss-components-react";
import type { ArcDefs } from "@thewaver/ss-components-react";

import { PageRadioStarCell, PageRadioStarContent } from "../../../StyledComponents/RadioStarContent/RadioStarContent";
import type { RadioRatingExampleProps } from "../RadioPage.types";

const RATING_OPTIONS = [1, 2, 3, 4, 5];

const ARC_DEFS: ArcDefs = {
    curveHeightRatio: 0.3867,
    spreadDegrees: 160,
    itemWidthRatio: 0.11,
    itemHeightRatio: 1.0909,
};

const ARC_LAYOUT = PlacementLayoutUtils.createArc(ARC_DEFS);

type Props = RadioRatingExampleProps;

const ARC_WIDTH = "300px";

export const ArcExample = (props: Props) => (
    <div style={{ width: ARC_WIDTH }}>
        <RadioGroup valueState={props.valueState} ariaLabel={"Rating on an arc"} computeLayout={ARC_LAYOUT}>
            {RATING_OPTIONS.map((rating) => (
                <Radio
                    key={rating}
                    value={rating}
                    ariaLabel={rating === 1 ? "1 star" : `${rating} stars`}
                    onMouseEnter={() => {
                        props.hoveredState[1](rating);
                    }}
                    onMouseLeave={() => {
                        props.hoveredState[1](undefined);
                    }}
                    renderContent={(flags) => (
                        <PageRadioStarCell>
                            <PageRadioStarContent
                                flags={flags}
                                isFilled={rating <= (props.hoveredState[0] ?? props.valueState[0])}
                            />
                        </PageRadioStarCell>
                    )}
                />
            ))}
        </RadioGroup>
    </div>
);
