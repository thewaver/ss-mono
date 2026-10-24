<script lang="ts">
    import { EXAMPLES_ONLY_PROP } from "@thewaver/ss-playground/App/PageComponents/Prop/Prop.const";
    import { Button } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/PageComponents/PropsPanel/PropsPanel.css";

    import PageButtonContent from "../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import { setFieldResetContext } from "../Field/FieldSvelte.context";
    import { getIsPreview } from "../Preview/Preview.context";
    import PageProp from "../Prop/Prop.svelte";
    import { setPropsPanelContext } from "./PropsPanel.context";
    import type { PagePropsPanelProps } from "./PropsPanelSvelte.types";
    import {
        DEFAULT_HAS_RESET,
        NOTHING_TO_RESET,
        SAMPLE_SELECTOR_ALONE,
    } from "@thewaver/ss-playground/App/PageComponents/PropsPanel/PropsPanel.const";

    let props: PagePropsPanelProps = $props();

    const isPreview = getIsPreview();

    let resets = $state.raw<(() => void)[]>([]);

    setFieldResetContext({
        register: (reset) => {
            resets = [...resets, reset];

            return () => {
                resets = resets.filter((entry) => entry !== reset);
            };
        },
    });

    setPropsPanelContext({
        get scope() {
            return props.scope;
        },
    });

    const isSampleScope = $derived(props.scope === "sample");

    const leastToReset = $derived(isSampleScope ? SAMPLE_SELECTOR_ALONE : NOTHING_TO_RESET);

    const resettable = $derived(isSampleScope ? resets.slice(SAMPLE_SELECTOR_ALONE) : resets);
</script>

{#if !isPreview}
    <div class={styles.propsPanelScopeVariants[props.scope]} data-panel={props.scope}>
        {@render props.children?.()}

        {#if (props.hasReset ?? DEFAULT_HAS_RESET) && resets.length > leastToReset}
            <PageProp
                itemKey={"resetPanel"}
                controls={EXAMPLES_ONLY_PROP}
                label={"These controls"}
                hint={"Puts every control in this panel back to the value it started at."}
            >
                <Button
                    onClick={() => {
                        resettable.forEach((reset) => reset());
                    }}
                >
                    {#snippet renderContent(flags)}
                        <PageButtonContent {flags}>Reset</PageButtonContent>
                    {/snippet}
                </Button>
            </PageProp>
        {/if}
    </div>
{/if}
