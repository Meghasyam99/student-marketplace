export const CATEGORIES = [
  { id: "books", name: "Books", icon: "book" },
  { id: "laptops", name: "Laptops", icon: "laptop" },
  { id: "calculators", name: "Calculators", icon: "calculator" },
  { id: "mobile-phones", name: "Mobile Phones", icon: "phone" },
  { id: "tablets", name: "Tablets", icon: "tablet" },
  { id: "lab-equipment", name: "Lab Equipment", icon: "eyedropper" },
  { id: "engineering-tools", name: "Engineering Tools", icon: "tools" },
  { id: "study-materials", name: "Study Materials", icon: "journal" },
  { id: "hostel-essentials", name: "Hostel Essentials", icon: "house" },
  { id: "bicycles", name: "Bicycles", icon: "bicycle" },
];

export const MOCK_USERS = [
  {
    id: "u1",
    fullName: "Aarav Sharma",
    collegeName: "Metro Institute of Technology",
    email: "aarav@example.com",
    phone: "+91 90000 00001",
    role: "student",
  },
  {
    id: "u2",
    fullName: "Meera Iyer",
    collegeName: "National College of Engineering",
    email: "meera@example.com",
    phone: "+91 90000 00002",
    role: "student",
  },
  {
    id: "admin",
    fullName: "Admin",
    collegeName: "Campus Marketplace",
    email: "admin@campusmarketplace.local",
    phone: "+91 90000 00099",
    role: "admin",
  },
];

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

export const MOCK_PRODUCTS = [
  {
    id: "p1",
    title: "Calculus Textbook (Like New)",
    categoryId: "books",
    price: 499,
    condition: "Like New",
    description:
      "Latest edition. Clean pages, no highlights. Perfect for first-year engineering.",
    imageUrl:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=60",
    sellerId: "u1",
    postedAt: daysAgo(2),
    flags: { featured: true, trending: true },
  },
  {
    id: "p2",
    title: "Dell Latitude i5 (8GB/256GB SSD)",
    categoryId: "laptops",
    price: 18999,
    condition: "Good",
    description:
      "Battery health is solid, ideal for classes and coding. Includes charger.",
    imageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=60",
    sellerId: "u2",
    postedAt: daysAgo(1),
    flags: { featured: true, trending: false },
  },
  {
    id: "p3",
    title: "Casio FX-991EX Scientific Calculator",
    categoryId: "calculators",
    price: 799,
    condition: "Excellent",
    description:
      "Great for exams and daily problem solving. All buttons work perfectly.",
    imageUrl:
      "https://images.unsplash.com/photo-1589792923962-5e0bba4f6c52?auto=format&fit=crop&w=1200&q=60",
    sellerId: "u1",
    postedAt: daysAgo(6),
    flags: { featured: false, trending: true },
  },
  {
    id: "p4",
    title: "iPad (9th Gen) 64GB",
    categoryId: "tablets",
    price: 19999,
    condition: "Good",
    description:
      "Perfect for note taking. Comes with original box. No major scratches.",
    imageUrl:
      "https://images.unsplash.com/photo-1587033411391-5d9b3c2b4b79?auto=format&fit=crop&w=1200&q=60",
    sellerId: "u2",
    postedAt: daysAgo(10),
    flags: { featured: false, trending: false },
  },
  {
    id: "p5",
    title: "Engineering Drawing Set",
    categoryId: "engineering-tools",
    price: 999,
    condition: "Good",
    description:
      "Includes mini drafter, set squares, compass. Great for first-year drawing.",
    imageUrl:
      "https://images.unsplash.com/photo-1558591710-4b4a1f4b7fd5?auto=format&fit=crop&w=1200&q=60",
    sellerId: "u1",
    postedAt: daysAgo(4),
    flags: { featured: true, trending: false },
  },
  {
    id: "p6",
    title: "Hostel Essentials Bundle",
    categoryId: "hostel-essentials",
    price: 1299,
    condition: "Good",
    description:
      "Extension board + study lamp + storage organizer. Clean and working.",
    imageUrl:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=60",
    sellerId: "u2",
    postedAt: daysAgo(3),
    flags: { featured: false, trending: true },
  },
];

export const MARKETPLACE_STATS = {
  activeListings: 1240,
  registeredStudents: 8320,
  productsSold: 15650,
};

export const TESTIMONIALS = [
  {
    name: "Priya",
    college: "Metro Institute of Technology",
    quote:
      "Sold my old calculator in a day — the UI is super clean and easy to use.",
  },
  {
    name: "Rahul",
    college: "National College of Engineering",
    quote:
      "Found a laptop for my projects at a great price. Loved the wishlist feature.",
  },
  {
    name: "Sneha",
    college: "City College",
    quote:
      "Feels like a real startup product — smooth experience on mobile too.",
  },
];
