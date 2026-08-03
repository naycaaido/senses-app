import { Router } from "express";
import pasienController from "../controller/pasienController.js";
import resepsionisAuthController from "../controller/resepsionisAuthController.js";
import validateToken from "../middleware/validateToken.js";
import requireRole from "../middleware/requireRole.js";

const authRoute = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new patient
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Registration successful
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Required fields are missing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Email is already registered or account exists with incomplete profile
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - type: object
 *                   properties:
 *                     profile_incomplete:
 *                       type: boolean
 *                       example: true
 *                     email:
 *                       type: string
 *                       example: testpasien@gmail.com
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRoute.post("/auth/register", pasienController.registerPasien);

/**
 * @openapi
 * /auth/pasien/login:
 *   post:
 *     summary: Login as a patient (new dedicated endpoint)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     nama_lengkap:
 *                       type: string
 *                     role:
 *                       type: string
 *                       example: pasien
 *                     profil_lengkap:
 *                       type: boolean
 *       400:
 *         description: Required fields are missing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Email or password is invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRoute.post("/auth/pasien/login", pasienController.loginPasien);

/**
 * @openapi
 * /auth/resepsionis/login:
 *   post:
 *     summary: Login as a receptionist
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_resepsionis:
 *                 type: number
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id_resepsionis:
 *                       type: number
 *                     nama_lengkap:
 *                       type: string
 *                     role:
 *                       type: string
 *                       example: resepsionis
 *       400:
 *         description: Required fields are missing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: ID or password is invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRoute.post(
  "/auth/resepsionis/login",
  resepsionisAuthController.loginResepsionis,
);

/**
 * @deprecated Will be replaced by /auth/pasien/login and /auth/resepsionis/login
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login as a patient (deprecated — use /auth/pasien/login for pasien)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token containing the patient user data
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Required fields are missing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Email or password is invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRoute.post("/auth/login", pasienController.login);

/**
 * @openapi
 * /auth/profile:
 *   get:
 *     summary: Get the authenticated patient's profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Patient profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [user]
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/Pasien'
 *       401:
 *         description: Missing, invalid, or expired token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Patient not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Complete patient profile
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfileRequest'
 *     responses:
 *       200:
 *         description: Profile completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile completed successfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Required fields are missing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Patient not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRoute.get(
  "/auth/profile",
  validateToken,
  requireRole("pasien"),
  pasienController.getProfilePasien,
);

authRoute.put(
  "/auth/profile",
  validateToken,
  requireRole("pasien"),
  pasienController.completeProfilePasien,
);

export default authRoute;
