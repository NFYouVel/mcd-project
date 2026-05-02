import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  HasMany,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";

import { FilterMenu } from "./FilterMenu.js";
import { OrderItems } from "./OrderItems.js";
import { MenuVariantGroups } from "./MenuVariantGroups.js";
import { PackageItems } from "./PackageItems.js";

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

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING })
  declare description: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare price: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare isPackage: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare isNew: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare isAvailable: boolean;

  @Column({ type: DataType.STRING, allowNull: true })
  declare imageUrl: string;

  // 🔥 FIX: FK → FilterMenu (1:N)
  @ForeignKey(() => FilterMenu)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare filterMenuId: string;

  @BelongsTo(() => FilterMenu)
  declare filterMenu: FilterMenu;


  @HasMany(() => OrderItems, { foreignKey: "menuId" })
  declare orderItems: OrderItems[];

  @HasMany(() => PackageItems, {
    foreignKey: "packageId",
    as: "packages",
  })
  declare packages: PackageItems[];

  @HasMany(() => PackageItems, {
    foreignKey: "packageItemId",
    as: "packageItems",
  })
  declare packageItems: PackageItems[];

  @HasMany(() => MenuVariantGroups, {
    foreignKey: "menuId",
  })
  declare menuVariantGroups: MenuVariantGroups[];

  @CreatedAt declare createdAt: Date;
  @UpdatedAt declare updatedAt: Date;
  @DeletedAt declare deletedAt: Date;
}