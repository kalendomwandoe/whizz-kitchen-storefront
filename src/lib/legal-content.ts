import { SITE, formatPhoneDisplay } from "@/lib/site";

export interface LegalSection {
  heading: string;
  paragraphs?: string[]; // shown first
  bullets?: string[];
  closing?: string[]; // shown after the bullets
}

export interface LegalDoc {
  title: string;
  lastUpdated: string;
  intro: string[];
  sections: LegalSection[];
}

// Update this when the wording changes (for example after legal review).
const LAST_UPDATED = "10 October 2026";

const contactLines: string[] = [
  SITE.email ? `Email: ${SITE.email}` : "",
  SITE.phone ? `Phone / WhatsApp: ${formatPhoneDisplay(SITE.phone)}` : "",
].filter(Boolean);

export const PRIVACY_POLICY: LegalDoc = {
  title: "Privacy Policy",
  lastUpdated: LAST_UPDATED,
  intro: [
    "This policy explains how Whizz Kitchen (“we”, “us”) handles your personal information when you use this website, place an order, create an account, post a review, or contact us.",
  ],
  sections: [
    {
      heading: "What we collect",
      paragraphs: ["We collect only what we need to run the website and fulfil your orders:"],
      bullets: [
        "Account details: your name, email address, phone number (optional) and password. We store passwords in a scrambled form, never as readable text.",
        "Order details: your name, phone number, delivery address and the items you ordered. This applies whether you check out as a guest or with an account.",
        "Your cart: items you add to your cart are saved on our servers so they are still there when you come back.",
        "Reviews: your name, star rating and comment. Reviews are shown publicly on the product page.",
        "Messages: anything you send us by email, phone or WhatsApp.",
        "Technical information: like most websites, our servers record basic details such as your IP address, browser type and the time of each request. We use this for security and troubleshooting.",
      ],
    },
    {
      heading: "Payments",
      paragraphs: [
        "We don't currently take card or mobile-money payments on this website. Payment is arranged directly with us after you place an order, so we don't collect or store your card or mobile-money details through the site. If this changes, we'll update this policy.",
      ],
    },
    {
      heading: "How we use your information",
      bullets: [
        "To take, confirm and deliver your orders, including contacting you on WhatsApp or by phone about them.",
        "To create and manage your account, including sending verification and password-reset emails.",
        "To answer your questions and requests.",
        "To publish the reviews you post.",
        "To keep the website secure and prevent fraud, spam and abuse.",
        "To fix problems and improve the website.",
        "To meet our legal and record-keeping obligations.",
      ],
      closing: [
        "We do not sell your personal information. We don't currently send marketing emails or show targeted advertising. If that changes, we'll update this policy and give you a way to opt out.",
      ],
    },
    {
      heading: "Browser storage",
      paragraphs: [
        "To work properly, the website stores small pieces of information in your browser: a sign-in token if you log in, and a random identifier that lets us remember your cart if you aren't logged in. These are not used to track you across other websites. We don't currently use advertising or analytics cookies. If we add them, we'll update this policy.",
      ],
    },
    {
      heading: "Who we share it with",
      paragraphs: ["We share your information only where it's needed:"],
      bullets: [
        "Service providers that help us run the website, such as website hosting, email delivery (for account verification and password-reset emails) and image hosting.",
        "People who deliver your order, so they can reach you and find your address.",
        "Messaging platforms, if you contact us on WhatsApp. Their own privacy policies apply to those conversations.",
        "Authorities, when the law requires it or to protect our rights and safety.",
        "A buyer or successor, if the business is sold or merged.",
        "Anyone you ask us to share it with.",
      ],
      closing: [
        "Anything you post publicly, such as a review, can be seen and copied by others. We do not sell your personal information.",
      ],
    },
    {
      heading: "How long we keep it",
      paragraphs: [
        "We keep your information only for as long as we need it for the purposes above, for example to fulfil your order, keep our business and tax records, and meet legal obligations. When we no longer need it, we will delete it or make it anonymous.",
      ],
    },
    {
      heading: "Your rights",
      paragraphs: [
        "You have rights over your personal information, including under Kenya's Data Protection Act, 2019. In general, you can ask us to:",
      ],
      bullets: [
        "tell you what personal information we hold about you;",
        "correct information that is wrong or out of date;",
        "delete your information (we may need to keep some records, such as order records, to meet legal obligations);",
        "stop using your information for a particular purpose, or object to how we use it.",
      ],
      closing: [
        "You can update your name, email address and phone number yourself from your account at any time. To make any other request, contact us using the details below. We may need to confirm your identity first.",
        "If you're not happy with how we've handled your information, please tell us first so we can put it right. You also have the right to complain to the Office of the Data Protection Commissioner in Kenya.",
      ],
    },
    {
      heading: "Security",
      paragraphs: [
        "We use reasonable safeguards to protect your information, but no online system is completely secure.",
      ],
    },
    {
      heading: "Other websites and services outside Kenya",
      paragraphs: [
        "The website may link to other sites, such as WhatsApp. This policy doesn't cover them.",
        "Some of the services we use, such as website hosting and email delivery, may process information on servers outside Kenya. We choose providers carefully and expect them to protect your information.",
      ],
    },
    {
      heading: "Children",
      paragraphs: [
        "This website is not intended for anyone under 18. If we learn that we've collected a child's information, we'll delete it.",
      ],
    },
    {
      heading: "Changes to this policy",
      paragraphs: [
        "We may update this policy from time to time. The date at the top shows when it was last changed. Continuing to use the website after a change means you accept the updated policy.",
      ],
    },
    {
      heading: "Contact us",
      paragraphs: [
        "If you have questions about this policy or want to make a request about your information, contact us:",
      ],
      bullets: contactLines,
    },
  ],
};

export const TERMS_OF_USE: LegalDoc = {
  title: "Terms of Use",
  lastUpdated: LAST_UPDATED,
  intro: [
    "These terms apply when you use this website (the “Site”), which is operated by Whizz Kitchen (“we”, “us”). By using the Site, you agree to them. If you don't agree, please don't use the Site.",
  ],
  sections: [
    {
      heading: "Who can use the Site",
      paragraphs: ["You must be at least 18 years old to use the Site or place an order."],
    },
    {
      heading: "Your account",
      paragraphs: [
        "You don't need an account to place an order, but you can create one. Give us accurate information and keep your password private. You are responsible for what happens under your account. You can ask us to delete your account at any time, and we may suspend or close accounts that break these terms.",
      ],
    },
    {
      heading: "Orders, prices and availability",
      paragraphs: [
        "Placing an order on the Site is a request to buy, not a guarantee. An order is only confirmed once we confirm it with you, usually by WhatsApp or phone.",
        "Prices are shown in Kenya shillings (KES). Prices and availability can change. We'll confirm the final price, including any delivery fee, before you pay. Products marked “Coming soon” can't be ordered yet.",
        "We may decline or cancel an order, for example if an item is unavailable or we can't deliver to your location, and we'll let you know if we do.",
        "Payment and delivery arrangements are agreed with us after you place your order.",
      ],
    },
    {
      heading: "Food, allergens and product information",
      paragraphs: [
        "We describe our products in good faith, but please always check the product label. If you have allergies, intolerances or specific dietary needs, contact us before ordering so we can confirm the details for the product you're interested in.",
      ],
    },
    {
      heading: "Using the Site",
      paragraphs: ["You get a limited, personal, non-commercial right to use the Site. You may not:"],
      bullets: [
        "copy, sell, modify or commercially exploit the Site or its content;",
        "scrape the Site or use automated tools that put a strain on it;",
        "try to gain unauthorised access to the Site, other people's accounts or our systems;",
        "use the Site in a way that is unlawful, abusive or harmful to others.",
      ],
    },
    {
      heading: "Reviews and anything you post",
      paragraphs: [
        "You keep ownership of the reviews you write, but you give us permission to display them on the Site. Reviews must be honest and respectful, and must not contain abusive language, spam, or other people's personal information. We can remove any review at our discretion.",
      ],
    },
    {
      heading: "Our content",
      paragraphs: [
        "The Site, its recipes, photos, logos, product descriptions and other content belong to Whizz Kitchen or our suppliers. You may not use them without our permission. If you give us feedback, we can use it freely without credit or payment.",
      ],
    },
    {
      heading: "Privacy",
      paragraphs: [
        "Our Privacy Policy explains how we handle your personal information and is part of these terms.",
      ],
    },
    {
      heading: "Third-party services",
      paragraphs: [
        "The Site may link to or rely on other services, such as WhatsApp. We don't control them and aren't responsible for them. Your use of them is at your own risk and subject to their own terms.",
      ],
    },
    {
      heading: "Disclaimers",
      paragraphs: [
        "The Site is provided “as is” and “as available”. We don't promise it will always be available, error-free or secure. Nothing in these terms takes away any rights you have under consumer protection law that cannot legally be excluded.",
      ],
    },
    {
      heading: "Limit of liability",
      paragraphs: [
        "To the extent the law allows, we aren't responsible for indirect or consequential losses arising from your use of the Site. Nothing in these terms limits liability that cannot legally be limited.",
      ],
    },
    {
      heading: "Changes and ending access",
      paragraphs: [
        "We may change, suspend or stop any part of the Site at any time, and we may end your access if you break these terms. We may update these terms from time to time; the date at the top shows when they were last changed. Continuing to use the Site means you accept the updated terms.",
      ],
    },
    {
      heading: "Governing law and complaints",
      paragraphs: [
        "These terms are governed by the laws of Kenya. If you have a complaint, please contact us first so we can try to resolve it informally. If we can't, the courts of Kenya have jurisdiction.",
      ],
    },
    {
      heading: "Contact us",
      paragraphs: ["Questions about these terms? Contact us:"],
      bullets: contactLines,
    },
  ],
};