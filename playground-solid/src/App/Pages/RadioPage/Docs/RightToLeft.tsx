import { For, createSignal } from "solid-js";

import { Radio, RadioGroup } from "@thewaver/ss-components-solid";
import { RADIO_GROUP_GAP, SIZE_OPTIONS } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";
import type { SizeValue } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.types";

import { PageRadioContent } from "../../../StyledComponents/RadioContent/RadioContent";

export const RightToLeftDocsExample = () => {
    const valueSignal = createSignal<SizeValue | undefined>();

    return (
        <div dir={"rtl"}>
            <RadioGroup value={valueSignal} ariaLabel={"Size"} gap={RADIO_GROUP_GAP}>
                <For each={SIZE_OPTIONS}>
                    {(option) => (
                        <Radio
                            value={() => option.value}
                            ariaLabel={() => option.label}
                            renderContent={(getFlags) => (
                                <PageRadioContent flags={getFlags}>{option.label}</PageRadioContent>
                            )}
                        />
                    )}
                </For>
            </RadioGroup>
        </div>
    );
};
