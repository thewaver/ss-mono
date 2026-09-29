import type {
    DateInputEra,
    DateInputFormat,
    InteractionFlags,
    MaybeAccessor,
    TextFieldFlags,
} from "@thewaver/ss-components-solid";
import { DateInput } from "@thewaver/ss-components-solid";
import { DATE_PART_HINTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { FIELD_WIDTH, LOCALE } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageEraCycle } from "../../../PageComponents/EraCycle/EraCycle";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import type { DateExampleProps } from "../../DatePickerPage/DatePickerPage.types";

type Props = DateExampleProps & {
    ariaLabel: MaybeAccessor<string>;
    format?: MaybeAccessor<DateInputFormat>;
};

export const TypedExample = (props: Props) => {
    return (
        <DateInput
            value={props.value}
            calendar={props.calendar}
            locale={() => LOCALE}
            format={props.format}
            ariaLabel={props.ariaLabel}
            partHints={DATE_PART_HINTS}
            padding={() => FIELD_STEPPER_PADDING}
            gap={() => FIELD_GAP}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} width={() => FIELD_WIDTH} />}
            renderPlaceholder={(getFlags, hint) => (
                <PageTextFieldPlaceholder flags={getFlags}>{hint}</PageTextFieldPlaceholder>
            )}
            renderLeading={(getFlags: () => InteractionFlags<TextFieldFlags>, era: DateInputEra) => (
                <PageEraCycle
                    era={era.getValue}
                    options={era.getOptions}
                    isDisabled={() => getFlags().isDisabled ?? false}
                    onChange={era.set}
                />
            )}
        />
    );
};
