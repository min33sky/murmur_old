module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci', // 이모티콘 저장
    },
  );

  Post.associate = (db) => {
    // ? belongsTo로 인해 column이 자동으로 생성
    db.Post.belongsTo(db.User); // column: UserId, method: post.addUser, post.getUser, post.setUser
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' }); // post.addHashtags
    db.Post.hasMany(db.Image); // post.addImages, post.getImagess
    db.Post.hasMany(db.Comment); // post.addComments, post.getComments
    db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' }); // post.addLikers, post.removeLikers
    db.Post.belongsTo(db.Post, { as: 'Retweet' }); // column: RetweetId, method: post.addRetweet
  };

  return Post;
};
