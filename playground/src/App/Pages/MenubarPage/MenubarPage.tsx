import { createMemo, createSignal } from "solid-js";

import { MenubarKnobs } from "../../Knobs/Menubars.const";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageNumberField } from "../../StyledComponents/Field/Field";
import { DefaultExample } from "./Examples/Default";
import { NOTHING_PICKED, VIEW_DEFAULTS } from "./MenubarPage.const";

import * as styles from "./MenubarPage.css";

const EXAMPLES_ROOT = "/src/App/Pages/MenubarPage/Examples";

export const MenubarPage = () => {
    const [getBarWidth, setBarWidth] = createSignal(MenubarKnobs.STARTING_BAR_WIDTH);
    const [getLastPicked, setLastPicked] = createSignal(NOTHING_PICKED);
    const checkedSignal = createSignal(VIEW_DEFAULTS);

    const getExamples = createMemo(() => [
        {
            key: "default",
            name: "File, Edit and View",
            readout: () =>
                `last picked: ${getLastPicked()} — with a menu open, the left and right arrows close it and open the next one; narrow the bar and a word becomes a submenu of the overflow menu`,
            component: () => (
                <div class={styles.bar} style={{ width: `${getBarWidth()}px` }}>
                    <DefaultExample checkedSignal={checkedSignal} onActivate={(entry) => setLastPicked(entry.name)} />
                </div>
            ),
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
    ]);

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"barWidth"}
                    label={"Bar width (px)"}
                    hint={"How wide the bar is. Narrow it far enough and words start moving into the overflow menu."}
                >
                    <PageNumberField
                        value={getBarWidth}
                        min={() => MenubarKnobs.MIN_BAR_WIDTH}
                        max={() => MenubarKnobs.MAX_BAR_WIDTH}
                        step={() => MenubarKnobs.BAR_WIDTH_STEP}
                        ariaLabel={"Bar width in pixels"}
                        onInput={setBarWidth}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};
