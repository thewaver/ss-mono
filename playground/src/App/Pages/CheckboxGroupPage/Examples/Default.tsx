import { For } from "solid-js";

import { Checkbox, CheckboxGroup, Label } from "@thewaver/ss-components";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";
import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";
import { GROUP_GAP, TOPPINGS } from "../CheckboxGroupPage.const";
import type { CheckboxGroupExampleProps } from "../CheckboxGroupPage.types";

type Props = CheckboxGroupExampleProps;

export const DefaultExample = (props: Props) => (
    <CheckboxGroup valueSignal={props.valueSignal} ariaLabel={"Toppings"} orientation={"vertical"} gap={GROUP_GAP}>
        <For each={TOPPINGS}>
            {(topping) => (
                <Label>
                    <Checkbox
                        value={topping.value}
                        renderContent={(getFlags) => <PageCheckboxContent flags={getFlags} />}
                    />

                    <PageLabelCaption>{topping.label}</PageLabelCaption>
                </Label>
            )}
        </For>
    </CheckboxGroup>
);
