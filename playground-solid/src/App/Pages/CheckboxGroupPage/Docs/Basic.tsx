import { For, createSignal } from "solid-js";

import { Checkbox, CheckboxGroup } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { GROUP_GAP, TOPPINGS } from "@thewaver/ss-playground/App/Pages/CheckboxGroupPage/CheckboxGroupPage.const";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";

export const BasicDocsExample = () => {
    const valueSignal = createSignal<string[]>(["cheese"]);

    return (
        <>
            <CheckboxGroup value={valueSignal} ariaLabel={"Toppings"} orientation={"vertical"} gap={GROUP_GAP}>
                <For each={TOPPINGS}>
                    {(topping) => (
                        <Checkbox
                            value={topping.value}
                            ariaLabel={topping.label}
                            renderContent={(getFlags) => (
                                <PageCheckboxContent flags={getFlags}>{topping.label}</PageCheckboxContent>
                            )}
                        />
                    )}
                </For>
            </CheckboxGroup>

            <div class={exampleStyles.exampleReadout} data-readout>
                {`Value: ${valueSignal[0]().length > 0 ? valueSignal[0]().join(", ") : "none"}`}
            </div>
        </>
    );
};
