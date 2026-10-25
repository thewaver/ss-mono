import { For, createSignal } from "solid-js";

import { Radio, RadioGroup } from "@thewaver/ss-components-solid";
import { STARTING_RATING } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";

import { PageRadioStarContent } from "../../../StyledComponents/RadioStarContent/RadioStarContent";

const RATING_OPTIONS = [1, 2, 3, 4, 5];

export const RatingDocsExample = () => {
    const valueSignal = createSignal(STARTING_RATING);
    const [getHovered, setHovered] = createSignal<number>();

    return (
        <RadioGroup value={valueSignal} ariaLabel={"Rating"} orientation={"horizontal"} gap={0}>
            <For each={RATING_OPTIONS}>
                {(rating) => (
                    <Radio
                        value={() => rating}
                        ariaLabel={() => (rating === 1 ? "1 star" : `${rating} stars`)}
                        onMouseEnter={() => setHovered(rating)}
                        onMouseLeave={() => setHovered(undefined)}
                        renderContent={(getFlags) => (
                            <PageRadioStarContent
                                flags={getFlags}
                                isFilled={() => rating <= (getHovered() ?? valueSignal[0]())}
                            />
                        )}
                    />
                )}
            </For>
        </RadioGroup>
    );
};
