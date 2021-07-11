// Create a discord bot using dscord.js (version 12)
// and respond to commands starting with "+"
// Only use the discord.js version 12
// Commands: 
// +hello - say hello
// +help - list commands
// +admin - list admin commands
// +ping - pong
// +echo - repeat what you say
// +roll - roll a dice
// +eightball - answer a yes/no question
// +weather <location> - get the weather
// +wiki <search> - search wikipedia
// +urban <search> - search urban dictionary
// +mute <user> - mute a user (admins only)
// +unmute <user> - unmute a user (admins only)
// +kick <user> - kick a user (admins only)
// +ban <user> - ban a user (admins only)
// +unban <user> - unban a user (admins only)
// +prune <count> - delete messages (admins only)
// +shutdown - shutdown the bot (admins only)
// +status - get bot status
// +invite - get bot invite link
// +server - get server info
// +userinfo <user> - get user info
// +eval <code> - evaluate some code
// +about - about the bot
// +flipimage - flip an attached image

const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const config = require('./config.json');

const prefix = config.prefix;

const commands = {
  // hello command
  hello: function(message) {
    message.channel.send('Hello ' + message.author.username + '!');
  },
  // help command
  help: function(message) {
    // send a list of non-admin commands in an embed
    // skip admin commands that end with "(admins only)"
    var embed = new Discord.MessageEmbed();
    embed.setColor(0xFF0000);
    embed.setTitle('Help');
    embed.setDescription('List of commands:');
    embed.addField('+hello', 'Say hello', true);
    embed.addField('+help', 'List commands', true);
    embed.addField('+ping', 'Pong', true);
    embed.addField('+echo', 'Repeat what you say', true);
    embed.addField('+roll', 'Roll a dice', true);
    embed.addField('+eightball', 'Answer a yes/no question', true);
    embed.addField('+weather <location>', 'Get the weather', true);
    embed.addField('+wiki <search>', 'Search wikipedia', true);
    embed.addField('+urban <search>', 'Search urban dictionary', true);
    embed.addField('+eval <code>', 'Evaluate some code', true);
    embed.addField('+about', 'About the bot', true);
    embed.addField('+flipimage', 'Flip an attached image', true);
    embed.addField('+status', 'Get bot status', true);
    embed.addField('+invite', 'Get bot invite link', true);
    embed.addField('+server', 'Get server info', true);
    embed.addField('+userinfo <user>', 'Get user info', true);
    
    message.channel.send({embed});
  },
  // admin command
  admin: function(message) {
    // make sure the message author is an admin
    if (message.member.roles.cache.some(role => role.name === 'Admin')) {
      // send a list of admin commands in an embed
      // only include commands that end with "admins only"
      var embed = new Discord.MessageEmbed();
      embed.setColor(0xFF0000);
      embed.setTitle('Admin Commands');
      embed.setDescription('List of admin commands:');
      embed.addField('+prune <count>', 'Delete messages', true);
      embed.addField('+mute <user>', 'Mute a user', true);
      embed.addField('+unmute <user>', 'Unmute a user', true);
      embed.addField('+kick <user>', 'Kick a user', true);
      embed.addField('+ban <user>', 'Ban a user', true);
      embed.addField('+unban <user>', 'Unban a user', true);
      embed.addField('+shutdown', 'Shutdown the bot', true);

      message.channel.send({embed});
    } else {
      // send an error message
      message.channel.send('You are not an admin!');
    }
  },
  // ping command
  ping: function(message) {
    message.channel.send('pong');
  },
  // echo command
  echo: function(message) {
    message.channel.send(message.content);
  },
  // roll command
  roll: function(message) {
    var dice = Math.floor(Math.random() * 6) + 1;
    message.channel.send('You rolled a ' + dice + '!');
  },
  // eightball command
  eightball: function(message) {
    var responses = ['It is certain', 'It is decidedly so', 'Without a doubt', 'Yes definitely', 'You may rely on it', 'As I see it, yes', 'Most likely', 'Outlook good', 'Yes', 'Signs point to yes', 'Reply hazy try again', 'Ask again later', 'Better not tell you now', 'Cannot predict now', 'Concentrate and ask again', 'Don\'t count on it', 'My reply is no', 'My sources say no', 'Outlook not so good', 'Very doubtful'];
    var response = responses[Math.floor(Math.random() * responses.length)];
    message.channel.send(response);
  },
  // weather command
  weather: function(message) {
    var location = message.content.substring("+wiki ".length);
    var weather = require('./weather.js');
    weather.getWeather(location).then(function(result) {
      // send embed
      var embed = new Discord.MessageEmbed();
      embed.setTitle(result.name + ', ' + result.sys.country);
      embed.setAuthor('Weather for ' + result.name + ', ' + result.sys.country);
      embed.setColor(0x00ff00);
      embed.setThumbnail(result.icon);
      embed.setDescription((Number(result.main.temp) - 273.15) + ' °C');
      embed.setFooter('Powered by OpenWeatherMap');

      message.channel.send(embed);
    }).catch(function(err) {
      message.channel.send('Error: ' + err);
    });
  },
  // wiki command
  wiki: function(message) {
    var search = message.content.substring("+wiki ".length);
    var wiki = require('./wiki.js');
    wiki.search(search).then(function(data) {
      // send embed
      var embed = new Discord.MessageEmbed();
      page = Object.keys(data.query.pages)[0];
      embed.setTitle(data.query.pages[page].title);
      embed.setDescription(data.query.pages[page].extract);
      embed.setColor(0xA4FF00);
      embed.setFooter('Powered by Wikipedia');
      
      message.channel.send(embed);
    }).catch(function(err) {
      message.channel.send('Error: ' + err);
    });
  },
  // urban command
  urban: function(message) {
    var search = message.content.substring("+urban ".length);
    var urban = require('./urban.js');
    urban.search(search).then(function(data) {
      // send embed
      var embed = new Discord.MessageEmbed();
      embed.setTitle(search);
      embed.setDescription(data.list[0].definition);
      embed.setColor(0x9C27B0);
      embed.setFooter('Powered by Urban Dictionary');
      
      message.channel.send(embed);
    }).catch(function(err) {
      message.channel.send('Error: ' + err);
    });
  },
  // prune command
  prune: function(message) {
    // prevent non-admins from pruning
    if (message.member.roles.cache.some(role => role.name === 'Admin')) {
      var count = message.content.substring("+prune ".length);
      message.channel.bulkDelete(Number(count));
      // send confirmation
      message.channel.send('Deleted ' + count + ' messages.');
    } else {
      // send confirmation
      message.channel.send('You are not an admin!');
    }
  },
  // eval command
  eval: function(message) {
    var equation = message.content.substring("+eval ".length);
    var eval = require('./eval.js');
    eval.evaluate(equation).then(function(result) {
      // send embed
      var embed = new Discord.MessageEmbed();
      embed.setTitle('Result');
      // display original code in embed footer not in a code block
      embed.setFooter(equation);
      embed.setDescription(result);
      embed.setColor(0x0FADED);
      
      message.channel.send(embed);
    }).catch(function(err) {
      message.channel.send('Error: ' + err);
    });
  },
  // about command
  about: function(message) {
    var embed = new Discord.MessageEmbed();
    embed.setColor(0x00ff00);
    embed.setTitle('About');
    embed.setDescription('This bot was created using GitHub Copilot. Almost all of this functionality was generated using the AI.');
    embed.setFooter('Powered by Discord.js');

    message.channel.send({embed});
  },
  // flipimage command
  flipimage: function(message) {
    // get the attachment
    var attachment = message.attachments.first();
    // get the attachment url
    var url = attachment.url;
    var images = require('./images.js');
    images.flip(url).then(function(result) {
      // create an attachment using the result buffer
      var attachment = new Discord.MessageAttachment(result, 'flipped.png');
      // send the attachment
      message.channel.send(attachment);
    }).catch(function(err) {
      message.channel.send('Error: ' + err);
    });
  },
  // mute command
  mute: function(message) {
    // prevent non-admins from muting
    if (message.member.roles.cache.some(role => role.name === 'Admin')) {
      // get the user id
      var userId = message.mentions.users.first().id;
      // get the user
      var user = message.guild.member(userId);
      // get the role
      var role = message.guild.roles.cache.find(role => role.name === 'Muted');
      // abort if the role is not found
      if (role === undefined) {
        message.channel.send('The Muted role is not found!');
        return;
      }
      // add the role to the user
      user.roles.add(role);
      // send confirmation
      message.channel.send('Muted ' + user.user.username + '!');
    } else {
      // send confirmation
      message.channel.send('You are not an admin!');
    }
  },
  // unmute command
  unmute: function(message) {
    // prevent non-admins from muting
    if (message.member.roles.cache.some(role => role.name === 'Admin')) {

      // get the user id
      var userId = message.mentions.users.first().id;
      // get the user
      var user = message.guild.member(userId);
      // get the role
      var role = message.guild.roles.cache.find(role => role.name === 'Muted');
      // abort if the role is not found
      if (role === undefined) {
        message.channel.send('The Muted role is not found!');
        return;
      }
      // remove the role from the user
      user.roles.remove(role);
      // send confirmation
      message.channel.send('Unmuted ' + user.user.username + '!');
    } else {
      // send confirmation
      message.channel.send('You are not an admin!');
    }
  },
  // kick command
  kick: function(message) {
    // prevent non-admins from kicking
    if (message.member.roles.cache.some(role => role.name === 'Admin')) {
      // get the user id
      var userId = message.mentions.users.first().id;
      // get the user
      var user = message.guild.member(userId);
      // kick the user
      user.kick();
      // send confirmation
      message.channel.send('Kicked ' + user.user.username + '!');
    } else {
      // send confirmation
      message.channel.send('You are not an admin!');
    }
  },
  // ban command
  ban: function(message) {
    // prevent non-admins from banning
    if (message.member.roles.cache.some(role => role.name === 'Admin')) {
      // get the user id
      var userId = message.mentions.users.first().id;
      // get the user
      var user = message.guild.member(userId);
      // ban the user
      user.ban();
      // send confirmation
      message.channel.send('Banned ' + user.user.username + '!');
    } else {
      // send confirmation
      message.channel.send('You are not an admin!');
    }
  },
  // unban command
  unban: function(message) {
    // prevent non-admins from unbaning
    if (message.member.roles.cache.some(role => role.name === 'Admin')) {
      // get the user id
      var userId = message.mentions.users.first().id;
      // get the user
      var user = message.guild.member(userId);
      // unban the user
      user.unban();
      // send confirmation
      message.channel.send('Unbanned ' + user.user.username + '!');
    } else {
      // send confirmation
      message.channel.send('You are not an admin!');
    }
  },
  // shutdown command
  shutdown: function(message) {
    // prevent non-admins from shutting down
    if (message.member.roles.cache.some(role => role.name === 'Admin')) {
      // send confirmation
      message.channel.send('Shutting down...');
      // shutdown the bot
      process.exit();
    } else {
      // send confirmation
      message.channel.send('You are not an admin!');
    }
  },
  // status command
  status: function(message) {
    // get the status
    var status = require('./status.js');
    // get the status
    var status = status.getStatus();
    // send embed
    var embed = new Discord.MessageEmbed();
    embed.setColor(0x00ff00);
    embed.setTitle('Status');
    description = 'The bot is currently **running**.';
    // add details about the process
    if (status.pid) {
      description += '\nThe process is running with pid ' + status.pid + '.';
    }
    // add details about the uptime
    if (status.uptime) {
      description += '\nThe bot has been running for ' + Math.floor(status.uptime / 60) + ' minutes.';
    }
    // add details about the memory
    if (status.memory) {
      description += '\nThe bot has ' + (status.memory.used / (1024 * 1024)).toFixed(2) + ' MB of memory used.';
    }
    // add the status description
    embed.setDescription(description);
    embed.setFooter('Powered by Discord.js');

    message.channel.send(embed);
  },
  // invite command
  invite: function(message) {
    // get the invite
    var invite = require('./invite.js');
    // get the invite
    var invite = invite.getInvite();
    // send the invite
    message.channel.send(invite);
  },
  // server command
  server: function(message) {
    // get the server
    var server = require('./server.js');
    // get the server
    var server = server.getServer(message.guild);
    // send the server
    message.channel.send(server);
  },
  // userinfo command
  userinfo: function(message) {
    // get the user
    var user = require('./users.js');
    // abort if no user was provided
    if (!message.mentions.users.first()) {
      // send error
      message.channel.send('Please mention a user!');
      return;
    }
    // get the guild member
    var member = message.guild.members.cache.find(member => member.user.id === message.mentions.users.first().id);
    // get the user
    var user = user.getUser(message.mentions.users.first(), member);
    // send the user
    message.channel.send(user);
  }
};

client.on('ready', () => {
  console.log('Logged in as ' + client.user.username);
});

client.on('message', message => {
  // ignore messages from bot itself
  if (message.author.bot) return;
  if (message.content.startsWith(prefix)) {
    let command = message.content.substring(prefix.length);
    // split command into arguments
    let args = command.split(' ');
    if (commands[args[0]]) {
      commands[args[0]](message);
    }
  }
});

client.login(config.token);