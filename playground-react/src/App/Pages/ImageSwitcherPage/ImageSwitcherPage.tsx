import { useState } from "react";

import type { ImageSwitcherProps } from "@thewaver/ss-components-react";
import { IMAGE_SWITCHER_DEFAULTS } from "@thewaver/ss-components-react";
import { ImageSwitcherKnobs } from "@thewaver/ss-playground-core/App/Knobs/ImageSwitchers.const";
import * as styles from "@thewaver/ss-playground-core/App/Pages/ImageSwitcherPage/ImageSwitcherPage.css";
import type { SourceType } from "@thewaver/ss-playground-core/App/Pages/ImageSwitcherPage/ImageSwitcherPage.types";
import knight_date from "@thewaver/ss-playground-core/App/knight_date.webp";
import knight_profile from "@thewaver/ss-playground-core/App/knight_profile.webp";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { DefaultExample } from "./Examples/Default";

const IMAGE_CONTAINER_SIZE = 480;
const MISSING_SRC = "missing_image.webp";

const SOURCE_URLS: Record<SourceType, string | undefined> = {
    profile: knight_profile,
    date: knight_date,
    missingFile: MISSING_SRC,
    none: undefined,
};

const SOURCE_ALTS: Record<SourceType, string | undefined> = {
    profile: "A knight in profile",
    date: "A knight on a date",
    missingFile: "A picture that will not load",
    none: undefined,
};

const DEFAULT_EXAMPLE_PATH = "/src/App/Pages/ImageSwitcherPage/Examples/Default.tsx";

const DefaultExampleWrapper = (props: ImageSwitcherProps) => {
    return (
        <PageMeasureBox width={IMAGE_CONTAINER_SIZE} height={IMAGE_CONTAINER_SIZE}>
            <DefaultExample {...props} />
        </PageMeasureBox>
    );
};

export const ImageSwitcherPage = () => {
    const [sourceType, setSourceType] = useState<SourceType>(ImageSwitcherKnobs.STARTING_SOURCE_TYPE);
    const [transitionDurationMs, setTransitionDurationMs] = useState(IMAGE_SWITCHER_DEFAULTS.transitionDurationMs);
    const [loadCount, setLoadCount] = useState(0);
    const [loadedName, setLoadedName] = useState("none");

    const onLoad = (e: Event) => {
        const loaded = (e.target as HTMLImageElement).src;

        setLoadCount((prev) => prev + 1);
        setLoadedName(loaded.slice(loaded.lastIndexOf("/") + 1));
    };

    const commonProps: ImageSwitcherProps = {
        src: SOURCE_URLS[sourceType],
        alt: SOURCE_ALTS[sourceType],
        transitionDurationMs,
        onLoad,
    };

    const examples = [
        {
            key: "default",
            name: "Default",
            readout: () => `loads: ${loadCount} | last loaded: ${loadedName}`,
            component: () => <DefaultExampleWrapper {...commonProps} />,
            path: DEFAULT_EXAMPLE_PATH,
        },
    ];

    return (
        <div className={styles.root}>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"sourceType"}
                    label={"Source"}
                    hint={"Where the pictures come from, which is what decides how long each one takes to load."}
                >
                    <PageSelectField
                        value={sourceType}
                        values={ImageSwitcherKnobs.SOURCE_TYPES}
                        ariaLabel={"Source"}
                        onChange={setSourceType}
                    />
                </PageProp>

                <PageProp
                    itemKey={"transitionDurationMs"}
                    label={"Transition duration (ms)"}
                    hint={"How long the crossfade from one picture to the next takes."}
                >
                    <PageNumberField
                        value={transitionDurationMs}
                        min={ImageSwitcherKnobs.MIN_DURATION_MS}
                        max={ImageSwitcherKnobs.MAX_DURATION_MS}
                        step={ImageSwitcherKnobs.DURATION_STEP_MS}
                        ariaLabel={"Transition duration"}
                        onInput={setTransitionDurationMs}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} layout={"flow"} />
        </div>
    );
};
