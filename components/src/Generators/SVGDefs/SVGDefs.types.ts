export type SVGDefsElementDefs<TElement> = {
    id: string;
    renderDefsElement: () => TElement;
};

export type SVGDefsOf<TElement> = {
    clipPath?: SVGDefsElementDefs<TElement>;
    filter?: SVGDefsElementDefs<TElement>;
    blend?: boolean;
    opacity?: number;
} & (
    | {
          color?: never;
          gradientOrPattern: SVGDefsElementDefs<TElement>;
      }
    | {
          color: string;
          gradientOrPattern?: never;
      }
);
