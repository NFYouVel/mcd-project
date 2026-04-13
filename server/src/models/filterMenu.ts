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
import { MenuSection } from "./menuSection.js";

@Table({
    tableName: "filter_menu",
    timestamps: true,
    paranoid: true,
})

export class FilterMenu extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
    }) declare id: string;

    @Column({type: DataType.STRING})
    declare name: string;

    @Column({type: DataType.STRING})
    declare description: string;

    @CreatedAt
    declare createdAt: Date;
    
    @UpdatedAt
    declare updatedAt: Date;
    
    @DeletedAt
    declare deletedAt: Date;

    @ForeignKey(() => MenuSection)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare section_menu_id: string;

    @BelongsTo(() => MenuSection, "section_menu_id")
    declare menuSection: MenuSection;

    @HasMany(() => Menu, "menu_id")
    declare menus: Menu[];
}