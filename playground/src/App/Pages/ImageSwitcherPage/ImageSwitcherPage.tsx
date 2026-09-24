import { createMemo, createSignal } from "solid-js";

import type { ImageSwitcherProps } from "@thewaver/ss-components";
import { IMAGE_SWITCHER_DEFAULTS } from "@thewaver/ss-components";

import { ImageSwitcherKnobs } from "../../Knobs/ImageSwitchers.const";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageNumberField, PageSelectField } from "../../StyledComponents/Field/Field";
import knight_date from "../../knight_date.webp";
import knight_profile from "../../knight_profile.webp";
import { DefaultExample } from "./Examples/Default";
import type { SourceType } from "./ImageSwitcherPage.types";

import * as styles from "./ImageSwitcherPage.css";

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
        <PageMeasureBox width={() => IMAGE_CONTAINER_SIZE} height={() => IMAGE_CONTAINER_SIZE}>
            <DefaultExample {...props} />
        </PageMeasureBox>
    );
};

export const ImageSwitcherPage = () => {
    const [getSourceType, setSourceType] = createSignal<SourceType>(ImageSwitcherKnobs.STARTING_SOURCE_TYPE);
    const [getTransitionDurationMs, setTransitionDurationMs] = createSignal(
        IMAGE_SWITCHER_DEFAULTS.transitionDurationMs,
    );
    const [getLoadCount, setLoadCount] = createSignal(0);
    const [getLoadedName, setLoadedName] = createSignal("none");

    const getSrc = () => SOURCE_URLS[getSourceType()];

    const getAlt = () => SOURCE_ALTS[getSourceType()];

    const onLoad = (e: Event) => {
        const loaded = (e.target as HTMLImageElement).src;

        setLoadCount((prev) => prev + 1);
        setLoadedName(loaded.slice(loaded.lastIndexOf("/") + 1));
    };

    const getExamples = createMemo(() => {
        const commonProps: ImageSwitcherProps = {
            src: getSrc,
            alt: getAlt,
            transitionDurationMs: getTransitionDurationMs,
            onLoad,
        };

        return [
            {
                key: "default",
                name: "Default",
                readout: () => `loads: ${getLoadCount()} | last loaded: ${getLoadedName()}`,
                component: () => <DefaultExampleWrapper {...commonProps} />,
                path: DEFAULT_EXAMPLE_PATH,
            },
        ];
    });

    return (
        <div class={styles.root}>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"sourceType"}
                    label={"Source"}
                    hint={"Where the pictures come from, which is what decides how long each one takes to load."}
                >
                    <PageSelectField
                        value={getSourceType}
                        values={() => ImageSwitcherKnobs.SOURCE_TYPES}
                        ariaLabel={"Source"}
                        onChange={(sourceType) => setSourceType(() => sourceType)}
                    />
                </PageProp>

                <PageProp
                    key={"transitionDurationMs"}
                    label={"Transition duration (ms)"}
                    hint={"How long the crossfade from one picture to the next takes."}
                >
                    <PageNumberField
                        value={getTransitionDurationMs}
                        min={() => ImageSwitcherKnobs.MIN_DURATION_MS}
                        max={() => ImageSwitcherKnobs.MAX_DURATION_MS}
                        step={() => ImageSwitcherKnobs.DURATION_STEP_MS}
                        ariaLabel={"Transition duration"}
                        onInput={setTransitionDurationMs}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} layout={"flow"} />
        </div>
    );
};
