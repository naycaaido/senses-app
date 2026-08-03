import "dotenv/config";
import prisma from "../src/config/prisma.js";
import jadwalService from "../src/services/jadwalService.js";

try {
  const summary = await jadwalService.ensureScheduleWindow();
  console.log(JSON.stringify(summary));
} catch {
  console.error("Schedule generation failed");
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
