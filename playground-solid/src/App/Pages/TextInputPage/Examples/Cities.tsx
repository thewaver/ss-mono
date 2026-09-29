import { TextInput } from "@thewaver/ss-components-solid";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import { renderSelectPopup } from "../../SelectPage/SelectPage.const";
import type { TextInputCitiesExampleProps } from "../TextInputPage.types";

type Props = TextInputCitiesExampleProps;

export const CitiesExample = (props: Props) => (
    <TextInput
        value={props.value}
        padding={() => FIELD_PADDING}
        gap={() => FIELD_GAP}
        ariaLabel={"City"}
        suggestions={props.suggestions}
        suggestionsAriaLabel={"Cities"}
        computeCustomSuggestionText={(city) => city.name}
        computeTextStyle={computePageTextFieldTextStyle}
        renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} />}
        renderPlaceholder={(getFlags) => <PageTextFieldPlaceholder flags={getFlags}>Any city</PageTextFieldPlaceholder>}
        renderSuggestion={(getCity, getFlags) => (
            <PageSelectOptionContent flags={getFlags} description={() => getCity().country}>
                {getCity().name}
            </PageSelectOptionContent>
        )}
        renderSuggestionPopup={renderSelectPopup}
    />
);
