import { TextInput } from "@thewaver/ss-components-react";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground-core/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import type { TextInputExampleProps } from "../TextInputPage.types";

type Props = TextInputExampleProps;

export const TransformingSetterExample = (props: Props) => (
    <TextInput
        valueState={props.valueState}
        padding={FIELD_PADDING}
        gap={FIELD_GAP}
        ariaLabel={"Coupon code"}
        onInput={(value) => {
            props.valueState[1](value.toLocaleUpperCase());
        }}
        computeTextStyle={computePageTextFieldTextStyle}
        renderContent={(flags) => <PageTextFieldContent flags={flags} />}
        renderPlaceholder={(flags) => (
            <PageTextFieldPlaceholder flags={flags}>Coupon code (upper-cased)</PageTextFieldPlaceholder>
        )}
    />
);
