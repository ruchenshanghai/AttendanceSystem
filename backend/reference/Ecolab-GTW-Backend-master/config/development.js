module.exports = {
  name: 'development',
  port: 3001,
  DBconfig: {
    database: 'GTWPEST',
    user: 'GTW',
    password: 'Ecolabit@123',
    connectConfig: {
      dialect: 'mssql',
      host: 'CNSHASQLSDB01P',
      schema: 'gtw',
      port: 1433, // Default port
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      },
      dialectOptions: {
        encrypt: true
      }
    }
  }
}