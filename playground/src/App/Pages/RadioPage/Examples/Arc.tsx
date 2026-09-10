import { For } from "solid-js";

import { PlacementLayoutUtils, Radio, RadioGroup } from "@thewaver/ss-components";
import type { ArcDefs } from "@thewaver/ss-components";

import { PageRadioStarCell, PageRadioStarContent } from "../../../StyledComponents/RadioStarContent/RadioStarContent";
import type { RadioRatingExampleProps } from "../RadioPage.types";

const RATING_OPTIONS = [1, 2, 3, 4, 5];

const ARC_DEFS: ArcDefs = { width: 300, height: 116, spreadDegrees: 160, itemWidth: 33, itemHeight: 36 };

const ARC_LAYOUT = PlacementLayoutUtils.createArc(ARC_DEFS);

type Props = RadioRatingExampleProps;

const ARC_WIDTH = `${ARC_DEFS.width}px`;

export const ArcExample = (props: Props) => (
    <div style={{ width: ARC_WIDTH }}>
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
    </div>
);
