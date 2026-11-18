import { useState } from "react";

import { IMAGE_SWITCHER_DEFAULTS } from "@thewaver/ss-components-react";
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
    const [sourceType, setSourceType] = useState<SourceType>(ImageSwitcherKnobs.STARTING_SOURCE_TYPE);
    const [transitionDurationMs, setTransitionDurationMs] = useState(IMAGE_SWITCHER_DEFAULTS.transitionDurationMs);

    return (
        <PageDocsExample
            path={`${DOCS_ROOT}/Basic.tsx`}
            renderKnobs={() => (
                <>
                    <PageProp itemKey={"sourceType"} {...ImageSwitcherKnobs.SOURCE_TYPE_TEXT}>
                        <PageSelectField
                            value={sourceType}
                            values={ImageSwitcherKnobs.SOURCE_TYPES}
                            ariaLabel={"Source"}
                            onChange={setSourceType}
                        />
                    </PageProp>

                    <PageProp itemKey={"transitionDurationMs"} {...ImageSwitcherKnobs.TRANSITION_DURATION_MS_TEXT}>
                        <PageNumberField
                            value={transitionDurationMs}
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
                src={SOURCE_URLS[sourceType]}
                alt={SOURCE_ALTS[sourceType]}
                transitionDurationMs={transitionDurationMs}
            />
        </PageDocsExample>
    );
};
