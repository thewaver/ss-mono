import { useState } from "react";

import { MultiSelect } from "../../src";
import type { SelectItem } from "../../src";
import {
    COUNTRIES,
    GROUPED_COUNTRIES,
    GroupContent,
    OptionContent,
    PLACEHOLDER,
    PopupSurface,
} from "./ListboxFixtures";

const CLEAR_ROOM = 40;

type DefaultProps = { isGrouped?: boolean; initial?: string[] };

export const Default = ({ isGrouped = false, initial = ["Denmark"] }: DefaultProps) => {
    const valuesState = useState<string[]>(initial);
    const options: SelectItem<string>[] = isGrouped ? GROUPED_COUNTRIES : COUNTRIES;

    return (
        <>
            <div style={{ width: 240 }}>
                <MultiSelect
                    valuesState={valuesState}
                    options={options}
                    ariaLabel={"Countries"}
                    padding={{ paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: CLEAR_ROOM }}
                    clearAriaLabel={"Clear countries"}
                    renderClear={() => <span aria-hidden="true">×</span>}
                    renderContent={(selected) => (
                        <span>{selected.length ? selected.map((option) => option.value).join(", ") : PLACEHOLDER}</span>
                    )}
                    renderGroup={(group, flags) => <GroupContent flags={flags}>{group.label}</GroupContent>}
                    renderOption={(option, flags) => <OptionContent flags={flags}>{option.value}</OptionContent>}
                    renderPopup={(renderOptions, visibilityTarget, durationMs) => (
                        <PopupSurface visibilityTarget={visibilityTarget} durationMs={durationMs}>
                            {renderOptions()}
                        </PopupSurface>
                    )}
                />
            </div>
            <output data-readout="values">{`values: [${valuesState[0].join(", ")}]`}</output>
        </>
    );
};
