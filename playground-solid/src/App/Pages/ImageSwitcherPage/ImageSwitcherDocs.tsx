import { createSignal } from "solid-js";

import { IMAGE_SWITCHER_DEFAULTS } from "@thewaver/ss-components-solid";
import { ImageSwitcherKnobs } from "@thewaver/ss-playground/App/Knobs/ImageSwitchers.const";
import {
    DOCS_ROOT,
    MISSING_SRC,
    SOURCE_ALTS,
} from "@thewaver/ss-playground/App/Pages/ImageSwitcherPage/ImageSwitcherPage.const";
import type { SourceType } from "@thewaver/ss-playground/App/Pages/ImageSwitcherPage/ImageSwitcherPage.types";
import knight_date from "@thewaver/ss-playground/App/knight_date.webp";
import knight_profile from "@thewaver/ss-playground/App/knight_profile.webp";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";

const SOURCE_URLS: Record<SourceType, string | undefined> = {
    profile: knight_profile,
    date: knight_date,
    missing_file: MISSING_SRC,
    none: undefined,
};

export const ImageSwitcherDocs = () => {
    const [getSourceType, setSourceType] = createSignal<SourceType>(ImageSwitcherKnobs.STARTING_SOURCE_TYPE);
    const [getTransitionDurationMs, setTransitionDurationMs] = createSignal(
        IMAGE_SWITCHER_DEFAULTS.transitionDurationMs,
    );

    return (
        <PageDocsExample
            path={`${DOCS_ROOT}/Basic.tsx`}
            renderKnobs={() => (
                <>
                    <PageProp
                        key={"sourceType"}
                        label={"Source"}
                        hint={
                            "Which picture to show. Switching crossfades from the old one once the new one has loaded; missing_file points at a file that does not exist, and none passes no source at all."
                        }
                        controls={"Picks the example picture sent to ImageSwitcherProps.src and ImageSwitcherProps.alt"}
                    >
                        <PageSelectField
                            value={getSourceType}
                            values={ImageSwitcherKnobs.SOURCE_TYPES}
                            ariaLabel={"Source"}
                            onChange={(sourceType) => setSourceType(() => sourceType)}
                        />
                    </PageProp>

                    <PageProp
                        key={"transitionDurationMs"}
                        label={"Transition duration (ms)"}
                        hint={"How long the crossfade from one picture to the next takes."}
                        controls={"Sets ImageSwitcherProps.transitionDurationMs"}
                    >
                        <PageNumberField
                            value={getTransitionDurationMs}
                            min={ImageSwitcherKnobs.MIN_DURATION_MS}
                            max={ImageSwitcherKnobs.MAX_DURATION_MS}
                            step={ImageSwitcherKnobs.DURATION_STEP_MS}
                            ariaLabel={"Transition duration in milliseconds"}
                            onInput={setTransitionDurationMs}
                        />
                    </PageProp>
                </>
            )}
        >
            <BasicDocsExample
                src={() => SOURCE_URLS[getSourceType()]}
                alt={() => SOURCE_ALTS[getSourceType()]}
                transitionDurationMs={getTransitionDurationMs}
            />
        </PageDocsExample>
    );
};
