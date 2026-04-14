const { db, initializeDatabase } = require("./db");

const CATEGORY_IMAGES = {
  "Electronics": [
    "https://images.unsplash.com/photo-1510557880182-3d4d3cba30a8?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop"
  ],
  "Clothing": [
    "https://images.unsplash.com/photo-1523381235208-175e260654ec?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1445205170230-053b830c6050?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1521311589143-8ef9935820cf?q=80&w=1000&auto=format&fit=crop"
  ],
  "Books": [
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=1000&auto=format&fit=crop"
  ],
  "Sports": [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1000&auto=format&fit=crop"
  ],
  "Home": [
    "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583847268964-b28dc2f51ac9?q=80&w=1000&auto=format&fit=crop"
  ],
  "Beauty": [
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop"
  ],
  "Toys": [
    "https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1537733314975-7b96e04772d6?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1566576628333-47a525d3dfbc?q=80&w=1000&auto=format&fit=crop"
  ]
};

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop"
];

async function aestheticize() {
  console.log("🚀 Starting database aestheticization...");
  
  try {
    const res = await db.execute("SELECT id, title, category FROM products");
    const products = res.rows;
    
    console.log(`Found ${products.length} products to process.`);
    
    let updatedCount = 0;
    for (const p of products) {
      const categoryImages = CATEGORY_IMAGES[p.category] || DEFAULT_IMAGES;
      // Use id to pick a semi-random but stable image from the array
      const imageUrl = categoryImages[p.id % categoryImages.length];
      
      await db.execute({
        sql: "UPDATE products SET image = ? WHERE id = ?",
        args: [imageUrl, p.id]
      });
      updatedCount++;
      if (updatedCount % 20 === 0) console.log(`✓ Processed ${updatedCount} fragments...`);
    }
    
    console.log(`✨ Successfully aestheticized ${updatedCount} products with high-res photography!`);
  } catch (err) {
    console.error("❌ Aestheticization failed:", err);
  }
}

aestheticize();
