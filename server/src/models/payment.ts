import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    BelongsTo,
    ForeignKey,
    AllowNull,
    HasMany,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
    HasOne
} from "sequelize-typescript";

import { Orders } from "./orders.js";

@Table({
    tableName: "payment",
    timestamps: true,
    paranoid: true,
})

export class Payment extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
    }) declare id: string;

    @Column({
        type: DataType.ENUM("paid", "unpaid"),
        defaultValue: "unpaid",
        allowNull: false,
    }) declare status: string;

    @Column({
        type: DataType.ENUM("card","ewallet","cash"),
        defaultValue: "cash",
        allowNull: false,
    }) declare payment_method: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    }) declare total_price : number;

    @CreatedAt
    declare createdAt: Date;
    
    @UpdatedAt
    declare updatedAt: Date;
    
    @DeletedAt
    declare deletedAt: Date;

    @HasOne(() => Orders, "order_id")
    declare order: Orders;
}