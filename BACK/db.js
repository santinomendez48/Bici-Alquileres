// db.js
import { Sequelize } from "sequelize";
import { format } from "sql-formatter";

const customLogger = (sql) => {
    try {
        const clean = sql.replace("Executing (default): ", "");
        // Formatear solo si no contiene parámetros o bindings
        if (!clean.includes("$") && !clean.includes("?")) {
            console.log(`\n📝 SQL ejecutado:\n${format(clean)}`);
        }
        else {
            console.log(`\n🔍 SQL:\n${clean}`); // Mostrar sin formatear si es más complejo
        }
    }
    catch (error) {
        console.warn("⚠️ Error en logger personalizado:", error.message);
        console.log(sql);
    }
};

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./data/db.sqlite",
    logging: customLogger
});

export function enableDbLog() {
    sequelize.options.logging = customLogger;
}

export function disableDbLog() {
    sequelize.options.logging = false; // Desactivar el logger
}

export default sequelize;
