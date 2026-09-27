import { useState } from "react";

import { Listbox } from "../../src";
import { COUNTRIES_WITH_REACHABLE, OptionContent, SIZES, Surface } from "./ListboxFixtures";

export const Single = () => {
    const valueState = useState<string | undefined>("Portugal");

    return (
        <>
            <button type="button" id="singleSource">
                Before
            </button>
            <Surface>
                <Listbox
                    valueState={valueState}
                    options={COUNTRIES_WITH_REACHABLE}
                    ariaLabel={"Shipping country"}
                    renderOption={(option, flags) => <OptionContent flags={flags}>{option.value}</OptionContent>}
                />
            </Surface>
            <button type="button" id="singleAfter">
                After
            </button>
            <output data-readout="value">{`value: ${valueState[0] ?? "undefined"}`}</output>
        </>
    );
};

export const Horizontal = () => {
    const valueState = useState<string | undefined>();

    return (
        <div dir="rtl">
            <Surface isWide={true}>
                <Listbox
                    valueState={valueState}
                    options={SIZES}
                    orientation={"horizontal"}
                    ariaLabel={"Size"}
                    renderOption={(option, flags) => <OptionContent flags={flags}>{option.value}</OptionContent>}
                />
            </Surface>
            <output data-readout="value">{`value: ${valueState[0] ?? "undefined"}`}</output>
        </div>
    );
};
