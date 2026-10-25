import { createSignal } from "solid-js";

import { Clock } from "@thewaver/ss-components-solid";
import { LOCALE } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import type { TimeValue } from "@thewaver/ss-utils";

import {
    PageClockColumn,
    PageClockFrame,
    PageClockOption,
    PageClockUnit,
} from "../../../StyledComponents/ClockContent/ClockContent";
import type { ClockBasicDocsExampleProps } from "../ClockPageSolid.types";

type Props = ClockBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const valueSignal = createSignal<TimeValue | undefined>({ hour: 9, minute: 30 });

    return (
        <PageClockFrame>
            <Clock
                value={valueSignal}
                locale={LOCALE}
                isDisabled={props.isDisabled}
                ariaLabel={"Appointment time"}
                renderOption={(_unused, getRenderProps) => <PageClockOption renderProps={getRenderProps} />}
                renderUnit={(name) => <PageClockUnit>{name}</PageClockUnit>}
                renderColumn={(renderOptions) => <PageClockColumn>{renderOptions()}</PageClockColumn>}
            />
        </PageClockFrame>
    );
};
