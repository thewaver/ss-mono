import { TextInput } from "@thewaver/ss-components-solid";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground-core/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import type { TextInputExampleProps } from "../TextInputPage.types";

type Props = TextInputExampleProps;

export const ErroredExample = (props: Props) => (
    <TextInput
        valueSignal={props.valueSignal}
        padding={() => FIELD_PADDING}
        gap={() => FIELD_GAP}
        type={"email"}
        hasError={() => !props.valueSignal[0]().includes("@")}
        ariaLabel={"Email"}
        autoComplete={"email"}
        computeTextStyle={computePageTextFieldTextStyle}
        renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} />}
    />
);
