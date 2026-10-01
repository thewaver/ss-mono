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
