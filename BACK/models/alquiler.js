import { DataTypes, DATE, Model } from "sequelize";
import sequelize from "../db.js";
import Cliente from "./cliente.js";
import Tarifa from "./tarifa.js";
import Estacion from "./estacion.js";

class Alquiler extends Model {}

Alquiler.init(
    {
        id: {
            type: DataTypes.INTEGER,
            field: "ID", 
            primaryKey: true,
            autoIncrement: true
        },
        idCliente: {
            type: DataTypes.INTEGER,
            field: "ID_CLIENTE",
            allowNull: false,
        },
        estado: {
            type: DataTypes.INTEGER,
            field: "ESTADO",
            allowNull: false
        },
        idEstacionRetiro: {
            type: DataTypes.INTEGER,
            field: "ID_ESTACION_RETIRO",
            allowNull: false
        },
        idEstacionDevolucion: {
            type: DataTypes.INTEGER,
            field: "ID_ESTACION_DEVOLUCION",
            allowNull: true
        },
        fechaHoraRetiro: {
            type: DataTypes.DATE(6),
            field: "FECHA_HORA_RETIRO",
            allowNull: false
        },
        fechaHoraDevolucion: {
            type: DataTypes.DATE(6),
            field: "FECHA_HORA_DEVOLUCION",
            allowNull: true
        },
        monto: {
            type: DataTypes.REAL,
            field: "MONTO",
            allowNull: true
        },
        idTarifa: {
            type: DataTypes.INTEGER,
            field: "ID_TARIFA",
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: "Alquiler",
        tableName: "Alquileres",
        timestamps: false
    }
);

// Relacion: cliente puede tener muchos alquileres
Cliente.hasMany(Alquiler, {
    foreignKey: {
        name: "idCliente",
        field: "ID_CLIENTE"
    },
    as: "alquileres"
});

// Relacion: Alquiler tiene un cliente
Alquiler.belongsTo(Cliente, {
    foreignKey: {
        name: "idCliente",
        field: "ID_CLIENTE"
    },
    as: "Cliente"
});

// Relacion: Alquiler tiene una tarifa
Alquiler.belongsTo(Tarifa, {
    foreignKey: {
        name: "idTarifa",
        field: "ID_TARIFA"
    },
    as: "tarifa"
});

// Relación: Alquiler tiene una estación de retiro
Alquiler.belongsTo(Estacion, {
    foreignKey: {
        name: "idEstacionRetiro",
        field: "ID_ESTACION_RETIRO"
    },
    as: "estacionRetiro"
});

// Relación: Alquiler tiene una estación de devolución (opcional)
Alquiler.belongsTo(Estacion, {
    foreignKey: {
        name: "idEstacionDevolucion",
        field: "ID_ESTACION_DEVOLUCION"
    },
    as: "estacionDevolucion"
});

export default Alquiler;
