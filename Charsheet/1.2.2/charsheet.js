/**
 * Generates a blank character sheet for any player in the campaign.
 *
 * Syntax: !charsheet
 */

var Charsheet = Charsheet || {};
var charName;

on("chat:message", function(msg) {
    // Exit if not an api command
    if (msg.type != "api") {
        return;
    }

    if (msg.content.indexOf('!charsheet') != -1) {
        // replace the !charsheet command with nothing, leaving just the character name behind
        charName = msg.content;
        charName = charName.replace('!charsheet ', '');
        Charsheet.Generate(msg);
    }
});

Charsheet.Generate = function(msg) {
        var generatorversion = "1.2.1";
        var playerid         = msg.playerid;
        var player           = msg.who;

        /**
         * Templates
         */
        var template = {
          "gmnotes": "Player: " + player +
            "<br>Generated By: CharacterSheet " + generatorversion,
          "charactername": charName // use character name from the message content which should be replaced on line 17
        }
        template.channelalert = "created a character named \"" +
          template.charactername + "\"!";

        /**
         * Permissions
         *
         * Valid values are "all" or comma-delimited list of player IDs.
         */
        /* Who can view the sheet */
        var viewableBy   = "all";
        /* Who can edit the sheet */
        var controlledby = playerid;

        /**
         * Character generation
         */
        /* Create the base character object */
        var character = createObj("character", {
            name:             template.charactername,
            archived:         false,
            inplayerjournals: viewableBy,
            controlledby:     controlledby
        });
        /* Set GM Notes */
        character.set("gmnotes", template.gmnotes);
        /* Set Player's name */
        createObj("attribute", {
            name:         "player_name",
            current:      player,
            _characterid: character.id
        });
        /* Set Character's name */
        createObj("attribute", {
            name:         "name",
            current:      template.charactername,
            _characterid: character.id
        });
        /* Set script version, used for debugging */
        createObj("attribute", {
            name:         "sheet_generator",
            current:      "CharacterSheet v" + generatorversion,
            _characterid: character.id
        });

        sendChat(player, "/me " + template.channelalert);
};
