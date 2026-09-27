import { Button, Form, FormField, MultiSelect, Select } from "@thewaver/ss-components-react";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import {
    PageFormButtons,
    PageFormFieldCaption,
    PageFormFieldMessage,
    PageFormStack,
} from "../../../StyledComponents/FormFieldContent/FormFieldContent";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { PLACEHOLDER, renderSelectPopup } from "../../SelectPage/SelectPage.const";
import type { FormFocusExampleProps } from "../FormPage.types";

const PLANS = [{ value: "Basic" }, { value: "Team" }, { value: "Enterprise" }];
const TOPICS = [{ value: "Design" }, { value: "Engineering" }, { value: "Research" }, { value: "Sales" }];

type Props = FormFocusExampleProps;

export const FocusOnErrorExample = (props: Props) => (
    <Form
        ariaLabel={"Newsletter"}
        onSubmit={props.onSubmit}
        onReset={props.onReset}
        renderContent={(state) => {
            const planMessage = state.hasSubmitted && props.planState[0] === undefined ? "Pick a plan." : "";

            const topicsMessage =
                state.hasSubmitted && props.topicsState[0].length < 1 ? "Pick at least one topic." : "";

            return (
                <PageFormStack>
                    <FormField
                        hasError={planMessage.length > 0}
                        message={planMessage}
                        renderCaption={() => <PageFormFieldCaption>Plan</PageFormFieldCaption>}
                        renderMessage={(fieldState) => (
                            <PageFormFieldMessage state={fieldState}>{planMessage}</PageFormFieldMessage>
                        )}
                        renderControl={(fieldState) => (
                            <Select
                                valueState={props.planState}
                                options={PLANS}
                                ariaLabel={"Plan"}
                                isRequired={true}
                                hasError={fieldState.hasError}
                                renderContent={(selectedOption, flags) => (
                                    <PageSelectContent flags={flags}>
                                        {selectedOption?.value ?? PLACEHOLDER}
                                    </PageSelectContent>
                                )}
                                renderOption={(option, flags) => (
                                    <PageSelectOptionContent flags={flags}>{option.value}</PageSelectOptionContent>
                                )}
                                renderPopup={renderSelectPopup}
                            />
                        )}
                    />

                    <FormField
                        hasError={topicsMessage.length > 0}
                        message={topicsMessage}
                        renderCaption={() => <PageFormFieldCaption>Topics</PageFormFieldCaption>}
                        renderMessage={(fieldState) => (
                            <PageFormFieldMessage state={fieldState}>{topicsMessage}</PageFormFieldMessage>
                        )}
                        renderControl={(fieldState) => (
                            <MultiSelect
                                valuesState={props.topicsState}
                                options={TOPICS}
                                ariaLabel={"Topics"}
                                isRequired={true}
                                hasError={fieldState.hasError}
                                renderContent={(selectedOptions, flags) => (
                                    <PageSelectContent flags={flags}>
                                        {selectedOptions.length
                                            ? selectedOptions.map((option) => option.value).join(", ")
                                            : PLACEHOLDER}
                                    </PageSelectContent>
                                )}
                                renderOption={(option, flags) => (
                                    <PageSelectOptionContent flags={flags}>{option.value}</PageSelectOptionContent>
                                )}
                                renderPopup={renderSelectPopup}
                            />
                        )}
                    />

                    <PageFormButtons>
                        <Button
                            type={"submit"}
                            renderContent={(flags) => <PageButtonContent flags={flags}>Subscribe</PageButtonContent>}
                        />

                        <Button
                            type={"reset"}
                            renderContent={(flags) => <PageButtonContent flags={flags}>Reset</PageButtonContent>}
                        />
                    </PageFormButtons>
                </PageFormStack>
            );
        }}
    />
);
