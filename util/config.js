require('dotenv').config()

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  // 不能太大 设置为66直接卡死
  // salt 必须是 int 类型 否则报错 Error: Invalid salt. Salt must be in the form of: $Vers$log2(NumRounds)$saltvalue
  SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS) || 10
}
