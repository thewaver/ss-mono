<script lang="ts">
    import { Accordion, Tabs } from "@thewaver/ss-components-svelte";
    import { DOCS_GAP } from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.const";
    import {
        SKIN_SAMPLE_EXPANDED_SECTIONS,
        SKIN_SAMPLE_SECTIONS,
        SKIN_SAMPLE_SECTION_BODY,
        SKIN_SAMPLE_SELECTED_TAB,
        SKIN_SAMPLE_TABS,
        SKIN_SAMPLE_TAB_PANEL,
    } from "@thewaver/ss-playground/App/Pages/SkinsPage/SkinsPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/SkinsPage/SkinsPage.css";
    import { ROW_TAB_GAP, getPanelId, getTabId } from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";

    import PageTabPanel from "../../PageComponents/TabPanel/TabPanel.svelte";
    import PageAccordionHeader from "../../StyledComponents/AccordionContent/PageAccordionHeader.svelte";
    import PageAccordionPanel from "../../StyledComponents/AccordionContent/PageAccordionPanel.svelte";
    import PageAccordionWrapper from "../../StyledComponents/AccordionContent/PageAccordionWrapper.svelte";
    import PageTabContent from "../../StyledComponents/TabContent/PageTabContent.svelte";
    import PageTabFloater from "../../StyledComponents/TabContent/PageTabFloater.svelte";
    import PageTabGutter from "../../StyledComponents/TabContent/PageTabGutter.svelte";
    import SkinButtonSample from "./SkinButtonSample.svelte";
    import SkinBarCell from "./SkinBarCell.svelte";
    import SkinCheckboxSample from "./SkinCheckboxSample.svelte";
    import SkinInputSample from "./SkinInputSample.svelte";
    import SkinListboxSample from "./SkinListboxSample.svelte";
    import SkinProgressSample from "./SkinProgressSample.svelte";
    import SkinRadioSample from "./SkinRadioSample.svelte";
    import SkinRangeSample from "./SkinRangeSample.svelte";
    import SkinSimpleButtonSample from "./SkinSimpleButtonSample.svelte";
    import SkinSampleColumn from "./SkinSampleColumn.svelte";
    import SkinSlideSample from "./SkinSlideSample.svelte";
    import SkinTagSample from "./SkinTagSample.svelte";
    import SkinToggleSample from "./SkinToggleSample.svelte";
    import type { SkinSamplesProps } from "./SkinsPage.types";

    let props: SkinSamplesProps = $props();

    let expanded = $state.raw(SKIN_SAMPLE_EXPANDED_SECTIONS);

    const idPrefix = $derived(`skin-${props.skin}`);

    const tabs = $derived(
        SKIN_SAMPLE_TABS.map((tab) => ({
            ...tab,
            id: getTabId(idPrefix, tab.value),
            panelId: getPanelId(idPrefix, tab.value),
        })),
    );
</script>

<SkinSampleColumn name={"Surface"}>
    <div class={styles.skinPanel}>A panel inside a surface.</div>
</SkinSampleColumn>

<SkinSampleColumn name={"Tabs"}>
    <div class={styles.skinWideSample}>
        <Tabs tabGap={ROW_TAB_GAP} ariaLabel={"Tabs"} {tabs} selectedValue={SKIN_SAMPLE_SELECTED_TAB}>
            {#snippet renderGutter()}
                <PageTabGutter orientation={"horizontal"} />
            {/snippet}

            {#snippet renderSelectionFloater(visibilityTarget, transitionDurationMs)}
                <PageTabFloater orientation={"horizontal"} {visibilityTarget} {transitionDurationMs} />
            {/snippet}

            {#snippet renderTab(tab, flags)}
                <PageTabContent {flags} orientation={"horizontal"} isSelected={tab.value === SKIN_SAMPLE_SELECTED_TAB}>
                    {tab.value}
                </PageTabContent>
            {/snippet}
        </Tabs>

        <PageTabPanel
            id={getPanelId(idPrefix, SKIN_SAMPLE_SELECTED_TAB)}
            tabId={getTabId(idPrefix, SKIN_SAMPLE_SELECTED_TAB)}
        >
            {SKIN_SAMPLE_TAB_PANEL}
        </PageTabPanel>
    </div>
</SkinSampleColumn>

<SkinSampleColumn name={"Input"} isWide={true}>
    <div class={[styles.skinStateGrid, styles.skinFittedStateGrid]}>
        <SkinInputSample state={"Default"} />
        <SkinInputSample state={"Read-only"} isReadOnly={true} />
        <SkinInputSample state={"Disabled"} isDisabled={true} />
        <SkinInputSample state={"Error"} hasError={true} />
    </div>
</SkinSampleColumn>

<SkinSampleColumn name={"Tags"} isWide={true}>
    <div class={[styles.skinStateGrid, styles.skinFittedStateGrid]}>
        <SkinTagSample state={"Default"} />
        <SkinTagSample state={"Disabled"} isDisabled={true} />
        <SkinTagSample state={"Error"} hasError={true} />
    </div>
</SkinSampleColumn>

<SkinSampleColumn name={"Listbox"}>
    <div class={styles.skinBarStack}>
        <SkinBarCell state={"With floater"}>
            <SkinListboxSample isGliding={true} />
        </SkinBarCell>

        <SkinBarCell state={"Without floater"}>
            <SkinListboxSample />
        </SkinBarCell>
    </div>
</SkinSampleColumn>

<SkinSampleColumn name={"Button"}>
    <div class={styles.skinStateGrid}>
        <SkinButtonSample state={"Default"} />
        <SkinButtonSample state={"Pressed"} isPressed={true} />
        <SkinButtonSample state={"Disabled"} isDisabled={true} />
        <SkinButtonSample state={"Error"} hasError={true} />
        <SkinButtonSample state={"Pressed Error"} isPressed={true} hasError={true} />
    </div>
</SkinSampleColumn>

<SkinSampleColumn name={"Simple button"}>
    <div class={styles.skinStateGrid}>
        <SkinSimpleButtonSample state={"Default"} />
        <SkinSimpleButtonSample state={"Pressed"} isPressed={true} />
        <SkinSimpleButtonSample state={"Disabled"} isDisabled={true} />
        <SkinSimpleButtonSample state={"Error"} hasError={true} />
        <SkinSimpleButtonSample state={"Pressed Error"} isPressed={true} hasError={true} />
    </div>
</SkinSampleColumn>

<SkinSampleColumn name={"Toggle"}>
    <div class={styles.skinStateGrid}>
        <SkinToggleSample state={"Off"} />
        <SkinToggleSample state={"On"} isChecked={true} />
        <SkinToggleSample state={"Disabled"} isDisabled={true} />
        <SkinToggleSample state={"Error"} hasError={true} />
    </div>
</SkinSampleColumn>

<SkinSampleColumn name={"Checkbox"}>
    <div class={styles.skinStateGrid}>
        <SkinCheckboxSample state={"Off"} />
        <SkinCheckboxSample state={"On"} isChecked={true} />
        <SkinCheckboxSample state={"Mixed"} isMixed={true} />
        <SkinCheckboxSample state={"Disabled"} isDisabled={true} />
        <SkinCheckboxSample state={"Error"} hasError={true} />
    </div>
</SkinSampleColumn>

<SkinSampleColumn name={"Radio"}>
    <div class={styles.skinStateGrid}>
        <SkinRadioSample state={"Off"} />
        <SkinRadioSample state={"On"} isChecked={true} />
        <SkinRadioSample state={"Disabled"} isDisabled={true} />
        <SkinRadioSample state={"Error"} hasError={true} />
    </div>
</SkinSampleColumn>

<SkinSampleColumn name={"Progress"}>
    <div class={styles.skinBarStack}>
        <SkinProgressSample state={"Default"} />
        <SkinProgressSample state={"Error"} hasError={true} />
    </div>
</SkinSampleColumn>

<SkinSampleColumn name={"Range"}>
    <div class={styles.skinBarStack}>
        <SkinRangeSample state={"Default"} />
        <SkinRangeSample state={"Disabled"} isDisabled={true} />
        <SkinRangeSample state={"Error"} hasError={true} />
    </div>
</SkinSampleColumn>

<SkinSampleColumn name={"Slide button"}>
    <div class={styles.skinBarStack}>
        <SkinSlideSample state={"Default"} />
        <SkinSlideSample state={"Disabled"} isDisabled={true} />
        <SkinSlideSample state={"Error"} hasError={true} />
    </div>
</SkinSampleColumn>

<SkinSampleColumn name={"Accordion"}>
    <div class={styles.skinWideSample}>
        <Accordion items={SKIN_SAMPLE_SECTIONS} gap={DOCS_GAP} bind:expanded>
            {#snippet renderSection(renderContent, _, flags)}
                <PageAccordionWrapper {flags}>{@render renderContent()}</PageAccordionWrapper>
            {/snippet}

            {#snippet renderHeader(item, flags)}
                <PageAccordionHeader {flags}>{item.value}</PageAccordionHeader>
            {/snippet}

            {#snippet renderPanel(_item, visibilityTarget, transitionDurationMs)}
                <PageAccordionPanel {visibilityTarget} {transitionDurationMs}>
                    {SKIN_SAMPLE_SECTION_BODY}
                </PageAccordionPanel>
            {/snippet}
        </Accordion>
    </div>
</SkinSampleColumn>
