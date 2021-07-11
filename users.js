// Only use the discord.js version 12
const Discord = require('discord.js');

// generate an embed containing the user's information
// the user is the user object passed in as a parameter
// the guild member is passed in as a parameter
function getUser(user, guildMember) {
  // create an embed object
  const embed = new Discord.MessageEmbed();

  // set the embed title
  embed.setTitle(`${user.username}#${user.discriminator}`);


  // add fields for all the details
  embed.addField('Name', user.username, true);
  embed.addField('ID', user.id, true);
  embed.addField('Created', user.createdAt, true);
  embed.addField('Joined', guildMember.joinedAt, true);

  // if the user is a bot, add a bot to the fields
  if (user.bot) {
    embed.addField('Bot', 'Yes', true);
  }

  // if the guild member is a member of the guild, add the guild member's roles to the fields
  if (guildMember) {
    embed.addField('Roles', guildMember.roles.cache.map(role => role.name).join(', '), true);
  }

  // if the guild member has a guild nickname, add it to the fields
  if (guildMember && guildMember.nick) {
    embed.addField('Nickname', guildMember.nick, true);
  }

  // if the guild member has a displaycolor, set it
  if (guildMember && guildMember.displayHexColor) {
    embed.setColor(guildMember.displayHexColor);
  }

  // set the embed image
  embed.setThumbnail(user.avatarURL());

  // return the embed object
  return embed;
}

module.exports = {
  getUser
};