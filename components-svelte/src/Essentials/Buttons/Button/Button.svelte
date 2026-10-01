<script lang="ts">
    import type { ButtonFlags, InteractionActivation } from "@thewaver/ss-components";

    import InteractionWrapper from "../../../Primitives/InteractionWrapper/InteractionWrapper.svelte";
    import type { ButtonCbs, ButtonProps } from "./Button.types.js";
    import ButtonElement from "./ButtonElement.svelte";

    let { ref = $bindable(), ...props }: ButtonProps = $props();

    let isPending = $state(false);

    const extraFlags: ButtonFlags = $derived({ isPending });

    const handleClick: ButtonCbs["onClick"] = (e) => {
        const result = props.onClick?.(e);

        if (!(result instanceof Promise)) return;

        isPending = true;

        void result.finally(() => {
            isPending = false;
        });
    };

    const handleActivation = (activation: InteractionActivation) => {
        if (isPending) return;

        props.onActivation?.(activation);
    };
</script>

<InteractionWrapper {...props} bind:ref {extraFlags} onActivation={props.onActivation && handleActivation}>
    {#snippet renderControl(attachElement, flags)}
        <ButtonElement
            {attachElement}
            ariaLabel={props.ariaLabel}
            type={props.type}
            id={props.id}
            {flags}
            renderContent={props.renderContent}
            onClick={handleClick}
            onPointerDown={props.onPointerDown}
            onPointerUp={props.onPointerUp}
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseLeave}
        />
    {/snippet}
</InteractionWrapper>
