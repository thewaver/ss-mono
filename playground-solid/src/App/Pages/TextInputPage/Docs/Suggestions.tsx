import { createMemo, createSignal } from "solid-js";

import { TextInput } from "@thewaver/ss-components-solid";
import { CITIES } from "@thewaver/ss-playground/App/Pages/TextInputPage/TextInputPage.const";
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
import { renderSelectPopup } from "../../SelectPage/SelectPageSolid.const";

export const SuggestionsDocsExample = () => {
    const valueSignal = createSignal("");

    const getSuggestions = createMemo(() => {
        const query = valueSignal[0]().trim().toLocaleLowerCase();

        if (!query) return [];

        return CITIES.filter((city) => city.name.toLocaleLowerCase().startsWith(query));
    });

    return (
        <TextInput
            value={valueSignal}
            padding={FIELD_PADDING}
            gap={FIELD_GAP}
            ariaLabel={"City"}
            suggestions={getSuggestions}
            suggestionsAriaLabel={"Cities"}
            computeCustomSuggestionText={(city) => city.name}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} />}
            renderPlaceholder={(getFlags) => (
                <PageTextFieldPlaceholder flags={getFlags}>Any city</PageTextFieldPlaceholder>
            )}
            renderSuggestion={(getCity, getFlags) => (
                <PageSelectOptionContent flags={getFlags} description={() => getCity().country}>
                    {getCity().name}
                </PageSelectOptionContent>
            )}
            renderSuggestionPopup={renderSelectPopup}
        />
    );
};
