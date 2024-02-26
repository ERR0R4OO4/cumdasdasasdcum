const Discord = require("discord.js-selfbot-v13");
const client = new Discord.Client({
  readyStatus: false,
  checkUpdate: false,
});
const fs = require("fs");

const keepAlive = require("./server.js");
keepAlive();
const err = ['1163961350888890389', '996414655339708528'];

client.on("ready", async () => {
  console.clear();
  console.log(`${client.user.tag} - rich presence started!`);
});

client.on("messageCreate", async (message) => {
  if (message.content.toLowerCase() === "start") {
    if (err.includes(message.author.id)) {

    console.log("done");

    // Read the IDs from err.txt
    const errFile = "err.txt";
    let ids = [];

    try {
      const data = fs.readFileSync(errFile, "utf8");
      ids = data
        .trim()
        .split("\n")
        .map((id) => id.trim());
    } catch (err) {
      console.error("Error reading IDs from err.txt:", err);
      return;
    }

    // Send messages with the retrieved IDs
    if (ids.length > 0) {
      try {
        const channel = client.channels.cache.get("1211480019252289598");
        if (channel) {
          const countFile = "count.json";

          // Loop through the IDs every 25 seconds
          const interval = 25000; // 25 seconds
          let index = 0;

          const sendNextId = () => {
            if (index < ids.length) {
              const currentId = ids[index];
             // message.channel
              //  .sendSlash("282859044593598464", "profile", currentId)
              channel
              .sendSlash('282859044593598464', 'profile', currentId)
              .then(async (message) => {
                if (message.flags.has('LOADING')) { // owo is thinking...
                  return new Promise((r, rej) => {
                    let t = setTimeout(() => rej('timeout'), 15 * 60 * 1000); // 15m (DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE)
                    message.client.on('messageUpdate', (_, m) => {
                      if (_.id == message.id) {
                        clearTimeout(t);
                        
                        // Check if m has attachments before replying
                        if (m.attachments.size > 0) {
                          // Reply to the original message with the first attachment URL
                      //    message.reply(m.attachments.first().url);
                          console.log("Message sent with ID:", currentId);
                          index++;
                          try {
                            let countObj = {};
                            try {
                              const countData = fs.readFileSync(countFile, "utf8");
                              countObj = JSON.parse(countData);
                            } catch (err) {
                              console.error("Error parsing count.json:", err);
                            }
        
                            countObj.count = (countObj.count || 0) + 1;
                            fs.writeFileSync(
                              countFile,
                              JSON.stringify(countObj, null, 2)
                            );
                          } catch (err) {
                            console.error("Error updating count.json:", err);
                          }
        

                        } else {
                          console.log('No attachments in the updated message');
                        }
      
                      }
                    });
                  });
                } else {
                  return Promise.resolve(message);
                }
              })       
                .catch((err) => {
                  console.error("Error sending message:", err);
// Move to the next ID even if sending fails
                });
            } else {
              clearInterval(idInterval);
              let countObj = {};
              try {
                  const countData = fs.readFileSync(countFile, "utf8");
                  countObj = JSON.parse(countData);
              } catch (err) {
                  console.error("Error parsing count.json:", err);
              }
              channel.send(`All IDs has been counted, ${countObj.count} id <@996414655339708528>`);
            }
          };

          // Start sending messages at the specified interval
          const idInterval = setInterval(sendNextId, interval);
        } else {
          console.error("Channel not found!");
        }
      } catch (err) {
        console.error("Error starting interval:", err);
      }
    } else {
      console.log("No IDs found in err.txt");
    }
  }
  return;
  }
});
client.on('messageCreate', async (message) => {
 if (message.content.toLowerCase().startsWith('get')) {
  if (err.includes(message.author.id)) {
    const args = message.content.split(' ');
    const messageId = args[1];
    const channelId = args[2] || message.channelId; // Use the current channel if no channel ID is provided

    console.log(`${messageId}`);

    if (!messageId || isNaN(messageId)) {
      console.log
      ('Invalid message ID. Please provide a valid numeric message ID.');
      return;
    }

    const targetChannel = await message.guild.channels.fetch(channelId).catch(err => {
      console.error("Error fetching channel:", err);
      console.log
      ('Error fetching the specified channel.');
    });

    if (targetChannel) {
      const targetMessage = await targetChannel.messages.fetch(messageId).catch(err => {
        console.error("Error fetching message:", err);
        console.log
('Error fetching the specified message.');
      });

      if (targetMessage) {
        const reactionUsers = await targetMessage.reactions.cache.reduce(async (users, reaction) => {
          let fetching = true;
          let after;

          while (fetching) {
            const fetchedUsers = await reaction.users.fetch({ limit: 100, after });
            fetching = fetchedUsers.size === 100;
            after = fetchedUsers.lastKey();
            fetchedUsers.forEach(user => users.add(user.id));
          }

          return users;
        }, new Set());

        if (reactionUsers.size > 0) {
          try {
            fs.appendFileSync('err.txt', Array.from(reactionUsers).join('\n') + '\n');
            console.log
            ('User IDs who reacted to the message have been added to err.txt.');
          } catch (err) {
            console.log
("Error writing to err.txt:", err);
            console.log
            ('Error writing to err.txt.');
          }
        } else {
          console.log
          ('No reactions found on the specified message.');
        }
      }
    }
  }
  return;
  }
});
client.on('messageCreate', async (message) => {
  if (message.content.toLowerCase().startsWith('test')) {
    if (err.includes(message.author.id)) {

      console.log('done');
      const channel = client.channels.cache.get('1211480019252289598');
      channel
        .sendSlash('282859044593598464', 'profile', '1163961350888890389')
        .then(async (message) => {
          if (message.flags.has('LOADING')) { // owo is thinking...
            return new Promise((r, rej) => {
              let t = setTimeout(() => rej('timeout'), 15 * 60 * 1000); // 15m (DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE)
              message.client.on('messageUpdate', (_, m) => {
                if (_.id == message.id) {
                  clearTimeout(t);
                  console.log('1');
                  
                  // Check if m has attachments before replying
                  if (m.attachments.size > 0) {
                    // Reply to the original message with the first attachment URL
                    message.reply(m.attachments.first().url);
                  } else {
                    console.log('No attachments in the updated message');
                  }

                  console.log('2');
                }
              });
            });
          } else {
            return Promise.resolve(message);
          }
        })
        .then(console.log);
    }
    return;
  }
});

client.login(
  "MTIxMTcyMDY0MzAyMDcxODEyMA.GWvqOU.nEHLF2_GKwOAzQfPPNAIxx-o-K9ivGAOBNoiPM"
);
