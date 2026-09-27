import type { PropsWithChildren } from "react";
import { useState } from "react";

import { MenubarKnobs } from "@thewaver/ss-playground-core/App/Knobs/Menubars.const";
import * as styles from "@thewaver/ss-playground-core/App/Pages/MenubarPage/MenubarPage.css";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { useLayerClass } from "../../StyledComponents/Layer/Layer.context";
import { DefaultExample } from "./Examples/Default";
import { NOTHING_PICKED, VIEW_DEFAULTS } from "./MenubarPage.const";

const EXAMPLES_ROOT = "/src/App/Pages/MenubarPage/Examples";

const MenubarFrame = (props: PropsWithChildren<{ width: number }>) => {
    const layerClass = useLayerClass();

    return (
        <div className={[styles.bar, layerClass].join(" ")} style={{ width: `${props.width}px` }}>
            {props.children}
        </div>
    );
};

export const MenubarPage = () => {
    const [barWidth, setBarWidth] = useState(MenubarKnobs.STARTING_BAR_WIDTH);
    const [lastPicked, setLastPicked] = useState(NOTHING_PICKED);
    const checkedState = useState(VIEW_DEFAULTS);

    const examples = [
        {
            key: "default",
            name: "File, Edit and View",
            readout: () =>
                `last picked: ${lastPicked} — with a menu open, the left and right arrows close it and open the next one; narrow the bar and a word becomes a submenu of the overflow menu`,
            component: () => (
                <MenubarFrame width={barWidth}>
                    <DefaultExample checkedState={checkedState} onActivate={(entry) => setLastPicked(entry.name)} />
                </MenubarFrame>
            ),
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"barWidth"}
                    label={"Bar width (px)"}
                    hint={"How wide the bar is. Narrow it far enough and words start moving into the overflow menu."}
                >
                    <PageNumberField
                        value={barWidth}
                        min={MenubarKnobs.MIN_BAR_WIDTH}
                        max={MenubarKnobs.MAX_BAR_WIDTH}
                        step={MenubarKnobs.BAR_WIDTH_STEP}
                        ariaLabel={"Bar width in pixels"}
                        onInput={setBarWidth}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} layout={"flow"} />
        </>
    );
};
