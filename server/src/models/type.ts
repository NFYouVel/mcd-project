import { timeStamp } from "node:console";
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

import { MenuSection } from "./menuSection.js";
@Table({
    tableName: "Type",
    timestamps: true,
    paranoid: true,
})

export class Type extends Model {
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
    declare foodTypeId: number;

    @Column({
        type: DataType.ENUM("Promotion", "Heavy", "Light")
    })
    declare description: string;

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;

    @DeletedAt
    declare deletedAt: Date;

    @HasMany(() => MenuSection, {
        foreignKey: "typeId",
    })
    declare menuSections: MenuSection[];
}