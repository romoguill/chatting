import { sequelize } from "../db/sequelize";
import { RefreshToken } from "./refresh-token.model";
import { UserCredentials } from "./user-credentials.model";

export const syncModels = async () => {
  await sequelize.sync();
};

// Associations - First time using sequelize. If I put relations in each model, there will error due to circular dependency.
UserCredentials.hasMany(RefreshToken, {
  foreignKey: "userId",
  as: "refreshTokens",
  onDelete: "CASCADE",
});

RefreshToken.belongsTo(UserCredentials, {
  foreignKey: "userId",
  as: "user",
});

export { UserCredentials, RefreshToken };
