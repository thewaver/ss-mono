import { useState } from "react";

import { Radio, RadioGroup } from "@thewaver/ss-components-react";
import { ARC_LAYOUT, ARC_WIDTH, STARTING_RATING } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";

import { PageRadioStarCell, PageRadioStarContent } from "../../../StyledComponents/RadioStarContent/RadioStarContent";

const RATING_OPTIONS = [1, 2, 3, 4, 5];

export const ArcDocsExample = () => {
    const valueState = useState(STARTING_RATING);
    const [hovered, setHovered] = useState<number>();

    return (
        <div style={{ width: ARC_WIDTH }}>
            <RadioGroup value={valueState} ariaLabel={"Rating on an arc"} computeLayout={ARC_LAYOUT}>
                {RATING_OPTIONS.map((rating) => (
                    <Radio
                        key={rating}
                        value={rating}
                        ariaLabel={rating === 1 ? "1 star" : `${rating} stars`}
                        onMouseEnter={() => setHovered(rating)}
                        onMouseLeave={() => setHovered(undefined)}
                        renderContent={(flags) => (
                            <PageRadioStarCell>
                                <PageRadioStarContent flags={flags} isFilled={rating <= (hovered ?? valueState[0])} />
                            </PageRadioStarCell>
                        )}
                    />
                ))}
            </RadioGroup>
        </div>
    );
};
