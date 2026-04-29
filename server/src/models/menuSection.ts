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
import { FilterMenu } from "./FlterMenu.js";
import { Type } from "./Type.js";

@Table({
    tableName: "Section_Menu",
    timestamps: true,
    paranoid: true,
})

export class MenuSection extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
    }) declare id: string;

    @Column({ type: DataType.STRING })
    declare name: string;

    @Column({ type: DataType.STRING })
    declare description: string;

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;

    @DeletedAt
    declare deletedAt: Date;

    
    @ForeignKey(() => Type)
    @Column({
    field: "Type", // 👈 matches DB column EXACTLY
    type: DataType.UUID,
    allowNull: false,
    })
    declare typeId: string;

    @BelongsTo(() => Type, {
    foreignKey: "typeId",
    })
    declare type: Type;

    @HasMany(() => FilterMenu, {
    foreignKey: "sectionMenuId",
    })
    declare filterMenus: FilterMenu[];
}