import { DataTypes, Model } from "sequelize";
import sequelize from "../db.js";
import Barrio from "./barrio.js";

class Cliente extends Model {}

Cliente.init(
    {
        idCliente: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: "ID_CLIENTE",
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: "NOMBRE",
        },
        apellido: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: "APELLIDO",
        },
        mail: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            field: "MAIL",
            validate: {
                isEmail: { msg: "El correo electrónico no es válido" },
            },
        },
        direccion: {
            type: DataTypes.STRING(250),
            allowNull: true,
            field: "DIRECCION",
        },
        idBarrio: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "ID_BARRIO",
        },
        fechaHoraCreacion: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: "FECHA_HORA_CREACION",
        },
    },
    {
        sequelize,
        modelName: "Cliente",
        tableName: "CLIENTES",
        timestamps: false,
    }
);

// Relación con Barrio
Cliente.belongsTo(Barrio, {
    foreignKey: { name: "idBarrio", field: "ID_BARRIO" },
    as: "barrio",
});

export default Cliente;
