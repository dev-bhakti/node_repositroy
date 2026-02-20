module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        len: [3, 200]
      }
    },

    summary: {
      type: DataTypes.STRING(500),
      allowNull: true
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },

    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      defaultValue: 'draft'
      // This aligns with your PostgreSQL enum: book_status
    },

    publishedat: {
      type: DataTypes.DATE,
      allowNull: true
    },

    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },

    createdat : {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },

    updatedat: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: 'book',
    timestamps: true
  });

  return Book;
};