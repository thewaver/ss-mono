import { createSignal } from "solid-js";

import { TextInput } from "@thewaver/ss-components-solid";
import {
    QUANTITY_MAX,
    QUANTITY_MIN,
    QUANTITY_STEP,
} from "@thewaver/ss-playground/App/Pages/TextInputPage/TextInputPage.const";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";

export const NumberDocsExample = () => {
    const valueSignal = createSignal("10");

    return (
        <TextInput
            value={valueSignal}
            padding={FIELD_PADDING}
            gap={FIELD_GAP}
            type={"number"}
            ariaLabel={"Quantity"}
            min={QUANTITY_MIN}
            max={QUANTITY_MAX}
            step={QUANTITY_STEP}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} />}
        />
    );
};
