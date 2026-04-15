const fs = require("fs");
const path = require("path");
const {
  initializeDatabase,
  clearProducts,
  bulkInsertProducts,
  db,
} = require("./db");

const PRODUCTS_FILE = path.join(__dirname, "products.json");

/**
 * Reads products.json and bulk-inserts into DB.
 * Clears existing products first (full reseed).
 */
async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    await initializeDatabase();
    console.log("✓ Database initialized");

    if (!fs.existsSync(PRODUCTS_FILE)) {
      console.error("✗ products.json not found!");
      process.exit(1);
    }

    const data = fs.readFileSync(PRODUCTS_FILE, "utf8");
    const products = JSON.parse(data);

    console.log(`✓ Loaded ${products.length} products`);

    await clearProducts();
    console.log("✓ Cleared existing products");

    const formattedProducts = products.map((p) => ({
      title: p.title,
      description: p.description,
      price: p.price,
      category: p.category,
      rating: p.rating || 0,
      stock: p.stock || 0,
      brand: p.brand,
      image: p.image || "",
      createdAt: p.createdAt
        ? new Date(p.createdAt).toISOString()
        : new Date().toISOString(),
    }));

    await bulkInsertProducts(formattedProducts);

    console.log(`✓ Inserted ${products.length} products`);
    console.log("✨ Database seeding completed successfully!");

    process.exit(0);
  } catch (error) {
    console.error("✗ Seeding failed:", error);
    process.exit(1);
  }
}

/**
 * Auto-seed on startup: only seeds if the products table is empty.
 * Called by server.js on every boot — safe to call repeatedly.
 * On Render, SQLite is wiped on restart, so this re-populates data automatically.
 */
async function seedIfEmpty() {
  try {
    if (!fs.existsSync(PRODUCTS_FILE)) {
      console.warn("⚠️  products.json not found — skipping auto-seed");
      return;
    }

    const countRes = await db.execute("SELECT COUNT(*) as total FROM products");
    const total = Number(countRes.rows[0].total);

    if (total > 0) {
      console.log(`✓ DB already has ${total} products — skipping seed`);
      return;
    }

    console.log("🌱 DB is empty — auto-seeding from products.json...");

    const data = fs.readFileSync(PRODUCTS_FILE, "utf8");
    const products = JSON.parse(data);

    const formattedProducts = products.map((p) => ({
      title: p.title,
      description: p.description,
      price: p.price,
      category: p.category,
      rating: p.rating || 0,
      stock: p.stock || 0,
      brand: p.brand,
      image: p.image || "",
      createdAt: p.createdAt
        ? new Date(p.createdAt).toISOString()
        : new Date().toISOString(),
    }));

    await bulkInsertProducts(formattedProducts);
    console.log(`✅ Auto-seeded ${products.length} products successfully!`);
  } catch (err) {
    console.error("✗ Auto-seed failed:", err);
    // Don't crash the server — just log the error
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, seedIfEmpty };
