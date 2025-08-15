import { DataTypes, Model } from "sequelize";
import sequelize from "../db.js";

class Tarifa extends Model {}

Tarifa.init(
    {
        idTarifa: {
            type: DataTypes.INTEGER,
            field: "ID_TARIFA",
            primaryKey: true,
            autoIncrement: true,
        },
        descripcion: {
            type: DataTypes.STRING(100),
            field: "DESCRIPCION",
            allowNull: false,
        },
        tipoTarifa: {
            type: DataTypes.INTEGER,
            field: "TIPO_TARIFA",
            defaultValue: 1,
        },
        definicion: {
            type: DataTypes.STRING(1),
            field: "DEFINICION",
            defaultValue: "S",
        },
        diaSemana: {
            type: DataTypes.INTEGER,
            field: "DIA_SEMANA",
        },
        diaMes: {
            type: DataTypes.INTEGER,
            field: "DIA_MES"
        },
        mes: {
            type: DataTypes.INTEGER,
            field: "MES"
        },
        anio: {
            type: DataTypes.INTEGER,
            field: "ANIO"
        },
        montoFijoAlquiler: {
            type: DataTypes.REAL,
            field: "MONTO_FIJO_ALQUILER"
        },
        montoMinutoFraccion: {
            type: DataTypes.REAL,
            field: "MONTO_MINUTO_FRACCION"
        },
        montoKm: {
            type: DataTypes.REAL,
            field: "MONTO_KM"
        },
        montoHora: {
            type: DataTypes.REAL,
            field: "MONTO_HORA"
        }
    },
    {
        sequelize,
        modelName: "Tarifa",
        tableName: "TARIFAS",
        timestamps: false
    },
);

export default Tarifa;
