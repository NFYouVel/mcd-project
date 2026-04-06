import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    BelongsTo,
    ForeignKey,
    AllowNull
} from "sequelize-typescript";

import {FilterMenu} from "./filterMenu.js";

@Table({
    tableName: "menu",
    timestamps: true,
})
export class Menu extends Model {
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

    @Column({type: DataType.INTEGER})
    declare price: number;

     // foreign key column
    @ForeignKey(() => FilterMenu)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare filterMenuId: string;

    // relation
    @BelongsTo(() => FilterMenu)
    declare filterMenu: FilterMenu;
}