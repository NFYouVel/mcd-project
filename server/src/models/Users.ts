import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    CreatedAt,
    UpdatedAt,
    DeletedAt
} from "sequelize-typescript";

@Table({
    tableName: "users",
    timestamps: true,
    paranoid: true,
})
export class Users extends Model {

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
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    declare email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare password: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare address: string;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    declare birthOfDate: Date;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    declare salary: number;

    @Column({
        type: DataType.ENUM("staff", "manager"),
        allowNull: true,
    })
    declare role: string;

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;

    @DeletedAt
    declare deletedAt: Date;
}