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

    import { VariantGroups } from "./VariantGroups.js";

    @Table({
        tableName: "Variant_Items",
        timestamps: true,
        paranoid: true,
    })
    export class VariantItems extends Model {

        @PrimaryKey
        @Column({
            type: DataType.UUID,
            defaultValue: DataType.UUIDV4,
            allowNull: false,
        })
        declare id: string;

        @Column({
            type: DataType.STRING,
            allowNull: false,
        })
        declare name: string;

        @Column({
            type: DataType.INTEGER,
            allowNull: false,
        })
        declare priceModifier: number;

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