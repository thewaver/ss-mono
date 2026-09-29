import { For } from "solid-js";

import { Radio, RadioGroup } from "@thewaver/ss-components-solid";

import { PageRadioStarContent } from "../../../StyledComponents/RadioStarContent/RadioStarContent";
import type { RadioRatingExampleProps } from "../RadioPage.types";

const RATING_OPTIONS = [1, 2, 3, 4, 5];

type Props = RadioRatingExampleProps;

export const RatingExample = (props: Props) => (
    <RadioGroup value={props.value} ariaLabel={"Rating"} orientation={"horizontal"} gap={0}>
        <For each={RATING_OPTIONS}>
            {(rating) => (
                <Radio
                    value={() => rating}
                    ariaLabel={() => (rating === 1 ? "1 star" : `${rating} stars`)}
                    onMouseEnter={() => {
                        props.hovered[1](rating);
                    }}
                    onMouseLeave={() => {
                        props.hovered[1](undefined);
                    }}
                    renderContent={(getFlags) => (
                        <PageRadioStarContent
                            flags={getFlags}
                            isFilled={() => rating <= (props.hovered[0]() ?? props.value[0]())}
                        />
                    )}
                />
            )}
        </For>
    </RadioGroup>
);
