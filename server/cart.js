const { getCart, addToCart, removeFromCart } = require("./db");

// --- NEWLY ADDED: Modularized Cart Routes Configuration ---
async function cartRoutes(fastify, options) {
  
  // Get all cart items mapping to a user
  fastify.get("/cart/:email", async (req, reply) => {
    const { email } = req.params;
    if (!email) return reply.code(400).send({ message: "Email required" });
    
    const cartItems = await getCart(email);
    return { data: cartItems };
  });

  // Automatically Upsert cart quantity
  fastify.post("/cart", async (req, reply) => {
    const { email, productId, quantity } = req.body;
    if (!email || !productId) return reply.code(400).send({ message: "Email and Product ID required" });
    
    // Explicitly clamp quantity to 0 deletion
    if (quantity <= 0) {
      const items = await getCart(email);
      const target = items.find(i => i.id === productId); 
      if (target) await removeFromCart(target.cartItemId);
    } else {
      await addToCart(email, productId, quantity);
    }
    
    return { message: "Cart synced successfully mapped to DB" };
  });

  // Delete cart item explicitly natively via ID
  fastify.delete("/cart/:cartItemId", async (req, reply) => {
    const { cartItemId } = req.params;
    await removeFromCart(cartItemId);
    return { message: "Cart item strictly removed from DB" };
  });
}

module.exports = cartRoutes;
