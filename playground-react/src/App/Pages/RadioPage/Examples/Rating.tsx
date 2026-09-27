import { Radio, RadioGroup } from "@thewaver/ss-components-react";

import { PageRadioStarContent } from "../../../StyledComponents/RadioStarContent/RadioStarContent";
import type { RadioRatingExampleProps } from "../RadioPage.types";

const RATING_OPTIONS = [1, 2, 3, 4, 5];

type Props = RadioRatingExampleProps;

export const RatingExample = (props: Props) => (
    <RadioGroup valueState={props.valueState} ariaLabel={"Rating"} orientation={"horizontal"} gap={0}>
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
                    <PageRadioStarContent
                        flags={flags}
                        isFilled={rating <= (props.hoveredState[0] ?? props.valueState[0])}
                    />
                )}
            />
        ))}
    </RadioGroup>
);
