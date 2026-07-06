require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const Product = require("../models/productSchema");

const image = (seed) => `https://picsum.photos/seed/${seed}/416/416`;
const detailImage = (seed) => `https://picsum.photos/seed/${seed}/832/832`;

const products = [
  {
    url: image("oneplus-nord"),
    detailUrl: detailImage("oneplus-nord"),
    title: { shortTitle: "OnePlus Nord CE 3 Lite 5G", longTitle: "OnePlus Nord CE 3 Lite 5G (Chromatic Gray, 128 GB)" },
    price: { mrp: 24999, cost: 19999, discount: "20%" },
    discount: "Extra ₹1000 off",
    tagline: "Trending",
    category: "mobile",
    qty: 50,
  },
  {
    url: image("realme-narzo"),
    detailUrl: detailImage("realme-narzo"),
    title: { shortTitle: "realme narzo 60 5G", longTitle: "realme narzo 60 5G (Mars Orange, 128 GB)" },
    price: { mrp: 12999, cost: 17999, discount: "28%" },
    discount: "Bank Offer",
    tagline: "Best Seller",
    category: "mobile",
    qty: 40,
  },
  {
    url: image("samsung-m14"),
    detailUrl: detailImage("samsung-m14"),
    title: { shortTitle: "Samsung Galaxy M14 5G", longTitle: "Samsung Galaxy M14 5G (Smoky Teal, 128 GB)" },
    price: { mrp: 13499, cost: 18999, discount: "29%" },
    discount: "Extra ₹1500 off",
    tagline: "Trending",
    category: "mobile",
    qty: 35,
  },
  {
    url: image("redmi-note12"),
    detailUrl: detailImage("redmi-note12"),
    title: { shortTitle: "Redmi Note 12 Pro 5G", longTitle: "Redmi Note 12 Pro 5G (Onyx Black, 128 GB)" },
    price: { mrp: 18999, cost: 26999, discount: "30%" },
    discount: "Exchange Offer",
    tagline: "Hot Deal",
    category: "mobile",
    qty: 45,
  },
  {
    url: image("poco-x5"),
    detailUrl: detailImage("poco-x5"),
    title: { shortTitle: "POCO X5 Pro 5G", longTitle: "POCO X5 Pro 5G (Horizon Blue, 256 GB)" },
    price: { mrp: 21999, cost: 29999, discount: "27%" },
    discount: "No Cost EMI",
    tagline: "Trending",
    category: "mobile",
    qty: 30,
  },
  {
    url: image("motorola-g54"),
    detailUrl: detailImage("motorola-g54"),
    title: { shortTitle: "Motorola G54 5G", longTitle: "Motorola G54 5G (Mint Green, 128 GB)" },
    price: { mrp: 14999, cost: 19999, discount: "25%" },
    discount: "Extra ₹500 off",
    tagline: "New Launch",
    category: "mobile",
    qty: 25,
  },
  {
    url: image("vivo-t2"),
    detailUrl: detailImage("vivo-t2"),
    title: { shortTitle: "vivo T2 5G", longTitle: "vivo T2 5G (Glimmer Black, 128 GB)" },
    price: { mrp: 16999, cost: 22999, discount: "26%" },
    discount: "Bank Offer",
    tagline: "Best Seller",
    category: "mobile",
    qty: 38,
  },
  {
    url: image("oppo-a78"),
    detailUrl: detailImage("oppo-a78"),
    title: { shortTitle: "OPPO A78 5G", longTitle: "OPPO A78 5G (Glowing Blue, 128 GB)" },
    price: { mrp: 15999, cost: 21999, discount: "27%" },
    discount: "Extra ₹800 off",
    tagline: "Trending",
    category: "mobile",
    qty: 42,
  },
  {
    url: image("boat-headphone"),
    detailUrl: detailImage("boat-headphone"),
    title: { shortTitle: "boAt Rockerz 450", longTitle: "boAt Rockerz 450 Bluetooth Headset" },
    price: { mrp: 1499, cost: 3990, discount: "62%" },
    discount: "Extra ₹100 off",
    tagline: "Best Seller",
    category: "electronic",
    qty: 100,
  },
  {
    url: image("noise-buds"),
    detailUrl: detailImage("noise-buds"),
    title: { shortTitle: "Noise Buds VS104 Pro", longTitle: "Noise Buds VS104 Pro Bluetooth Headset" },
    price: { mrp: 999, cost: 3499, discount: "71%" },
    discount: "Bank Offer",
    tagline: "Trending",
    category: "electronic",
    qty: 80,
  },
  {
    url: image("asus-vivobook"),
    detailUrl: detailImage("asus-vivobook"),
    title: { shortTitle: "ASUS VivoBook 15", longTitle: "ASUS VivoBook 15 Core i3 11th Gen Thin and Light Laptop" },
    price: { mrp: 34990, cost: 52990, discount: "34%" },
    discount: "No Cost EMI",
    tagline: "Hot Deal",
    category: "electronic",
    qty: 15,
  },
  {
    url: image("realme-pad"),
    detailUrl: detailImage("realme-pad"),
    title: { shortTitle: "realme Pad 2", longTitle: "realme Pad 2 Wi-Fi Android Tablet" },
    price: { mrp: 19999, cost: 29999, discount: "33%" },
    discount: "Exchange Offer",
    tagline: "New Launch",
    category: "electronic",
    qty: 20,
  },
  {
    url: image("jbl-speaker"),
    detailUrl: detailImage("jbl-speaker"),
    title: { shortTitle: "JBL Go 3 Bluetooth Speaker", longTitle: "JBL Go 3 Portable Bluetooth Speaker" },
    price: { mrp: 2999, cost: 3999, discount: "25%" },
    discount: "Extra ₹200 off",
    tagline: "Best Seller",
    category: "electronic",
    qty: 60,
  },
  {
    url: image("fireboltt-watch"),
    detailUrl: detailImage("fireboltt-watch"),
    title: { shortTitle: "Fire-Boltt Ninja Call Pro", longTitle: "Fire-Boltt Ninja Call Pro Smartwatch" },
    price: { mrp: 1999, cost: 9999, discount: "80%" },
    discount: "Bank Offer",
    tagline: "Trending",
    category: "electronic",
    qty: 75,
  },
  {
    url: image("mi-powerbank"),
    detailUrl: detailImage("mi-powerbank"),
    title: { shortTitle: "Mi 20000mAh Power Bank", longTitle: "Mi 20000mAh Power Bank 3i" },
    price: { mrp: 1899, cost: 2499, discount: "24%" },
    discount: "Extra ₹100 off",
    tagline: "Best Seller",
    category: "electronic",
    qty: 90,
  },
  {
    url: image("samsung-washer"),
    detailUrl: detailImage("samsung-washer"),
    title: { shortTitle: "Samsung 7 kg Washing Machine", longTitle: "Samsung 7 kg Fully Automatic Top Load Washing Machine" },
    price: { mrp: 15990, cost: 22990, discount: "30%" },
    discount: "Exchange Offer",
    tagline: "Hot Deal",
    category: "appliances",
    qty: 12,
  },
  {
    url: image("lg-fridge"),
    detailUrl: detailImage("lg-fridge"),
    title: { shortTitle: "LG 260 L Refrigerator", longTitle: "LG 260 L Direct Cool Single Door Refrigerator" },
    price: { mrp: 18990, cost: 26990, discount: "30%" },
    discount: "No Cost EMI",
    tagline: "Trending",
    category: "appliances",
    qty: 10,
  },
  {
    url: image("ifb-microwave"),
    detailUrl: detailImage("ifb-microwave"),
    title: { shortTitle: "IFB 25 L Convection Microwave", longTitle: "IFB 25 L Convection Microwave Oven" },
    price: { mrp: 9990, cost: 14990, discount: "33%" },
    discount: "Bank Offer",
    tagline: "Best Seller",
    category: "appliances",
    qty: 18,
  },
  {
    url: image("mi-airpurifier"),
    detailUrl: detailImage("mi-airpurifier"),
    title: { shortTitle: "Mi Air Purifier 4", longTitle: "Mi Air Purifier 4 with True HEPA Filter" },
    price: { mrp: 9999, cost: 14999, discount: "33%" },
    discount: "Extra ₹500 off",
    tagline: "New Launch",
    category: "appliances",
    qty: 22,
  },
  {
    url: image("aquaguard"),
    detailUrl: detailImage("aquaguard"),
    title: { shortTitle: "Aquaguard Sure Water Purifier", longTitle: "Aquaguard Sure from Aquaguard Water Purifier" },
    price: { mrp: 8999, cost: 13999, discount: "36%" },
    discount: "Exchange Offer",
    tagline: "Trending",
    category: "appliances",
    qty: 14,
  },
  {
    url: image("dining-table"),
    detailUrl: detailImage("dining-table"),
    title: { shortTitle: "Kendalwood 4 Seater Dining Table", longTitle: "Kendalwood Furniture Solid Wood 4 Seater Dining Table" },
    price: { mrp: 15000, cost: 6501, discount: "56%" },
    discount: "Extra ₹723 off",
    tagline: "Trending",
    category: "furniture",
    qty: 8,
  },
  {
    url: image("wakefit-sofa"),
    detailUrl: detailImage("wakefit-sofa"),
    title: { shortTitle: "Wakefit 3 Seater Sofa", longTitle: "Wakefit Fabric 3 Seater Sofa" },
    price: { mrp: 18999, cost: 32999, discount: "42%" },
    discount: "No Cost EMI",
    tagline: "Best Seller",
    category: "furniture",
    qty: 6,
  },
  {
    url: image("wakefit-bed"),
    detailUrl: detailImage("wakefit-bed"),
    title: { shortTitle: "Wakefit Queen Size Bed", longTitle: "Wakefit Sheesham Wood Queen Size Bed" },
    price: { mrp: 12999, cost: 24999, discount: "48%" },
    discount: "Bank Offer",
    tagline: "Hot Deal",
    category: "furniture",
    qty: 9,
  },
  {
    url: image("office-chair"),
    detailUrl: detailImage("office-chair"),
    title: { shortTitle: "Green Soul Office Chair", longTitle: "Green Soul Jupiter Superb Office Chair" },
    price: { mrp: 8999, cost: 18999, discount: "53%" },
    discount: "Extra ₹400 off",
    tagline: "Trending",
    category: "furniture",
    qty: 20,
  },
  {
    url: image("wardrobe"),
    detailUrl: detailImage("wardrobe"),
    title: { shortTitle: "HomeTown 3 Door Wardrobe", longTitle: "HomeTown Engineered Wood 3 Door Wardrobe" },
    price: { mrp: 9999, cost: 17999, discount: "44%" },
    discount: "Exchange Offer",
    tagline: "New Launch",
    category: "furniture",
    qty: 11,
  },
];

async function seed() {
  const forceReseed = process.argv.includes("--force");

  try {
    await mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const existingCount = await Product.countDocuments();
    if (existingCount > 0 && !forceReseed) {
      console.log(`Database already has ${existingCount} products. Skipping seed.`);
      console.log("Run with --force to replace all products.");
      process.exit(0);
    }

    if (forceReseed) {
      await Product.deleteMany({});
      console.log("Cleared existing products.");
    }

    const normalizedProducts = products.map((product) => {
      if (product.price.mrp < product.price.cost) {
        return {
          ...product,
          price: {
            ...product.price,
            mrp: product.price.cost,
            cost: product.price.mrp,
          },
        };
      }
      return product;
    });

    await Product.insertMany(normalizedProducts);
    console.log(`Seeded ${normalizedProducts.length} products successfully.`);
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
}

seed();
