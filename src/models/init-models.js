var DataTypes = require("sequelize").DataTypes;
var _SequelizeMeta = require("./SequelizeMeta");
var _casts = require("./casts");
var _directors = require("./directors");
var _genres = require("./genres");
var _movie_casts = require("./movie_casts");
var _movie_directors = require("./movie_directors");
var _movie_genres = require("./movie_genres");
var _movies = require("./movies");
var _payment_method = require("./payment_method");
var _profiles = require("./profiles");
var _transaction_details = require("./transaction_details");
var _transactions = require("./transactions");
var _users = require("./users");

function initModels(sequelize) {
  var SequelizeMeta = _SequelizeMeta(sequelize, DataTypes);
  var casts = _casts(sequelize, DataTypes);
  var directors = _directors(sequelize, DataTypes);
  var genres = _genres(sequelize, DataTypes);
  var movie_casts = _movie_casts(sequelize, DataTypes);
  var movie_directors = _movie_directors(sequelize, DataTypes);
  var movie_genres = _movie_genres(sequelize, DataTypes);
  var movies = _movies(sequelize, DataTypes);
  var payment_method = _payment_method(sequelize, DataTypes);
  var profiles = _profiles(sequelize, DataTypes);
  var transaction_details = _transaction_details(sequelize, DataTypes);
  var transactions = _transactions(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  casts.belongsToMany(movies, { as: 'movie_id_movies', through: movie_casts, foreignKey: "cast_id", otherKey: "movie_id" });
  directors.belongsToMany(movies, { as: 'movie_id_movies_movie_directors', through: movie_directors, foreignKey: "director_id", otherKey: "movie_id" });
  genres.belongsToMany(movies, { as: 'movie_id_movies_movie_genres', through: movie_genres, foreignKey: "genre_id", otherKey: "movie_id" });
  movies.belongsToMany(casts, { as: 'cast_id_casts', through: movie_casts, foreignKey: "movie_id", otherKey: "cast_id" });
  movies.belongsToMany(directors, { as: 'director_id_directors', through: movie_directors, foreignKey: "movie_id", otherKey: "director_id" });
  movies.belongsToMany(genres, { as: 'genre_id_genres', through: movie_genres, foreignKey: "movie_id", otherKey: "genre_id" });
  movie_casts.belongsTo(casts, { as: "cast", foreignKey: "cast_id"});
  casts.hasMany(movie_casts, { as: "movie_casts", foreignKey: "cast_id"});
  movie_directors.belongsTo(directors, { as: "director", foreignKey: "director_id"});
  directors.hasMany(movie_directors, { as: "movie_directors", foreignKey: "director_id"});
  movie_genres.belongsTo(genres, { as: "genre", foreignKey: "genre_id"});
  genres.hasMany(movie_genres, { as: "movie_genres", foreignKey: "genre_id"});
  movie_casts.belongsTo(movies, { as: "movie", foreignKey: "movie_id"});
  movies.hasMany(movie_casts, { as: "movie_casts", foreignKey: "movie_id"});
  movie_directors.belongsTo(movies, { as: "movie", foreignKey: "movie_id"});
  movies.hasMany(movie_directors, { as: "movie_directors", foreignKey: "movie_id"});
  movie_genres.belongsTo(movies, { as: "movie", foreignKey: "movie_id"});
  movies.hasMany(movie_genres, { as: "movie_genres", foreignKey: "movie_id"});
  transactions.belongsTo(movies, { as: "movie", foreignKey: "movie_id"});
  movies.hasMany(transactions, { as: "transactions", foreignKey: "movie_id"});
  transactions.belongsTo(payment_method, { as: "payment_method", foreignKey: "payment_method_id"});
  payment_method.hasMany(transactions, { as: "transactions", foreignKey: "payment_method_id"});
  users.belongsTo(profiles, { as: "profile", foreignKey: "profile_id"});
  profiles.hasMany(users, { as: "users", foreignKey: "profile_id"});
  transaction_details.belongsTo(transactions, { as: "transaction", foreignKey: "transaction_id"});
  transactions.hasMany(transaction_details, { as: "transaction_details", foreignKey: "transaction_id"});
  movies.belongsTo(users, { as: "admin", foreignKey: "admin_id"});
  users.hasMany(movies, { as: "movies", foreignKey: "admin_id"});
  transactions.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(transactions, { as: "transactions", foreignKey: "user_id"});

  return {
    SequelizeMeta,
    casts,
    directors,
    genres,
    movie_casts,
    movie_directors,
    movie_genres,
    movies,
    payment_method,
    profiles,
    transaction_details,
    transactions,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
