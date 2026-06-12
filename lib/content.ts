import contentJson from "@/data/content.json";

export interface Fact {
  label: string;
  value: string;
}

export interface Capability {
  track: string;
  title: string;
  body: string;
}

export interface Social {
  label: string;
  href: string;
}

export interface SiteContent {
  hero: {
    kicker: string;
    /** Supports **bold** markers — rendered as accent-colored text */
    tagline: string;
  };
  about: {
    /** Supports **bold** markers — rendered as accent-colored text */
    bio: string;
    subBio: string;
    facts: Fact[];
  };
  capabilities: Capability[];
  contact: {
    email: string;
    intro: string;
    socials: Social[];
  };
  footer: {
    kicker: string;
  };
}

export const content = contentJson as SiteContent;
