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
import type { TextInputPasswordExampleProps } from "../TextInputPage.types";

type Props = TextInputPasswordExampleProps;

export const PasswordExample = (props: Props) => (
    <TextInput
        value={props.value}
        padding={FIELD_PADDING}
        gap={FIELD_GAP}
        type={props.reveal[0] ? "text" : "password"}
        ariaLabel={"Password"}
        autoComplete={"current-password"}
        computeTextStyle={computePageTextFieldTextStyle}
        renderContent={(flags) => <PageTextFieldContent flags={flags} />}
        renderPlaceholder={(flags) => <PageTextFieldPlaceholder flags={flags}>Password</PageTextFieldPlaceholder>}
        renderTrailing={() => (
            <Button
                onClick={() => {
                    props.reveal[1](!props.reveal[0]);
                }}
                renderContent={(flags) => (
                    <PageTextFieldAdornment flags={flags}>
                        {props.reveal[0] ? "Hide" : "Show"}
                    </PageTextFieldAdornment>
                )}
            />
        )}
    />
);
