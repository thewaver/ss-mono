import { For } from "solid-js";

import { Radio, RadioGroup } from "@thewaver/ss-components-solid";

import { PageRadioContent } from "../../../StyledComponents/RadioContent/RadioContent";
import { RADIO_GROUP_GAP, SIZE_OPTIONS } from "../RadioPage.const";
import type { RadioOptionalExampleProps } from "../RadioPage.types";

type Props = RadioOptionalExampleProps;

export const DefaultExample = (props: Props) => (
    <RadioGroup value={props.value} ariaLabel={"Default size"} gap={() => RADIO_GROUP_GAP}>
        <For each={SIZE_OPTIONS}>
            {(option) => (
                <Radio
                    value={() => option.value}
                    ariaLabel={() => option.label}
                    renderContent={(getFlags) => <PageRadioContent flags={getFlags}>{option.label}</PageRadioContent>}
                />
            )}
        </For>
    </RadioGroup>
);
