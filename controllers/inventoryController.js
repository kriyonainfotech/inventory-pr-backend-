// controllers/inventoryController.js
const Inventory = require("../model/inventory");
const mongoose = require("mongoose");
const Product = require("../model/product");
const Vendor = require("../model/Vendor");
const Jobworker = require("../model/jobworker");
const Firm = require("../model/firm");
const Employee = require("../model/employee");

// 🛠 Create Inventory Log
exports.createInventory = async (req, res) => {
    console.log("📝 Received request to create inventory log...");

    try {
        const {
            product,
            quantity,
            issuedBy,
            employee,
            jobworker,
            vendor,
            firm
        } = req.body;

        // 🎯 Create new log entry
        const newLog = new Inventory({
            product,
            quantity,
            issuedBy,
            employee,
            jobworker,
            vendor,
            firm
        });

        // 💾 Save to DB
        const savedLog = await newLog.save();
        console.log("✅ Inventory log created successfully:", savedLog._id);

        res.status(201).json({
            success: true,
            message: "Inventory log created successfully.",
            data: savedLog
        });

    } catch (error) {
        console.error("🔥 Error creating inventory log:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error while creating inventory log.",
            error: error.message
        });
    }
};


/**
 * 📝 Update Inventory Log
 */
// 🛠 Update Inventory Log
exports.updateInventory = async (req, res) => {
    console.log("🔄 Received request to update inventory log...");

    try {
        const { id, ...updateData } = req.body;

        // 🛑 Check if ID is provided
        if (!id) {
            console.error("❌ No ID provided in request");
            return res.status(400).json({
                success: false,
                message: "Inventory log ID is required."
            });
        }

        // ✏️ Attempt update
        const updatedLog = await Inventory.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedLog) {
            console.warn(`⚠️ Inventory log not found for ID: ${id}`);
            return res.status(404).json({
                success: false,
                message: "Inventory log not found."
            });
        }

        console.log(`✅ Inventory log updated: ${updatedLog._id}`);

        res.json({
            success: true,
            message: "Inventory log updated successfully.",
            data: updatedLog
        });

    } catch (error) {
        console.error("🔥 Error updating inventory log:", error);
        res.status(500).json({
            success: false,
            message: "Server error while updating inventory log.",
            error: error.message
        });
    }
};

/**
 * 🗑 Delete Inventory Log
 */
// 🗑 Delete Inventory Log
exports.deleteInventory = async (req, res) => {
    console.log("🗑 Received request to delete inventory log...");

    try {
        const { id } = req.body;

        // 🛑 Validate ID
        if (!id) {
            console.error("❌ No inventory log ID provided");
            return res.status(400).json({
                success: false,
                message: "Inventory log ID is required."
            });
        }

        // 🚮 Attempt delete
        const deletedLog = await Inventory.findByIdAndDelete(id);

        if (!deletedLog) {
            console.warn(`⚠️ Inventory log not found for ID: ${id}`);
            return res.status(404).json({
                success: false,
                message: "Inventory log not found."
            });
        }

        console.log(`✅ Inventory log deleted successfully: ${deletedLog._id}`);

        res.json({
            success: true,
            message: "Inventory log deleted successfully.",
            deletedId: deletedLog._id
        });

    } catch (error) {
        console.error(`🔥 Error deleting inventory log (ID: ${req.params.id}):`, error);
        res.status(500).json({
            success: false,
            message: "Server error while deleting inventory log.",
            error: error.message
        });
    }
};


/**
 * 👁️ View Inventory Logs
 */
// 📦 Get All Inventory Logs
// 📦 Get All Inventory Logs (with pagination + filters)
exports.getInventories = async (req, res) => {
    const startTime = Date.now();
    console.log("📥 Fetching inventory logs...");

    try {
        // Filters
        const filter = {};
        if (req.query.firm) filter.firm = req.query.firm;
        if (req.query.action) filter.action = req.query.action;

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Field selection (optional: ?fields=product,quantity,action)
        const selectFields = req.query.fields
            ? req.query.fields.replace(/,/g, " ")
            : "";

        // Query
        const inventories = await Inventory.find(filter)
            .select(selectFields)
            .populate("product", "name sku")
            .populate("employee", "name email")
            .populate("jobworker", "name phone")
            .populate("vendor", "name companyName")
            .populate("firm", "name")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Inventory.countDocuments(filter);

        console.log(
            `✅ Found ${inventories.length} logs | Page ${page} of ${Math.ceil(
                total / limit
            )} | ⏱ ${Date.now() - startTime}ms`
        );

        res.json({
            success: true,
            message: "Inventory logs fetched successfully.",
            count: inventories.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: inventories
        });

    } catch (error) {
        console.error(
            `🔥 Error fetching inventory logs | Params: ${JSON.stringify(
                req.query
            )} | Error: ${error.message}`
        );
        res.status(500).json({
            success: false,
            message: "Server error while fetching inventory logs.",
            error: error.message
        });
    }
};


/**
 * 👁️ View Single Inventory Log
 */
exports.getInventoryById = async (req, res) => {
    try {
        const { id } = req.body;

        const inventory = await Inventory.findById(id)
            .populate('product')
            .populate('employee')
            .populate('jobworker')
            .populate('vendor')
            .populate('firm');

        if (!inventory) {
            return res.status(404).json({
                success: false,
                message: "Inventory log not found."
            });
        }

        res.json({
            success: true,
            message: "Inventory log fetched successfully.",
            data: inventory
        });
    } catch (error) {
        console.error("🔥 Error fetching inventory log:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error while fetching inventory log.",
            error: error.message
        });
    }
};

