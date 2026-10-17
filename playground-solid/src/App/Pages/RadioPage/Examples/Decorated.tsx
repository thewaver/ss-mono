import { For } from "solid-js";

import { CornerHighlight, Radio, RadioGroup } from "@thewaver/ss-components-solid";
import { RADIO_GROUP_GAP, SIZE_OPTIONS } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";

import { PageRadioContent } from "../../../StyledComponents/RadioContent/RadioContent";
import type { RadioExampleProps } from "../RadioPageSolid.types";

const CORNER_LENGTH = { width: 8, height: 8 };
const STROKE_THICKNESS = 2;

type Props = RadioExampleProps;

export const DecoratedExample = (props: Props) => (
    <RadioGroup value={props.value} ariaLabel={"Decorated size"} gap={RADIO_GROUP_GAP}>
        <For each={SIZE_OPTIONS}>
            {(option) => (
                <Radio
                    value={() => option.value}
                    ariaLabel={() => option.label}
                    renderContent={(getFlags) => <PageRadioContent flags={getFlags}>{option.label}</PageRadioContent>}
                    renderDecoration={(getFlags) => (
                        <CornerHighlight
                            color={() => (getFlags().checkedState === true ? "yellow" : "transparent")}
                            cornerLength={CORNER_LENGTH}
                            strokeThickness={STROKE_THICKNESS}
                        />
                    )}
                />
            )}
        </For>
    </RadioGroup>
);
