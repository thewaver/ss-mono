<script lang="ts">
    import type { Toast, ToastState } from "@thewaver/ss-components-svelte";
    import { Toasts } from "@thewaver/ss-components-svelte";

    import PageToastContent from "../../../StyledComponents/ToastContent/ToastContent.svelte";
    import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentSvelte.types";
    import type { ToastsAnimationDocsExampleProps } from "../ToastsPageSvelte.types";
    import AnimationRaisers from "./AnimationRaisers.svelte";

    type Props = ToastsAnimationDocsExampleProps;

    let props: Props = $props();
</script>

<Toasts ariaLabel={"Animated notifications"} alignment={"top_left"} transitionDurationMs={props.transitionDurationMs}>
    <AnimationRaisers />

    {#snippet renderToast(
        toast: Toast<ToastDefs>,
        visibilityTarget: 0 | 1,
        transitionDurationMs: number,
        state: ToastState,
        dismiss: () => boolean,
    )}
        <PageToastContent
            {toast}
            {state}
            animation={props.animation}
            {visibilityTarget}
            {transitionDurationMs}
            onDismiss={dismiss}
        />
    {/snippet}
</Toasts>
