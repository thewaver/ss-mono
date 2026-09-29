import { useId, useState } from "react";

import { Color } from "@thewaver/ss-utils";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import type { ColorAreaDropdownExampleProps, ColorAreaExampleProps } from "./ColorAreaPage.types";
import { DropdownExample } from "./Examples/Dropdown";
import { SurfaceExample } from "./Examples/Surface";

const EXAMPLES_ROOT = "/src/App/Pages/ColorAreaPage/Examples";

const STARTING_HSV: Color.HSVA = { h: 210, s: 70, v: 90, a: 1 };
const STARTING_PICKER_HSV: Color.HSVA = { h: 90, s: 50, v: 80, a: 1 };
const STARTING_DISABLED_HSV: Color.HSVA = { h: 0, s: 60, v: 60, a: 1 };

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
            name: "The surface alone",
            readout: () =>
                `hsv: ${Math.round(bareState[0].h)}° ${Math.round(bareState[0].s)}% ${Math.round(bareState[0].v)}% — hex: ${Color.HSV.toHex(bareState[0])}`,
            component: () => <SurfaceExample {...bareProps} />,
            path: `${EXAMPLES_ROOT}/Surface.tsx`,
        },
        {
            key: "dropdown",
            name: "In a dropdown, replacing the OS dialog",
            readout: () => `${Color.HSVA.toHexa(pickerState[0])} — open: ${isOpenState[0]}`,
            component: () => <DropdownExample {...dropdownProps} />,
            path: `${EXAMPLES_ROOT}/Dropdown.tsx`,
        },
        {
            key: "disabled",
            name: "Disabled",
            readout: () => "the drag is not attached at all, so nothing moves",
            component: () => <SurfaceExample {...disabledProps} />,
            path: `${EXAMPLES_ROOT}/Surface.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};
