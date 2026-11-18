<script lang="ts">
    import type { Toast, ToastState } from "@thewaver/ss-components-svelte";
    import { Toasts } from "@thewaver/ss-components-svelte";

    import PageToastContent from "../../../StyledComponents/ToastContent/ToastContent.svelte";
    import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentSvelte.types";
    import RightToLeftRaisers from "./RightToLeftRaisers.svelte";
    import { PUBLISHING_NOTIFICATIONS_LABEL } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";
</script>

<div dir="rtl">
    <Toasts ariaLabel={PUBLISHING_NOTIFICATIONS_LABEL} alignment={"middle_left"}>
        <RightToLeftRaisers />

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
</div>
