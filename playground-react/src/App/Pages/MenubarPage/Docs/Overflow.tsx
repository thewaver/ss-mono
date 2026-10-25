import { useState } from "react";

import { Menubar } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import * as styles from "@thewaver/ss-playground/App/Pages/MenubarPage/MenubarPage.css";
import { POPOVER_SURFACE_INSET } from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import { useLayerClass } from "../../../StyledComponents/Layer/Layer.context";
import { PageMenuTriggerContent } from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import type { MenubarOverflowDocsExampleProps } from "../MenubarPage.types";
import { NOTHING_PICKED, VIEW_DEFAULTS, WORDS, renderMenubarItem, renderMenubarPopup } from "../MenubarPageReact.const";

type Props = MenubarOverflowDocsExampleProps;

export const OverflowDocsExample = (props: Props) => {
    const layerClass = useLayerClass();

    const checkedState = useState(VIEW_DEFAULTS);
    const [lastPicked, setLastPicked] = useState(NOTHING_PICKED);

    return (
        <>
            <div className={[styles.bar, layerClass].join(" ")} style={{ width: `${props.barWidth}px` }}>
                <Menubar
                    actions={WORDS}
                    ariaLabel={"Narrow editor"}
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
