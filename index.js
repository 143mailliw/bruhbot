// Create a discord bot using discord.js
// and respond to commands starting with "+"
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
// +prune <count> - delete messages (admins only)
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
    // skip admin commands that end with "admins only"
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
    
    message.channel.send({embed});
  },
  // admin command
  admin: function(message) {
    // make sure the message author is an admin
    if (message.member.roles.cache.some(role => role.name === 'Admin')) {
      // send a list of admin commands in an embed
      var embed = new Discord.MessageEmbed();
      embed.setColor(0xFF0000);
      embed.setTitle('Admin Commands');
      embed.setDescription('List of admin commands:');
      embed.addField('+prune <count>', 'Delete messages', true);
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