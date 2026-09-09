import { For } from "solid-js";

import { Radio, RadioGroup, createHemisphere } from "@thewaver/ss-components";
import type { ArcDefs } from "@thewaver/ss-components";

import { PageRadioStarCell, PageRadioStarContent } from "../../../StyledComponents/RadioStarContent/RadioStarContent";
import type { RadioRatingExampleProps } from "../RadioPage.types";

const RATING_OPTIONS = [1, 2, 3, 4, 5];

const ARC_DEFS: ArcDefs = { fit: "content", holeRadiusPx: 72, bandWidthPx: 44, labelMaxWidthRatio: 0.75 };

const ARC_LAYOUT = createHemisphere(ARC_DEFS);

type Props = RadioRatingExampleProps;

export const ArcExample = (props: Props) => (
    <RadioGroup valueSignal={props.valueSignal} ariaLabel={"Rating on an arc"} computeLayout={ARC_LAYOUT}>
        <For each={RATING_OPTIONS}>
            {(rating) => (
                <Radio
                    value={() => rating}
                    ariaLabel={() => (rating === 1 ? "1 star" : `${rating} stars`)}
                    onMouseEnter={() => {
                        props.hoveredSignal[1](rating);
                    }}
                    onMouseLeave={() => {
                        props.hoveredSignal[1](undefined);
                    }}
                    renderContent={(getFlags) => (
                        <PageRadioStarCell>
                            <PageRadioStarContent
                                flags={getFlags}
                                isFilled={() => rating <= (props.hoveredSignal[0]() ?? props.valueSignal[0]())}
                            />
                        </PageRadioStarCell>
                    )}
                />
            )}
        </For>
    </RadioGroup>
);
