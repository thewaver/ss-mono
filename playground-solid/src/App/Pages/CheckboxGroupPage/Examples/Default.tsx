import { For } from "solid-js";

import { Checkbox, CheckboxGroup, Label } from "@thewaver/ss-components-solid";
import { GROUP_GAP, TOPPINGS } from "@thewaver/ss-playground/App/Pages/CheckboxGroupPage/CheckboxGroupPage.const";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";
import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";
import type { CheckboxGroupExampleProps } from "../CheckboxGroupPage.types";

type Props = CheckboxGroupExampleProps;

export const DefaultExample = (props: Props) => (
    <CheckboxGroup value={props.value} ariaLabel={"Toppings"} orientation={"vertical"} gap={GROUP_GAP}>
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
