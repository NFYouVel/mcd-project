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
import { FilterMenu } from "./FilterMenu.js";
import { Type } from "./Type.js";

@Table({
    tableName: "Menu_Section",
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
        type: DataType.UUID,
        allowNull: false
    })
    declare foodTypeId: string;
    @BelongsTo(() => Type, "foodTypeId")
    declare type: Type;

    @HasMany(() => FilterMenu, "sectionMenuId")
    declare filterMenus: FilterMenu[];
}