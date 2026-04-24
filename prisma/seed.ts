import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Using Unsplash source URLs as placeholders so the site looks alive
// before real Cloudinary uploads. Replace via admin gallery page.
const galleryItems = [
  {
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
    title: "Rose & Ivory Wedding Mandap",
    description: "Classic south-Indian mandap with blush roses, ivory drapes, and gold accent columns.",
    eventType: "wedding",
    featured: true,
    displayOrder: 1,
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=80",
    title: "Golden 60th Birthday",
    description: "A radiant 60th celebration with gold & burgundy balloons and a custom name backdrop.",
    eventType: "birthday",
    featured: true,
    displayOrder: 2,
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=1200&q=80",
    title: "Pastel Baby Shower",
    description: "Dreamy pink-and-mint baby shower with a paper-flower arch and hanging crib.",
    eventType: "baby_shower",
    featured: true,
    displayOrder: 3,
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80",
    title: "Corporate Launch Stage",
    description: "Sleek corporate product-launch stage with LED panels and minimal floral accents.",
    eventType: "corporate",
    featured: false,
    displayOrder: 4,
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1522413452208-996ff3f3e740?w=1200&q=80",
    title: "Silver Anniversary Night",
    description: "Silver-themed 25th anniversary with candlelight, white orchids, and a crystal centerpiece.",
    eventType: "anniversary",
    featured: false,
    displayOrder: 5,
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80",
    title: "Sweet Sixteen Terrace",
    description: "A pastel-lavender Sweet 16 on a rooftop with fairy lights, balloons, and a dessert table.",
    eventType: "birthday",
    featured: false,
    displayOrder: 6,
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=1200&q=80",
    title: "Retirement Garden Toast",
    description: "An intimate retirement garden party with bistro lights and wooden-crate flower arrangements.",
    eventType: "retirement",
    featured: false,
    displayOrder: 7,
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1200&q=80",
    title: "Floral Haldi Setup",
    description: "Yellow marigold haldi ceremony with traditional paisley backdrop and low seating.",
    eventType: "wedding",
    featured: false,
    displayOrder: 8,
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=1200&q=80",
    title: "Garden Reception Dinner",
    description: "Long-table garden reception with greenery runners and hurricane candle lanterns.",
    eventType: "wedding",
    featured: false,
    displayOrder: 9,
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80",
    title: "Baby Boy Blue Shower",
    description: "Powder-blue clouds, baby-breath flowers, and a welcome-baby balloon sign.",
    eventType: "baby_shower",
    featured: false,
    displayOrder: 10,
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=1200&q=80",
    title: "Corporate Year-End Gala",
    description: "Black-tie corporate gala with mirror tables, candelabras, and burgundy florals.",
    eventType: "corporate",
    featured: false,
    displayOrder: 11,
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80",
    title: "Bridal Shower Brunch",
    description: "A bright bridal-shower brunch with peach roses, rattan chairs, and a floral welcome sign.",
    eventType: "wedding",
    featured: false,
    displayOrder: 12,
  },
];

const feedbackItems = [
  {
    name: "Priya & Arjun",
    eventType: "wedding",
    rating: 5,
    message:
      "Jesuraj and his team turned our wedding hall into something from a dream. Every petal placed with intention, every drape perfectly pleated. Guests are still talking about it.",
    approved: true,
    featured: true,
  },
  {
    name: "Meera S.",
    eventType: "baby_shower",
    rating: 5,
    message:
      "Our baby shower was magical. The pastel theme was exactly what I pictured, and they handled last-minute requests without a single complaint. Highly recommend.",
    approved: true,
    featured: true,
  },
  {
    name: "Deloitte HR Team",
    eventType: "corporate",
    rating: 5,
    message:
      "Professional, on-time, stunning. The launch stage looked premium without being flashy — exactly the tone we wanted. We've booked them for our next gala.",
    approved: true,
    featured: true,
  },
  {
    name: "Anish K.",
    eventType: "birthday",
    rating: 5,
    message:
      "They decorated my father's 60th with incredible warmth. The gold and burgundy theme felt classic and celebratory at the same time. Dad was in tears.",
    approved: true,
    featured: false,
  },
  {
    name: "Ramya V.",
    eventType: "anniversary",
    rating: 5,
    message:
      "Silver anniversary decor was beyond expectations. The candlelight setup transformed our living room into a banquet.",
    approved: true,
    featured: false,
  },
];

const inquiryItems = [
  {
    name: "Priya Menon",
    email: "priya.m@example.com",
    phone: "+91 98765 12345",
    eventType: "wedding",
    eventDate: new Date("2026-06-18"),
    guestCount: 250,
    venueSize: "large",
    message: "Traditional south-Indian wedding, looking for a mandap with floral work and a reception stage.",
    estimatedCost: 210000,
    status: "new",
    source: "contact",
  },
  {
    name: "Anish Kumar",
    email: "anish.k@example.com",
    phone: "+91 98123 45678",
    eventType: "birthday",
    eventDate: new Date("2026-05-12"),
    guestCount: 80,
    venueSize: "medium",
    message: "Father's 60th birthday. Gold and burgundy palette, classic vibe.",
    estimatedCost: 65000,
    status: "followup",
    source: "pricing",
  },
  {
    name: "Deloitte HR",
    email: "events@deloitte.example.com",
    phone: "+91 44 1234 5678",
    eventType: "corporate",
    eventDate: new Date("2026-05-05"),
    guestCount: 150,
    venueSize: "large",
    message: "Product launch + cocktail hour. Need stage, entrance arch, and lounge seating decor.",
    estimatedCost: 140000,
    status: "booked",
    source: "contact",
  },
  {
    name: "Meera S.",
    email: "meera.s@example.com",
    phone: "+91 99887 66554",
    eventType: "baby_shower",
    eventDate: new Date("2026-05-02"),
    guestCount: 40,
    venueSize: "small",
    message: "Pastel theme baby shower at home. Floral arch and cake table setup.",
    estimatedCost: 42000,
    status: "booked",
    source: "pricing",
  },
];

const orderItems = [
  {
    customerName: "Deloitte HR",
    customerEmail: "events@deloitte.example.com",
    customerPhone: "+91 44 1234 5678",
    eventType: "corporate",
    eventDate: new Date("2026-05-05"),
    venueAddress: "ITC Grand Chola, Chennai",
    guestCount: 150,
    totalAmount: 140000,
    advancePaid: 70000,
    status: "confirmed",
    notes: "Launch + cocktails. Setup by 2pm on event day.",
  },
  {
    customerName: "Meera Sundaram",
    customerEmail: "meera.s@example.com",
    customerPhone: "+91 99887 66554",
    eventType: "baby_shower",
    eventDate: new Date("2026-05-02"),
    venueAddress: "Adyar, Chennai",
    guestCount: 40,
    totalAmount: 42000,
    advancePaid: 21000,
    status: "in_progress",
    notes: "Pastel pink/mint. Morning setup at 10am.",
  },
];

async function main() {
  console.log("Seeding database...");

  // Clear existing data (safe for dev only)
  await prisma.feedback.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.inquiry.deleteMany();

  for (const g of galleryItems) await prisma.galleryItem.create({ data: g });
  for (const f of feedbackItems) await prisma.feedback.create({ data: f });
  for (const i of inquiryItems) await prisma.inquiry.create({ data: i });
  for (const o of orderItems) await prisma.order.create({ data: o });

  console.log(
    `Done — ${galleryItems.length} gallery, ${feedbackItems.length} feedback, ${inquiryItems.length} inquiries, ${orderItems.length} orders.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
