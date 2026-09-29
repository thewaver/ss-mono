<script lang="ts">
    import { Button, Die } from "@thewaver/ss-components-svelte";
    import type { DieController } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/DiePage/DiePage.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageDieFace from "../../../StyledComponents/DieContent/DieContent.svelte";
    import type { DieExampleProps } from "../DiePage.types";

    const FIRST_NUMBER = 1;

    type Props = DieExampleProps;

    let { face = $bindable(), ...props }: Props = $props();

    let controller = $state.raw<DieController>();

    const isRolling = $derived(controller?.getIsRolling() ?? true);
</script>

<div class={styles.stage}>
    <Die
        shape={props.shape}
        size={props.size}
        rollDurationMs={props.rollDurationMs}
        tumbleCount={props.tumbleCount}
        bind:face
        ariaLabel={"A die"}
        computeFaceLabel={(index) => `${index + FIRST_NUMBER}`}
        computeRollTarget={() => Math.floor(Math.random() * props.shape.faces.length)}
        onMount={(next) => {
            controller = next;
        }}
    >
        {#snippet renderFace(index, state)}
            <PageDieFace {state} label={`${index + FIRST_NUMBER}`} />
        {/snippet}
    </Die>

    <Button
        id={"dieRoll"}
        isDisabled={isRolling}
        onClick={() => {
            controller?.roll();
        }}
    >
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>Roll</PageButtonContent>
        {/snippet}
    </Button>
</div>
