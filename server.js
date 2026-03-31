console.log("TOKEN:", process.env.ACCESS_TOKEN);
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { MercadoPagoConfig, Preference } = require("mercadopago");

const app = express();

// ==========================
// CONFIG GENERAL
// ==========================
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ==========================
// MERCADO PAGO CONFIG
// ==========================
const client = new MercadoPagoConfig({
  accessToken: process.env.ACCESS_TOKEN
});

// ==========================
// TEST ROUTE
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

    console.log("🛒 ITEMS RECIBIDOS:", items);

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
          success: "https://tertiusgem-backend.onrender.com",
          failure: "https://tertiusgem-backend.onrender.com",
          pending: "https://tertiusgem-backend.onrender.com"
        }

        // 🚫 NO usamos auto_return para evitar errores
      }
    });

    console.log("✅ PREFERENCIA CREADA:", response.id);

    res.json({
      id: response.id
    });

  } catch (error) {
    console.error("🔥 ERROR MERCADO PAGO:", error);

    res.status(500).json({
      error: "Error al crear preferencia"
    });
  }
});

// ==========================
// START SERVER
// ==========================
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});