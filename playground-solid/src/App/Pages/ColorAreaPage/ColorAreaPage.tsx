import { createMemo, createSignal, createUniqueId } from "solid-js";

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
    const popupId = createUniqueId();

    const bareSignal = createSignal<Color.HSVA>(STARTING_HSV);
    const pickerSignal = createSignal<Color.HSVA>(STARTING_PICKER_HSV);
    const disabledSignal = createSignal<Color.HSVA>(STARTING_DISABLED_HSV);
    const isOpenSignal = createSignal(false);
    const hueSignal = createSignal(pickerSignal[0]().h);

    const getExamples = createMemo(() => {
        const bareProps: ColorAreaExampleProps = { hsv: bareSignal };

        const disabledProps: ColorAreaExampleProps = { hsv: disabledSignal, isDisabled: () => true };

        const dropdownProps: ColorAreaDropdownExampleProps = {
            hsv: pickerSignal,
            isOpen: isOpenSignal,
            hue: hueSignal,
            popupId: () => popupId,
        };

        return [
            {
                key: "bare",
                name: EXAMPLE_NAMES.bare,
                readout: () =>
                    `hsv: ${Math.round(bareSignal[0]().h)}° ${Math.round(bareSignal[0]().s)}% ${Math.round(bareSignal[0]().v)}% — hex: ${Color.HSV.toHex(bareSignal[0]())}`,
                component: () => <SurfaceExample {...bareProps} />,
                path: `${EXAMPLES_ROOT}/Surface.tsx`,
            },
            {
                key: "dropdown",
                name: EXAMPLE_NAMES.dropdown,
                readout: () => `${Color.HSVA.toHexa(pickerSignal[0]())} — open: ${isOpenSignal[0]()}`,
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
    });

    return <PageExamples items={getExamples} />;
};
