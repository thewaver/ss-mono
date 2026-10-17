import { For } from "solid-js";

import { Radio, RadioGroup } from "@thewaver/ss-components-solid";
import { RADIO_GROUP_GAP, SIZE_OPTIONS } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";

import { PageRadioContent } from "../../../StyledComponents/RadioContent/RadioContent";
import type { RadioExampleProps } from "../RadioPageSolid.types";

type Props = RadioExampleProps;

export const DisabledExample = (props: Props) => (
    <RadioGroup value={props.value} ariaLabel={"Disabled size"} gap={RADIO_GROUP_GAP}>
        <For each={SIZE_OPTIONS}>
            {(option) => (
                <Radio
                    value={() => option.value}
                    ariaLabel={() => option.label}
                    isDisabled={true}
                    renderContent={(getFlags) => <PageRadioContent flags={getFlags}>{option.label}</PageRadioContent>}
                />
            )}
        </For>
    </RadioGroup>
);
