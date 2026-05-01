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

import { MenuSection } from "./MenuSection.js";
import { FilterMenu } from "./FilterMenu.js";

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

  // 🔥 FK → Section_Menu
  @ForeignKey(() => MenuSection)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare sectionMenuId: string;

  @BelongsTo(() => MenuSection)
  declare menuSection: MenuSection;
  
  @ForeignKey(() => FilterMenu)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare filterMenuId: string;

  @BelongsTo(() => FilterMenu)
  declare filterMenu: FilterMenu;

  // 🔥 NEW FK → FilterMenu
  @ForeignKey(() => FilterMenu)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare filterMenuId: string;

  @BelongsTo(() => FilterMenu)
  declare filterMenu: FilterMenu;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}