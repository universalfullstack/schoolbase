import express from "express";
import {
  listSubscriptions,
  createSubscriptionForm,
  createSubscription,
  editSubscriptionForm,
  updateSubscription,
  deleteSubscription
} from "../controllers/super_admin/subscriptionController.js";

const router = express.Router();

// List subscriptions
router.get("/", listSubscriptions);

// Create
router.get("/create", createSubscriptionForm);
router.post("/create", createSubscription);

// Edit
router.get("/edit/:id", editSubscriptionForm);
router.post("/edit/:id", updateSubscription);

// Delete
router.post("/delete/:id", deleteSubscription);

export default router;
