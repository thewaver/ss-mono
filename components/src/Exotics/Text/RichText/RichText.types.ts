export type RichTextAllowedAttributes = Record<string, string[]>;

export type RichTextNode =
    | {
          type: "text";
          content: string;
      }
    | {
          type: "tag";
          tag: string;
          attributes: Record<string, string>;
          openingMarkup: string;
          children: RichTextNode[];
      };

export type RichTextTagTreatment =
    { kind: "class"; className: string } | { kind: "unwrap" } | { kind: "literal"; closingMarkup: string };

export type BaseRichTextValues = {
    /** The markup to render. */
    content: string;
    /** Strips any tag that was not mapped to a class, rather than leaving it in the markup untouched. */
    removeOtherTags?: boolean;
    /**
     * Which attributes each tag may carry, as a tag name mapped to the attribute names it accepts, so
     * `{ a: ["href"] }` lets `[a href="…"]` through. An opening tag carrying an attribute not listed for it
     * is not a tag at all and prints as typed, which keeps a bracket in ordinary prose from being read as
     * markup. Names are matched case-sensitively, as tag names are. The values reach `renderTag` untouched
     * and unvetted: the library writes no attribute onto any element itself, so what a value is allowed to
     * become, a link's address included, is decided by whoever renders it.
     */
    allowedAttributes?: RichTextAllowedAttributes;
    /**
     * How deeply tags may nest, a tag at the top level sitting at depth `1`. A tag that would sit deeper prints as
     * typed, as any other malformed markup does. Defaults to `Infinity`, no limit, which is right for copy the
     * consumer wrote; set it when the content comes from somewhere untrusted, since thousands of nested tags are
     * enough to exhaust the renderer's call stack.
     */
    maxDepth?: number;
};

export type BaseRichTextCbs = {
    /** Maps each tag to the classes it is drawn with, given the defaults to build on. */
    computeClassNames?: (defaultClasses: Record<string, string>) => Record<string, string>;
};

export type BaseRichTextProps = BaseRichTextValues & BaseRichTextCbs;
