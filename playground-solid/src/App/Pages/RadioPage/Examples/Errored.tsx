import { For } from "solid-js";

import { Radio, RadioGroup } from "@thewaver/ss-components-solid";
import { RADIO_GROUP_GAP, SIZE_OPTIONS } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";

import { PageRadioContent } from "../../../StyledComponents/RadioContent/RadioContent";
import type { RadioOptionalExampleProps } from "../RadioPageSolid.types";

type Props = RadioOptionalExampleProps;

export const ErroredExample = (props: Props) => {
    const getHasError = () => props.value[0]() === undefined;

    return (
        <RadioGroup value={props.value} ariaLabel={"Required size"} gap={RADIO_GROUP_GAP} hasError={getHasError}>
            <For each={SIZE_OPTIONS}>
                {(option) => (
                    <Radio
                        value={() => option.value}
                        ariaLabel={() => option.label}
                        hasError={getHasError}
                        renderContent={(getFlags) => (
                            <PageRadioContent flags={getFlags}>{option.label}</PageRadioContent>
                        )}
                    />
                )}
            </For>
        </RadioGroup>
    );
};
