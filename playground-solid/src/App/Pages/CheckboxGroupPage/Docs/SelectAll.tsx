import { For, createSignal } from "solid-js";

import type { CheckboxGroupController } from "@thewaver/ss-components-solid";
import { Checkbox, CheckboxGroup } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import {
    GROUP_GAP,
    TOPPINGS_WITH_SOLD_OUT,
} from "@thewaver/ss-playground/App/Pages/CheckboxGroupPage/CheckboxGroupPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/CheckboxGroupPage/CheckboxGroupPage.css";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";

export const SelectAllDocsExample = () => {
    const valueSignal = createSignal<string[]>(["cheese", "olives"]);
    const [getGroup, setGroup] = createSignal<CheckboxGroupController>();

    const getParentState = () => getGroup()?.getCheckedState() ?? false;

    return (
        <>
            <div class={styles.column}>
                <Checkbox
                    id={"allToppings"}
                    checked={[
                        () => getParentState() === true,
                        (isChecked: boolean) => {
                            getGroup()?.setIsEveryChecked(isChecked);
                        },
                    ]}
                    isMixed={() => getParentState() === "mixed"}
                    ariaLabel={"All toppings"}
                    renderContent={(getFlags) => (
                        <PageCheckboxContent flags={getFlags}>All toppings</PageCheckboxContent>
                    )}
                />

                <div class={styles.members}>
                    <CheckboxGroup
                        value={valueSignal}
                        ariaLabel={"Toppings"}
                        orientation={"vertical"}
                        gap={GROUP_GAP}
                        onMount={setGroup}
                    >
                        <For each={TOPPINGS_WITH_SOLD_OUT}>
                            {(topping) => (
                                <Checkbox
                                    value={topping.value}
                                    isDisabled={topping.isSoldOut ?? false}
                                    ariaLabel={topping.label}
                                    renderContent={(getFlags) => (
                                        <PageCheckboxContent flags={getFlags}>{topping.label}</PageCheckboxContent>
                                    )}
                                />
                            )}
                        </For>
                    </CheckboxGroup>
                </div>
            </div>

            <div class={exampleStyles.exampleReadout} data-readout>
                {`Value: ${valueSignal[0]().length > 0 ? valueSignal[0]().join(", ") : "none"}`}
            </div>
        </>
    );
};
