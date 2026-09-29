import { Checkbox, CheckboxGroup, Label } from "@thewaver/ss-components-react";
import { GROUP_GAP, TOPPINGS } from "@thewaver/ss-playground/App/Pages/CheckboxGroupPage/CheckboxGroupPage.const";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";
import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";
import type { CheckboxGroupExampleProps } from "../CheckboxGroupPage.types";

type Props = CheckboxGroupExampleProps;

export const DefaultExample = (props: Props) => (
    <CheckboxGroup value={props.value} ariaLabel={"Toppings"} orientation={"vertical"} gap={GROUP_GAP}>
        {TOPPINGS.map((topping) => (
            <Label key={topping.value}>
                <Checkbox value={topping.value} renderContent={(flags) => <PageCheckboxContent flags={flags} />} />

                <PageLabelCaption>{topping.label}</PageLabelCaption>
            </Label>
        ))}
    </CheckboxGroup>
);
