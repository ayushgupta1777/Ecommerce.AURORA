const { createClient } = require("@libsql/client");
const path = require("path");

const db = createClient({
  url: "file:" + path.join(__dirname, "ecommerce.db"),
});

/**
 * Initialize database
 */
async function initializeDatabase() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      rating REAL DEFAULT 0,
      stock INTEGER DEFAULT 0,
      brand TEXT NOT NULL,
      image TEXT,     
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // RTY IMAGE_TEXT

  // Failsafe: Add image column if it doesn't exist for legacy databases        RTY
  try {
    await db.execute("ALTER TABLE products ADD COLUMN image TEXT");
  } catch (e) {
    // Column likely already exists, ignore error
  }

  // --- NEWLY ADDED: Users and Carts Tables ---
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      email TEXT PRIMARY KEY,
      role TEXT DEFAULT 'user',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS carts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userEmail TEXT NOT NULL,
      productId INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(userEmail, productId),
      FOREIGN KEY(userEmail) REFERENCES users(email),
      FOREIGN KEY(productId) REFERENCES products(id)
    )
  `);
}

/**
 * Get products with filters
 */
async function getProducts(opts = {}) {
  const {
    page = 1,
    limit = 10,
    category,
    minPrice,
    maxPrice,
    rating,
    search,
    sortBy = "createdAt",
    sortOrder = "DESC",
  } = opts;

  let query = "SELECT * FROM products WHERE 1=1";
  let params = [];

  if (category) {
    query += " AND category = ?";
    params.push(category);
  }

  if (minPrice != null) {
    query += " AND price >= ?";
    params.push(minPrice);
  }

  if (maxPrice != null) {
    query += " AND price <= ?";
    params.push(maxPrice);
  }

  if (rating != null) {
    query += " AND rating >= ?";
    params.push(rating);
  }

  if (search) {
    query += " AND (title LIKE ? OR description LIKE ?)";
    const s = `%${search}%`;
    params.push(s, s);
  }

  // Count
  const countRes = await db.execute({
    sql: query.replace("SELECT *", "SELECT COUNT(*) as total"),
    args: params,
  });

  const total = countRes.rows[0].total;

  // Sorting
  const validSort = ["id", "title", "price", "rating", "stock", "createdAt"];
  const field = validSort.includes(sortBy) ? sortBy : "createdAt";
  const order = sortOrder === "ASC" ? "ASC" : "DESC";

  query += ` ORDER BY ${field} ${order} LIMIT ? OFFSET ?`;
  params.push(limit, (page - 1) * limit);

  const res = await db.execute({ sql: query, args: params });

  return {
    total,
    page,
    limit,
    data: res.rows,
  };
}

/**
 * Get product by ID
 */
async function getProductById(id) {
  const res = await db.execute({
    sql: "SELECT * FROM products WHERE id = ?",
    args: [id],
  });

  return res.rows[0] || null;
}

/**
 * Create product
 */
async function createProduct(data) {
  const {
    title,
    description,
    price,
    category,
    rating = 0,
    stock = 0,
    brand,
    image = ""
  } = data;

  const res = await db.execute({
    sql: `
      INSERT INTO products 
      (title, description, price, category, rating, stock, brand, image, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `,
    args: [title, description, price, category, rating, stock, brand, image],
  });

  return { id: res.lastInsertRowid, ...data };
}

/**
 * Update product
 */
async function updateProduct(id, data) {
  const existing = await getProductById(id);
  if (!existing) return null;

  const fields = [];
  const values = [];

  // Build dynamic query
  for (const key in data) {
    fields.push(`${key} = ?`);
    values.push(data[key]);
  }

  // If no fields provided
  if (fields.length === 0) {
    return existing;
  }

  // Add updatedAt
  fields.push("updatedAt = CURRENT_TIMESTAMP");

  const sql = `
    UPDATE products 
    SET ${fields.join(", ")} 
    WHERE id = ?
  `;

  values.push(id);

  await db.execute({
    sql,
    args: values,
  });

  // Return updated record
  return await getProductById(id);
}

/**
 * Delete product
 */
async function deleteProduct(id) {
  const product = await getProductById(id);
  if (!product) return null;

  await db.execute({
    sql: "DELETE FROM products WHERE id=?",
    args: [id],
  });

  return product;
}

/**
 * Get categories
 */
async function getCategories() {
  const res = await db.execute(
    "SELECT DISTINCT category FROM products ORDER BY category",
  );
  return res.rows.map((r) => r.category);
}
/**
 *
 * @param {*} Get product by category
 * @param {*} page
 * @param {*} limit
 * @returns
 */
async function getProductsByCategory(category, page = 1, limit = 10) {
  return getProducts({
    category,
    page,
    limit,
  });
}

/**
 * Statistics
 */
async function getStatistics() {
  const res = await db.execute(`
    SELECT
      COUNT(*) as totalProducts,
      COUNT(DISTINCT category) as totalCategories,
      COUNT(DISTINCT brand) as totalBrands,
      AVG(price) as avgPrice,
      MIN(price) as minPrice,
      MAX(price) as maxPrice,
      AVG(rating) as avgRating,
      SUM(stock) as totalStock
    FROM products
  `);

  return res.rows[0];
}

/**
 * Clear products
 */
async function clearProducts() {
  await db.execute("DELETE FROM products");
}

/**
 * Bulk insert (transaction)
 */
async function bulkInsertProducts(products) {
  const tx = await db.transaction();

  try {
    for (const p of products) {
      await tx.execute({
        sql: `
          INSERT INTO products
          (title, description, price, category, rating, stock, brand, image, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          p.title,
          p.description,
          p.price,
          p.category,
          p.rating,
          p.stock,
          p.brand,
          p.image || null,
          p.createdAt,
          new Date().toISOString(),
        ],
      });
    }

    await tx.commit();
  } catch (err) {
    await tx.rollback();
    throw err;
  }
}

/**
 * --- NEWLY ADDED: User Helpers ---
 */
async function getUserByEmail(email) {
  const res = await db.execute({
    sql: "SELECT * FROM users WHERE email = ?",
    args: [email],
  });
  return res.rows[0] || null;
}

async function createUser(email, role = "user") {
  await db.execute({
    sql: "INSERT INTO users (email, role) VALUES (?, ?)",
    args: [email, role],
  });
  return { email, role };
}

/**
 * --- NEWLY ADDED: Cart Helpers ---
 */
async function getCart(userEmail) {
  const res = await db.execute({
    sql: `
      SELECT c.id as cartItemId, c.quantity, p.* 
      FROM carts c
      JOIN products p ON c.productId = p.id
      WHERE c.userEmail = ?
    `,
    args: [userEmail],
  });
  return res.rows;
}

async function addToCart(userEmail, productId, quantity) {
  // Upsert pattern
  const existing = await db.execute({
    sql: "SELECT id, quantity FROM carts WHERE userEmail = ? AND productId = ?",
    args: [userEmail, productId]
  });

  if (existing.rows.length > 0) {
    await db.execute({
      sql: "UPDATE carts SET quantity = ? WHERE id = ?",
      args: [quantity, existing.rows[0].id]
    });
  } else {
    await db.execute({
      sql: "INSERT INTO carts (userEmail, productId, quantity) VALUES (?, ?, ?)",
      args: [userEmail, productId, quantity]
    });
  }
}

async function removeFromCart(cartItemId) {
  await db.execute({
    sql: "DELETE FROM carts WHERE id = ?",
    args: [cartItemId]
  });
}

function getDatabaseClient() { return db; }

module.exports = {
  db,
  initializeDatabase,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getProductsByCategory,
  getStatistics,
  clearProducts,
  bulkInsertProducts,
  getUserByEmail,
  createUser,
  getCart,
  addToCart,
  removeFromCart,
};
