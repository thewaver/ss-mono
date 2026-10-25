import { For, createSignal } from "solid-js";

import { Radio, RadioGroup } from "@thewaver/ss-components-solid";
import { ARC_LAYOUT, ARC_WIDTH, STARTING_RATING } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";

import { PageRadioStarCell, PageRadioStarContent } from "../../../StyledComponents/RadioStarContent/RadioStarContent";

const RATING_OPTIONS = [1, 2, 3, 4, 5];

export const ArcDocsExample = () => {
    const valueSignal = createSignal(STARTING_RATING);
    const [getHovered, setHovered] = createSignal<number>();

    return (
        <div style={{ width: ARC_WIDTH }}>
            <RadioGroup value={valueSignal} ariaLabel={"Rating on an arc"} computeLayout={ARC_LAYOUT}>
                <For each={RATING_OPTIONS}>
                    {(rating) => (
                        <Radio
                            value={() => rating}
                            ariaLabel={() => (rating === 1 ? "1 star" : `${rating} stars`)}
                            onMouseEnter={() => setHovered(rating)}
                            onMouseLeave={() => setHovered(undefined)}
                            renderContent={(getFlags) => (
                                <PageRadioStarCell>
                                    <PageRadioStarContent
                                        flags={getFlags}
                                        isFilled={() => rating <= (getHovered() ?? valueSignal[0]())}
                                    />
                                </PageRadioStarCell>
                            )}
                        />
                    )}
                </For>
            </RadioGroup>
        </div>
    );
};
