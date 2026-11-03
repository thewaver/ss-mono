<script lang="ts">
    import { Accordion, Tabs } from "@thewaver/ss-components-svelte";
    import { DOCS_GAP } from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.const";
    import {
        LOOK_SAMPLE_EXPANDED_SECTIONS,
        LOOK_SAMPLE_SECTIONS,
        LOOK_SAMPLE_SECTION_BODY,
        LOOK_SAMPLE_SELECTED_TAB,
        LOOK_SAMPLE_TABS,
        LOOK_SAMPLE_TAB_PANEL,
    } from "@thewaver/ss-playground/App/Pages/LooksPage/LooksPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/LooksPage/LooksPage.css";
    import { ROW_TAB_GAP, getPanelId, getTabId } from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";

    import PageTabPanel from "../../PageComponents/TabPanel/TabPanel.svelte";
    import PageAccordionHeader from "../../StyledComponents/AccordionContent/PageAccordionHeader.svelte";
    import PageAccordionPanel from "../../StyledComponents/AccordionContent/PageAccordionPanel.svelte";
    import PageTabContent from "../../StyledComponents/TabContent/PageTabContent.svelte";
    import PageTabFloater from "../../StyledComponents/TabContent/PageTabFloater.svelte";
    import PageTabGutter from "../../StyledComponents/TabContent/PageTabGutter.svelte";
    import LookButtonSample from "./LookButtonSample.svelte";
    import LookCheckboxSample from "./LookCheckboxSample.svelte";
    import LookInputSample from "./LookInputSample.svelte";
    import LookProgressSample from "./LookProgressSample.svelte";
    import LookRadioSample from "./LookRadioSample.svelte";
    import LookRangeSample from "./LookRangeSample.svelte";
    import LookSampleColumn from "./LookSampleColumn.svelte";
    import LookSlideSample from "./LookSlideSample.svelte";
    import LookTagSample from "./LookTagSample.svelte";
    import LookToggleSample from "./LookToggleSample.svelte";
    import type { LookSamplesProps } from "./LooksPage.types";

    let props: LookSamplesProps = $props();

    let expanded = $state.raw(LOOK_SAMPLE_EXPANDED_SECTIONS);

    const idPrefix = $derived(`look-${props.look}`);

    const tabs = $derived(
        LOOK_SAMPLE_TABS.map((tab) => ({
            ...tab,
            id: getTabId(idPrefix, tab.value),
            panelId: getPanelId(idPrefix, tab.value),
        })),
    );
</script>

<LookSampleColumn name={"Surface"}>
    <div class={styles.lookPanel}>A panel inside a surface.</div>
</LookSampleColumn>

<LookSampleColumn name={"Tabs"}>
    <div class={styles.lookWideSample}>
        <Tabs tabGap={ROW_TAB_GAP} ariaLabel={"Tabs"} {tabs} selectedValue={LOOK_SAMPLE_SELECTED_TAB}>
            {#snippet renderGutter()}
                <PageTabGutter orientation={"horizontal"} />
            {/snippet}

            {#snippet renderSelectionFloater(visibilityTarget, transitionDurationMs)}
                <PageTabFloater orientation={"horizontal"} {visibilityTarget} {transitionDurationMs} />
            {/snippet}

            {#snippet renderTab(tab, flags)}
                <PageTabContent {flags} orientation={"horizontal"} isSelected={tab.value === LOOK_SAMPLE_SELECTED_TAB}>
                    {tab.value}
                </PageTabContent>
            {/snippet}
        </Tabs>

        <PageTabPanel
            id={getPanelId(idPrefix, LOOK_SAMPLE_SELECTED_TAB)}
            tabId={getTabId(idPrefix, LOOK_SAMPLE_SELECTED_TAB)}
        >
            {LOOK_SAMPLE_TAB_PANEL}
        </PageTabPanel>
    </div>
</LookSampleColumn>

<LookSampleColumn name={"Input"} isWide={true}>
    <div class={[styles.lookStateGrid, styles.lookFittedStateGrid]}>
        <LookInputSample state={"Default"} />
        <LookInputSample state={"Read-only"} isReadOnly={true} />
        <LookInputSample state={"Disabled"} isDisabled={true} />
        <LookInputSample state={"Error"} hasError={true} />
    </div>
</LookSampleColumn>

<LookSampleColumn name={"Tags"} isWide={true}>
    <div class={[styles.lookStateGrid, styles.lookFittedStateGrid]}>
        <LookTagSample state={"Default"} />
        <LookTagSample state={"Disabled"} isDisabled={true} />
        <LookTagSample state={"Error"} hasError={true} />
    </div>
</LookSampleColumn>

<LookSampleColumn name={"Button"}>
    <div class={styles.lookStateGrid}>
        <LookButtonSample state={"Default"} />
        <LookButtonSample state={"Pressed"} isPressed={true} />
        <LookButtonSample state={"Disabled"} isDisabled={true} />
        <LookButtonSample state={"Error"} hasError={true} />
    </div>
</LookSampleColumn>

<LookSampleColumn name={"Toggle"}>
    <div class={styles.lookStateGrid}>
        <LookToggleSample state={"Off"} />
        <LookToggleSample state={"On"} isChecked={true} />
        <LookToggleSample state={"Disabled"} isDisabled={true} />
        <LookToggleSample state={"Error"} hasError={true} />
    </div>
</LookSampleColumn>

<LookSampleColumn name={"Checkbox"}>
    <div class={styles.lookStateGrid}>
        <LookCheckboxSample state={"Off"} />
        <LookCheckboxSample state={"On"} isChecked={true} />
        <LookCheckboxSample state={"Mixed"} isMixed={true} />
        <LookCheckboxSample state={"Disabled"} isDisabled={true} />
        <LookCheckboxSample state={"Error"} hasError={true} />
    </div>
</LookSampleColumn>

<LookSampleColumn name={"Radio"}>
    <div class={styles.lookStateGrid}>
        <LookRadioSample state={"Off"} />
        <LookRadioSample state={"On"} isChecked={true} />
        <LookRadioSample state={"Disabled"} isDisabled={true} />
        <LookRadioSample state={"Error"} hasError={true} />
    </div>
</LookSampleColumn>

<LookSampleColumn name={"Progress"}>
    <div class={styles.lookBarStack}>
        <LookProgressSample state={"Default"} />
        <LookProgressSample state={"Error"} hasError={true} />
    </div>
</LookSampleColumn>

<LookSampleColumn name={"Range"}>
    <div class={styles.lookBarStack}>
        <LookRangeSample state={"Default"} />
        <LookRangeSample state={"Disabled"} isDisabled={true} />
        <LookRangeSample state={"Error"} hasError={true} />
    </div>
</LookSampleColumn>

<LookSampleColumn name={"Slide button"}>
    <div class={styles.lookBarStack}>
        <LookSlideSample state={"Default"} />
        <LookSlideSample state={"Disabled"} isDisabled={true} />
        <LookSlideSample state={"Error"} hasError={true} />
    </div>
</LookSampleColumn>

<LookSampleColumn name={"Accordion"}>
    <div class={styles.lookWideSample}>
        <Accordion items={LOOK_SAMPLE_SECTIONS} gap={DOCS_GAP} bind:expanded>
            {#snippet renderHeader(item, flags)}
                <PageAccordionHeader {flags}>{item.value}</PageAccordionHeader>
            {/snippet}

            {#snippet renderPanel(_item, visibilityTarget, transitionDurationMs)}
                <PageAccordionPanel {visibilityTarget} {transitionDurationMs}>
                    {LOOK_SAMPLE_SECTION_BODY}
                </PageAccordionPanel>
            {/snippet}
        </Accordion>
    </div>
</LookSampleColumn>
