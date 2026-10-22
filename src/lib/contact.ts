import data from "@/data/contact.json";

export type ContactType = "email" | "instagram" | "discord" | "youtube";

type ContactInfo = {
  type: ContactType;
  name: string;
  handle: string;
  url?: string; // e-mail não precisa: o link vira mailto:
};

export type ContactChannel = ContactInfo & {
  href: string;
  external: boolean;
};

export const NEW_TAB_HINT = "(abre em nova aba)";

const KNOWN_TYPES = new Set<string>(["email", "instagram", "discord", "youtube"]);

// Um tipo errado deixaria o card sem ícone, e um canal sem link sumiria em silêncio
const channels = (data as ContactInfo[]).flatMap((channel): ContactChannel[] => {
  if (!KNOWN_TYPES.has(channel.type)) {
    console.warn(`[contact] "${channel.name}" tem tipo desconhecido: "${channel.type}"`);
  }

  const href = channel.type === "email" ? `mailto:${channel.handle}` : channel.url;
  if (!href) {
    console.warn(`[contact] "${channel.name}" está sem url`);
    return [];
  }

  return [{ ...channel, href, external: channel.type !== "email" }];
});

export function getContactChannels() {
  return channels;
}
