import type { StepperProps } from "./Stepper.types.js";
declare function $$render<TValue, TState>(): {
    props: StepperProps<TValue, TState>;
    exports: {};
    bindings: "";
    slots: {};
    events: {};
};
declare class __sveltets_Render<TValue, TState> {
    props(): ReturnType<typeof $$render<TValue, TState>>['props'];
    events(): ReturnType<typeof $$render<TValue, TState>>['events'];
    slots(): ReturnType<typeof $$render<TValue, TState>>['slots'];
    bindings(): "";
    exports(): {};
}
interface $$IsomorphicComponent {
    new <TValue, TState>(options: import('svelte').ComponentConstructorOptions<ReturnType<__sveltets_Render<TValue, TState>['props']>>): import('svelte').SvelteComponent<ReturnType<__sveltets_Render<TValue, TState>['props']>, ReturnType<__sveltets_Render<TValue, TState>['events']>, ReturnType<__sveltets_Render<TValue, TState>['slots']>> & {
        $$bindings?: ReturnType<__sveltets_Render<TValue, TState>['bindings']>;
    } & ReturnType<__sveltets_Render<TValue, TState>['exports']>;
    <TValue, TState>(internal: unknown, props: ReturnType<__sveltets_Render<TValue, TState>['props']> & {}): ReturnType<__sveltets_Render<TValue, TState>['exports']>;
    z_$$bindings?: ReturnType<__sveltets_Render<any, any>['bindings']>;
}
declare const Stepper: $$IsomorphicComponent;
type Stepper<TValue, TState> = InstanceType<typeof Stepper<TValue, TState>>;
export default Stepper;
