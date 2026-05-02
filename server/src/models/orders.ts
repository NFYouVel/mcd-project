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

import { Payment } from "./Payment.js";
import { OrderItems } from "./OrderItems.js";

@Table({
    tableName: "Orders",
    timestamps: true,
    paranoid: true,
})

export class Orders extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
    })
    declare id: string;

    @Column({
        type: DataType.ENUM("pending", "checkedout", "served", "cancelled"),
        defaultValue: "pending",
        allowNull: false,
    })
    declare status: string;

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;

    @DeletedAt
    declare deletedAt: Date;

    @HasOne(() => Payment, "orderId")
    declare payment: Payment

    @HasMany(() => OrderItems, {
    foreignKey: "orderId",
    as: "orderItems",
    })
    declare orderItems: OrderItems[];

}