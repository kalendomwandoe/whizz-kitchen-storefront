export interface FaqItem {
  question: string;
  answer: string[];
  whatsappCta?: string; // label for an optional "message us on WhatsApp" link under the answer
}

export interface FaqGroup {
  title: string;
  items: FaqItem[];
}

export const FAQ_GROUPS: FaqGroup[] = [
  {
    title: "About Whizz Kitchen",
    items: [
      {
        question: "Who is Chef Whizzy?",
        answer: [
          "Chef Whizzy is the founder of Whizz Kitchen, a chef whose passion for good food and culinary creativity inspired the brand. Having worked as an Executive Chef at prestigious hospitality establishments, including JW Marriott and St. Regis, he brings professional culinary experience and a love for bold flavours to Whizz Kitchen.",
          "The name “Chef Whizzy” was given to him by people who worked under him and experienced his culinary creativity firsthand.",
        ],
      },
      {
        question: "What does Whizz Kitchen offer?",
        answer: [
          "Whizz Kitchen brings culinary creativity closer to your everyday life through our signature Beefire Sauce, other sauces, recipes, food inspiration, and branded merchandise. We’re passionate about helping you explore flavour and make your food experiences more exciting.",
        ],
      },
    ],
  },
  {
    title: "Products",
    items: [
      {
        question: "What can I use all Whizz Kitchen sauces with?",
        answer: [
          "Our sauces can inspire a variety of meals, depending on the sauce and its flavour profile. Explore our recipes for ideas on how to incorporate them into your cooking. For specific serving suggestions, check the individual product details or contact us for guidance.",
        ],
      },
      {
        question: "What are the ingredients, and are the sauces suitable for my dietary needs?",
        answer: [
          "Ingredients and dietary suitability can vary from one sauce to another. Please check the product label or product page for the relevant ingredient information. If you have allergies, intolerances, or specific dietary requirements, contact us before ordering so you can confirm the details for the particular sauce.",
        ],
        whatsappCta: "Ask about ingredients on WhatsApp",
      },
    ],
  },
  {
    title: "Orders and Payments",
    items: [
      {
        question: "How do I place an order?",
        answer: [
          // Reworded: the site has a cart and checkout, so ordering no longer starts on WhatsApp.
          "Ordering is simple! Browse our products, add what you like to your cart and check out, either as a guest or with an account. Once your order is placed, our team will contact you on WhatsApp to confirm product availability, pricing, and the next steps for completing your purchase.",
        ],
        whatsappCta: "Have a question first? Message us on WhatsApp",
      },
      {
        question: "Which payment methods do you accept?",
        answer: [
          // Reworded to match the checkout flow.
          "Once you place your order, our team will confirm the available payment methods and guide you through the payment process.",
        ],
      },
    ],
  },
  {
    title: "Delivery and Collection",
    items: [
      {
        question: "Do you offer delivery?",
        answer: [
          "Please contact us on WhatsApp to confirm delivery availability for your location. Our team will let you know the available arrangements and estimated delivery timeframe for your order.",
        ],
        whatsappCta: "Ask about delivery on WhatsApp",
      },
      {
        question: "How much does delivery cost?",
        answer: [
          "Delivery charges may vary depending on your location and the delivery arrangements. Contact us on WhatsApp with your location and order details, and our team will confirm the applicable delivery fee before you proceed.",
        ],
        whatsappCta: "Ask about delivery fees on WhatsApp",
      },
    ],
  },
  {
    title: "Recipes and Merchandise",
    items: [
      {
        question: "Do I need to be an experienced cook to follow your recipes?",
        answer: [
          "Not at all! Our recipes are here to inspire you in the kitchen, whether you’re trying something new or experimenting with familiar favourites. Follow the instructions provided and explore new ways to bring more flavour to your meals.",
        ],
      },
      {
        question: "Do you sell Whizz Kitchen merchandise?",
        answer: [
          // Reworded to match the checkout flow.
          "Yes! Whizz Kitchen merchandise is part of our brand. Explore the Merchandise section of our shop to see what’s available and add your favourites to your cart. Our team will confirm availability with you on WhatsApp.",
        ],
      },
    ],
  },
];