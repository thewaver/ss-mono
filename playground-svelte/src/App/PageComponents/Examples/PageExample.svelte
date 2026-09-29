<script lang="ts">
    import type { Snippet } from "svelte";

    import { Button } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

    import PageTooltipContent from "../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import { setExampleKnobsContext } from "../ExampleKnobs/ExampleKnobs.context";
    import PageExampleKnobsButton from "../ExampleKnobs/PageExampleKnobsButton.svelte";
    import PageLayer from "../Layer/Layer.svelte";
    import type { ExampleProps } from "./Examples.types";

    const SINGLE_SPAN = 1;

    let props: ExampleProps = $props();

    let renderKnobs = $state.raw<Snippet>();

    setExampleKnobsContext({
        setRenderKnobs: (render) => {
            renderKnobs = render;
        },
    });
</script>

<div
    class={styles.exampleContainer}
    style:grid-column={`span ${props.example.span ?? SINGLE_SPAN}`}
    data-example=""
    data-testid={props.example.key}
>
    <PageLayer level={1}>
        <div class={styles.exampleTitle}>
            {`${props.example.name}:`}
            <div class={styles.exampleActions}>
                {#if props.example.path}
                    <Button
                        id={`${props.example.key}Source`}
                        tooltipDefs={{
                            placement: { x: "center", y: "top-out" },
                            offset: { x: 0, y: 10 },
                            renderContent: sourceTooltip,
                        }}
                        onClick={async () => {
                            props.onViewSource();
                        }}
                    >
                        {#snippet renderContent()}
                            {"</>"}
                        {/snippet}
                    </Button>
                {/if}

                {#if renderKnobs}
                    <PageExampleKnobsButton
                        exampleKey={props.example.key}
                        exampleName={props.example.name}
                        {renderKnobs}
                    />
                {/if}
            </div>
        </div>

        <div class={styles.exampleDemo} data-demo="">
            {@render props.example.component()}
        </div>

        {#if props.example.readout}
            <div class={styles.exampleReadout} data-readout="">
                {props.example.readout()}
            </div>
        {/if}
    </PageLayer>
</div>

{#snippet sourceTooltip(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>View source code</PageTooltipContent>
{/snippet}
