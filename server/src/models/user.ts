import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey
} from "sequelize-typescript";

@Table({
    tableName: "users",
    timestamps: true,
})
export class User extends Model {

    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
    }) 
    declare id: string;

    @Column({type: DataType.STRING})
    declare name: string;

    @Column({type: DataType.STRING})
    declare email: string;

    @Column({type: DataType.STRING})
    declare password: string;

    @Column({type: DataType.STRING})
    declare address: string;

    @Column({type : DataType.DATE})
    declare birthOfDate: Date;

    @Column({type: DataType.INTEGER})
    declare salary: number;

    @Column({type: DataType.ENUM("staff", "manager")})
    declare role: string;
}