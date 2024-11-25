// backend/src/models/table.model.ts
export class Table extends BaseModel {
    public number!: string;
    public capacity!: number;
    public status!: 'available' | 'occupied' | 'reserved';
  }
  
  Table.init({
    number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('available', 'occupied', 'reserved'),
      defaultValue: 'available'
    }
  }, {
    sequelize: Database.getInstance(),
    tableName: 'tables'
  });