import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

import { Menu } from "./Menu.js";
import { MenuSection } from "./MenuSection.js";

@Table({
  tableName: "Section_Menu_Items",
  timestamps: true,
})
export class SectionMenuItems extends Model {
  
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  declare id: string;

  // 🔥 FK → Menu
  @ForeignKey(() => Menu)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare menuId: string;

  @BelongsTo(() => Menu)
  declare menu: Menu;

  // 🔥 FK → Section_Menu
  @ForeignKey(() => MenuSection)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare sectionMenuId: string;

  @BelongsTo(() => MenuSection)
  declare menuSection: MenuSection;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}