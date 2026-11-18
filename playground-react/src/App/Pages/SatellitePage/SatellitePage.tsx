import { useMemo, useState } from "react";

import { ANCHOR_H_PLACEMENTS, ANCHOR_V_PLACEMENTS, SATELLITE_DEFAULTS } from "@thewaver/ss-components-react";
import type { AnchorHPlacement, AnchorVPlacement } from "@thewaver/ss-components-react";
import { SatelliteKnobs } from "@thewaver/ss-playground/App/Knobs/Satellites.const";
import { EXAMPLES_ONLY_PROP } from "@thewaver/ss-playground/App/PageComponents/Prop/Prop.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/SatellitePage/SatellitePage.const";

import { PageExampleKnobs } from "../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageCheckField, PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { BadgeExample } from "./Examples/Badge";
import { DefaultExample } from "./Examples/Default";
import { SeveralExample } from "./Examples/Several";
import type { SatelliteBadgeCorner, SatelliteExampleProps } from "./SatellitePageReact.types";

export const SatellitePage = () => {
    const [hPlacement, setHPlacement] = useState<AnchorHPlacement>(SatelliteKnobs.STARTING_H_PLACEMENT);
    const [vPlacement, setVPlacement] = useState<AnchorVPlacement>(SatelliteKnobs.STARTING_V_PLACEMENT);
    const [offsetX, setOffsetX] = useState(SATELLITE_DEFAULTS.offset.x);
    const [offsetY, setOffsetY] = useState(SATELLITE_DEFAULTS.offset.y);
    const [subjectWidth, setSubjectWidth] = useState(SatelliteKnobs.STARTING_SUBJECT_WIDTH);
    const [subjectHeight, setSubjectHeight] = useState(SatelliteKnobs.STARTING_SUBJECT_HEIGHT);
    const [badgeSize, setBadgeSize] = useState(SatelliteKnobs.STARTING_BADGE_SIZE);
    const [hasSatellite, setHasSatellite] = useState(SatelliteKnobs.STARTING_HAS_SATELLITE);
    const [isBehindSubject, setIsBehindSubject] = useState(SATELLITE_DEFAULTS.isBehindSubject);
    const [corner, setCorner] = useState<SatelliteBadgeCorner>(SatelliteKnobs.STARTING_CORNER);
    const [count, setCount] = useState(SatelliteKnobs.STARTING_COUNT);
    const [overhang, setOverhang] = useState(SatelliteKnobs.STARTING_OVERHANG);

    const placement = useMemo(() => ({ x: hPlacement, y: vPlacement }), [hPlacement, vPlacement]);

    const offset = useMemo(() => ({ x: offsetX, y: offsetY }), [offsetX, offsetY]);

    const commonProps: SatelliteExampleProps = {
        subjectWidth,
        subjectHeight,
    };

    const examples = [
        {
            key: "default",
            name: EXAMPLE_NAMES.default,
            readout: () => "one satellite, moved through every placement; the dashed box is what the pair takes up",
            component: () => (
                <>
                    <PageMeasureBox>
                        <DefaultExample
                            {...commonProps}
                            placement={placement}
                            offset={offset}
                            isBehindSubject={isBehindSubject}
                            badgeSize={badgeSize}
                            hasSatellite={hasSatellite}
                        />
                    </PageMeasureBox>

                    <PageExampleKnobs>
                        <PageProp itemKey={"hPlacement"} {...SatelliteKnobs.H_PLACEMENT_TEXT}>
                            <PageSelectField
                                value={hPlacement}
                                values={ANCHOR_H_PLACEMENTS}
                                width={FIELD_WIDTH}
                                ariaLabel={"Placement across"}
                                onChange={(placement) => setHPlacement(placement)}
                            />
                        </PageProp>

                        <PageProp itemKey={"vPlacement"} {...SatelliteKnobs.V_PLACEMENT_TEXT}>
                            <PageSelectField
                                value={vPlacement}
                                values={ANCHOR_V_PLACEMENTS}
                                width={FIELD_WIDTH}
                                ariaLabel={"Placement down"}
                                onChange={(placement) => setVPlacement(placement)}
                            />
                        </PageProp>

                        <PageProp itemKey={"offsetX"} {...SatelliteKnobs.OFFSET_X_TEXT}>
                            <PageNumberField
                                value={offsetX}
                                min={SatelliteKnobs.MIN_OFFSET}
                                max={SatelliteKnobs.MAX_OFFSET}
                                step={SatelliteKnobs.OFFSET_STEP}
                                width={FIELD_WIDTH}
                                ariaLabel={"Offset across"}
                                onInput={setOffsetX}
                            />
                        </PageProp>

                        <PageProp itemKey={"offsetY"} {...SatelliteKnobs.OFFSET_Y_TEXT}>
                            <PageNumberField
                                value={offsetY}
                                min={SatelliteKnobs.MIN_OFFSET}
                                max={SatelliteKnobs.MAX_OFFSET}
                                step={SatelliteKnobs.OFFSET_STEP}
                                width={FIELD_WIDTH}
                                ariaLabel={"Offset down"}
                                onInput={setOffsetY}
                            />
                        </PageProp>

                        <PageProp itemKey={"hasSatellite"} {...SatelliteKnobs.HAS_SATELLITE_TEXT}>
                            <PageCheckField
                                value={hasSatellite}
                                ariaLabel={"Render a satellite"}
                                onChange={setHasSatellite}
                            />
                        </PageProp>

                        <PageProp itemKey={"badgeSize"} {...SatelliteKnobs.BADGE_SIZE_TEXT}>
                            <PageNumberField
                                value={badgeSize}
                                min={SatelliteKnobs.MIN_BADGE_SIZE}
                                max={SatelliteKnobs.MAX_BADGE_SIZE}
                                step={SatelliteKnobs.BADGE_SIZE_STEP}
                                width={FIELD_WIDTH}
                                ariaLabel={"Satellite size"}
                                onInput={setBadgeSize}
                            />
                        </PageProp>

                        <PageProp itemKey={"isBehindSubject"} {...SatelliteKnobs.IS_BEHIND_SUBJECT_TEXT}>
                            <PageCheckField
                                value={isBehindSubject}
                                ariaLabel={"Behind the subject"}
                                onChange={setIsBehindSubject}
                            />
                        </PageProp>
                    </PageExampleKnobs>
                </>
            ),
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "several",
            name: EXAMPLE_NAMES.several,
            readout: () =>
                "a corner badge, one hanging off the left and one tucked behind the bottom edge — each side of the box grows by the furthest any of them reaches",
            component: () => (
                <PageMeasureBox>
                    <SeveralExample {...commonProps} />
                </PageMeasureBox>
            ),
            path: `${EXAMPLES_ROOT}/Several.tsx`,
        },
        {
            key: "badge",
            name: EXAMPLE_NAMES.badge,
            readout: () =>
                "a count pinned inside a corner and pushed out past it by the same amount on both axes, so a longer number grows the badge inward and the overhang never changes",
            component: () => (
                <>
                    <PageMeasureBox>
                        <BadgeExample {...commonProps} corner={corner} count={count} overhang={overhang} />
                    </PageMeasureBox>

                    <PageExampleKnobs>
                        <PageProp itemKey={"badgeCorner"} {...SatelliteKnobs.BADGE_CORNER_TEXT}>
                            <PageSelectField
                                value={corner}
                                values={SatelliteKnobs.BADGE_CORNERS}
                                width={FIELD_WIDTH}
                                ariaLabel={"Corner"}
                                onChange={(corner) => setCorner(corner)}
                            />
                        </PageProp>

                        <PageProp itemKey={"badgeCount"} {...SatelliteKnobs.BADGE_COUNT_TEXT}>
                            <PageNumberField
                                value={count}
                                min={SatelliteKnobs.MIN_COUNT}
                                max={SatelliteKnobs.MAX_COUNT}
                                step={SatelliteKnobs.COUNT_STEP}
                                width={FIELD_WIDTH}
                                ariaLabel={"Count"}
                                onInput={setCount}
                            />
                        </PageProp>

                        <PageProp itemKey={"badgeOverhang"} {...SatelliteKnobs.BADGE_OVERHANG_TEXT}>
                            <PageNumberField
                                value={overhang}
                                min={SatelliteKnobs.MIN_OVERHANG}
                                max={SatelliteKnobs.MAX_OVERHANG}
                                step={SatelliteKnobs.OVERHANG_STEP}
                                width={FIELD_WIDTH}
                                ariaLabel={"Overhang"}
                                onInput={setOverhang}
                            />
                        </PageProp>
                    </PageExampleKnobs>
                </>
            ),
            path: `${EXAMPLES_ROOT}/Badge.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"subjectWidth"}
                    label={"Subject width (px)"}
                    hint={"How wide the thing the satellite is pinned to is."}
                    controls={EXAMPLES_ONLY_PROP}
                >
                    <PageNumberField
                        value={subjectWidth}
                        min={SatelliteKnobs.MIN_SUBJECT_SIZE}
                        max={SatelliteKnobs.MAX_SUBJECT_SIZE}
                        step={SatelliteKnobs.SUBJECT_SIZE_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Subject width"}
                        onInput={setSubjectWidth}
                    />
                </PageProp>

                <PageProp
                    itemKey={"subjectHeight"}
                    label={"Subject height (px)"}
                    hint={"How tall the thing the satellite is pinned to is."}
                    controls={EXAMPLES_ONLY_PROP}
                >
                    <PageNumberField
                        value={subjectHeight}
                        min={SatelliteKnobs.MIN_SUBJECT_SIZE}
                        max={SatelliteKnobs.MAX_SUBJECT_SIZE}
                        step={SatelliteKnobs.SUBJECT_SIZE_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Subject height"}
                        onInput={setSubjectHeight}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} layout={"flow"} />
        </>
    );
};
