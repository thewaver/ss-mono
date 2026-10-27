import { createSignal } from "solid-js";

import type { DateValue } from "@thewaver/ss-components-solid";
import { Button, DateInput, Form, FormField, MultiSelect, Select } from "@thewaver/ss-components-solid";
import { DATE_PART_HINTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { FIELD_WIDTH, LOCALE } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import {
    PageFormButtons,
    PageFormFieldCaption,
    PageFormStack,
} from "../../../StyledComponents/FormFieldContent/FormFieldContent";
import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import { PLACEHOLDER, renderSelectPopup } from "../../SelectPage/SelectPageSolid.const";

const PLANS = [{ value: "Basic" }, { value: "Team" }, { value: "Enterprise" }];
const TOPICS = [{ value: "Design" }, { value: "Engineering" }, { value: "Research" }, { value: "Sales" }];

const EMPTY_ENTRY = "(empty)";

const describeEntries = (data: FormData) =>
    Array.from(new Set(data.keys()), (key) => `${key}: ${data.getAll(key).join(", ") || EMPTY_ENTRY}`).join("; ");

export const ValuesDocsExample = () => {
    const planSignal = createSignal<string | undefined>();
    const topicsSignal = createSignal<string[]>([]);
    const startSignal = createSignal<DateValue | undefined>();
    const [getOutcome, setOutcome] = createSignal("Not sent yet.");

    return (
        <Form
            ariaLabel={"Booking"}
            onSubmit={(data) => setOutcome(`Sent: ${describeEntries(data)}.`)}
            onReset={() => {
                planSignal[1](undefined);
                topicsSignal[1]([]);
                startSignal[1](undefined);
                setOutcome("Not sent yet.");
            }}
            renderContent={() => (
                <PageFormStack>
                    <FormField
                        renderCaption={() => <PageFormFieldCaption>Plan</PageFormFieldCaption>}
                        renderControl={() => (
                            <Select
                                renderHighlightFloater={renderPageHighlightFloater}
                                name={"plan"}
                                value={planSignal}
                                options={PLANS}
                                renderContent={(getSelectedOption, getFlags) => (
                                    <PageSelectContent flags={getFlags}>
                                        {getSelectedOption()?.value ?? PLACEHOLDER}
                                    </PageSelectContent>
                                )}
                                renderOption={(getOption, getFlags) => (
                                    <PageSelectOptionContent isGliding flags={getFlags}>
                                        {getOption().value}
                                    </PageSelectOptionContent>
                                )}
                                renderPopup={renderSelectPopup}
                            />
                        )}
                    />

                    <FormField
                        renderCaption={() => <PageFormFieldCaption>Topics</PageFormFieldCaption>}
                        renderControl={() => (
                            <MultiSelect
                                renderHighlightFloater={renderPageHighlightFloater}
                                name={"topics"}
                                values={topicsSignal}
                                options={TOPICS}
                                renderContent={(getSelectedOptions, getFlags) => (
                                    <PageSelectContent flags={getFlags}>
                                        {getSelectedOptions().length
                                            ? getSelectedOptions()
                                                  .map((option) => option.value)
                                                  .join(", ")
                                            : PLACEHOLDER}
                                    </PageSelectContent>
                                )}
                                renderOption={(getOption, getFlags) => (
                                    <PageSelectOptionContent isGliding flags={getFlags}>
                                        {getOption().value}
                                    </PageSelectOptionContent>
                                )}
                                renderPopup={renderSelectPopup}
                            />
                        )}
                    />

                    <FormField
                        renderCaption={() => <PageFormFieldCaption>Start date</PageFormFieldCaption>}
                        renderControl={() => (
                            <DateInput
                                name={"start"}
                                value={startSignal}
                                locale={LOCALE}
                                partHints={DATE_PART_HINTS}
                                padding={FIELD_PADDING}
                                gap={FIELD_GAP}
                                computeTextStyle={computePageTextFieldTextStyle}
                                renderContent={(getFlags) => (
                                    <PageTextFieldContent flags={getFlags} width={FIELD_WIDTH} />
                                )}
                                renderPlaceholder={(getFlags, hint) => (
                                    <PageTextFieldPlaceholder flags={getFlags}>{hint}</PageTextFieldPlaceholder>
                                )}
                            />
                        )}
                    />

                    <PageFormButtons>
                        <Button
                            type={"submit"}
                            renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Book</PageButtonContent>}
                        />

                        <Button
                            type={"reset"}
                            renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Reset</PageButtonContent>}
                        />
                    </PageFormButtons>

                    <div class={exampleStyles.exampleReadout} data-readout>
                        {getOutcome()}
                    </div>
                </PageFormStack>
            )}
        />
    );
};
