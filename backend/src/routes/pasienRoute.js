import { Router } from "express";
import pasienController from "../controller/pasienController.js";
import validateToken from "../middleware/validateToken.js";
import requireRole from "../middleware/requireRole.js";

const pasienRouter = Router();

/**
 * @openapi
 * /pasien/password:
 *   put:
 *     summary: Change the authenticated patient's password
 *     tags: [Pasien]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid password request
 *       401:
 *         description: Missing, invalid, expired token, or incorrect old password
 */
pasienRouter.put(
  "/pasien/password",
  validateToken,
  requireRole("pasien"),
  pasienController.changePasswordPasien,
);

export default pasienRouter;
