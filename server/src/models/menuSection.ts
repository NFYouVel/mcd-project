import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    BelongsTo,
    ForeignKey,
    HasMany,
    CreatedAt,
    UpdatedAt,
    DeletedAt
} from "sequelize-typescript";
import { FilterMenu } from "./filterMenu.js";
import { Type } from "./type.js";

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
    })
    declare id: string;

    @Column({ type: DataType.STRING })
    declare name: string;

    @Column({ type: DataType.STRING })
    declare description: string;

    @ForeignKey(() => Type)
    @Column({
        field: "Type",
        type: DataType.UUID,
        allowNull: false,
    })
    declare typeId: string;

    @BelongsTo(() => Type, {
        foreignKey: "typeId",
    })
    declare type: Type;

    // 🔥 INI YANG PENTING
    @HasMany(() => FilterMenu, {
        foreignKey: "sectionMenuId",
    })
    declare filterMenus: FilterMenu[];

    @CreatedAt declare createdAt: Date;
    @UpdatedAt declare updatedAt: Date;
    @DeletedAt declare deletedAt: Date;
}