import { DataTypes, Model } from "sequelize";
import sequelize from "../db.js";
import Barrio from "./barrio.js";

class Estacion extends Model {}

Estacion.init(
    {
        idEstacion: {
            type: DataTypes.INTEGER,
            field: "ID_ESTACION",
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING(100),
            field: "NOMBRE",
            allowNull: true,
        },
        direccion: {
            type: DataTypes.STRING(100),
            field: "DIRECCION",
            allowNull: true,
        },
        idBarrio: {
            type: DataTypes.INTEGER,
            field: "ID_BARRIO",
            allowNull: true,
        },
        fechaCreacion: {
            type: DataTypes.DATE,
            field: "FECHA_HORA_CREACION",
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        latitud: {
            type: DataTypes.FLOAT,
            field: "LATITUD",
            allowNull: true,
        },
        longitud: {
            type: DataTypes.FLOAT,
            field: "LONGITUD",
            allowNull: true,
        },
        activo: {
            type: DataTypes.INTEGER,
            field: "ACTIVA"
        }
    },
    {
        sequelize,
        modelName: "Estacion",
        tableName: "Estaciones",
        timestamps: false,
    }
);

// Definición de la relación entre Estacion y Barrio
// Una estación pertenece a un barrio
Estacion.belongsTo(Barrio, {
    foreignKey: {
        name: "idBarrio",
        field: "ID_BARRIO"
    },
    as: "barrio"
});

// Definición de la relación entre Barrio y Estacion
// Un barrio puede tener muchas estaciones
Barrio.hasMany(Estacion, {
    foreignKey: {
        name: "idBarrio",
        field: "ID_BARRIO"
    },
    as: "estaciones"
});

export default Estacion;
