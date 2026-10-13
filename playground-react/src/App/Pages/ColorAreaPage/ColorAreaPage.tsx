import { useId, useState } from "react";

import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    STARTING_DISABLED_HSV,
    STARTING_HSV,
    STARTING_PICKER_HSV,
} from "@thewaver/ss-playground/App/Pages/ColorAreaPage/ColorAreaPage.const";
import { Color } from "@thewaver/ss-utils";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import type { ColorAreaDropdownExampleProps, ColorAreaExampleProps } from "./ColorAreaPage.types";
import { DropdownExample } from "./Examples/Dropdown";
import { SurfaceExample } from "./Examples/Surface";

export const ColorAreaPage = () => {
    const popupId = useId();

    const bareState = useState<Color.HSVA>(STARTING_HSV);
    const pickerState = useState<Color.HSVA>(STARTING_PICKER_HSV);
    const disabledState = useState<Color.HSVA>(STARTING_DISABLED_HSV);
    const isOpenState = useState(false);
    const hueState = useState(STARTING_PICKER_HSV.h);

    const bareProps: ColorAreaExampleProps = { hsv: bareState };

    const disabledProps: ColorAreaExampleProps = { hsv: disabledState, isDisabled: true };

    const dropdownProps: ColorAreaDropdownExampleProps = {
        hsv: pickerState,
        isOpen: isOpenState,
        hue: hueState,
        popupId,
    };

    const examples = [
        {
            key: "bare",
            name: EXAMPLE_NAMES.bare,
            readout: () =>
                `hsv: ${Math.round(bareState[0].h)}° ${Math.round(bareState[0].s)}% ${Math.round(bareState[0].v)}% — hex: ${Color.HSV.toHex(bareState[0])}`,
            component: () => <SurfaceExample {...bareProps} />,
            path: `${EXAMPLES_ROOT}/Surface.tsx`,
        },
        {
            key: "dropdown",
            name: EXAMPLE_NAMES.dropdown,
            readout: () => `${Color.HSVA.toHexa(pickerState[0])} — open: ${isOpenState[0]}`,
            component: () => <DropdownExample {...dropdownProps} />,
            path: `${EXAMPLES_ROOT}/Dropdown.tsx`,
        },
        {
            key: "disabled",
            name: EXAMPLE_NAMES.disabled,
            readout: () => "the drag is not attached at all, so nothing moves",
            component: () => <SurfaceExample {...disabledProps} />,
            path: `${EXAMPLES_ROOT}/Surface.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};
