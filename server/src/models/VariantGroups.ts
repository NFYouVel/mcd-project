import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AllowNull,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
    HasMany
} from "sequelize-typescript";

import { VariantItems } from "./VariantItems.js";
import { MenuVariantGroups } from "./MenuVariantGroups.js";

@Table({
    tableName: "Variant_Groups",
    timestamps: true,
    paranoid: true,
})

export class VariantGroups extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
    })
    declare id: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING
    })
    declare name: string;

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;

    @DeletedAt
    declare deletedAt: Date;

    // One Variant Group -> Many Variant Items
    @HasMany(() => VariantItems, {
        foreignKey: "variantGroupId",
        as: "variantItems"
    })
    declare variantItems: VariantItems[];

    // One Variant Group -> Many Menu Variant Group mappings
    @HasMany(() => MenuVariantGroups, {
        foreignKey: "variantGroupId",
        as: "menuVariantGroups"
    })
    declare menuVariantGroups: MenuVariantGroups[];
}