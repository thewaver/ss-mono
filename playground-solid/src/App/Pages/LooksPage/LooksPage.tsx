import { For, type ParentProps, createSignal } from "solid-js";

import {
    Accordion,
    Button,
    Checkbox,
    MediaQueryMonitorSolidUtils,
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
} from "@thewaver/ss-components-solid";
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
import * as tabsPageStyles from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.css";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";
import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";
import {
    FIELD_GAP,
    FIELD_HEIGHT,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";
import person from "@thewaver/ss-playground/App/person.svg";

import { PageLayer } from "../../PageComponents/Layer/Layer";
import { getAppliedLook, revealLook } from "../../PageComponents/Look/LookSolid.const";
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
    LookStateProps,
    LookTabsSampleProps,
} from "./LooksPage.types";

const LookSampleColumn = (props: ParentProps<LookSampleColumnProps>) => (
    <div class={styles.lookColumn}>
        <PageLayer level={1}>
            <div class={styles.lookColumnName}>{props.name}</div>

            {props.children}
        </PageLayer>
    </div>
);

const LookStateGrid = (props: ParentProps) => <div class={styles.lookStateGrid}>{props.children}</div>;

const LookStack = (props: ParentProps) => <div class={styles.lookBarStack}>{props.children}</div>;

const LookBarCell = (props: ParentProps<LookStateProps>) => (
    <div class={styles.lookBarCell}>
        <div class={styles.lookBarCaption}>{props.state}</div>

        {props.children}
    </div>
);

const LookButtonSample = (props: LookStateProps) => (
    <Button
        sizing={"fill"}
        isPressed={props.isPressed}
        isDisabled={props.isDisabled}
        hasError={props.hasError}
        renderContent={(getFlags) => <PageButtonContent flags={getFlags}>{props.state}</PageButtonContent>}
    />
);

const LookInputSample = (props: LookStateProps) => {
    const valueSignal = createSignal(props.state);

    return (
        <TextInput
            value={valueSignal}
            padding={FIELD_PADDING}
            gap={FIELD_GAP}
            isReadOnly={props.isReadOnly}
            isDisabled={props.isDisabled}
            hasError={props.hasError}
            ariaLabel={props.state}
            renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} />}
            renderLeading={(getFlags) => (
                <PageTextFieldAdornment flags={getFlags}>
                    <PageIcon src={person} />
                </PageTextFieldAdornment>
            )}
            renderTrailing={() => (
                <Button
                    isDisabled={props.isDisabled}
                    renderContent={(getFlags) => (
                        <PageTextFieldAdornment flags={getFlags}>Clear</PageTextFieldAdornment>
                    )}
                />
            )}
        />
    );
};

const LookToggleSample = (props: LookStateProps) => {
    const checkedSignal = createSignal(props.isChecked ?? false);

    return (
        <Toggle
            checked={checkedSignal}
            isMixed={props.isMixed}
            isDisabled={props.isDisabled}
            hasError={props.hasError}
            ariaLabel={props.state}
            renderContent={(getFlags) => <PageToggleContent flags={getFlags}>{props.state}</PageToggleContent>}
        />
    );
};

const LookCheckboxSample = (props: LookStateProps) => {
    const checkedSignal = createSignal(props.isChecked ?? false);

    return (
        <Checkbox
            checked={checkedSignal}
            isMixed={props.isMixed}
            isDisabled={props.isDisabled}
            hasError={props.hasError}
            ariaLabel={props.state}
            renderContent={(getFlags) => <PageCheckboxContent flags={getFlags}>{props.state}</PageCheckboxContent>}
        />
    );
};

const LookRadioSample = (props: LookStateProps) => {
    const valueSignal = createSignal(props.isChecked ? props.state : undefined);

    return (
        <RadioGroup value={valueSignal} ariaLabel={props.state} gap={RADIO_GROUP_GAP} hasError={props.hasError}>
            <Radio
                value={() => props.state}
                ariaLabel={() => props.state}
                isDisabled={props.isDisabled}
                hasError={props.hasError}
                renderContent={(getFlags) => <PageRadioContent flags={getFlags}>{props.state}</PageRadioContent>}
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
            renderContent={(getState) => <PageProgressContent state={getState} />}
        />
    </LookBarCell>
);

const LookRangeSample = (props: LookStateProps) => {
    const valueSignal = createSignal(LOOK_SAMPLE_RANGE);

    return (
        <LookBarCell state={props.state}>
            <Range
                value={valueSignal}
                ariaLabel={props.state}
                isDisabled={props.isDisabled}
                hasError={props.hasError}
                thumbSize={RANGE_THUMB_SIZE}
                renderContent={(getRenderProps) => <PageRangeContent renderProps={getRenderProps} />}
            />
        </LookBarCell>
    );
};

const LookTagSample = (props: LookStateProps) => {
    const valueSignal = createSignal(LOOK_SAMPLE_TAGS);

    return (
        <TagInput
            value={valueSignal}
            ariaLabel={props.state}
            gap={FIELD_GAP}
            padding={FIELD_PADDING}
            minHeight={FIELD_HEIGHT}
            isDisabled={props.isDisabled}
            hasError={props.hasError}
            computeTagAriaLabel={computeTagAriaLabel}
            renderContent={(getFlags) => <PageTagInputContent flags={getFlags} />}
            renderPlaceholder={() => <PageTagInputPlaceholder>{props.state}</PageTagInputPlaceholder>}
            renderTag={(getTag, getFlags) => <PageTagContent flags={getFlags}>{getTag()}</PageTagContent>}
        />
    );
};

const LookSlideSample = (props: LookStateProps) => (
    <SlideButton
        ariaDescription={LOOK_SAMPLE_SLIDE_DESCRIPTION}
        thumbSize={SLIDE_BUTTON_THUMB_SIZE}
        isDisabled={props.isDisabled}
        hasError={props.hasError}
        renderContent={(getRenderProps) => (
            <PageSlideButtonContent renderProps={getRenderProps}>{props.state}</PageSlideButtonContent>
        )}
    />
);

const LookTabsSample = (props: LookTabsSampleProps) => {
    const getIdPrefix = () => `look-${props.look}-${props.orientation}`;

    const getTabs = () =>
        LOOK_SAMPLE_TABS.map((tab) => ({
            ...tab,
            id: getTabId(getIdPrefix(), tab.value),
            panelId: getPanelId(getIdPrefix(), tab.value),
        }));

    return (
        <div class={tabsPageStyles.tabsDemo} data-orientation={props.orientation}>
            <Tabs
                orientation={props.orientation}
                tabGap={ROW_TAB_GAP}
                ariaLabel={"Tabs"}
                tabs={getTabs}
                selectedValue={() => LOOK_SAMPLE_SELECTED_TAB}
                renderGutter={() => <PageTabGutter orientation={props.orientation} />}
                renderSelectionFloater={(getVisibilityTarget, getTransitionDurationMs) => (
                    <PageTabFloater
                        orientation={props.orientation}
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                    />
                )}
                renderTab={(getTab, getFlags) => (
                    <PageTabContent
                        flags={getFlags}
                        orientation={props.orientation}
                        isSelected={() => getTab().value === LOOK_SAMPLE_SELECTED_TAB}
                    >
                        {getTab().value}
                    </PageTabContent>
                )}
            />

            <div class={tabsPageStyles.tabsDemoPanel}>
                <PageTabPanel
                    id={getPanelId(getIdPrefix(), LOOK_SAMPLE_SELECTED_TAB)}
                    tabId={getTabId(getIdPrefix(), LOOK_SAMPLE_SELECTED_TAB)}
                >
                    {LOOK_SAMPLE_TAB_PANEL}
                </PageTabPanel>
            </div>
        </div>
    );
};

const LookSamples = (props: LookSamplesProps) => {
    const expandedSignal = createSignal(LOOK_SAMPLE_EXPANDED_SECTIONS);

    return (
        <>
            <LookSampleColumn name={"Surface"}>
                <div class={styles.lookPanel}>{"A panel inside a surface."}</div>
            </LookSampleColumn>

            <LookSampleColumn name={"Tabs"}>
                <LookTabsSample look={props.look} orientation={"horizontal"} />
            </LookSampleColumn>

            <LookSampleColumn name={"Vertical tabs"}>
                <LookTabsSample look={props.look} orientation={"vertical"} />
            </LookSampleColumn>

            <LookSampleColumn name={"Input"}>
                <LookStack>
                    <LookInputSample state={"Default"} />
                    <LookInputSample state={"Read-only"} isReadOnly />
                    <LookInputSample state={"Disabled"} isDisabled />
                    <LookInputSample state={"Error"} hasError />
                </LookStack>
            </LookSampleColumn>

            <LookSampleColumn name={"Tags"}>
                <LookStack>
                    <LookTagSample state={"Default"} />
                    <LookTagSample state={"Disabled"} isDisabled />
                    <LookTagSample state={"Error"} hasError />
                </LookStack>
            </LookSampleColumn>

            <LookSampleColumn name={"Button"}>
                <LookStateGrid>
                    <LookButtonSample state={"Default"} />
                    <LookButtonSample state={"Pressed"} isPressed />
                    <LookButtonSample state={"Disabled"} isDisabled />
                    <LookButtonSample state={"Error"} hasError />
                    <LookButtonSample state={"Pressed Error"} isPressed hasError />
                </LookStateGrid>
            </LookSampleColumn>

            <LookSampleColumn name={"Toggle"}>
                <LookStateGrid>
                    <LookToggleSample state={"Off"} />
                    <LookToggleSample state={"On"} isChecked />
                    <LookToggleSample state={"Mixed"} isMixed />
                    <LookToggleSample state={"Disabled"} isDisabled />
                    <LookToggleSample state={"Error"} hasError />
                    <LookToggleSample state={"On Error"} isChecked hasError />
                </LookStateGrid>
            </LookSampleColumn>

            <LookSampleColumn name={"Checkbox"}>
                <LookStateGrid>
                    <LookCheckboxSample state={"Off"} />
                    <LookCheckboxSample state={"On"} isChecked />
                    <LookCheckboxSample state={"Mixed"} isMixed />
                    <LookCheckboxSample state={"Disabled"} isDisabled />
                    <LookCheckboxSample state={"Error"} hasError />
                    <LookCheckboxSample state={"On Error"} isChecked hasError />
                </LookStateGrid>
            </LookSampleColumn>

            <LookSampleColumn name={"Radio"}>
                <LookStateGrid>
                    <LookRadioSample state={"Off"} />
                    <LookRadioSample state={"On"} isChecked />
                    <LookRadioSample state={"Disabled"} isDisabled />
                    <LookRadioSample state={"Error"} hasError />
                    <LookRadioSample state={"On Error"} isChecked hasError />
                </LookStateGrid>
            </LookSampleColumn>

            <LookSampleColumn name={"Progress"}>
                <LookStack>
                    <LookProgressSample state={"Default"} />
                    <LookProgressSample state={"Error"} hasError />
                </LookStack>
            </LookSampleColumn>

            <LookSampleColumn name={"Range"}>
                <LookStack>
                    <LookRangeSample state={"Default"} />
                    <LookRangeSample state={"Disabled"} isDisabled />
                    <LookRangeSample state={"Error"} hasError />
                </LookStack>
            </LookSampleColumn>

            <LookSampleColumn name={"Slide button"}>
                <LookStack>
                    <LookSlideSample state={"Default"} />
                    <LookSlideSample state={"Disabled"} isDisabled />
                    <LookSlideSample state={"Error"} hasError />
                </LookStack>
            </LookSampleColumn>

            <LookSampleColumn name={"Accordion"}>
                <div class={styles.lookWideSample}>
                    <Accordion
                        items={LOOK_SAMPLE_SECTIONS}
                        gap={DOCS_GAP}
                        expanded={expandedSignal}
                        renderHeader={(getItem, getFlags) => (
                            <PageAccordionHeader flags={getFlags}>{getItem().value}</PageAccordionHeader>
                        )}
                        renderPanel={(_getItem, getVisibilityTarget, getTransitionDurationMs) => (
                            <PageAccordionPanel
                                visibilityTarget={getVisibilityTarget}
                                transitionDurationMs={getTransitionDurationMs}
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
        value={() => props.look}
        ariaLabel={() => props.label}
        sizing={"fill"}
        renderContent={(getFlags) => (
            <div id={computeLookRowId(props.look)} class={styles.lookRow}>
                <div class={styles.lookSampleBoundary}>
                    <div class={PLAYGROUND_LOOKS[props.look]}>
                        <div class={styles.lookSamples}>
                            <PageRadioContent flags={getFlags}>{props.label}</PageRadioContent>

                            <div class={styles.lookColumns} inert aria-hidden="true">
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
    const getPrefersReducedMotion = MediaQueryMonitorSolidUtils.createReducedMotion();

    const pickLook = (look: PlaygroundLook) => {
        void revealLook(look, {
            origin: document.getElementById(computeLookRowId(look)) ?? SHAPE_REVEAL_DEFAULTS.origin,
            durationMs: getPrefersReducedMotion() ? NO_MOTION_DURATION_MS : SHAPE_REVEAL_DEFAULTS.durationMs,
        });
    };

    return (
        <div class={styles.looksPage} data-view={"looks"}>
            <h1 class={styles.looksTitle}>{"Looks"}</h1>

            <p class={styles.looksDescription}>
                {
                    "A look decides how the playground is drawn: the shapes, borders, shadows and fonts of its controls, and where the theme's colors go. Each row shows the controls in one look; picking a row applies it to every page."
                }
            </p>

            <RadioGroup
                value={[getAppliedLook, pickLook]}
                ariaLabel={"Look"}
                orientation={"vertical"}
                gap={LOOK_ROW_GAP}
            >
                <For each={LOOK_OPTIONS}>{(option) => <LookRow look={option.value} label={option.label} />}</For>
            </RadioGroup>
        </div>
    );
};
