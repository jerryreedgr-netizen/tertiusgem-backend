require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { MercadoPagoConfig, Preference } = require("mercadopago");

const app = express();

// ==========================
// CONFIGURACIÓN
// ==========================
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ==========================
// MERCADO PAGO (SDK v2)
// ==========================
const client = new MercadoPagoConfig({
  accessToken: process.env.ACCESS_TOKEN
});

// ==========================
// RUTA TEST
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
          success: "http://localhost:5500/success.html",
          failure: "http://localhost:5500/failure.html",
          pending: "http://localhost:5500/pending.html"
        }

        // ❌ NO usamos auto_return para evitar conflictos
      }
    });

    console.log("✅ PREFERENCIA CREADA:", response.id);

    res.json({
      id: response.id
    });

  } catch (error) {
    console.error("🔥 ERROR MP:", error);

    res.status(500).json({
      error: "Error al crear la preferencia"
    });
  }
});

// ==========================
// INICIAR SERVIDOR
// ==========================
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});