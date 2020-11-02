const DataTypes = require('sequelize');

const { Model } = DataTypes;

module.exports = class Post extends Model {
  static init(sequelize) {
    return super.init(
      {
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        modelName: 'Post',
        tableName: 'posts',
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci', // 이모티콘 저장
        sequelize,
      },
    );
  }

  static associate(db) {
    // ? belongsTo로 인하여 column이 자동으로 생성
    db.Post.belongsTo(db.User); // column: UserId, method: post.addUser, post.getUser, post.setUser
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' }); // post.addHashtags
    db.Post.hasMany(db.Image); // post.addImages, post.getImagess
    db.Post.hasMany(db.Comment); // post.addComments, post.getComments
    db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' }); // post.addLikers, post.removeLikers
    db.Post.belongsTo(db.Post, { as: 'Retweet' }); // column: RetweetId, method: post.addRetweet
  }
};
