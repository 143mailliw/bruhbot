// Only use the discord.js version 12
const Discord = require('discord.js');

// create an embed with information about a guild passed as the first param
function getServer(guild) {
    return new Discord.MessageEmbed()
        .setTitle(`${guild.name}`)
        .setDescription(`${guild.id}`)
        .setColor(0x00ff00)
        .setThumbnail(guild.iconURL)
        .setFooter(`${guild.memberCount} members`)
        .setTimestamp();
}

module.exports = {
  getServer
};