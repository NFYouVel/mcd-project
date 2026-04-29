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

@Table({
    tableName: "Package_Items",
    timestamps: true,
    paranoid: true,
})
export class PackageItems extends Model {

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

    // Package menu
    @ForeignKey(() => Menu)
    @Column({
        field: "packageId",
        type: DataType.UUID,
        allowNull: false,
    })
    declare packageId: string;

    @BelongsTo(() => Menu, {
        foreignKey: "packageId",
    })
    declare package: Menu;

    // Individual item inside package
    @ForeignKey(() => Menu)
    @Column({
        field: "packageItemId",
        type: DataType.UUID,
        allowNull: false,
    })
    declare packageItemId: string;

    @BelongsTo(() => Menu, {
        foreignKey: "packageItemId",
    })
    declare packageItem: Menu;

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;

    @DeletedAt
    declare deletedAt: Date;
}