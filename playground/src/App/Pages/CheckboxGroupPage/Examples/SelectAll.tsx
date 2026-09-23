import { For, createSignal } from "solid-js";

import type { CheckboxGroupController } from "@thewaver/ss-components";
import { Checkbox, CheckboxGroup, Label } from "@thewaver/ss-components";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";
import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";
import { GROUP_GAP, TOPPINGS_WITH_SOLD_OUT } from "../CheckboxGroupPage.const";
import type { CheckboxGroupExampleProps } from "../CheckboxGroupPage.types";

import * as styles from "../CheckboxGroupPage.css";

type Props = CheckboxGroupExampleProps;

export const SelectAllExample = (props: Props) => {
    const [getGroup, setGroup] = createSignal<CheckboxGroupController>();

    const getParentState = () => getGroup()?.getCheckedState() ?? false;

    return (
        <div class={styles.column}>
            <Label>
                <Checkbox
                    id={"allToppings"}
                    checkedSignal={[
                        () => getParentState() === true,
                        (isChecked: boolean) => {
                            getGroup()?.setIsEveryChecked(isChecked);
                        },
                    ]}
                    isMixed={() => getParentState() === "mixed"}
                    renderContent={(getFlags) => <PageCheckboxContent flags={getFlags} />}
                />

                <PageLabelCaption>All toppings</PageLabelCaption>
            </Label>

            <div class={styles.members}>
                <CheckboxGroup
                    valueSignal={props.valueSignal}
                    ariaLabel={"Toppings"}
                    orientation={"vertical"}
                    gap={GROUP_GAP}
                    onMount={setGroup}
                >
                    <For each={TOPPINGS_WITH_SOLD_OUT}>
                        {(topping) => (
                            <Label>
                                <Checkbox
                                    value={topping.value}
                                    isDisabled={topping.isSoldOut ?? false}
                                    renderContent={(getFlags) => <PageCheckboxContent flags={getFlags} />}
                                />

                                <PageLabelCaption>{topping.label}</PageLabelCaption>
                            </Label>
                        )}
                    </For>
                </CheckboxGroup>
            </div>
        </div>
    );
};
