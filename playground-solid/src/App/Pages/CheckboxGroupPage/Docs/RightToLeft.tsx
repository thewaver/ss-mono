import { For, createSignal } from "solid-js";

import { Checkbox, CheckboxGroup } from "@thewaver/ss-components-solid";
import { GROUP_GAP, TOPPINGS } from "@thewaver/ss-playground/App/Pages/CheckboxGroupPage/CheckboxGroupPage.const";

import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";

export const RightToLeftDocsExample = () => {
    const valueSignal = createSignal<string[]>(["cheese"]);

    return (
        <div dir={"rtl"}>
            <CheckboxGroup value={valueSignal} ariaLabel={"Toppings"} orientation={"horizontal"} gap={GROUP_GAP}>
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
        </div>
    );
};
