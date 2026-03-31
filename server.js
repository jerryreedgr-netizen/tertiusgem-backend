require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { MercadoPagoConfig, Preference } = require("mercadopago");

const app = express();

// ==========================
// CONFIG
// ==========================
app.use(cors());
app.use(express.json());

// 🔥 IMPORTANTE PARA RENDER
const PORT = process.env.PORT || 3000;

// ==========================
// MERCADO PAGO
// ==========================
const client = new MercadoPagoConfig({
  accessToken: process.env.ACCESS_TOKEN
});

// ==========================
// TEST
// ==========================
app.get("/", (req, res) => {
  res.send("Backend Tertiusgem activo 🚀");
});

// ==========================
// CREAR PREFERENCIA
// ==========================
app.post("/crear-preferencia", async (req, res) => {
  try {
    const { items } = req.body;

    console.log("🛒 ITEMS:", items);

    if (!items || items.length === 0) {
      return res.status(400).json({
        error: "Carrito vacío"
      });
    }

    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: items.map(item => ({
          title: item.name,
          unit_price: Number(item.price),
          quantity: Number(item.qty),
          currency_id: "MXN"
        })),

        back_urls: {
          success: "https://tu-frontend.com/success.html",
          failure: "https://tu-frontend.com/failure.html",
          pending: "https://tu-frontend.com/pending.html"
        }

        // ❌ SIN auto_return para evitar errores
      }
    });

    console.log("✅ PREFERENCIA:", response.id);

    res.json({
      id: response.id
    });

  } catch (error) {
    console.error("🔥 ERROR:", error);

    res.status(500).json({
      error: "Error en el servidor"
    });
  }
});

// ==========================
// INICIAR SERVIDOR
// ==========================
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});