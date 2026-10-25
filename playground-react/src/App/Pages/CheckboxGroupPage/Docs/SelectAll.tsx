import { useState } from "react";

import type { CheckboxGroupController } from "@thewaver/ss-components-react";
import { Checkbox, CheckboxGroup } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import {
    GROUP_GAP,
    TOPPINGS_WITH_SOLD_OUT,
} from "@thewaver/ss-playground/App/Pages/CheckboxGroupPage/CheckboxGroupPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/CheckboxGroupPage/CheckboxGroupPage.css";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";

export const SelectAllDocsExample = () => {
    const valueState = useState<string[]>(["cheese", "olives"]);
    const [group, setGroup] = useState<CheckboxGroupController>();

    const parentState = group?.getCheckedState() ?? false;

    return (
        <>
            <div className={styles.column}>
                <Checkbox
                    id={"allToppings"}
                    checked={[
                        parentState === true,
                        (isChecked: boolean) => {
                            group?.setIsEveryChecked(isChecked);
                        },
                    ]}
                    isMixed={parentState === "mixed"}
                    ariaLabel={"All toppings"}
                    renderContent={(flags) => <PageCheckboxContent flags={flags}>All toppings</PageCheckboxContent>}
                />

                <div className={styles.members}>
                    <CheckboxGroup
                        value={valueState}
                        ariaLabel={"Toppings"}
                        orientation={"vertical"}
                        gap={GROUP_GAP}
                        onMount={setGroup}
                    >
                        {TOPPINGS_WITH_SOLD_OUT.map((topping) => (
                            <Checkbox
                                key={topping.value}
                                value={topping.value}
                                isDisabled={topping.isSoldOut ?? false}
                                ariaLabel={topping.label}
                                renderContent={(flags) => (
                                    <PageCheckboxContent flags={flags}>{topping.label}</PageCheckboxContent>
                                )}
                            />
                        ))}
                    </CheckboxGroup>
                </div>
            </div>

            <div className={exampleStyles.exampleReadout} data-readout>
                {`Value: ${valueState[0].length > 0 ? valueState[0].join(", ") : "none"}`}
            </div>
        </>
    );
};
