// Crea o actualiza la cuenta de administrador/docente a partir de variables de entorno.
// No se expone por API: se ejecuta manualmente una vez (p. ej. desde la shell de Render).
//
// Uso: ADMIN_NAME="..." ADMIN_EMAIL="..." ADMIN_PASSWORD="..." node src/scripts/seedAdmin.js
import "../db/index.js";
import { findByEmail, createUser, updatePasswordAndRole } from "../models/userRepository.js";
import { hashPassword } from "../utils/password.js";

async function main() {
  const fullName = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const documentId = process.env.ADMIN_DOCUMENT_ID || "admin";

  if (!fullName || !email || !password) {
    console.error(
      "Faltan variables de entorno. Se requieren ADMIN_NAME, ADMIN_EMAIL y ADMIN_PASSWORD."
    );
    process.exit(1);
  }

  if (password.length < 6) {
    console.error("ADMIN_PASSWORD debe tener al menos 6 caracteres.");
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);
  const existing = findByEmail(email);

  if (existing) {
    updatePasswordAndRole(existing.id, { passwordHash, role: "teacher" });
    console.log(`Cuenta existente actualizada a rol 'teacher': ${email}`);
  } else {
    createUser({ fullName, role: "teacher", documentId, email, passwordHash });
    console.log(`Cuenta de docente/administrador creada: ${email}`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
