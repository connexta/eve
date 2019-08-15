# Utils

## Emojis
Emoji utilities for adding emoji support in the slack components.

### emojis.json
JSON emoji library containing data on a massive list of emojis. The original github library can be found [here](https://github.com/iamcal/emoji-data). For slack, the data used is the `unified` and `short_name` properties, giving access to the unicode and name respectively.

### emojiUtil.js
Function for returning the html for an emoji, when given its name.

## Constants.js
Contains useful constants for colors and fonts used.

## Link.js
Contains useful links for use with the jenkins API calls.

## TimeUtils.js
Contains helper functions and constants for dealing with time. Included are constants for converting ms to seconds, minutes, or hours. Also included are functions for calculating relative time difference between a start and end as well as other helper functions.
Whenever a function requires time in ms to be given as a parameter, use `TimeUtils.js`.
