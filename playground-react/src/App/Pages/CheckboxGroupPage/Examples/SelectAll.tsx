import { useState } from "react";

import type { CheckboxGroupController } from "@thewaver/ss-components-react";
import { Checkbox, CheckboxGroup, Label } from "@thewaver/ss-components-react";
import {
    GROUP_GAP,
    TOPPINGS_WITH_SOLD_OUT,
} from "@thewaver/ss-playground/App/Pages/CheckboxGroupPage/CheckboxGroupPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/CheckboxGroupPage/CheckboxGroupPage.css";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";
import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";
import type { CheckboxGroupExampleProps } from "../CheckboxGroupPage.types";

type Props = CheckboxGroupExampleProps;

export const SelectAllExample = (props: Props) => {
    const [group, setGroup] = useState<CheckboxGroupController>();

    const parentState = group?.getCheckedState() ?? false;

    return (
        <div className={styles.column}>
            <Label>
                <Checkbox
                    id={"allToppings"}
                    checkedState={[
                        parentState === true,
                        (isChecked: boolean) => {
                            group?.setIsEveryChecked(isChecked);
                        },
                    ]}
                    isMixed={parentState === "mixed"}
                    renderContent={(flags) => <PageCheckboxContent flags={flags} />}
                />

                <PageLabelCaption>All toppings</PageLabelCaption>
            </Label>

            <div className={styles.members}>
                <CheckboxGroup
                    valueState={props.valueState}
                    ariaLabel={"Toppings"}
                    orientation={"vertical"}
                    gap={GROUP_GAP}
                    onMount={setGroup}
                >
                    {TOPPINGS_WITH_SOLD_OUT.map((topping) => (
                        <Label key={topping.value}>
                            <Checkbox
                                value={topping.value}
                                isDisabled={topping.isSoldOut ?? false}
                                renderContent={(flags) => <PageCheckboxContent flags={flags} />}
                            />

                            <PageLabelCaption>{topping.label}</PageLabelCaption>
                        </Label>
                    ))}
                </CheckboxGroup>
            </div>
        </div>
    );
};
