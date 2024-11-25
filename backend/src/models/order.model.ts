// backend/src/models/order.model.ts
export class Order extends BaseModel {
    public tableId!: number;
    public status!: 'pending' | 'preparing' | 'ready' | 'delivered';
    public total!: number;
  }
  
  Order.init({
    tableId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Table,
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'preparing', 'ready', 'delivered'),
      defaultValue: 'pending'
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize: Database.getInstance(),
    tableName: 'orders'
  });
  
  // Setup relationships
  Table.hasMany(Order);
  Order.belongsTo(Table);