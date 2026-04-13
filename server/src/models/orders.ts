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

@Table({
    tableName: "orders",
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
        type: DataType.ENUM("pending", "checkedout", "closed", "cancelled"),
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

}