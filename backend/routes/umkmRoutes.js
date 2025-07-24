// routes/umkmRoutes.js
const express = require("express");
const router = express.Router();
const { getAllUMKM, createUMKM, updateUMKM, deleteUMKM } = require("../controllers/umkmController");

// GET semua UMKM
router.get("/", getAllUMKM);

// POST tambah UMKM
router.post("/", createUMKM);

// PUT update UMKM berdasarkan id
router.put("/:id", updateUMKM);

// DELETE UMKM berdasarkan id
router.delete("/:id", deleteUMKM);

module.exports = router;
