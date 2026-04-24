import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  BelongsTo,
  ForeignKey,
  HasMany,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from "sequelize-typescript";

import { FilterMenu } from "./FilterMenu.js";
import { OrderItems } from "./OrderItems.js";

@Table({
  tableName: "Menu",
  timestamps: true,
  paranoid: true,
})
export class Menu extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare description: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare price: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  declare isNew: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  declare isAvailable: boolean;

  // 🔥 FK → FilterMenu
  @ForeignKey(() => FilterMenu)
  @Column({
    field: "filterMenuId", // 👈 match your DB column EXACTLY
    type: DataType.UUID,
    allowNull: true, // allow create without it (your controller)
  })
  declare filterMenuId: string;

  @BelongsTo(() => FilterMenu, {
    foreignKey: "filterMenuId",
  })
  declare filterMenu: FilterMenu;

  // 🔥 relation → OrderItems
  @HasMany(() => OrderItems, {
    foreignKey: "menuId",
  })
  declare orderItems: OrderItems[];

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @DeletedAt
  declare deletedAt: Date;
}