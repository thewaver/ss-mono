import { createSignal } from "solid-js";

import { Menubar } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import * as styles from "@thewaver/ss-playground/App/Pages/MenubarPage/MenubarPage.css";
import { POPOVER_SURFACE_INSET } from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import { useLayerClass } from "../../../StyledComponents/Layer/Layer.context";
import { PageMenuTriggerContent } from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { NOTHING_PICKED, VIEW_DEFAULTS, WORDS, renderMenubarItem, renderMenubarPopup } from "../MenubarPageSolid.const";

export const BasicDocsExample = () => {
    const getLayerClass = useLayerClass();

    const checkedSignal = createSignal(VIEW_DEFAULTS);
    const [getLastPicked, setLastPicked] = createSignal(NOTHING_PICKED);

    return (
        <>
            <div class={[styles.bar, styles.wideBar, getLayerClass()].join(" ")}>
                <Menubar
                    actions={WORDS}
                    ariaLabel={"Editor"}
                    overflowAriaLabel={"More menus"}
                    checked={checkedSignal}
                    submenuOffset={{ x: POPOVER_SURFACE_INSET, y: -POPOVER_SURFACE_INSET }}
                    renderAction={(getAction, getFlags) => (
                        <PageMenuTriggerContent flags={getFlags}>{getAction().value.name}</PageMenuTriggerContent>
                    )}
                    renderOverflowTrigger={(getFlags) => (
                        <PageMenuTriggerContent flags={getFlags}>More</PageMenuTriggerContent>
                    )}
                    renderItem={renderMenubarItem}
                    renderPopup={renderMenubarPopup}
                    onActivate={(entry) => setLastPicked(entry.name)}
                />
            </div>

            <div class={exampleStyles.exampleReadout} data-readout>{`Last picked: ${getLastPicked()}`}</div>
        </>
    );
};
