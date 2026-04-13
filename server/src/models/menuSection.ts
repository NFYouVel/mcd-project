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
import { FilterMenu } from "./filterMenu.js";
import { Type } from "./type.js";

export class MenuSection extends Model {
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

    @ForeignKey(() => Type)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare food_type_id: string;

    @BelongsTo(() => Type, "food_type_id")
    declare type: Type;

    @HasMany(() => FilterMenu)
    declare filterMenu: FilterMenu[];
}