import express from "express";
import {
  listPlans,
  showCreatePlan,
  createPlan,
  showEditPlan,
  editPlan,
  deletePlan
} from "../controllers/super_admin/planController.js";

import { ensureSuperAdmin } from "../middleware/auth.js";

const router = express.Router();

router.use(ensureSuperAdmin);

router.get("/", listPlans);
router.get("/create", showCreatePlan);
router.post("/create", createPlan);

router.get("/edit/:id", showEditPlan);
router.post("/edit/:id", editPlan);

router.post("/delete/:id", deletePlan);

export default router;
