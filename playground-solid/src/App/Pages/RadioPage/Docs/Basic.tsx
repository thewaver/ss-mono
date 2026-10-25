import { For, createSignal } from "solid-js";

import { Radio, RadioGroup } from "@thewaver/ss-components-solid";
import { RADIO_GROUP_GAP, SIZE_OPTIONS } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";
import type { SizeValue } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.types";

import { PageRadioContent } from "../../../StyledComponents/RadioContent/RadioContent";
import type { RadioBasicDocsExampleProps } from "../RadioPageSolid.types";

type Props = RadioBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const valueSignal = createSignal<SizeValue | undefined>();

    return (
        <RadioGroup value={valueSignal} ariaLabel={"Size"} gap={RADIO_GROUP_GAP} hasError={props.hasError}>
            <For each={SIZE_OPTIONS}>
                {(option) => (
                    <Radio
                        value={() => option.value}
                        ariaLabel={() => option.label}
                        hasError={props.hasError}
                        isDisabled={props.isDisabled}
                        renderContent={(getFlags) => (
                            <PageRadioContent flags={getFlags}>{option.label}</PageRadioContent>
                        )}
                    />
                )}
            </For>
        </RadioGroup>
    );
};
