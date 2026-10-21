<script lang="ts">
    import { SWITCHED_DIRECTION_TABS } from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";

    import PageExampleKnobs from "../../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageCheckField from "../../../PageComponents/Field/PageCheckField.svelte";
    import PageProp from "../../../PageComponents/Prop/Prop.svelte";
    import type { TabsExampleProps } from "../TabsPageSvelte.types";
    import RowExample from "./Row.svelte";

    type Props = TabsExampleProps;

    let props: Props = $props();

    let isRightToLeft = $state(false);
</script>

<div dir={isRightToLeft ? "rtl" : "ltr"}>
    <RowExample
        selectedValue={props.selectedValue}
        tabs={SWITCHED_DIRECTION_TABS}
        idPrefix={"switchedDirection"}
        onSelectionChange={props.onSelectionChange}
    />

    <PageExampleKnobs>
        <PageProp
            itemKey={"isRightToLeft"}
            label={"Right to left"}
            hint={"Switches the box around the tabs between right-to-left and left-to-right while they are on screen."}
            controls={"Sets dir on the box around the tabs"}
        >
            <PageCheckField
                value={isRightToLeft}
                ariaLabel={"Right to left"}
                onChange={(value) => {
                    isRightToLeft = value;
                }}
            />
        </PageProp>
    </PageExampleKnobs>
</div>
