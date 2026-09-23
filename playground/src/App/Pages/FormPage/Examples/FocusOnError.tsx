import { Button, Form, FormField, MultiSelect, Select } from "@thewaver/ss-components";

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
        renderContent={(getState) => {
            const getPlanMessage = () =>
                getState().hasSubmitted && props.planSignal[0]() === undefined ? "Pick a plan." : "";

            const getTopicsMessage = () =>
                getState().hasSubmitted && props.topicsSignal[0]().length < 1 ? "Pick at least one topic." : "";

            return (
                <PageFormStack>
                    <FormField
                        hasError={() => getPlanMessage().length > 0}
                        message={getPlanMessage}
                        renderCaption={() => <PageFormFieldCaption>Plan</PageFormFieldCaption>}
                        renderMessage={(getFieldState) => (
                            <PageFormFieldMessage state={getFieldState}>{getPlanMessage()}</PageFormFieldMessage>
                        )}
                        renderControl={(getFieldState) => (
                            <Select
                                valueSignal={props.planSignal}
                                options={() => PLANS}
                                ariaLabel={"Plan"}
                                isRequired={true}
                                hasError={() => getFieldState().hasError}
                                renderContent={(getSelectedOption, getFlags) => (
                                    <PageSelectContent flags={getFlags}>
                                        {getSelectedOption()?.value ?? PLACEHOLDER}
                                    </PageSelectContent>
                                )}
                                renderOption={(getOption, getFlags) => (
                                    <PageSelectOptionContent flags={getFlags}>
                                        {getOption().value}
                                    </PageSelectOptionContent>
                                )}
                                renderPopup={renderSelectPopup}
                            />
                        )}
                    />

                    <FormField
                        hasError={() => getTopicsMessage().length > 0}
                        message={getTopicsMessage}
                        renderCaption={() => <PageFormFieldCaption>Topics</PageFormFieldCaption>}
                        renderMessage={(getFieldState) => (
                            <PageFormFieldMessage state={getFieldState}>{getTopicsMessage()}</PageFormFieldMessage>
                        )}
                        renderControl={(getFieldState) => (
                            <MultiSelect
                                valuesSignal={props.topicsSignal}
                                options={() => TOPICS}
                                ariaLabel={"Topics"}
                                isRequired={true}
                                hasError={() => getFieldState().hasError}
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
                                    <PageSelectOptionContent flags={getFlags}>
                                        {getOption().value}
                                    </PageSelectOptionContent>
                                )}
                                renderPopup={renderSelectPopup}
                            />
                        )}
                    />

                    <PageFormButtons>
                        <Button
                            type={"submit"}
                            renderContent={(getFlags) => (
                                <PageButtonContent flags={getFlags}>Subscribe</PageButtonContent>
                            )}
                        />

                        <Button
                            type={"reset"}
                            renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Reset</PageButtonContent>}
                        />
                    </PageFormButtons>
                </PageFormStack>
            );
        }}
    />
);
