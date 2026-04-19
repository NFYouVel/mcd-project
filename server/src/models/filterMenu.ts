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
import { MenuSection } from "./MenuSection.js";

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
    declare sectionMenuId: string;

    @BelongsTo(() => MenuSection, "sectionMenuId")
    declare menuSection: MenuSection;

    @HasMany(() => Menu, {
    foreignKey: "filterMenuId",
    })
    declare menus: Menu[];
}