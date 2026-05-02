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
import { Menu } from "./Menu.js";
import { Orders } from "./Orders.js";
import { IngredientItems } from "./IngredientItems.js";
import { VariantItems } from "./VariantItems.js";
@Table({
    tableName: "Order_Items",
    timestamps: true,
    paranoid: true,
})

export class OrderItems extends Model {
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
    declare menuId: string;
    @BelongsTo(() => Menu, "menuId")
    declare menu: Menu;

    
    @ForeignKey(() => Orders)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare orderId: string;
    @BelongsTo(() => Orders, "orderId")
    declare order: Orders;
    
    @ForeignKey(() => VariantItems)
    @Column({
        type: DataType.UUID,
        allowNull: true
    })
    declare variantItemsId: string;
    
    @BelongsTo(() => VariantItems, "variantItemsId")
    declare variantItems: VariantItems;

    @HasMany(() => IngredientItems, {
    foreignKey: "orderItemsId"
    })
    declare ingredientItems: IngredientItems[];

}