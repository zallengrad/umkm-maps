const { getAllUMKMs, createUMKM, updateUMKM, deleteUMKM } = require("../models/umkmModel");

const getAll = async (req, res) => {
  try {
    const data = await getAllUMKMs();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const data = await createUMKM(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const data = await updateUMKM(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const data = await deleteUMKM(req.params.id);
    res.json({ message: "Deleted", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllUMKM: getAll,
  createUMKM: create,
  updateUMKM: update,
  deleteUMKM: remove,
};
