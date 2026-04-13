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
    DeletedAt
} from "sequelize-typescript";
import { Menu } from "./menu.js";
import { Orders } from "./orders.js";

@Table({
    tableName: "order_item",
    timestamps: true,
    paranoid: true, 
})

export class OrderItem extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
    }) 
    declare id: string;
    
    @Column({
        type: DataType.ENUM("pending", "preparing", "served", "cancelled"),
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

    @ForeignKey(() => Menu)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare menu_id: string;

    @BelongsTo(() => Menu, "menu_id")
    declare menu: Menu;

    @ForeignKey(() => Orders)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare order_id: string;

    @BelongsTo(() => Orders, "order_id")
    declare order: Orders;
}