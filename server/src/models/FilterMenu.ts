import {
  Table, Column, Model, DataType, PrimaryKey,
  BelongsToMany, HasMany,
  CreatedAt, UpdatedAt, DeletedAt
} from "sequelize-typescript";

import { Menu } from "./Menu.js";
import { MenuSection } from "./MenuSection.js";
import { SectionMenuItems } from "./SectionMenuItems.js";

@Table({
  tableName: "Filter_Menu",
  timestamps: true,
  paranoid: true,
})
export class FilterMenu extends Model {

  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column(DataType.STRING)
  declare name: string;

  @Column(DataType.STRING)
  declare description: string;

  // 🔥 M:N with Section
  @BelongsToMany(() => MenuSection, () => SectionMenuItems)
  declare menuSections: MenuSection[];

  // 🔥 1:N with Menu
  @HasMany(() => Menu, {
    foreignKey: "filterMenuId",
  })
  declare menus: Menu[];

  @CreatedAt declare createdAt: Date;
  @UpdatedAt declare updatedAt: Date;
  @DeletedAt declare deletedAt: Date;
}