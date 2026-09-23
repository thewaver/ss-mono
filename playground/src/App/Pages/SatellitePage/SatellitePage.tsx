import { createMemo, createSignal } from "solid-js";

import { SATELLITE_DEFAULTS } from "@thewaver/ss-components";
import type { AnchorHPlacement, AnchorVPlacement } from "@thewaver/ss-components";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageCheckField, PageNumberField, PageSelectField } from "../../StyledComponents/Field/Field";
import { BadgeExample } from "./Examples/Badge";
import { DefaultExample } from "./Examples/Default";
import { SeveralExample } from "./Examples/Several";
import type { SatelliteBadgeCorner, SatelliteExampleProps } from "./SatellitePage.types";

const H_PLACEMENTS: AnchorHPlacement[] = ["left-out", "left-in", "center", "right-in", "right-out"];
const V_PLACEMENTS: AnchorVPlacement[] = ["top-out", "top-in", "center", "bottom-in", "bottom-out"];
const BADGE_CORNERS: SatelliteBadgeCorner[] = ["top-right", "top-left", "bottom-right", "bottom-left"];

const MIN_OFFSET = -40;
const MAX_OFFSET = 40;
const OFFSET_STEP = 2;
const MIN_SUBJECT_SIZE = 40;
const MAX_SUBJECT_SIZE = 240;
const SUBJECT_SIZE_STEP = 10;
const MIN_BADGE_SIZE = 12;
const MAX_BADGE_SIZE = 96;
const BADGE_SIZE_STEP = 4;
const MIN_COUNT = 0;
const MAX_COUNT = 99999;
const COUNT_STEP = 1;
const MIN_OVERHANG = 0;
const MAX_OVERHANG = 16;
const OVERHANG_STEP = 1;
const FIELD_WIDTH = 110;
const EXAMPLES_ROOT = "/src/App/Pages/SatellitePage/Examples";

const STARTING_H_PLACEMENT: AnchorHPlacement = "right-out";
const STARTING_V_PLACEMENT: AnchorVPlacement = "top-out";
const STARTING_SUBJECT_WIDTH = 140;
const STARTING_SUBJECT_HEIGHT = 80;
const STARTING_BADGE_SIZE = 28;
const STARTING_OFFSET_X = 0;
const STARTING_OFFSET_Y = 0;
const STARTING_CORNER: SatelliteBadgeCorner = "top-right";
const STARTING_COUNT = 7;
const STARTING_OVERHANG = 8;

export const SatellitePage = () => {
    const [getHPlacement, setHPlacement] = createSignal<AnchorHPlacement>(STARTING_H_PLACEMENT);
    const [getVPlacement, setVPlacement] = createSignal<AnchorVPlacement>(STARTING_V_PLACEMENT);
    const [getOffsetX, setOffsetX] = createSignal(STARTING_OFFSET_X);
    const [getOffsetY, setOffsetY] = createSignal(STARTING_OFFSET_Y);
    const [getSubjectWidth, setSubjectWidth] = createSignal(STARTING_SUBJECT_WIDTH);
    const [getSubjectHeight, setSubjectHeight] = createSignal(STARTING_SUBJECT_HEIGHT);
    const [getBadgeSize, setBadgeSize] = createSignal(STARTING_BADGE_SIZE);
    const [getHasSatellite, setHasSatellite] = createSignal(true);
    const [getIsBehindSubject, setIsBehindSubject] = createSignal(SATELLITE_DEFAULTS.isBehindSubject);
    const [getCorner, setCorner] = createSignal<SatelliteBadgeCorner>(STARTING_CORNER);
    const [getCount, setCount] = createSignal(STARTING_COUNT);
    const [getOverhang, setOverhang] = createSignal(STARTING_OVERHANG);

    const getPlacement = createMemo(() => ({ x: getHPlacement(), y: getVPlacement() }));

    const getOffset = createMemo(() => ({ x: getOffsetX(), y: getOffsetY() }));

    const getExamples = createMemo(() => {
        const commonProps: SatelliteExampleProps = {
            subjectWidth: getSubjectWidth,
            subjectHeight: getSubjectHeight,
        };

        return [
            {
                key: "default",
                name: "Default",
                readout: () => "one satellite, moved through every placement; the dashed box is what the pair takes up",
                component: () => (
                    <>
                        <PageMeasureBox>
                            <DefaultExample
                                {...commonProps}
                                placement={getPlacement}
                                offset={getOffset}
                                isBehindSubject={getIsBehindSubject}
                                badgeSize={getBadgeSize}
                                hasSatellite={getHasSatellite}
                            />
                        </PageMeasureBox>

                        <PagePropsPanel scope={"local"}>
                            <PageProp
                                key={"hPlacement"}
                                label={"Placement across"}
                                hint={
                                    "Where the satellite sits across its subject: inside an edge, centered, or outside it altogether."
                                }
                            >
                                <PageSelectField
                                    value={getHPlacement}
                                    values={() => H_PLACEMENTS}
                                    width={() => FIELD_WIDTH}
                                    ariaLabel={"Placement across"}
                                    onChange={(placement) => setHPlacement(() => placement)}
                                />
                            </PageProp>

                            <PageProp
                                key={"vPlacement"}
                                label={"Placement down"}
                                hint={
                                    "Where the satellite sits above or below its subject: inside an edge, centered, or outside it altogether."
                                }
                            >
                                <PageSelectField
                                    value={getVPlacement}
                                    values={() => V_PLACEMENTS}
                                    width={() => FIELD_WIDTH}
                                    ariaLabel={"Placement down"}
                                    onChange={(placement) => setVPlacement(() => placement)}
                                />
                            </PageProp>

                            <PageProp
                                key={"offsetX"}
                                label={"Offset across (px)"}
                                hint={"How far the satellite is nudged sideways from where the placement put it."}
                            >
                                <PageNumberField
                                    value={getOffsetX}
                                    min={() => MIN_OFFSET}
                                    max={() => MAX_OFFSET}
                                    step={() => OFFSET_STEP}
                                    width={() => FIELD_WIDTH}
                                    ariaLabel={"Offset across"}
                                    onInput={setOffsetX}
                                />
                            </PageProp>

                            <PageProp
                                key={"offsetY"}
                                label={"Offset down (px)"}
                                hint={"How far the satellite is nudged up or down from where the placement put it."}
                            >
                                <PageNumberField
                                    value={getOffsetY}
                                    min={() => MIN_OFFSET}
                                    max={() => MAX_OFFSET}
                                    step={() => OFFSET_STEP}
                                    width={() => FIELD_WIDTH}
                                    ariaLabel={"Offset down"}
                                    onInput={setOffsetY}
                                />
                            </PageProp>

                            <PageProp
                                key={"hasSatellite"}
                                label={"Render a satellite"}
                                hint={
                                    "Whether a satellite is rendered at all, so the subject can be seen with and without one."
                                }
                            >
                                <PageCheckField
                                    value={getHasSatellite}
                                    ariaLabel={"Render a satellite"}
                                    onChange={setHasSatellite}
                                />
                            </PageProp>

                            <PageProp
                                key={"badgeSize"}
                                label={"Satellite size (px)"}
                                hint={"How large the satellite itself is."}
                            >
                                <PageNumberField
                                    value={getBadgeSize}
                                    min={() => MIN_BADGE_SIZE}
                                    max={() => MAX_BADGE_SIZE}
                                    step={() => BADGE_SIZE_STEP}
                                    width={() => FIELD_WIDTH}
                                    ariaLabel={"Satellite size"}
                                    onInput={setBadgeSize}
                                />
                            </PageProp>

                            <PageProp
                                key={"isBehindSubject"}
                                label={"Behind the subject"}
                                hint={
                                    "Puts the satellite under the subject rather than over it, so the subject hides whatever overlaps."
                                }
                            >
                                <PageCheckField
                                    value={getIsBehindSubject}
                                    ariaLabel={"Behind the subject"}
                                    onChange={setIsBehindSubject}
                                />
                            </PageProp>
                        </PagePropsPanel>
                    </>
                ),
                path: `${EXAMPLES_ROOT}/Default.tsx`,
            },
            {
                key: "several",
                name: "Several satellites",
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
                name: "Badge",
                readout: () =>
                    "a count pinned inside a corner and pushed out past it by the same amount on both axes, so a longer number grows the badge inward and the overhang never changes",
                component: () => (
                    <>
                        <PageMeasureBox>
                            <BadgeExample {...commonProps} corner={getCorner} count={getCount} overhang={getOverhang} />
                        </PageMeasureBox>

                        <PagePropsPanel scope={"local"}>
                            <PageProp
                                key={"badgeCorner"}
                                label={"Corner"}
                                hint={"Which corner the badge is pinned to; the overhang turns outward with it."}
                            >
                                <PageSelectField
                                    value={getCorner}
                                    values={() => BADGE_CORNERS}
                                    width={() => FIELD_WIDTH}
                                    ariaLabel={"Corner"}
                                    onChange={(corner) => setCorner(() => corner)}
                                />
                            </PageProp>

                            <PageProp
                                key={"badgeCount"}
                                label={"Count"}
                                hint={
                                    "The number on the badge. More digits make it wider, and it grows toward the middle."
                                }
                            >
                                <PageNumberField
                                    value={getCount}
                                    min={() => MIN_COUNT}
                                    max={() => MAX_COUNT}
                                    step={() => COUNT_STEP}
                                    width={() => FIELD_WIDTH}
                                    ariaLabel={"Count"}
                                    onInput={setCount}
                                />
                            </PageProp>

                            <PageProp
                                key={"badgeOverhang"}
                                label={"Overhang (px)"}
                                hint={"How far the badge pokes out past each of the two edges it is pinned to."}
                            >
                                <PageNumberField
                                    value={getOverhang}
                                    min={() => MIN_OVERHANG}
                                    max={() => MAX_OVERHANG}
                                    step={() => OVERHANG_STEP}
                                    width={() => FIELD_WIDTH}
                                    ariaLabel={"Overhang"}
                                    onInput={setOverhang}
                                />
                            </PageProp>
                        </PagePropsPanel>
                    </>
                ),
                path: `${EXAMPLES_ROOT}/Badge.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"subjectWidth"}
                    label={"Subject width (px)"}
                    hint={"How wide the thing the satellite is pinned to is."}
                >
                    <PageNumberField
                        value={getSubjectWidth}
                        min={() => MIN_SUBJECT_SIZE}
                        max={() => MAX_SUBJECT_SIZE}
                        step={() => SUBJECT_SIZE_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Subject width"}
                        onInput={setSubjectWidth}
                    />
                </PageProp>

                <PageProp
                    key={"subjectHeight"}
                    label={"Subject height (px)"}
                    hint={"How tall the thing the satellite is pinned to is."}
                >
                    <PageNumberField
                        value={getSubjectHeight}
                        min={() => MIN_SUBJECT_SIZE}
                        max={() => MAX_SUBJECT_SIZE}
                        step={() => SUBJECT_SIZE_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Subject height"}
                        onInput={setSubjectHeight}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};
