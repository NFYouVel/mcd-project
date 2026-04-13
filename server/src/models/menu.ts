import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    BelongsTo,
    ForeignKey,
    AllowNull,
    CreatedAt,
    DeletedAt,
    UpdatedAt,
    HasMany
} from "sequelize-typescript";

import { FilterMenu } from "./FilterMenu.js";
import { OrderItems } from "./OrderItems.js";
import { Col } from "sequelize/lib/utils";

@Table({
    tableName: "menu",
    timestamps: true,
    paranoid: true,
})
export class Menu extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
    }) declare id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare name: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare description: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare price: number;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true,
        allowNull: true,
    })
    declare isNew: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true,
        allowNull: false,
    })
    declare isAvailable: boolean;

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;
    
    @DeletedAt
    declare deletedAt: Date;
    
    // relation
    @ForeignKey(() => FilterMenu)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare filterMenuId: string;
    @BelongsTo(() => FilterMenu, "filterMenuId")
    declare filterMenu: FilterMenu;

    @HasMany(() => OrderItems, "menuId")
    declare orderItems: OrderItems[];
}