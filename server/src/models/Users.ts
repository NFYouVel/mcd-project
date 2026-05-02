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
    tableName: "Users",
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
    declare birth_of_date: Date;
    
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    declare salary: number;
    
    @Column({
        type: DataType.ENUM("customer", "manager", "cashier"),
        allowNull: true,
    })
    declare role: string;
    
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare resetPasswordToken: string | null;
    
    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    declare resetPasswordExpires: Date | null;

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;

    @DeletedAt
    declare deletedAt: Date;
}