
const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const downloadedUrl = sequelize.define('downloadedurls',{
    
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },

    Url: Sequelize.STRING,
});

module.exports = downloadedUrl