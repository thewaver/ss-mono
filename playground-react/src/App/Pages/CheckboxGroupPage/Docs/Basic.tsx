import { useState } from "react";

import { Checkbox, CheckboxGroup } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { GROUP_GAP, TOPPINGS } from "@thewaver/ss-playground/App/Pages/CheckboxGroupPage/CheckboxGroupPage.const";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";

export const BasicDocsExample = () => {
    const valueState = useState<string[]>(["cheese"]);

    return (
        <>
            <CheckboxGroup value={valueState} ariaLabel={"Toppings"} orientation={"vertical"} gap={GROUP_GAP}>
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

            <div className={exampleStyles.exampleReadout} data-readout>
                {`Value: ${valueState[0].length > 0 ? valueState[0].join(", ") : "none"}`}
            </div>
        </>
    );
};
