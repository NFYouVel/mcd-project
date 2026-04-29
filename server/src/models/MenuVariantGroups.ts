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
    DeletedAt
} from "sequelize-typescript";

import { Menu } from "./Menu.js";
import { VariantGroups } from "./VariantGroups.js";

@Table({
    tableName: "Menu_Variant_Groups",
    timestamps: true,
    paranoid: true,
})
export class MenuVariantGroups extends Model {

    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
    })
    declare id: string;

    // FK -> Menu
    @ForeignKey(() => Menu)
    @Column({
        field: "menuId",
        type: DataType.UUID,
        allowNull: false,
    })
    declare menuId: string;

    @BelongsTo(() => Menu, {
        foreignKey: "menuId",
    })
    declare menu: Menu;

    // FK -> VariantGroups
    @ForeignKey(() => VariantGroups)
    @Column({
        field: "variantGroupId",
        type: DataType.UUID,
        allowNull: false,
    })
    declare variantGroupId: string;

    @BelongsTo(() => VariantGroups, {
        foreignKey: "variantGroupId",
    })
    declare variantGroup: VariantGroups;

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;

    @DeletedAt
    declare deletedAt: Date;
}