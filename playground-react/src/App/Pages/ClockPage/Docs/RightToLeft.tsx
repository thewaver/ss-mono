import { useState } from "react";

import { Clock } from "@thewaver/ss-components-react";
import { TIME_RIGHT_LEFT_BOX_LABEL } from "@thewaver/ss-playground/App/Pages/ClockPage/ClockPage.const";
import { LOCALE } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import type { TimeValue } from "@thewaver/ss-utils";

import {
    PageClockColumn,
    PageClockFrame,
    PageClockOption,
    PageClockUnit,
} from "../../../StyledComponents/ClockContent/ClockContent";

export const RightToLeftDocsExample = () => {
    const valueState = useState<TimeValue | undefined>({ hour: 9, minute: 30 });

    return (
        <div dir={"rtl"}>
            <PageClockFrame>
                <Clock
                    value={valueState}
                    locale={LOCALE}
                    ariaLabel={TIME_RIGHT_LEFT_BOX_LABEL}
                    renderOption={(_unused, renderProps) => <PageClockOption renderProps={renderProps} />}
                    renderUnit={(name) => <PageClockUnit>{name}</PageClockUnit>}
                    renderColumn={(renderOptions) => <PageClockColumn>{renderOptions()}</PageClockColumn>}
                />
            </PageClockFrame>
        </div>
    );
};
