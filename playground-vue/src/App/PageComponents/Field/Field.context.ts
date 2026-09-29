import { type InjectionKey, inject, onBeforeUnmount, onMounted, provide } from "vue";

export type FieldResetRegistry = {
    register: (reset: () => void) => () => void;
};

export type FieldDefaultRegistry = {
    report: (value: unknown) => () => void;
};

const FIELD_RESET_KEY: InjectionKey<FieldResetRegistry> = Symbol("FieldReset");

const FIELD_DEFAULT_KEY: InjectionKey<FieldDefaultRegistry> = Symbol("FieldDefault");

export const provideFieldReset = (registry: FieldResetRegistry) => provide(FIELD_RESET_KEY, registry);

export const provideFieldDefault = (registry: FieldDefaultRegistry) => provide(FIELD_DEFAULT_KEY, registry);

export const useFieldReset = <T>(value: T, apply: (value: T) => void) => {
    const registry = inject(FIELD_RESET_KEY, undefined);
    const defaults = inject(FIELD_DEFAULT_KEY, undefined);

    const initial = value;

    let stopReporting: (() => void) | undefined;
    let stopRegistering: (() => void) | undefined;

    onMounted(() => {
        stopReporting = defaults?.report(initial);
        stopRegistering = registry?.register(() => apply(initial));
    });

    onBeforeUnmount(() => {
        stopRegistering?.();
        stopReporting?.();
    });
};
