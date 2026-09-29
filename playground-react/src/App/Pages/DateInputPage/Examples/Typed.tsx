import type { DateInputEra, DateInputFormat, InteractionFlags, TextFieldFlags } from "@thewaver/ss-components-react";
import { DateInput } from "@thewaver/ss-components-react";
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
    ariaLabel: string;
    format?: DateInputFormat;
};

export const TypedExample = (props: Props) => {
    return (
        <DateInput
            value={props.value}
            calendar={props.calendar}
            locale={LOCALE}
            format={props.format}
            ariaLabel={props.ariaLabel}
            partHints={DATE_PART_HINTS}
            padding={FIELD_STEPPER_PADDING}
            gap={FIELD_GAP}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(flags) => <PageTextFieldContent flags={flags} width={FIELD_WIDTH} />}
            renderPlaceholder={(flags, hint) => (
                <PageTextFieldPlaceholder flags={flags}>{hint}</PageTextFieldPlaceholder>
            )}
            renderLeading={(flags: InteractionFlags<TextFieldFlags>, era: DateInputEra) => (
                <PageEraCycle
                    era={era.value}
                    options={era.options}
                    isDisabled={flags.isDisabled ?? false}
                    onChange={era.set}
                />
            )}
        />
    );
};
