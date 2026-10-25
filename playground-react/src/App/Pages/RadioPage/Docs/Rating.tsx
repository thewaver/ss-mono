import { useState } from "react";

import { Radio, RadioGroup } from "@thewaver/ss-components-react";
import { STARTING_RATING } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";

import { PageRadioStarContent } from "../../../StyledComponents/RadioStarContent/RadioStarContent";

const RATING_OPTIONS = [1, 2, 3, 4, 5];

export const RatingDocsExample = () => {
    const valueState = useState(STARTING_RATING);
    const [hovered, setHovered] = useState<number>();

    return (
        <RadioGroup value={valueState} ariaLabel={"Rating"} orientation={"horizontal"} gap={0}>
            {RATING_OPTIONS.map((rating) => (
                <Radio
                    key={rating}
                    value={rating}
                    ariaLabel={rating === 1 ? "1 star" : `${rating} stars`}
                    onMouseEnter={() => setHovered(rating)}
                    onMouseLeave={() => setHovered(undefined)}
                    renderContent={(flags) => (
                        <PageRadioStarContent flags={flags} isFilled={rating <= (hovered ?? valueState[0])} />
                    )}
                />
            ))}
        </RadioGroup>
    );
};
