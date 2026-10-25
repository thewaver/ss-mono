<script lang="ts">
    import type { Toast, ToastState } from "@thewaver/ss-components-svelte";
    import { Toasts } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

    import PageToastContent from "../../../StyledComponents/ToastContent/ToastContent.svelte";
    import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentSvelte.types";
    import type { ToastsShowAnswer } from "../ToastsPageSvelte.types";
    import FarDownSaveButton from "./FarDownSaveButton.svelte";
    import FarDownSettingsPanel from "./FarDownSettingsPanel.svelte";

    let answer = $state<ToastsShowAnswer>();

    const setAnswer = (next: ToastsShowAnswer) => {
        answer = next;
    };
</script>

<div class={styles.example}>
    <div class={styles.raiseRow}>
        <Toasts ariaLabel={"Profile notifications"} alignment={"middle_center"}>
            <FarDownSettingsPanel onAnswer={setAnswer} />

            {#snippet renderToast(
                toast: Toast<ToastDefs>,
                visibilityTarget: 0 | 1,
                transitionDurationMs: number,
                state: ToastState,
                dismiss: () => boolean,
            )}
                <PageToastContent {toast} {state} {visibilityTarget} {transitionDurationMs} onDismiss={dismiss} />
            {/snippet}
        </Toasts>

        <FarDownSaveButton id={"farDownOutside"} caption={"Save outside"} onAnswer={setAnswer} />
    </div>

    <div class={exampleStyles.exampleReadout} data-readout>
        {`show answered: ${answer === undefined ? "nothing yet" : (answer.id ?? "undefined")}`}
    </div>
</div>
