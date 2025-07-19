'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      const tables = await queryInterface.showAllTables();
      
      const userTables = tables.filter(table => 
        !table.includes('SequelizeMeta') && 
        !table.startsWith('pg_') && 
        !table.startsWith('information_')
      );

      console.log('Processing tables:', userTables);

      for (const tableName of userTables) {
        try {
          const tableInfo = await queryInterface.describeTable(tableName);
          
          if (tableInfo.created_at) {
            console.log(`Updating created_at in ${tableName}`);
            await queryInterface.changeColumn(tableName, 'created_at', {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }, { transaction });
          }
          
          if (tableInfo.updated_at) {
            console.log(`Updating updated_at in ${tableName}`);
            await queryInterface.changeColumn(tableName, 'updated_at', {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }, { transaction });
          }

          if (!tableInfo.created_at && !tableInfo.updated_at) {
            console.log(`Adding timestamp columns to ${tableName}`);
            
            await queryInterface.addColumn(tableName, 'created_at', {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }, { transaction });

            await queryInterface.addColumn(tableName, 'updated_at', {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }, { transaction });
          }

        } catch (error) {
          console.log(`Skipping ${tableName}: ${error.message}`);
        }
      }

      await transaction.commit();
      console.log('✅ All timestamp columns updated successfully');

    } catch (error) {
      await transaction.rollback();
      console.error('❌ Migration failed:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      const tables = await queryInterface.showAllTables();
      const userTables = tables.filter(table => 
        !table.includes('SequelizeMeta') && 
        !table.startsWith('pg_') && 
        !table.startsWith('information_')
      );

      for (const tableName of userTables) {
        try {
          const tableInfo = await queryInterface.describeTable(tableName);
          
          if (tableInfo.created_at) {
            await queryInterface.changeColumn(tableName, 'created_at', {
              type: Sequelize.DATE,
              allowNull: false
            }, { transaction });
          }
          
          if (tableInfo.updated_at) {
            await queryInterface.changeColumn(tableName, 'updated_at', {
              type: Sequelize.DATE,
              allowNull: false
            }, { transaction });
          }

        } catch (error) {
          console.log(`Skipping rollback for ${tableName}: ${error.message}`);
        }
      }

      await transaction.commit();
      console.log('✅ Rollback completed');

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};