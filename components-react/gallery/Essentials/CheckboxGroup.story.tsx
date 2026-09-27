import { useState } from "react";

import type { CheckboxGroupController, InteractionFlags } from "@thewaver/ss-components";

import { Checkbox, CheckboxGroup, Label } from "../../src";

type Topping = { value: string; label: string; isSoldOut?: boolean };

const TOPPINGS: Topping[] = [
    { value: "cheese", label: "Cheese" },
    { value: "mushrooms", label: "Mushrooms" },
    { value: "olives", label: "Olives" },
    { value: "peppers", label: "Peppers" },
];

const TOPPINGS_WITH_SOLD_OUT: Topping[] = [
    ...TOPPINGS,
    { value: "anchovies", label: "Anchovies (sold out)", isSoldOut: true },
];

const Box = ({ flags }: { flags: InteractionFlags }) => (
    <span
        style={{
            display: "block",
            width: 20,
            height: 20,
            border: "1px solid black",
            opacity: flags.isDisabled ? 0.5 : 1,
        }}
    />
);

const describe = (values: string[]) => (values.length ? values.join(", ") : "none");

export const Default = () => {
    const valueState = useState(["cheese"]);

    return (
        <>
            <button type="button" id="defaultSource">
                Before
            </button>
            <CheckboxGroup valueState={valueState} ariaLabel="Toppings" orientation="vertical" gap={10}>
                {TOPPINGS.map((topping) => (
                    <Label key={topping.value}>
                        <Checkbox value={topping.value} renderContent={(flags) => <Box flags={flags} />} />
                        <span>{topping.label}</span>
                    </Label>
                ))}
            </CheckboxGroup>
            <output data-readout="value">{describe(valueState[0])}</output>
        </>
    );
};

export const SelectAll = ({ isOwned = false }: { isOwned?: boolean }) => {
    const valueState = useState(["cheese", "olives"]);
    const [group, setGroup] = useState<CheckboxGroupController>();

    const parentState = group?.getCheckedState() ?? false;

    return (
        <>
            <Label>
                <Checkbox
                    id="allToppings"
                    checkedState={[parentState === true, (isChecked) => void group?.setIsEveryChecked(isChecked)]}
                    isMixed={parentState === "mixed"}
                    renderContent={(flags) => <Box flags={flags} />}
                />
                <span>All toppings</span>
            </Label>
            <CheckboxGroup
                valueState={isOwned ? undefined : valueState}
                ariaLabel="Toppings"
                orientation="vertical"
                gap={10}
                onMount={setGroup}
            >
                {TOPPINGS_WITH_SOLD_OUT.map((topping) => (
                    <Label key={topping.value}>
                        <Checkbox
                            value={topping.value}
                            isDisabled={topping.isSoldOut ?? false}
                            renderContent={(flags) => <Box flags={flags} />}
                        />
                        <span>{topping.label}</span>
                    </Label>
                ))}
            </CheckboxGroup>
            <output data-readout="value">{describe(valueState[0])}</output>
        </>
    );
};
