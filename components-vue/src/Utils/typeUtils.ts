import type { SetupContext } from "vue";

/**
 * The second argument of a component's `setup`, with its slots typed.
 *
 * Annotating `setup`'s context with it is what gives `slots.renderContent` and its neighbors their value types inside
 * the component. Every slot reads as possibly missing, whatever the slots type says, because a Vue consumer can
 * always leave one out.
 */
export type SlotsContext<TSlots extends Record<string, unknown>> = Omit<SetupContext, "slots"> & {
    slots: Readonly<Partial<TSlots>>;
};
