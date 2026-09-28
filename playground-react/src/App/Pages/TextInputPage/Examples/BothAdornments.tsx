import { Button, TextInput } from "@thewaver/ss-components-react";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageTextFieldAdornment } from "../../../StyledComponents/TextFieldAdornment/TextFieldAdornment";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import type { TextInputExampleProps } from "../TextInputPage.types";

type Props = TextInputExampleProps;

export const BothAdornmentsExample = (props: Props) => (
    <TextInput
        valueState={props.valueState}
        padding={FIELD_PADDING}
        gap={FIELD_GAP}
        ariaLabel={"Amount"}
        inputMode={"decimal"}
        computeTextStyle={computePageTextFieldTextStyle}
        renderContent={(flags) => <PageTextFieldContent flags={flags} />}
        renderPlaceholder={(flags) => <PageTextFieldPlaceholder flags={flags}>0.00</PageTextFieldPlaceholder>}
        renderLeading={(flags) => <PageTextFieldAdornment flags={flags}>USD</PageTextFieldAdornment>}
        renderTrailing={() => (
            <Button
                isDisabled={props.valueState[0] === ""}
                onClick={() => {
                    props.valueState[1]("");
                }}
                renderContent={(flags) => <PageTextFieldAdornment flags={flags}>Clear</PageTextFieldAdornment>}
            />
        )}
    />
);
