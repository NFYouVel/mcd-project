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
import { Ingredients } from "./Ingredients.js";
import { OrderItems } from "./OrderItems.js";

@Table({
  tableName: "Ingredient_Items",
  timestamps: true,
  paranoid: true,
})
export class IngredientItems extends Model{
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  declare id: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare quantity: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare price: number;

  @CreatedAt
  declare createdAt: Date;
  @UpdatedAt
  declare updatedAt: Date;
  @DeletedAt
  declare deletedAt: Date;

  @ForeignKey(() => Ingredients)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare ingredientsId: string;
    @BelongsTo(() => Ingredients, "ingredientsId")
    declare ingredients: Ingredients;
  
  @ForeignKey(() => OrderItems)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare orderItemsId: string;
    @BelongsTo(() => OrderItems, "orderItemsId")
    declare orderItems: OrderItems;
    

}