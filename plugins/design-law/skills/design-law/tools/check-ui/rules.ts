export type Scope = "class" | "text" | "element" | "style";

export type Rule = {
  id: string;
  section: string;
  scope: Scope;
  title: string;
  fix: string;
  // class scope: tested per whitespace-separated token. text scope: tested on the whole string.
  test?: RegExp;
  // element scope: tag names
  tags?: string[];
  // class scope: tokens matching this are exempt
  except?: RegExp;
};

// Strip any number of variant prefixes (md:, hover:, group-hover:, ...) before testing.
export const COLOR_NAMES =
  "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white";
const COLOR_PREFIX = "text|bg|border|ring|fill|stroke|divide|outline|decoration|caret|shadow|from|via|to|accent";
const TOKENS =
  "background|foreground|muted|card|border|accent|accent-foreground|border-hover|nav|nav-border|scrim|scrim-strong|device-frame";

export const CLASS_RULES: Rule[] = [
  {
    id: "UI01", section: "1.1", scope: "class",
    title: "Palette colour or black/white instead of a token",
    fix: "Use a wrapper (Text, Heading, Button, Card, Tag). If a colour is missing, add a token in globals.css and a DESIGN.md entry.",
    test: new RegExp(`^(?:${COLOR_PREFIX})-(?:${COLOR_NAMES})(?:-\\d{2,3})?(?:\\/\\d+)?$`),
  },
  {
    id: "UI02", section: "1.2", scope: "class",
    title: "Colour literal in a class (hex, rgb, hsl, oklch)",
    fix: "Add a token to globals.css (DS tokens) and use it through a wrapper.",
    test: /-\[(?:#|rgba?\(|hsla?\(|oklch\(|oklab\()/,
  },
  {
    id: "UI03", section: "1.3", scope: "class",
    title: "Opacity modifier on a colour",
    fix: "Muted is the token `muted`. For a translucent colour add a named token. Faded colours have no audited contrast.",
    test: /^(?:text|bg|border|ring|fill|stroke|divide|outline|shadow|from|via|to)-[a-z-]+\/(?:\d+|\[[^\]]+\])$/,
  },
  {
    id: "UI04", section: "1.3", scope: "class",
    title: "opacity-* utility in product code",
    fix: "Opacity belongs to ds/button only. Use a token or remove it.",
    test: /^opacity-\d+$/,
  },
  {
    id: "UI05", section: "1.6", scope: "class",
    title: "Gradient",
    fix: "Use a flat token fill (bg-background or bg-card via a wrapper). No gradients on this site.",
    test: /^(?:bg-(?:gradient|linear|radial|conic)-|from-|via-|to-|bg-clip-text$|text-transparent$)/,
  },
  {
    id: "UI06", section: "1.6", scope: "class",
    title: "Blur, glass or glow",
    fix: "Remove it. The sticky nav is the only backdrop-blur and lives in the existing nav.",
    test: /^(?:backdrop-|blur(?:-|$)|drop-shadow|brightness-|saturate-)/,
  },
  {
    id: "UI07", section: "2.2", scope: "class",
    title: "Font weight other than 400/500, or a weight utility in product code",
    fix: "Weights come from Heading (500) and Text (400). Do not set font-* in product code.",
    test: /^font-(?:thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/,
  },
  {
    id: "UI08", section: "2.3", scope: "class",
    title: "Raw text size",
    fix: "Use Heading level=page|section|card|card-featured, or Text variant=intro|body|small, or Tag.",
    test: /^text-(?:xs|sm|base|lg|xl|[2-9]xl|\[[^\]]+\])$/,
  },
  {
    id: "UI09", section: "2.4", scope: "class",
    title: "Tracking, case, italic or leading set by hand",
    fix: "Headings already use tracking-tight. No uppercase, wide tracking or italic. Leading comes from Text.",
    test: /^(?:uppercase|lowercase|capitalize|italic|tracking-[a-z]+|leading-[a-z0-9.]+)$/,
  },
  {
    id: "UI10", section: "2.1", scope: "class",
    title: "Font family other than Geist Sans",
    fix: "Remove font-serif and font-[...]. font-mono is for code only.",
    test: /^font-(?:serif|mono|\[)/,
  },
  {
    id: "UI11", section: "3.1", scope: "class",
    title: "Radius utility in product code",
    fix: "Radius comes from Card (16px), Button/Tag (pill) and DeviceFrame. Use the wrapper.",
    test: /^rounded(?:-|$)/,
  },
  {
    id: "UI12", section: "3.2", scope: "class",
    title: "Hand-built border or divider",
    fix: "Borders live in Card, Tag, Button and Section. Use them. Dividers between sections use border-t on Section only.",
    test: /^(?:border(?:-[trblxy])?(?:-\d+)?|divide-[xy](?:-\d+)?|border-(?:border|border-hover|accent|foreground|muted|transparent|dashed|dotted)|divide-(?:border|accent|foreground|muted))$/,
  },
  {
    id: "UI13", section: "4.1", scope: "class",
    title: "Shadow or ring",
    fix: "The site is flat. Remove it. The only shadow is shadow-device inside DeviceFrame.",
    test: /^(?:shadow(?:-[a-z0-9]+)?|drop-shadow(?:-[a-z0-9]+)?|ring(?:-[a-z0-9]+)?)$/,
    except: /^shadow-none$/,
  },
  {
    id: "UI14", section: "5.6", scope: "class",
    title: "Arbitrary value in product code",
    fix: "Use a scale step or a token. Only grid-cols-[...] / grid-rows-[...] templates inside a recipe are allowed.",
    test: /-\[[^\]]+\]/,
    except: /^(?:[a-z-]+:)*(?:grid-cols|grid-rows)-\[/,
  },
  {
    id: "UI15", section: "5.1", scope: "class",
    title: "Content width other than max-w-5xl or max-w-intro",
    fix: "Use Section for the container (max-w-5xl) and Text variant=intro for 60ch.",
    test: /^(?:container|max-w-(?:xs|sm|md|lg|xl|2xl|3xl|4xl|6xl|7xl|prose|screen-[a-z]+))$/,
  },
  {
    id: "UI16", section: "5.8", scope: "class",
    title: "Width that can force sideways scroll at 390px",
    fix: "Use fluid layout (grid/flex, w-full). Do not use w-screen, min-w-screen or horizontal scroll.",
    test: /^(?:w-screen|min-w-screen|overflow-x-(?:scroll|auto)|min-w-max)$/,
  },
  {
    id: "UI17", section: "7.1", scope: "class",
    title: "Hover scale, translate, rotate or looping animation",
    fix: "Hover is a colour or border change only. Entrances use Reveal.",
    test: /^(?:(?:group-)?hover:(?:-?scale|-?translate|-?rotate)|animate-(?!none)|transition-transform$)/,
  },
  {
    id: "UI18", section: "10.1", scope: "class",
    title: "dark: variant",
    fix: "Tokens already flip with prefers-color-scheme. Use a token instead of a dark: override.",
    test: /^dark:/,
  },
  {
    id: "UI19", section: "0.2", scope: "class",
    title: "Token colour utility written by hand in product code",
    fix: "Use a wrapper (Text for text colour, Card/Button/Tag for fills). Colour utilities live in src/components/ds/.",
    test: new RegExp(`^(?:text|bg|border|ring|fill|stroke)-(?:${TOKENS})$`),
  },
];

export const ELEMENT_RULES: Rule[] = [
  {
    id: "UI20", section: "2.3", scope: "element",
    title: "Raw heading or paragraph element",
    fix: "Use Heading (page, section, card, card-featured) or Text (intro, body, small).",
    tags: ["h1", "h2", "h3", "h4", "h5", "h6", "p"],
  },
  {
    id: "UI21", section: "6.3", scope: "element",
    title: "Raw button element",
    fix: "Use Button variant=primary|outline (href for links, onClick for actions).",
    tags: ["button"],
  },
];

export const TEXT_RULES: Rule[] = [
  {
    id: "UI22", section: "6.5", scope: "text",
    title: "Emoji or decorative symbol in copy",
    fix: "Use a Phosphor icon (14/16/18/20px) or no symbol. Text copy is plain.",
    test: /[\p{Extended_Pictographic}←-⇿☀-➿⬀-⯿•●▶]/u,
  },
  {
    id: "UI23", section: "8.2", scope: "text",
    title: "Em dash, en dash or smart quote in copy",
    fix: "Use a comma, colon, period or a plain ASCII hyphen/quote.",
    test: /[—–‘’“”]/,
  },
  {
    id: "UI24", section: "8.1", scope: "text",
    title: "Invented proof or marketing filler",
    fix: "Use only claims already on the site (8.1). Remove stat strips, social proof and hype words.",
    test: /\b(?:trusted by|testimonials?|\d[\d,.]*\s?[kKmM]?\+?\s+(?:happy |active |satisfied )?(?:users|customers|clients|developers|downloads|stars|companies)|supercharge|revolutionary|seamless(?:ly)?|cutting-edge|game-?chang(?:ing|er)|unlock|10x|learn more|get started)\b/i,
  },
];

export const STYLE_RULE: Rule = {
  id: "UI25", section: "5.7", scope: "style",
  title: "Inline style with a static value",
  fix: "Use a class from the vocabulary. style is only for values computed at runtime.",
};

export const ALL_RULES: Rule[] = [...CLASS_RULES, ...ELEMENT_RULES, ...TEXT_RULES, STYLE_RULE];
