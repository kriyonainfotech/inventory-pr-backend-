const express = require('express');
const { createInventory, updateInventory, getInventoryById, getInventories, deleteInventory } = require('../controllers/inventoryController');
const router = express.Router();

router.post('/add-inventory', createInventory)
router.put('/update-inventory', updateInventory)
router.get('/get-inventory', getInventoryById)
router.get('/all-inventory', getInventories);
router.delete('/delete-inventory', deleteInventory)

module.exports = router;
