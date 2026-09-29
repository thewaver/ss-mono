import type { CarouselControlProps } from "./Carousel.types.js";
declare function $$render<TExtra extends object = {}>(): {
    props: CarouselControlProps<TExtra>;
    exports: {};
    bindings: "";
    slots: {};
    events: {};
};
declare class __sveltets_Render<TExtra extends object = {}> {
    props(): ReturnType<typeof $$render<TExtra>>['props'];
    events(): ReturnType<typeof $$render<TExtra>>['events'];
    slots(): ReturnType<typeof $$render<TExtra>>['slots'];
    bindings(): "";
    exports(): {};
}
interface $$IsomorphicComponent {
    new <TExtra extends object = {}>(options: import('svelte').ComponentConstructorOptions<ReturnType<__sveltets_Render<TExtra>['props']>>): import('svelte').SvelteComponent<ReturnType<__sveltets_Render<TExtra>['props']>, ReturnType<__sveltets_Render<TExtra>['events']>, ReturnType<__sveltets_Render<TExtra>['slots']>> & {
        $$bindings?: ReturnType<__sveltets_Render<TExtra>['bindings']>;
    } & ReturnType<__sveltets_Render<TExtra>['exports']>;
    <TExtra extends object = {}>(internal: unknown, props: ReturnType<__sveltets_Render<TExtra>['props']> & {}): ReturnType<__sveltets_Render<TExtra>['exports']>;
    z_$$bindings?: ReturnType<__sveltets_Render<any>['bindings']>;
}
declare const CarouselControl: $$IsomorphicComponent;
type CarouselControl<TExtra extends object = {}> = InstanceType<typeof CarouselControl<TExtra>>;
export default CarouselControl;
