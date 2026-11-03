import { type PropsWithChildren, useState } from "react";

import {
    Accordion,
    Button,
    Checkbox,
    MediaQueryMonitorReactUtils,
    Progress,
    Radio,
    RadioGroup,
    Range,
    SHAPE_REVEAL_DEFAULTS,
    SlideButton,
    Tabs,
    TagInput,
    TextInput,
    Toggle,
} from "@thewaver/ss-components-react";
import { PLAYGROUND_LOOKS } from "@thewaver/ss-playground/App/Looks/Look.const";
import { computeTagAriaLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import {
    LOOK_OPTIONS,
    NO_MOTION_DURATION_MS,
} from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.const";
import type { PlaygroundLook } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.types";
import { DOCS_GAP } from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.const";
import {
    LOOK_ROW_GAP,
    LOOK_SAMPLE_EXPANDED_SECTIONS,
    LOOK_SAMPLE_PROGRESS,
    LOOK_SAMPLE_RANGE,
    LOOK_SAMPLE_SECTIONS,
    LOOK_SAMPLE_SECTION_BODY,
    LOOK_SAMPLE_SELECTED_TAB,
    LOOK_SAMPLE_SLIDE_DESCRIPTION,
    LOOK_SAMPLE_TABS,
    LOOK_SAMPLE_TAB_PANEL,
    LOOK_SAMPLE_TAGS,
    computeLookRowId,
} from "@thewaver/ss-playground/App/Pages/LooksPage/LooksPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/LooksPage/LooksPage.css";
import { RADIO_GROUP_GAP } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";
import { ROW_TAB_GAP, getPanelId, getTabId } from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";
import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";
import {
    FIELD_GAP,
    FIELD_HEIGHT,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";
import person from "@thewaver/ss-playground/App/person.svg";

import { PageLayer } from "../../PageComponents/Layer/Layer";
import { revealLook, useAppliedLook } from "../../PageComponents/Look/LookReact.const";
import { PageTabPanel } from "../../PageComponents/TabPanel/TabPanel";
import { PageAccordionHeader, PageAccordionPanel } from "../../StyledComponents/AccordionContent/AccordionContent";
import { PageButtonContent } from "../../StyledComponents/ButtonContent/ButtonContent";
import { PageCheckboxContent } from "../../StyledComponents/CheckboxContent/CheckboxContent";
import { PageIcon } from "../../StyledComponents/Icon/Icon";
import { PageProgressContent } from "../../StyledComponents/ProgressContent/ProgressContent";
import { PageRadioContent } from "../../StyledComponents/RadioContent/RadioContent";
import { PageRangeContent } from "../../StyledComponents/RangeContent/RangeContent";
import { PageSlideButtonContent } from "../../StyledComponents/SlideButtonContent/SlideButtonContent";
import { PageTabContent, PageTabFloater, PageTabGutter } from "../../StyledComponents/TabContent/TabContent";
import {
    PageTagContent,
    PageTagInputContent,
    PageTagInputPlaceholder,
} from "../../StyledComponents/TagInputContent/TagInputContent";
import { PageTextFieldAdornment } from "../../StyledComponents/TextFieldAdornment/TextFieldAdornment";
import { PageTextFieldContent } from "../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageToggleContent } from "../../StyledComponents/ToggleContent/ToggleContent";
import type {
    LookRowProps,
    LookSampleColumnProps,
    LookSamplesProps,
    LookStateGridProps,
    LookStateProps,
} from "./LooksPage.types";

const LookSampleColumn = (props: PropsWithChildren<LookSampleColumnProps>) => (
    <div className={[styles.lookColumn, props.isWide && styles.lookWideColumn].filter(Boolean).join(" ")}>
        <PageLayer level={1}>
            <div className={styles.lookColumnName}>{props.name}</div>

            {props.children}
        </PageLayer>
    </div>
);

const LookStateGrid = (props: PropsWithChildren<LookStateGridProps>) => (
    <div className={[styles.lookStateGrid, props.isFitted && styles.lookFittedStateGrid].filter(Boolean).join(" ")}>
        {props.children}
    </div>
);

const LookBarStack = (props: PropsWithChildren) => <div className={styles.lookBarStack}>{props.children}</div>;

const LookBarCell = (props: PropsWithChildren<LookStateProps>) => (
    <div className={styles.lookBarCell}>
        <div className={styles.lookBarCaption}>{props.state}</div>

        {props.children}
    </div>
);

const LookButtonSample = (props: LookStateProps) => (
    <Button
        sizing={"fill"}
        isPressed={props.isPressed}
        isDisabled={props.isDisabled}
        hasError={props.hasError}
        renderContent={(flags) => <PageButtonContent flags={flags}>{props.state}</PageButtonContent>}
    />
);

const LookInputSample = (props: LookStateProps) => {
    const valueState = useState(props.state);

    return (
        <TextInput
            value={valueState}
            padding={FIELD_PADDING}
            gap={FIELD_GAP}
            isReadOnly={props.isReadOnly}
            isDisabled={props.isDisabled}
            hasError={props.hasError}
            ariaLabel={props.state}
            renderContent={(flags) => <PageTextFieldContent flags={flags} />}
            renderLeading={(flags) => (
                <PageTextFieldAdornment flags={flags}>
                    <PageIcon src={person} />
                </PageTextFieldAdornment>
            )}
            renderTrailing={() => (
                <Button
                    isDisabled={props.isDisabled}
                    renderContent={(flags) => <PageTextFieldAdornment flags={flags}>Clear</PageTextFieldAdornment>}
                />
            )}
        />
    );
};

const LookToggleSample = (props: LookStateProps) => {
    const checkedState = useState(props.isChecked ?? false);

    return (
        <Toggle
            checked={checkedState}
            isDisabled={props.isDisabled}
            hasError={props.hasError}
            ariaLabel={props.state}
            renderContent={(flags) => <PageToggleContent flags={flags}>{props.state}</PageToggleContent>}
        />
    );
};

const LookCheckboxSample = (props: LookStateProps) => {
    const checkedState = useState(props.isChecked ?? false);

    return (
        <Checkbox
            checked={checkedState}
            isMixed={props.isMixed}
            isDisabled={props.isDisabled}
            hasError={props.hasError}
            ariaLabel={props.state}
            renderContent={(flags) => <PageCheckboxContent flags={flags}>{props.state}</PageCheckboxContent>}
        />
    );
};

const LookRadioSample = (props: LookStateProps) => {
    const valueState = useState(props.isChecked ? props.state : undefined);

    return (
        <RadioGroup value={valueState} ariaLabel={props.state} gap={RADIO_GROUP_GAP} hasError={props.hasError}>
            <Radio
                value={props.state}
                ariaLabel={props.state}
                isDisabled={props.isDisabled}
                hasError={props.hasError}
                renderContent={(flags) => <PageRadioContent flags={flags}>{props.state}</PageRadioContent>}
            />
        </RadioGroup>
    );
};

const LookProgressSample = (props: LookStateProps) => (
    <LookBarCell state={props.state}>
        <Progress
            value={LOOK_SAMPLE_PROGRESS}
            hasError={props.hasError}
            ariaLabel={props.state}
            renderContent={(state) => <PageProgressContent state={state} />}
        />
    </LookBarCell>
);

const LookRangeSample = (props: LookStateProps) => {
    const valueState = useState(LOOK_SAMPLE_RANGE);

    return (
        <LookBarCell state={props.state}>
            <Range
                value={valueState}
                ariaLabel={props.state}
                isDisabled={props.isDisabled}
                hasError={props.hasError}
                thumbSize={RANGE_THUMB_SIZE}
                renderContent={(renderProps) => <PageRangeContent renderProps={renderProps} />}
            />
        </LookBarCell>
    );
};

const LookTagSample = (props: LookStateProps) => {
    const valueState = useState(LOOK_SAMPLE_TAGS);

    return (
        <TagInput
            value={valueState}
            ariaLabel={props.state}
            gap={FIELD_GAP}
            padding={FIELD_PADDING}
            minHeight={FIELD_HEIGHT}
            isDisabled={props.isDisabled}
            hasError={props.hasError}
            computeTagAriaLabel={computeTagAriaLabel}
            renderContent={(flags) => <PageTagInputContent flags={flags} />}
            renderPlaceholder={() => <PageTagInputPlaceholder>{props.state}</PageTagInputPlaceholder>}
            renderTag={(tag, flags) => <PageTagContent flags={flags}>{tag}</PageTagContent>}
        />
    );
};

const LookSlideSample = (props: LookStateProps) => (
    <SlideButton
        ariaDescription={LOOK_SAMPLE_SLIDE_DESCRIPTION}
        thumbSize={SLIDE_BUTTON_THUMB_SIZE}
        isDisabled={props.isDisabled}
        hasError={props.hasError}
        renderContent={(renderProps) => (
            <PageSlideButtonContent renderProps={renderProps}>{props.state}</PageSlideButtonContent>
        )}
    />
);

const LookSamples = (props: LookSamplesProps) => {
    const expandedState = useState(LOOK_SAMPLE_EXPANDED_SECTIONS);

    const idPrefix = `look-${props.look}`;

    const tabs = LOOK_SAMPLE_TABS.map((tab) => ({
        ...tab,
        id: getTabId(idPrefix, tab.value),
        panelId: getPanelId(idPrefix, tab.value),
    }));

    return (
        <>
            <LookSampleColumn name={"Surface"}>
                <div className={styles.lookPanel}>{"A panel inside a surface."}</div>
            </LookSampleColumn>

            <LookSampleColumn name={"Tabs"}>
                <div className={styles.lookWideSample}>
                    <Tabs
                        tabGap={ROW_TAB_GAP}
                        ariaLabel={"Tabs"}
                        tabs={tabs}
                        selectedValue={LOOK_SAMPLE_SELECTED_TAB}
                        renderGutter={() => <PageTabGutter orientation={"horizontal"} />}
                        renderSelectionFloater={(visibilityTarget, transitionDurationMs) => (
                            <PageTabFloater
                                orientation={"horizontal"}
                                visibilityTarget={visibilityTarget}
                                transitionDurationMs={transitionDurationMs}
                            />
                        )}
                        renderTab={(tab, flags) => (
                            <PageTabContent
                                flags={flags}
                                orientation={"horizontal"}
                                isSelected={tab.value === LOOK_SAMPLE_SELECTED_TAB}
                            >
                                {tab.value}
                            </PageTabContent>
                        )}
                    />

                    <PageTabPanel
                        id={getPanelId(idPrefix, LOOK_SAMPLE_SELECTED_TAB)}
                        tabId={getTabId(idPrefix, LOOK_SAMPLE_SELECTED_TAB)}
                    >
                        {LOOK_SAMPLE_TAB_PANEL}
                    </PageTabPanel>
                </div>
            </LookSampleColumn>

            <LookSampleColumn name={"Input"} isWide>
                <LookStateGrid isFitted>
                    <LookInputSample state={"Default"} />
                    <LookInputSample state={"Read-only"} isReadOnly />
                    <LookInputSample state={"Disabled"} isDisabled />
                    <LookInputSample state={"Error"} hasError />
                </LookStateGrid>
            </LookSampleColumn>

            <LookSampleColumn name={"Tags"} isWide>
                <LookStateGrid isFitted>
                    <LookTagSample state={"Default"} />
                    <LookTagSample state={"Disabled"} isDisabled />
                    <LookTagSample state={"Error"} hasError />
                </LookStateGrid>
            </LookSampleColumn>

            <LookSampleColumn name={"Button"}>
                <LookStateGrid>
                    <LookButtonSample state={"Default"} />
                    <LookButtonSample state={"Pressed"} isPressed />
                    <LookButtonSample state={"Disabled"} isDisabled />
                    <LookButtonSample state={"Error"} hasError />
                </LookStateGrid>
            </LookSampleColumn>

            <LookSampleColumn name={"Toggle"}>
                <LookStateGrid>
                    <LookToggleSample state={"Off"} />
                    <LookToggleSample state={"On"} isChecked />
                    <LookToggleSample state={"Disabled"} isDisabled />
                    <LookToggleSample state={"Error"} hasError />
                </LookStateGrid>
            </LookSampleColumn>

            <LookSampleColumn name={"Checkbox"}>
                <LookStateGrid>
                    <LookCheckboxSample state={"Off"} />
                    <LookCheckboxSample state={"On"} isChecked />
                    <LookCheckboxSample state={"Mixed"} isMixed />
                    <LookCheckboxSample state={"Disabled"} isDisabled />
                    <LookCheckboxSample state={"Error"} hasError />
                </LookStateGrid>
            </LookSampleColumn>

            <LookSampleColumn name={"Radio"}>
                <LookStateGrid>
                    <LookRadioSample state={"Off"} />
                    <LookRadioSample state={"On"} isChecked />
                    <LookRadioSample state={"Disabled"} isDisabled />
                    <LookRadioSample state={"Error"} hasError />
                </LookStateGrid>
            </LookSampleColumn>

            <LookSampleColumn name={"Progress"}>
                <LookBarStack>
                    <LookProgressSample state={"Default"} />
                    <LookProgressSample state={"Error"} hasError />
                </LookBarStack>
            </LookSampleColumn>

            <LookSampleColumn name={"Range"}>
                <LookBarStack>
                    <LookRangeSample state={"Default"} />
                    <LookRangeSample state={"Disabled"} isDisabled />
                    <LookRangeSample state={"Error"} hasError />
                </LookBarStack>
            </LookSampleColumn>

            <LookSampleColumn name={"Slide button"}>
                <LookBarStack>
                    <LookSlideSample state={"Default"} />
                    <LookSlideSample state={"Disabled"} isDisabled />
                    <LookSlideSample state={"Error"} hasError />
                </LookBarStack>
            </LookSampleColumn>

            <LookSampleColumn name={"Accordion"}>
                <div className={styles.lookWideSample}>
                    <Accordion
                        items={LOOK_SAMPLE_SECTIONS}
                        gap={DOCS_GAP}
                        expanded={expandedState}
                        renderHeader={(item, flags) => (
                            <PageAccordionHeader flags={flags}>{item.value}</PageAccordionHeader>
                        )}
                        renderPanel={(_item, visibilityTarget, transitionDurationMs) => (
                            <PageAccordionPanel
                                visibilityTarget={visibilityTarget}
                                transitionDurationMs={transitionDurationMs}
                            >
                                {LOOK_SAMPLE_SECTION_BODY}
                            </PageAccordionPanel>
                        )}
                    />
                </div>
            </LookSampleColumn>
        </>
    );
};

const LookRow = (props: LookRowProps) => (
    <Radio
        value={props.look}
        ariaLabel={props.label}
        sizing={"fill"}
        renderContent={(flags) => (
            <div id={computeLookRowId(props.look)} className={styles.lookRow}>
                <div className={styles.lookSampleBoundary}>
                    <div className={PLAYGROUND_LOOKS[props.look]}>
                        <div className={styles.lookSamples}>
                            <PageRadioContent flags={flags}>{props.label}</PageRadioContent>

                            <div className={styles.lookColumns} inert={true} aria-hidden="true">
                                <LookSamples look={props.look} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
    />
);

export const LooksPage = () => {
    const look = useAppliedLook();

    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion();

    const pickLook = (nextLook: PlaygroundLook) => {
        void revealLook(nextLook, {
            origin: document.getElementById(computeLookRowId(nextLook)) ?? SHAPE_REVEAL_DEFAULTS.origin,
            durationMs: prefersReducedMotion ? NO_MOTION_DURATION_MS : SHAPE_REVEAL_DEFAULTS.durationMs,
        });
    };

    return (
        <div className={styles.looksPage} data-view={"looks"}>
            <h1 className={styles.looksTitle}>{"Looks"}</h1>

            <p className={styles.looksDescription}>
                {
                    "A look decides how the playground is drawn: the shapes, borders, shadows and fonts of its controls, and where the theme's colors go. Each row shows the controls in one look; picking a row applies it to every page."
                }
            </p>

            <RadioGroup value={[look, pickLook]} ariaLabel={"Look"} orientation={"vertical"} gap={LOOK_ROW_GAP}>
                {LOOK_OPTIONS.map((option) => (
                    <LookRow key={option.value} look={option.value} label={option.label} />
                ))}
            </RadioGroup>
        </div>
    );
};
