import { useState } from "react";

import { Checkbox, CheckboxGroup } from "@thewaver/ss-components-react";
import { GROUP_GAP, TOPPINGS } from "@thewaver/ss-playground/App/Pages/CheckboxGroupPage/CheckboxGroupPage.const";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";

export const RightToLeftDocsExample = () => {
    const valueState = useState<string[]>(["cheese"]);

    return (
        <div dir={"rtl"}>
            <CheckboxGroup value={valueState} ariaLabel={"Toppings"} orientation={"horizontal"} gap={GROUP_GAP}>
                {TOPPINGS.map((topping) => (
                    <Checkbox
                        key={topping.value}
                        value={topping.value}
                        ariaLabel={topping.label}
                        renderContent={(flags) => (
                            <PageCheckboxContent flags={flags}>{topping.label}</PageCheckboxContent>
                        )}
                    />
                ))}
            </CheckboxGroup>
        </div>
    );
};
