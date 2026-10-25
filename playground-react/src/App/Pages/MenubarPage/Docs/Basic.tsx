import { useState } from "react";

import { Menubar } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import * as styles from "@thewaver/ss-playground/App/Pages/MenubarPage/MenubarPage.css";
import { POPOVER_SURFACE_INSET } from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import { useLayerClass } from "../../../StyledComponents/Layer/Layer.context";
import { PageMenuTriggerContent } from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { NOTHING_PICKED, VIEW_DEFAULTS, WORDS, renderMenubarItem, renderMenubarPopup } from "../MenubarPageReact.const";

export const BasicDocsExample = () => {
    const layerClass = useLayerClass();

    const checkedState = useState(VIEW_DEFAULTS);
    const [lastPicked, setLastPicked] = useState(NOTHING_PICKED);

    return (
        <>
            <div className={[styles.bar, styles.wideBar, layerClass].join(" ")}>
                <Menubar
                    actions={WORDS}
                    ariaLabel={"Editor"}
                    overflowAriaLabel={"More menus"}
                    checked={checkedState}
                    submenuOffset={{ x: POPOVER_SURFACE_INSET, y: -POPOVER_SURFACE_INSET }}
                    renderAction={(action, flags) => (
                        <PageMenuTriggerContent flags={flags}>{action.value.name}</PageMenuTriggerContent>
                    )}
                    renderOverflowTrigger={(flags) => (
                        <PageMenuTriggerContent flags={flags}>More</PageMenuTriggerContent>
                    )}
                    renderItem={renderMenubarItem}
                    renderPopup={renderMenubarPopup}
                    onActivate={(entry) => setLastPicked(entry.name)}
                />
            </div>

            <div className={exampleStyles.exampleReadout} data-readout>{`Last picked: ${lastPicked}`}</div>
        </>
    );
};
