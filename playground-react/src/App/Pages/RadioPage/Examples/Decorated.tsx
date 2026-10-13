import { Corners, Radio, RadioGroup } from "@thewaver/ss-components-react";
import { RADIO_GROUP_GAP, SIZE_OPTIONS } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";

import { PageRadioContent } from "../../../StyledComponents/RadioContent/RadioContent";
import type { RadioExampleProps } from "../RadioPageReact.types";

const CORNER_LENGTH = { width: 8, height: 8 };
const STROKE_THICKNESS = 2;

type Props = RadioExampleProps;

export const DecoratedExample = (props: Props) => (
    <RadioGroup value={props.value} ariaLabel={"Decorated size"} gap={RADIO_GROUP_GAP}>
        {SIZE_OPTIONS.map((option) => (
            <Radio
                key={option.value}
                value={option.value}
                ariaLabel={option.label}
                renderContent={(flags) => <PageRadioContent flags={flags}>{option.label}</PageRadioContent>}
                renderDecoration={(flags) => (
                    <Corners
                        color={flags.checkedState === true ? "yellow" : "transparent"}
                        cornerLength={CORNER_LENGTH}
                        strokeThickness={STROKE_THICKNESS}
                    />
                )}
            />
        ))}
    </RadioGroup>
);
