export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type DateRange = {
  __typename?: "DateRange";
  start?: Maybe<Scalars["String"]>;
  end?: Maybe<Scalars["String"]>;
};

export type DestinyActivityChallengeDefinition = {
  __typename?: "DestinyActivityChallengeDefinition";
  /** The hash for the Objective that matches this challenge. Use it to look up the DestinyObjectiveDefinition. */
  objectiveHash?: Maybe<Scalars["Float"]>;
  objective?: Maybe<DestinyObjectiveDefinition>;
  /**
   * The rewards as they're represented in the UI. Note that they generally link to "dummy" items that give a summary of rewards rather than direct, real items themselves.
   * If the quantity is 0, don't show the quantity.
   */
  dummyRewards?: Maybe<Array<Maybe<DestinyItemQuantity>>>;
};

export type DestinyActivityDefinition = {
  __typename?: "DestinyActivityDefinition";
  /** The title, subtitle, and icon for the activity. We do a little post-processing on this to try and account for Activities where the designers have left this data too minimal to determine what activity is actually being played. */
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /** The unadulterated form of the display properties, as they ought to be shown in the Director (if the activity appears in the director). */
  originalDisplayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /** The title, subtitle, and icon for the activity as determined by Selection Screen data, if there is any for this activity. There won't be data in this field if the activity is never shown in a selection/options screen. */
  selectionScreenDisplayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /** If the activity has an icon associated with a specific release (such as a DLC), this is the path to that release's icon. */
  releaseIcon?: Maybe<Scalars["String"]>;
  /** If the activity will not be visible until a specific and known time, this will be the seconds since the Epoch when it will become visible. */
  releaseTime?: Maybe<Scalars["Int"]>;
  /** The recommended light level for this activity. */
  activityLightLevel?: Maybe<Scalars["Int"]>;
  /** The hash identifier for the Destination on which this Activity is played. Use it to look up the DestinyDestinationDefinition for human readable info about the destination. A Destination can be thought of as a more specific location than a "Place". For instance, if the "Place" is Earth, the "Destination" would be a specific city or region on Earth. */
  destinationHash?: Maybe<Scalars["Float"]>;
  destination?: Maybe<DestinyDestinationDefinition>;
  /** The hash identifier for the "Place" on which this Activity is played. Use it to look up the DestinyPlaceDefinition for human readable info about the Place. A Place is the largest-scoped concept for location information. For instance, if the "Place" is Earth, the "Destination" would be a specific city or region on Earth. */
  placeHash?: Maybe<Scalars["Float"]>;
  place?: Maybe<DestinyPlaceDefinition>;
  /** The hash identifier for the Activity Type of this Activity. You may use it to look up the DestinyActivityTypeDefinition for human readable info, but be forewarned: Playlists and many PVP Map Activities will map to generic Activity Types. You'll have to use your knowledge of the Activity Mode being played to get more specific information about what the user is playing. */
  activityTypeHash?: Maybe<Scalars["Float"]>;
  activityType?: Maybe<DestinyActivityTypeDefinition>;
  /** The difficulty tier of the activity. */
  tier?: Maybe<Scalars["Int"]>;
  /** When Activities are completed, we generate a "Post-Game Carnage Report", or PGCR, with details about what happened in that activity (how many kills someone got, which team won, etc...) We use this image as the background when displaying PGCR information, and often use it when we refer to the Activity in general. */
  pgcrImage?: Maybe<Scalars["String"]>;
  /** The expected possible rewards for the activity. These rewards may or may not be accessible for an individual player based on their character state, the account state, and even the game's state overall. But it is a useful reference for possible rewards you can earn in the activity. These match up to rewards displayed when you hover over the Activity in the in-game Director, and often refer to Placeholder or "Dummy" items: items that tell you what you can earn in vague terms rather than what you'll specifically be earning (partly because the game doesn't even know what you'll earn specifically until you roll for it at the end) */
  rewards?: Maybe<Array<Maybe<DestinyActivityRewardDefinition>>>;
  /** Activities can have Modifiers, as defined in DestinyActivityModifierDefinition. These are references to the modifiers that *can* be applied to that activity, along with data that we use to determine if that modifier is actually active at any given point in time. */
  modifiers?: Maybe<Array<Maybe<DestinyActivityModifierReferenceDefinition>>>;
  /** If True, this Activity is actually a Playlist that refers to multiple possible specific Activities and Activity Modes. For instance, a Crucible Playlist may have references to multiple Activities (Maps) with multiple Activity Modes (specific PvP gameplay modes). If this is true, refer to the playlistItems property for the specific entries in the playlist. */
  isPlaylist?: Maybe<Scalars["Boolean"]>;
  /** An activity can have many Challenges, of which any subset of them may be active for play at any given period of time. This gives the information about the challenges and data that we use to understand when they're active and what rewards they provide. Sadly, at the moment there's no central definition for challenges: much like "Skulls" were in Destiny 1, these are defined on individual activities and there can be many duplicates/near duplicates across the Destiny 2 ecosystem. I have it in mind to centralize these in a future revision of the API, but we are out of time. */
  challenges?: Maybe<Array<Maybe<DestinyActivityChallengeDefinition>>>;
  /** If there are status strings related to the activity and based on internal state of the game, account, or character, then this will be the definition of those strings and the states needed in order for the strings to be shown. */
  optionalUnlockStrings?: Maybe<
    Array<Maybe<DestinyActivityUnlockStringDefinition>>
  >;
  /** Represents all of the possible activities that could be played in the Playlist, along with information that we can use to determine if they are active at the present time. */
  playlistItems?: Maybe<Array<Maybe<DestinyActivityPlaylistItemDefinition>>>;
  /** Unfortunately, in practice this is almost never populated. In theory, this is supposed to tell which Activity Graph to show if you bring up the director while in this activity. */
  activityGraphList?: Maybe<
    Array<Maybe<DestinyActivityGraphListEntryDefinition>>
  >;
  /** This block of data provides information about the Activity's matchmaking attributes: how many people can join and such. */
  matchmaking?: Maybe<DestinyActivityMatchmakingBlockDefinition>;
  /** This block of data, if it exists, provides information about the guided game experience and restrictions for this activity. If it doesn't exist, the game is not able to be played as a guided game. */
  guidedGame?: Maybe<DestinyActivityGuidedBlockDefinition>;
  /** If this activity had an activity mode directly defined on it, this will be the hash of that mode. */
  directActivityModeHash?: Maybe<Scalars["Float"]>;
  directActivityMode?: Maybe<DestinyActivityModeDefinition>;
  /** If the activity had an activity mode directly defined on it, this will be the enum value of that mode. */
  directActivityModeType?: Maybe<Scalars["Int"]>;
  /** The set of all possible loadout requirements that could be active for this activity. Only one will be active at any given time, and you can discover which one through activity-associated data such as Milestones that have activity info on them. */
  loadouts?: Maybe<Array<Maybe<DestinyActivityLoadoutRequirementSet>>>;
  /** The hash identifiers for Activity Modes relevant to this activity.  Note that if this is a playlist, the specific playlist entry chosen will determine the actual activity modes that end up being relevant. */
  activityModeHashes?: Maybe<Array<Maybe<Scalars["Float"]>>>;
  activityMode?: Maybe<DestinyActivityModeDefinition>;
  /** The activity modes - if any - in enum form. Because we can't seem to escape the enums. */
  activityModeTypes?: Maybe<Array<Maybe<Scalars["Int"]>>>;
  /** If true, this activity is a PVP activity or playlist. */
  isPvP?: Maybe<Scalars["Boolean"]>;
  /** The list of phases or points of entry into an activity, along with information we can use to determine their gating and availability. */
  insertionPoints?: Maybe<
    Array<Maybe<DestinyActivityInsertionPointDefinition>>
  >;
  /** A list of location mappings that are affected by this activity. Pulled out of DestinyLocationDefinitions for our/your lookup convenience. */
  activityLocationMappings?: Maybe<
    Array<Maybe<DestinyEnvironmentLocationMapping>>
  >;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyActivityGraphArtElementDefinition = {
  __typename?: "DestinyActivityGraphArtElementDefinition";
  /** The position on the map of the art element. */
  position?: Maybe<DestinyPositionDefinition>;
};

export type DestinyActivityGraphConnectionDefinition = {
  __typename?: "DestinyActivityGraphConnectionDefinition";
  sourceNodeHash?: Maybe<Scalars["Float"]>;
  destNodeHash?: Maybe<Scalars["Float"]>;
};

export type DestinyActivityGraphDefinition = {
  __typename?: "DestinyActivityGraphDefinition";
  /** These represent the visual "nodes" on the map's view. These are the activities you can click on in the map. */
  nodes?: Maybe<Array<Maybe<DestinyActivityGraphNodeDefinition>>>;
  /** Represents one-off/special UI elements that appear on the map. */
  artElements?: Maybe<Array<Maybe<DestinyActivityGraphArtElementDefinition>>>;
  /** Represents connections between graph nodes. However, it lacks context that we'd need to make good use of it. */
  connections?: Maybe<Array<Maybe<DestinyActivityGraphConnectionDefinition>>>;
  /** Objectives can display on maps, and this is supposedly metadata for that. I have not had the time to analyze the details of what is useful within however: we could be missing important data to make this work. Expect this property to be expanded on later if possible. */
  displayObjectives?: Maybe<
    Array<Maybe<DestinyActivityGraphDisplayObjectiveDefinition>>
  >;
  /** Progressions can also display on maps, but similarly to displayObjectives we appear to lack some required information and context right now. We will have to look into it later and add more data if possible. */
  displayProgressions?: Maybe<
    Array<Maybe<DestinyActivityGraphDisplayProgressionDefinition>>
  >;
  /** Represents links between this Activity Graph and other ones. */
  linkedGraphs?: Maybe<Array<Maybe<DestinyLinkedGraphDefinition>>>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyActivityGraphDisplayObjectiveDefinition = {
  __typename?: "DestinyActivityGraphDisplayObjectiveDefinition";
  /** $NOTE $amola 2017-01-19 This field is apparently something that CUI uses to manually wire up objectives to display info. I am unsure how it works. */
  id?: Maybe<Scalars["Float"]>;
  /** The objective being shown on the map. */
  objectiveHash?: Maybe<Scalars["Float"]>;
  objective?: Maybe<DestinyObjectiveDefinition>;
};

export type DestinyActivityGraphDisplayProgressionDefinition = {
  __typename?: "DestinyActivityGraphDisplayProgressionDefinition";
  id?: Maybe<Scalars["Float"]>;
  progressionHash?: Maybe<Scalars["Float"]>;
};

export type DestinyActivityGraphListEntryDefinition = {
  __typename?: "DestinyActivityGraphListEntryDefinition";
  /** The hash identifier of the DestinyActivityGraphDefinition that should be shown when opening the director. */
  activityGraphHash?: Maybe<Scalars["Float"]>;
  activityGraph?: Maybe<DestinyActivityGraphDefinition>;
};

export type DestinyActivityGraphNodeActivityDefinition = {
  __typename?: "DestinyActivityGraphNodeActivityDefinition";
  /** An identifier for this node activity. It is only guaranteed to be unique within the Activity Graph. */
  nodeActivityId?: Maybe<Scalars["Float"]>;
  /** The activity that will be activated if the user clicks on this node. Controls all activity-related information displayed on the node if it is active (the text shown in the tooltip etc) */
  activityHash?: Maybe<Scalars["Float"]>;
  activity?: Maybe<DestinyActivityDefinition>;
};

export type DestinyActivityGraphNodeDefinition = {
  __typename?: "DestinyActivityGraphNodeDefinition";
  /** An identifier for the Activity Graph Node, only guaranteed to be unique within its parent Activity Graph. */
  nodeId?: Maybe<Scalars["Float"]>;
  /** The node *may* have display properties that override the active Activity's display properties. */
  overrideDisplay?: Maybe<DestinyDisplayPropertiesDefinition>;
  /** The position on the map for this node. */
  position?: Maybe<DestinyPositionDefinition>;
  /** The node may have various visual accents placed on it, or styles applied. These are the list of possible styles that the Node can have. The game iterates through each, looking for the first one that passes a check of the required game/character/account state in order to show that style, and then renders the node in that style. */
  featuringStates?: Maybe<
    Array<Maybe<DestinyActivityGraphNodeFeaturingStateDefinition>>
  >;
  /** The node may have various possible activities that could be active for it, however only one may be active at a time. See the DestinyActivityGraphNodeActivityDefinition for details. */
  activities?: Maybe<Array<Maybe<DestinyActivityGraphNodeActivityDefinition>>>;
  /** Represents possible states that the graph node can be in. These are combined with some checking that happens in the game client and server to determine which state is actually active at any given time. */
  states?: Maybe<Array<Maybe<DestinyActivityGraphNodeStateEntry>>>;
};

export type DestinyActivityGraphNodeFeaturingStateDefinition = {
  __typename?: "DestinyActivityGraphNodeFeaturingStateDefinition";
  /** The node can be highlighted in a variety of ways - the game iterates through these and finds the first FeaturingState that is valid at the present moment given the Game, Account, and Character state, and renders the node in that state. See the ActivityGraphNodeHighlightType enum for possible values. */
  highlightType?: Maybe<Scalars["Int"]>;
};

export type DestinyActivityGraphNodeStateEntry = {
  __typename?: "DestinyActivityGraphNodeStateEntry";
  state?: Maybe<Scalars["Int"]>;
};

export type DestinyActivityGuidedBlockDefinition = {
  __typename?: "DestinyActivityGuidedBlockDefinition";
  /** The maximum amount of people that can be in the waiting lobby. */
  guidedMaxLobbySize?: Maybe<Scalars["Int"]>;
  /** The minimum amount of people that can be in the waiting lobby. */
  guidedMinLobbySize?: Maybe<Scalars["Int"]>;
  /** If -1, the guided group cannot be disbanded. Otherwise, take the total # of players in the activity and subtract this number: that is the total # of votes needed for the guided group to disband. */
  guidedDisbandCount?: Maybe<Scalars["Int"]>;
};

export type DestinyActivityInsertionPointDefinition = {
  __typename?: "DestinyActivityInsertionPointDefinition";
  /** A unique hash value representing the phase. This can be useful for, for example, comparing how different instances of Raids have phases in different orders! */
  phaseHash?: Maybe<Scalars["Float"]>;
};

export type DestinyActivityLoadoutRequirement = {
  __typename?: "DestinyActivityLoadoutRequirement";
  equipmentSlotHash?: Maybe<Scalars["Float"]>;
  equipmentSlot?: Maybe<DestinyEquipmentSlotDefinition>;
  allowedEquippedItemHashes?: Maybe<Array<Maybe<Scalars["Float"]>>>;
  allowedEquippedItem?: Maybe<DestinyInventoryItemDefinition>;
  allowedWeaponSubTypes?: Maybe<Array<Maybe<Scalars["Int"]>>>;
};

export type DestinyActivityLoadoutRequirementSet = {
  __typename?: "DestinyActivityLoadoutRequirementSet";
  /** The set of requirements that will be applied on the activity if this requirement set is active. */
  requirements?: Maybe<Array<Maybe<DestinyActivityLoadoutRequirement>>>;
};

export type DestinyActivityMatchmakingBlockDefinition = {
  __typename?: "DestinyActivityMatchmakingBlockDefinition";
  /** If TRUE, the activity is matchmade. Otherwise, it requires explicit forming of a party. */
  isMatchmade?: Maybe<Scalars["Boolean"]>;
  /** The minimum # of people in the fireteam for the activity to launch. */
  minParty?: Maybe<Scalars["Int"]>;
  /** The maximum # of people allowed in a Fireteam. */
  maxParty?: Maybe<Scalars["Int"]>;
  /** The maximum # of people allowed across all teams in the activity. */
  maxPlayers?: Maybe<Scalars["Int"]>;
  /** If true, you have to Solemnly Swear to be up to Nothing But Good(tm) to play. */
  requiresGuardianOath?: Maybe<Scalars["Boolean"]>;
};

export type DestinyActivityModeDefinition = {
  __typename?: "DestinyActivityModeDefinition";
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /** If this activity mode has a related PGCR image, this will be the path to said image. */
  pgcrImage?: Maybe<Scalars["String"]>;
  /** The Enumeration value for this Activity Mode. Pass this identifier into Stats endpoints to get aggregate stats for this mode. */
  modeType?: Maybe<Scalars["Int"]>;
  /** The type of play being performed in broad terms (PVP, PVE) */
  activityModeCategory?: Maybe<Scalars["Int"]>;
  /**
   * If True, this mode has oppositional teams fighting against each other rather than "Free-For-All" or Co-operative modes of play.
   * Note that Aggregate modes are never marked as team based, even if they happen to be team based at the moment. At any time, an aggregate whose subordinates are only team based could be changed so that one or more aren't team based, and then this boolean won't make much sense (the aggregation would become "sometimes team based"). Let's not deal with that right now.
   */
  isTeamBased?: Maybe<Scalars["Boolean"]>;
  /** If true, this mode is an aggregation of other, more specific modes rather than being a mode in itself. This includes modes that group Features/Events rather than Gameplay, such as Trials of The Nine: Trials of the Nine being an Event that is interesting to see aggregate data for, but when you play the activities within Trials of the Nine they are more specific activity modes such as Clash. */
  isAggregateMode?: Maybe<Scalars["Boolean"]>;
  /** The hash identifiers of the DestinyActivityModeDefinitions that represent all of the "parent" modes for this mode. For instance, the Nightfall Mode is also a member of AllStrikes and AllPvE. */
  parentHashes?: Maybe<Array<Maybe<Scalars["Float"]>>>;
  /** A Friendly identifier you can use for referring to this Activity Mode. We really only used this in our URLs, so... you know, take that for whatever it's worth. */
  friendlyName?: Maybe<Scalars["String"]>;
  /** If FALSE, we want to ignore this type when we're showing activity modes in BNet UI. It will still be returned in case 3rd parties want to use it for any purpose. */
  display?: Maybe<Scalars["Boolean"]>;
  /** The relative ordering of activity modes. */
  order?: Maybe<Scalars["Int"]>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyActivityModifierDefinition = {
  __typename?: "DestinyActivityModifierDefinition";
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyActivityModifierReferenceDefinition = {
  __typename?: "DestinyActivityModifierReferenceDefinition";
  /** The hash identifier for the DestinyActivityModifierDefinition referenced by this activity. */
  activityModifierHash?: Maybe<Scalars["Float"]>;
  activityModifier?: Maybe<DestinyActivityModifierDefinition>;
};

export type DestinyActivityPlaylistItemDefinition = {
  __typename?: "DestinyActivityPlaylistItemDefinition";
  /** The hash identifier of the Activity that can be played. Use it to look up the DestinyActivityDefinition. */
  activityHash?: Maybe<Scalars["Float"]>;
  activity?: Maybe<DestinyActivityDefinition>;
  /** If this playlist entry had an activity mode directly defined on it, this will be the hash of that mode. */
  directActivityModeHash?: Maybe<Scalars["Float"]>;
  directActivityMode?: Maybe<DestinyActivityModeDefinition>;
  /** If the playlist entry had an activity mode directly defined on it, this will be the enum value of that mode. */
  directActivityModeType?: Maybe<Scalars["Int"]>;
  /** The hash identifiers for Activity Modes relevant to this entry. */
  activityModeHashes?: Maybe<Array<Maybe<Scalars["Float"]>>>;
  activityMode?: Maybe<DestinyActivityModeDefinition>;
  /** The activity modes - if any - in enum form. Because we can't seem to escape the enums. */
  activityModeTypes?: Maybe<Array<Maybe<Scalars["Int"]>>>;
};

export type DestinyActivityRewardDefinition = {
  __typename?: "DestinyActivityRewardDefinition";
  /** The header for the reward set, if any. */
  rewardText?: Maybe<Scalars["String"]>;
  /**
   * The "Items provided" in the reward. This is almost always a pointer to a DestinyInventoryItemDefintion for an item that you can't actually earn in-game, but that has name/description/icon information for the vague concept of the rewards you will receive. This is because the actual reward generation is non-deterministic and extremely complicated, so the best the game can do is tell you what you'll get in vague terms. And so too shall we.
   * Interesting trivia: you actually *do* earn these items when you complete the activity. They go into a single-slot bucket on your profile, which is how you see the pop-ups of these rewards when you complete an activity that match these "dummy" items. You can even see them if you look at the last one you earned in your profile-level inventory through the BNet API! Who said reading documentation is a waste of time?
   */
  rewardItems?: Maybe<Array<Maybe<DestinyItemQuantity>>>;
};

export type DestinyActivityTypeDefinition = {
  __typename?: "DestinyActivityTypeDefinition";
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyActivityUnlockStringDefinition = {
  __typename?: "DestinyActivityUnlockStringDefinition";
  /** The string to be displayed if the conditions are met. */
  displayString?: Maybe<Scalars["String"]>;
};

export type DestinyAnimationReference = {
  __typename?: "DestinyAnimationReference";
  animName?: Maybe<Scalars["String"]>;
  animIdentifier?: Maybe<Scalars["String"]>;
  path?: Maybe<Scalars["String"]>;
};

export type DestinyArtDyeReference = {
  __typename?: "DestinyArtDyeReference";
  artDyeChannelHash?: Maybe<Scalars["Float"]>;
};

export type DestinyArtifactDefinition = {
  __typename?: "DestinyArtifactDefinition";
  /** Any basic display info we know about the Artifact. Currently sourced from a related inventory item, but the source of this data is subject to change. */
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /** Any Geometry/3D info we know about the Artifact. Currently sourced from a related inventory item's gearset information, but the source of this data is subject to change. */
  translationBlock?: Maybe<DestinyItemTranslationBlockDefinition>;
  /** Any Tier/Rank data related to this artifact, listed in display order.  Currently sourced from a Vendor, but this source is subject to change. */
  tiers?: Maybe<Array<Maybe<DestinyArtifactTierDefinition>>>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyArtifactTierDefinition = {
  __typename?: "DestinyArtifactTierDefinition";
  /** An identifier, unique within the Artifact, for this specific tier. */
  tierHash?: Maybe<Scalars["Float"]>;
  /** The human readable title of this tier, if any. */
  displayTitle?: Maybe<Scalars["String"]>;
  /** A string representing the localized minimum requirement text for this Tier, if any. */
  progressRequirementMessage?: Maybe<Scalars["String"]>;
  /** The items that can be earned within this tier. */
  items?: Maybe<Array<Maybe<DestinyArtifactTierItemDefinition>>>;
  /** The minimum number of "unlock points" that you must have used before you can unlock items from this tier. */
  minimumUnlockPointsUsedRequirement?: Maybe<Scalars["Int"]>;
};

export type DestinyArtifactTierItemDefinition = {
  __typename?: "DestinyArtifactTierItemDefinition";
  /** The identifier of the Plug Item unlocked by activating this item in the Artifact. */
  itemHash?: Maybe<Scalars["Float"]>;
};

export type DestinyBreakerTypeDefinition = {
  __typename?: "DestinyBreakerTypeDefinition";
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /** We have an enumeration for Breaker types for quick reference. This is the current definition's breaker type enum value. */
  enumValue?: Maybe<Scalars["Int"]>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyBubbleDefinition = {
  __typename?: "DestinyBubbleDefinition";
  /** The identifier for the bubble: only guaranteed to be unique within the Destination. */
  hash?: Maybe<Scalars["Float"]>;
  /** The display properties of this bubble, so you don't have to look them up in a separate list anymore. */
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
};

export type DestinyChecklistDefinition = {
  __typename?: "DestinyChecklistDefinition";
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /** A localized string prompting you to view the checklist. */
  viewActionString?: Maybe<Scalars["String"]>;
  /** Indicates whether you will find this checklist on the Profile or Character components. */
  scope?: Maybe<Scalars["Int"]>;
  /** The individual checklist items. Gotta catch 'em all. */
  entries?: Maybe<Array<Maybe<DestinyChecklistEntryDefinition>>>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyChecklistEntryDefinition = {
  __typename?: "DestinyChecklistEntryDefinition";
  /** The identifier for this Checklist entry. Guaranteed unique only within this Checklist Definition, and not globally/for all checklists. */
  hash?: Maybe<Scalars["Float"]>;
  /** Even if no other associations exist, we will give you *something* for display properties. In cases where we have no associated entities, it may be as simple as a numerical identifier. */
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  destinationHash?: Maybe<Scalars["Float"]>;
  destination?: Maybe<DestinyDestinationDefinition>;
  locationHash?: Maybe<Scalars["Float"]>;
  location?: Maybe<DestinyLocationDefinition>;
  /**
   * Note that a Bubble's hash doesn't uniquely identify a "top level" entity in Destiny. Only the combination of location and bubble can uniquely identify a place in the world of Destiny: so if bubbleHash is populated, locationHash must too be populated for it to have any meaning.
   * You can use this property if it is populated to look up the DestinyLocationDefinition's associated .locationReleases[].activityBubbleName property.
   */
  bubbleHash?: Maybe<Scalars["Float"]>;
  activityHash?: Maybe<Scalars["Float"]>;
  activity?: Maybe<DestinyActivityDefinition>;
  itemHash?: Maybe<Scalars["Float"]>;
  item?: Maybe<DestinyInventoryItemDefinition>;
  vendorHash?: Maybe<Scalars["Float"]>;
  vendorInteractionIndex?: Maybe<Scalars["Int"]>;
  /** The scope at which this specific entry can be computed. */
  scope?: Maybe<Scalars["Int"]>;
};

export type DestinyClassDefinition = {
  __typename?: "DestinyClassDefinition";
  /** In Destiny 1, we added a convenience Enumeration for referring to classes. We've kept it, though mostly for posterity. This is the enum value for this definition's class. */
  classType?: Maybe<Scalars["Int"]>;
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  genderedClassNamesByGender?: Maybe<DestinyGenderDefinition>;
  /** Mentors don't really mean anything anymore. Don't expect this to be populated. */
  mentorVendorHash?: Maybe<Scalars["Float"]>;
  mentorVendor?: Maybe<DestinyVendorDefinition>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyCollectibleAcquisitionBlock = {
  __typename?: "DestinyCollectibleAcquisitionBlock";
  acquireMaterialRequirementHash?: Maybe<Scalars["Float"]>;
  acquireMaterialRequirement?: Maybe<DestinyMaterialRequirementSetDefinition>;
  acquireTimestampUnlockValueHash?: Maybe<Scalars["Float"]>;
  acquireTimestampUnlockValue?: Maybe<DestinyUnlockValueDefinition>;
};

export type DestinyCollectibleDefinition = {
  __typename?: "DestinyCollectibleDefinition";
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /** Indicates whether the state of this Collectible is determined on a per-character or on an account-wide basis. */
  scope?: Maybe<Scalars["Int"]>;
  /** A human readable string for a hint about how to acquire the item. */
  sourceString?: Maybe<Scalars["String"]>;
  /**
   * This is a hash identifier we are building on the BNet side in an attempt to let people group collectibles by similar sources.
   * I can't promise that it's going to be 100% accurate, but if the designers were consistent in assigning the same source strings to items with the same sources, it *ought to* be. No promises though.
   * This hash also doesn't relate to an actual definition, just to note: we've got nothing useful other than the source string for this data.
   */
  sourceHash?: Maybe<Scalars["Float"]>;
  itemHash?: Maybe<Scalars["Float"]>;
  item?: Maybe<DestinyInventoryItemDefinition>;
  acquisitionInfo?: Maybe<DestinyCollectibleAcquisitionBlock>;
  stateInfo?: Maybe<DestinyCollectibleStateBlock>;
  presentationInfo?: Maybe<DestinyPresentationChildBlock>;
  presentationNodeType?: Maybe<Scalars["Int"]>;
  traitIds?: Maybe<Array<Maybe<Scalars["String"]>>>;
  traitHashes?: Maybe<Array<Maybe<Scalars["Float"]>>>;
  trait?: Maybe<DestinyTraitDefinition>;
  /** A quick reference to presentation nodes that have this node as a child. Presentation nodes can be parented under multiple parents. */
  parentNodeHashes?: Maybe<Array<Maybe<Scalars["Float"]>>>;
  parentNode?: Maybe<DestinyPresentationNodeDefinition>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyCollectibleStateBlock = {
  __typename?: "DestinyCollectibleStateBlock";
  obscuredOverrideItemHash?: Maybe<Scalars["Float"]>;
  obscuredOverrideItem?: Maybe<DestinyInventoryItemDefinition>;
  requirements?: Maybe<DestinyPresentationNodeRequirementsBlock>;
};

export type DestinyColor = {
  __typename?: "DestinyColor";
  red?: Maybe<Scalars["String"]>;
  green?: Maybe<Scalars["String"]>;
  blue?: Maybe<Scalars["String"]>;
  alpha?: Maybe<Scalars["String"]>;
};

export type DestinyDamageTypeDefinition = {
  __typename?: "DestinyDamageTypeDefinition";
  /** The description of the damage type, icon etc... */
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /** A variant of the icon that is transparent and colorless. */
  transparentIconPath?: Maybe<Scalars["String"]>;
  /** If TRUE, the game shows this damage type's icon. Otherwise, it doesn't. Whether you show it or not is up to you. */
  showIcon?: Maybe<Scalars["Boolean"]>;
  /** We have an enumeration for damage types for quick reference. This is the current definition's damage type enum value. */
  enumValue?: Maybe<Scalars["Int"]>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyDerivedItemCategoryDefinition = {
  __typename?: "DestinyDerivedItemCategoryDefinition";
  /** The localized string for the category title. This will be something describing the items you can get as a group, or your likelihood/the quantity you'll get. */
  categoryDescription?: Maybe<Scalars["String"]>;
  /** This is the list of all of the items for this category and the basic properties we'll know about them. */
  items?: Maybe<Array<Maybe<DestinyDerivedItemDefinition>>>;
};

export type DestinyDerivedItemDefinition = {
  __typename?: "DestinyDerivedItemDefinition";
  /** The hash for the DestinyInventoryItemDefinition of this derived item, if there is one. Sometimes we are given this information as a manual override, in which case there won't be an actual DestinyInventoryItemDefinition for what we display, but you can still show the strings from this object itself. */
  itemHash?: Maybe<Scalars["Float"]>;
  /** The name of the derived item. */
  itemName?: Maybe<Scalars["String"]>;
  /** Additional details about the derived item, in addition to the description. */
  itemDetail?: Maybe<Scalars["String"]>;
  /** A brief description of the item. */
  itemDescription?: Maybe<Scalars["String"]>;
  /** An icon for the item. */
  iconPath?: Maybe<Scalars["String"]>;
  /** If the item was derived from a "Preview Vendor", this will be an index into the DestinyVendorDefinition's itemList property. Otherwise, -1. */
  vendorItemIndex?: Maybe<Scalars["Int"]>;
};

export type DestinyDestinationBubbleSettingDefinition = {
  __typename?: "DestinyDestinationBubbleSettingDefinition";
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
};

export type DestinyDestinationDefinition = {
  __typename?: "DestinyDestinationDefinition";
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /** The place that "owns" this Destination. Use this hash to look up the DestinyPlaceDefinition. */
  placeHash?: Maybe<Scalars["Float"]>;
  place?: Maybe<DestinyPlaceDefinition>;
  /** If this Destination has a default Free-Roam activity, this is the hash for that Activity. Use it to look up the DestinyActivityDefintion. */
  defaultFreeroamActivityHash?: Maybe<Scalars["Float"]>;
  defaultFreeroamActivity?: Maybe<DestinyActivityDefinition>;
  /** If the Destination has default Activity Graphs (i.e. "Map") that should be shown in the director, this is the list of those Graphs. At most, only one should be active at any given time for a Destination: these would represent, for example, different variants on a Map if the Destination is changing on a macro level based on game state. */
  activityGraphEntries?: Maybe<
    Array<Maybe<DestinyActivityGraphListEntryDefinition>>
  >;
  /**
   * A Destination may have many "Bubbles" zones with human readable properties.
   * We don't get as much info as I'd like about them - I'd love to return info like where on the map they are located - but at least this gives you the name of those bubbles. bubbleSettings and bubbles both have the identical number of entries, and you should match up their indexes to provide matching bubble and bubbleSettings data.
   * DEPRECATED - Just use bubbles, it now has this data.
   */
  bubbleSettings?: Maybe<
    Array<Maybe<DestinyDestinationBubbleSettingDefinition>>
  >;
  /**
   * This provides the unique identifiers for every bubble in the destination (only guaranteed unique within the destination), and any intrinsic properties of the bubble.
   * bubbleSettings and bubbles both have the identical number of entries, and you should match up their indexes to provide matching bubble and bubbleSettings data.
   */
  bubbles?: Maybe<Array<Maybe<DestinyBubbleDefinition>>>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyDisplayCategoryDefinition = {
  __typename?: "DestinyDisplayCategoryDefinition";
  index?: Maybe<Scalars["Int"]>;
  /** A string identifier for the display category. */
  identifier?: Maybe<Scalars["String"]>;
  displayCategoryHash?: Maybe<Scalars["Float"]>;
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /** If true, this category should be displayed in the "Banner" section of the vendor's UI. */
  displayInBanner?: Maybe<Scalars["Boolean"]>;
  /**
   * If it exists, this is the hash identifier of a DestinyProgressionDefinition that represents the progression to show on this display category.
   * Specific categories can now have thier own distinct progression, apparently. So that's cool.
   */
  progressionHash?: Maybe<Scalars["Float"]>;
  progression?: Maybe<DestinyProgressionDefinition>;
  /** If this category sorts items in a nonstandard way, this will be the way we sort. */
  sortOrder?: Maybe<Scalars["Int"]>;
  /** An indicator of how the category will be displayed in the UI. It's up to you to do something cool or interesting in response to this, or just to treat it as a normal category. */
  displayStyleHash?: Maybe<Scalars["Float"]>;
  /** An indicator of how the category will be displayed in the UI. It's up to you to do something cool or interesting in response to this, or just to treat it as a normal category. */
  displayStyleIdentifier?: Maybe<Scalars["String"]>;
};

export type DestinyDisplayPropertiesDefinition = {
  __typename?: "DestinyDisplayPropertiesDefinition";
  description?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  /**
   * Note that "icon" is sometimes misleading, and should be interpreted in the context of the entity. For instance, in Destiny 1 the DestinyRecordBookDefinition's icon was a big picture of a book.
   * But usually, it will be a small square image that you can use as... well, an icon.
   * They are currently represented as 96px x 96px images.
   */
  icon?: Maybe<Scalars["String"]>;
  iconSequences?: Maybe<Array<Maybe<DestinyIconSequenceDefinition>>>;
  /** If this item has a high-res icon (at least for now, many things won't), then the path to that icon will be here. */
  highResIcon?: Maybe<Scalars["String"]>;
  hasIcon?: Maybe<Scalars["Boolean"]>;
};

export type DestinyEnergyCapacityEntry = {
  __typename?: "DestinyEnergyCapacityEntry";
  /** How much energy capacity this plug provides. */
  capacityValue?: Maybe<Scalars["Int"]>;
  /** Energy provided by a plug is always of a specific type - this is the hash identifier for the energy type for which it provides Capacity. */
  energyTypeHash?: Maybe<Scalars["Float"]>;
  /** The Energy Type for this energy capacity, in enum form for easy use. */
  energyType?: Maybe<Scalars["Int"]>;
};

export type DestinyEnergyCostEntry = {
  __typename?: "DestinyEnergyCostEntry";
  /** The Energy cost for inserting this plug. */
  energyCost?: Maybe<Scalars["Int"]>;
  /** The type of energy that this plug costs, as a reference to the DestinyEnergyTypeDefinition of the energy type. */
  energyTypeHash?: Maybe<Scalars["Float"]>;
  /** The type of energy that this plug costs, in enum form. */
  energyType?: Maybe<Scalars["Int"]>;
};

export type DestinyEnergyTypeDefinition = {
  __typename?: "DestinyEnergyTypeDefinition";
  /** The description of the energy type, icon etc... */
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /** A variant of the icon that is transparent and colorless. */
  transparentIconPath?: Maybe<Scalars["String"]>;
  /** If TRUE, the game shows this Energy type's icon. Otherwise, it doesn't. Whether you show it or not is up to you. */
  showIcon?: Maybe<Scalars["Boolean"]>;
  /** We have an enumeration for Energy types for quick reference. This is the current definition's Energy type enum value. */
  enumValue?: Maybe<Scalars["Int"]>;
  /** If this Energy Type can be used for determining the Type of Energy that an item can consume, this is the hash for the DestinyInvestmentStatDefinition that represents the stat which holds the Capacity for that energy type. (Note that this is optional because "Any" is a valid cost, but not valid for Capacity - an Armor must have a specific Energy Type for determining the energy type that the Armor is restricted to use) */
  capacityStatHash?: Maybe<Scalars["Float"]>;
  /** If this Energy Type can be used as a cost to pay for socketing Armor 2.0 items, this is the hash for the DestinyInvestmentStatDefinition that stores the plug's raw cost. */
  costStatHash?: Maybe<Scalars["Float"]>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyEnvironmentLocationMapping = {
  __typename?: "DestinyEnvironmentLocationMapping";
  /** The location that is revealed on the director by this mapping. */
  locationHash?: Maybe<Scalars["Float"]>;
  location?: Maybe<DestinyLocationDefinition>;
  /** A hint that the UI uses to figure out how this location is activated by the player. */
  activationSource?: Maybe<Scalars["String"]>;
  /** If this is populated, it is the item that you must possess for this location to be active because of this mapping. (theoretically, a location can have multiple mappings, and some might require an item while others don't) */
  itemHash?: Maybe<Scalars["Float"]>;
  item?: Maybe<DestinyInventoryItemDefinition>;
  /** If this is populated, this is an objective related to the location. */
  objectiveHash?: Maybe<Scalars["Float"]>;
  objective?: Maybe<DestinyObjectiveDefinition>;
  /** If this is populated, this is the activity you have to be playing in order to see this location appear because of this mapping. (theoretically, a location can have multiple mappings, and some might require you to be in a specific activity when others don't) */
  activityHash?: Maybe<Scalars["Float"]>;
  activity?: Maybe<DestinyActivityDefinition>;
};

export type DestinyEquipmentSlotDefinition = {
  __typename?: "DestinyEquipmentSlotDefinition";
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /** These technically point to "Equipment Category Definitions". But don't get excited. There's nothing of significant value in those definitions, so I didn't bother to expose them. You can use the hash here to group equipment slots by common functionality, which serves the same purpose as if we had the Equipment Category definitions exposed. */
  equipmentCategoryHash?: Maybe<Scalars["Float"]>;
  /** The inventory bucket that owns this equipment slot. */
  bucketTypeHash?: Maybe<Scalars["Float"]>;
  bucketType?: Maybe<DestinyInventoryBucketDefinition>;
  /** If True, equipped items should have their custom art dyes applied when rendering the item. Otherwise, custom art dyes on an item should be ignored if the item is equipped in this slot. */
  applyCustomArtDyes?: Maybe<Scalars["Boolean"]>;
  /** The Art Dye Channels that apply to this equipment slot. */
  artDyeChannels?: Maybe<Array<Maybe<DestinyArtDyeReference>>>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyEquippingBlockDefinition = {
  __typename?: "DestinyEquippingBlockDefinition";
  /** If the item is part of a gearset, this is a reference to that gearset item. */
  gearsetItemHash?: Maybe<Scalars["Float"]>;
  gearsetItem?: Maybe<DestinyInventoryItemDefinition>;
  /**
   * If defined, this is the label used to check if the item has other items of matching types already equipped.
   * For instance, when you aren't allowed to equip more than one Exotic Weapon, that's because all exotic weapons have identical uniqueLabels and the game checks the to-be-equipped item's uniqueLabel vs. all other already equipped items (other than the item in the slot that's about to be occupied).
   */
  uniqueLabel?: Maybe<Scalars["String"]>;
  /** The hash of that unique label. Does not point to a specific definition. */
  uniqueLabelHash?: Maybe<Scalars["Float"]>;
  /** An equipped item *must* be equipped in an Equipment Slot. This is the hash identifier of the DestinyEquipmentSlotDefinition into which it must be equipped. */
  equipmentSlotTypeHash?: Maybe<Scalars["Float"]>;
  equipmentSlotType?: Maybe<DestinyEquipmentSlotDefinition>;
  /**
   * These are custom attributes on the equippability of the item.
   * For now, this can only be "equip on acquire", which would mean that the item will be automatically equipped as soon as you pick it up.
   */
  attributes?: Maybe<Scalars["Int"]>;
  /** Ammo type used by a weapon is no longer determined by the bucket in which it is contained. If the item has an ammo type - i.e. if it is a weapon - this will be the type of ammunition expected. */
  ammoType?: Maybe<Scalars["Int"]>;
  /** These are strings that represent the possible Game/Account/Character state failure conditions that can occur when trying to equip the item. They match up one-to-one with requiredUnlockExpressions. */
  displayStrings?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type DestinyFactionDefinition = {
  __typename?: "DestinyFactionDefinition";
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /** The hash identifier for the DestinyProgressionDefinition that indicates the character's relationship with this faction in terms of experience and levels. */
  progressionHash?: Maybe<Scalars["Float"]>;
  progression?: Maybe<DestinyProgressionDefinition>;
  /** The faction reward item hash, usually an engram. */
  rewardItemHash?: Maybe<Scalars["Float"]>;
  rewardItem?: Maybe<DestinyInventoryItemDefinition>;
  /** The faction reward vendor hash, used for faction engram previews. */
  rewardVendorHash?: Maybe<Scalars["Float"]>;
  rewardVendor?: Maybe<DestinyVendorDefinition>;
  /** List of vendors that are associated with this faction. The last vendor that passes the unlock flag checks is the one that should be shown. */
  vendors?: Maybe<Array<Maybe<DestinyFactionVendorDefinition>>>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyFactionVendorDefinition = {
  __typename?: "DestinyFactionVendorDefinition";
  /** The faction vendor hash. */
  vendorHash?: Maybe<Scalars["Float"]>;
  vendor?: Maybe<DestinyVendorDefinition>;
  /** The hash identifier for a Destination at which this vendor may be located. Each destination where a Vendor may exist will only ever have a single entry. */
  destinationHash?: Maybe<Scalars["Float"]>;
  destination?: Maybe<DestinyDestinationDefinition>;
  /** The relative path to the background image representing this Vendor at this location, for use in a banner. */
  backgroundImagePath?: Maybe<Scalars["String"]>;
};

export type DestinyGearArtArrangementReference = {
  __typename?: "DestinyGearArtArrangementReference";
  classHash?: Maybe<Scalars["Float"]>;
  artArrangementHash?: Maybe<Scalars["Float"]>;
};

export type DestinyGenderDefinition = {
  __typename?: "DestinyGenderDefinition";
  /** This is a quick reference enumeration for all of the currently defined Genders. We use the enumeration for quicker lookups in related data, like DestinyClassDefinition.genderedClassNames. */
  genderType?: Maybe<Scalars["Int"]>;
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyHistoricalStatsDefinition = {
  __typename?: "DestinyHistoricalStatsDefinition";
  /** Unique programmer friendly ID for this stat */
  statId?: Maybe<Scalars["String"]>;
  /** Statistic group */
  group?: Maybe<Scalars["Int"]>;
  /** Time periods the statistic covers */
  periodTypes?: Maybe<Array<Maybe<Scalars["Int"]>>>;
  /** Game modes where this statistic can be reported. */
  modes?: Maybe<Array<Maybe<Scalars["Int"]>>>;
  /** Category for the stat. */
  category?: Maybe<Scalars["Int"]>;
  /** Display name */
  statName?: Maybe<Scalars["String"]>;
  /** Display name abbreviated */
  statNameAbbr?: Maybe<Scalars["String"]>;
  /** Description of a stat if applicable. */
  statDescription?: Maybe<Scalars["String"]>;
  /** Unit, if any, for the statistic */
  unitType?: Maybe<Scalars["Int"]>;
  /** Optional URI to an icon for the statistic */
  iconImage?: Maybe<Scalars["String"]>;
  /** Optional icon for the statistic */
  mergeMethod?: Maybe<Scalars["Int"]>;
  /** Localized Unit Name for the stat. */
  unitLabel?: Maybe<Scalars["String"]>;
  /** Weight assigned to this stat indicating its relative impressiveness. */
  weight?: Maybe<Scalars["Int"]>;
  /** The tier associated with this medal - be it implicitly or explicitly. */
  medalTierHash?: Maybe<Scalars["Float"]>;
};

export type DestinyIconSequenceDefinition = {
  __typename?: "DestinyIconSequenceDefinition";
  frames?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type DestinyInsertPlugActionDefinition = {
  __typename?: "DestinyInsertPlugActionDefinition";
  /** How long it takes for the Plugging of the item to be completed once it is initiated, if you care. */
  actionExecuteSeconds?: Maybe<Scalars["Int"]>;
  /** The type of action being performed when you act on this Socket Type. The most common value is "insert plug", but there are others as well (for instance, a "Masterwork" socket may allow for Re-initialization, and an Infusion socket allows for items to be consumed to upgrade the item) */
  actionType?: Maybe<Scalars["Int"]>;
};

export type DestinyInventoryBucketDefinition = {
  __typename?: "DestinyInventoryBucketDefinition";
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /** Where the bucket is found. 0 = Character, 1 = Account */
  scope?: Maybe<Scalars["Int"]>;
  /** An enum value for what items can be found in the bucket. See the BucketCategory enum for more details. */
  category?: Maybe<Scalars["Int"]>;
  /** Use this property to provide a quick-and-dirty recommended ordering for buckets in the UI. Most UIs will likely want to forsake this for something more custom and manual. */
  bucketOrder?: Maybe<Scalars["Int"]>;
  /**
   * The maximum # of item "slots" in a bucket. A slot is a given combination of item + quantity.
   * For instance, a Weapon will always take up a single slot, and always have a quantity of 1. But a material could take up only a single slot with hundreds of quantity.
   */
  itemCount?: Maybe<Scalars["Int"]>;
  /**
   * Sometimes, inventory buckets represent conceptual "locations" in the game that might not be expected. This value indicates the conceptual location of the bucket, regardless of where it is actually contained on the character/account.
   * See ItemLocation for details.
   * Note that location includes the Vault and the Postmaster (both of whom being just inventory buckets with additional actions that can be performed on them through a Vendor)
   */
  location?: Maybe<Scalars["Int"]>;
  /** If TRUE, there is at least one Vendor that can transfer items to/from this bucket. See the DestinyVendorDefinition's acceptedItems property for more information on how transferring works. */
  hasTransferDestination?: Maybe<Scalars["Boolean"]>;
  /** If True, this bucket is enabled. Disabled buckets may include buckets that were included for test purposes, or that were going to be used but then were abandoned but never removed from content *cough*. */
  enabled?: Maybe<Scalars["Boolean"]>;
  /** if a FIFO bucket fills up, it will delete the oldest item from said bucket when a new item tries to be added to it. If this is FALSE, the bucket will not allow new items to be placed in it until room is made by the user manually deleting items from it. You can see an example of this with the Postmaster's bucket. */
  fifo?: Maybe<Scalars["Boolean"]>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyInventoryItemDefinition = {
  __typename?: "DestinyInventoryItemDefinition";
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /** Tooltips that only come up conditionally for the item. Check the live data DestinyItemComponent.tooltipNotificationIndexes property for which of these should be shown at runtime. */
  tooltipNotifications?: Maybe<Array<Maybe<DestinyItemTooltipNotification>>>;
  /** If this item has a collectible related to it, this is the hash identifier of that collectible entry. */
  collectibleHash?: Maybe<Scalars["Float"]>;
  collectible?: Maybe<DestinyCollectibleDefinition>;
  /** If available, this is the original 'active' release watermark overlay for the icon. If the item has different versions, this can be overridden by the 'display version watermark icon' from the 'quality' block. Alternatively, if there is no watermark for the version, and the item version has a power cap below the current season power cap, this can be overridden by the iconWatermarkShelved property. */
  iconWatermark?: Maybe<Scalars["String"]>;
  /** If available, this is the 'shelved' release watermark overlay for the icon. If the item version has a power cap below the current season power cap, it can be treated as 'shelved', and should be shown with this 'shelved' watermark overlay. */
  iconWatermarkShelved?: Maybe<Scalars["String"]>;
  /** A secondary icon associated with the item. Currently this is used in very context specific applications, such as Emblem Nameplates. */
  secondaryIcon?: Maybe<Scalars["String"]>;
  /** Pulled from the secondary icon, this is the "secondary background" of the secondary icon. Confusing? Sure, that's why I call it "overlay" here: because as far as it's been used thus far, it has been for an optional overlay image. We'll see if that holds up, but at least for now it explains what this image is a bit better. */
  secondaryOverlay?: Maybe<Scalars["String"]>;
  /** Pulled from the Secondary Icon, this is the "special" background for the item. For Emblems, this is the background image used on the Details view: but it need not be limited to that for other types of items. */
  secondarySpecial?: Maybe<Scalars["String"]>;
  /** Sometimes, an item will have a background color. Most notably this occurs with Emblems, who use the Background Color for small character nameplates such as the "friends" view you see in-game. There are almost certainly other items that have background color as well, though I have not bothered to investigate what items have it nor what purposes they serve: use it as you will. */
  backgroundColor?: Maybe<DestinyColor>;
  /** If we were able to acquire an in-game screenshot for the item, the path to that screenshot will be returned here. Note that not all items have screenshots: particularly not any non-equippable items. */
  screenshot?: Maybe<Scalars["String"]>;
  /** The localized title/name of the item's type. This can be whatever the designers want, and has no guarantee of consistency between items. */
  itemTypeDisplayName?: Maybe<Scalars["String"]>;
  flavorText?: Maybe<Scalars["String"]>;
  /** A string identifier that the game's UI uses to determine how the item should be rendered in inventory screens and the like. This could really be anything - at the moment, we don't have the time to really breakdown and maintain all the possible strings this could be, partly because new ones could be added ad hoc. But if you want to use it to dictate your own UI, or look for items with a certain display style, go for it! */
  uiItemDisplayStyle?: Maybe<Scalars["String"]>;
  /** It became a common enough pattern in our UI to show Item Type and Tier combined into a single localized string that I'm just going to go ahead and start pre-creating these for items. */
  itemTypeAndTierDisplayName?: Maybe<Scalars["String"]>;
  /** In theory, it is a localized string telling you about how you can find the item. I really wish this was more consistent. Many times, it has nothing. Sometimes, it's instead a more narrative-forward description of the item. Which is cool, and I wish all properties had that data, but it should really be its own property. */
  displaySource?: Maybe<Scalars["String"]>;
  /** An identifier that the game UI uses to determine what type of tooltip to show for the item. These have no corresponding definitions that BNet can link to: so it'll be up to you to interpret and display your UI differently according to these styles (or ignore it). */
  tooltipStyle?: Maybe<Scalars["String"]>;
  /** If the item can be "used", this block will be non-null, and will have data related to the action performed when using the item. (Guess what? 99% of the time, this action is "dismantle". Shocker) */
  action?: Maybe<DestinyItemActionBlockDefinition>;
  /** If this item can exist in an inventory, this block will be non-null. In practice, every item that currently exists has one of these blocks. But note that it is not necessarily guaranteed. */
  inventory?: Maybe<DestinyItemInventoryBlockDefinition>;
  /** If this item is a quest, this block will be non-null. In practice, I wish I had called this the Quest block, but at the time it wasn't clear to me whether it would end up being used for purposes other than quests. It will contain data about the steps in the quest, and mechanics we can use for displaying and tracking the quest. */
  setData?: Maybe<DestinyItemSetBlockDefinition>;
  /** If this item can have stats (such as a weapon, armor, or vehicle), this block will be non-null and populated with the stats found on the item. */
  stats?: Maybe<DestinyItemStatBlockDefinition>;
  /** If the item is an emblem that has a special Objective attached to it - for instance, if the emblem tracks PVP Kills, or what-have-you. This is a bit different from, for example, the Vanguard Kill Tracker mod, which pipes data into the "art channel". When I get some time, I would like to standardize these so you can get at the values they expose without having to care about what they're being used for and how they are wired up, but for now here's the raw data. */
  emblemObjectiveHash?: Maybe<Scalars["Float"]>;
  /** If this item can be equipped, this block will be non-null and will be populated with the conditions under which it can be equipped. */
  equippingBlock?: Maybe<DestinyEquippingBlockDefinition>;
  /** If this item can be rendered, this block will be non-null and will be populated with rendering information. */
  translationBlock?: Maybe<DestinyItemTranslationBlockDefinition>;
  /** If this item can be Used or Acquired to gain other items (for instance, how Eververse Boxes can be consumed to get items from the box), this block will be non-null and will give summary information for the items that can be acquired. */
  preview?: Maybe<DestinyItemPreviewBlockDefinition>;
  /** If this item can have a level or stats, this block will be non-null and will be populated with default quality (item level, "quality", and infusion) data. See the block for more details, there's often less upfront information in D2 so you'll want to be aware of how you use quality and item level on the definition level now. */
  quality?: Maybe<DestinyItemQualityBlockDefinition>;
  /** The conceptual "Value" of an item, if any was defined. See the DestinyItemValueBlockDefinition for more details. */
  value?: Maybe<DestinyItemValueBlockDefinition>;
  /** If this item has a known source, this block will be non-null and populated with source information. Unfortunately, at this time we are not generating sources: that is some aggressively manual work which we didn't have time for, and I'm hoping to get back to at some point in the future. */
  sourceData?: Maybe<DestinyItemSourceBlockDefinition>;
  /** If this item has Objectives (extra tasks that can be accomplished related to the item... most frequently when the item is a Quest Step and the Objectives need to be completed to move on to the next Quest Step), this block will be non-null and the objectives defined herein. */
  objectives?: Maybe<DestinyItemObjectiveBlockDefinition>;
  /** If this item has available metrics to be shown, this block will be non-null have the appropriate hashes defined. */
  metrics?: Maybe<DestinyItemMetricBlockDefinition>;
  /** If this item *is* a Plug, this will be non-null and the info defined herein. See DestinyItemPlugDefinition for more information. */
  plug?: Maybe<DestinyItemPlugDefinition>;
  /** If this item has related items in a "Gear Set", this will be non-null and the relationships defined herein. */
  gearset?: Maybe<DestinyItemGearsetBlockDefinition>;
  /** If this item is a "reward sack" that can be opened to provide other items, this will be non-null and the properties of the sack contained herein. */
  sack?: Maybe<DestinyItemSackBlockDefinition>;
  /** If this item has any Sockets, this will be non-null and the individual sockets on the item will be defined herein. */
  sockets?: Maybe<DestinyItemSocketBlockDefinition>;
  /** Summary data about the item. */
  summary?: Maybe<DestinyItemSummaryBlockDefinition>;
  /** If the item has a Talent Grid, this will be non-null and the properties of the grid defined herein. Note that, while many items still have talent grids, the only ones with meaningful Nodes still on them will be Subclass/"Build" items. */
  talentGrid?: Maybe<DestinyItemTalentGridBlockDefinition>;
  /** If the item has stats, this block will be defined. It has the "raw" investment stats for the item. These investment stats don't take into account the ways that the items can spawn, nor do they take into account any Stat Group transformations. I have retained them for debugging purposes, but I do not know how useful people will find them. */
  investmentStats?: Maybe<Array<Maybe<DestinyItemInvestmentStatDefinition>>>;
  /** If the item has any *intrinsic* Perks (Perks that it will provide regardless of Sockets, Talent Grid, and other transitory state), they will be defined here. */
  perks?: Maybe<Array<Maybe<DestinyItemPerkEntryDefinition>>>;
  /** If the item has any related Lore (DestinyLoreDefinition), this will be the hash identifier you can use to look up the lore definition. */
  loreHash?: Maybe<Scalars["Float"]>;
  lore?: Maybe<DestinyLoreDefinition>;
  /**
   * There are times when the game will show you a "summary/vague" version of an item - such as a description of its type represented as a DestinyInventoryItemDefinition - rather than display the item itself.
   * This happens sometimes when summarizing possible rewards in a tooltip. This is the item displayed instead, if it exists.
   */
  summaryItemHash?: Maybe<Scalars["Float"]>;
  summaryItem?: Maybe<DestinyInventoryItemDefinition>;
  /** If any animations were extracted from game content for this item, these will be the definitions of those animations. */
  animations?: Maybe<Array<Maybe<DestinyAnimationReference>>>;
  /** BNet may forbid the execution of actions on this item via the API. If that is occurring, allowActions will be set to false. */
  allowActions?: Maybe<Scalars["Boolean"]>;
  /** If we added any help or informational URLs about this item, these will be those links. */
  links?: Maybe<Array<Maybe<HyperlinkReference>>>;
  /**
   * The boolean will indicate to us (and you!) whether something *could* happen when you transfer this item from the Postmaster that might be considered a "destructive" action.
   * It is not feasible currently to tell you (or ourelves!) in a consistent way whether this *will* actually cause a destructive action, so we are playing it safe: if it has the potential to do so, we will not allow it to be transferred from the Postmaster by default. You will need to check for this flag before transferring an item from the Postmaster, or else you'll end up receiving an error.
   */
  doesPostmasterPullHaveSideEffects?: Maybe<Scalars["Boolean"]>;
  /**
   * The intrinsic transferability of an item.
   * I hate that this boolean is negative - but there's a reason.
   * Just because an item is intrinsically transferrable doesn't mean that it can be transferred, and we don't want to imply that this is the only source of that transferability.
   */
  nonTransferrable?: Maybe<Scalars["Boolean"]>;
  /**
   * BNet attempts to make a more formal definition of item "Categories", as defined by DestinyItemCategoryDefinition. This is a list of all Categories that we were able to algorithmically determine that this item is a member of. (for instance, that it's a "Weapon", that it's an "Auto Rifle", etc...)
   * The algorithm for these is, unfortunately, volatile. If you believe you see a miscategorized item, please let us know on the Bungie API forums.
   */
  itemCategoryHashes?: Maybe<Array<Maybe<Scalars["Float"]>>>;
  itemCategory?: Maybe<DestinyItemCategoryDefinition>;
  /** In Destiny 1, we identified some items as having particular categories that we'd like to know about for various internal logic purposes. These are defined in SpecialItemType, and while these days the itemCategoryHashes are the preferred way of identifying types, we have retained this enum for its convenience. */
  specialItemType?: Maybe<Scalars["Int"]>;
  /**
   * A value indicating the "base" the of the item. This enum is a useful but dramatic oversimplification of what it means for an item to have a "Type". Still, it's handy in many situations.
   * itemCategoryHashes are the preferred way of identifying types, we have retained this enum for its convenience.
   */
  itemType?: Maybe<Scalars["Int"]>;
  /**
   * A value indicating the "sub-type" of the item. For instance, where an item might have an itemType value "Weapon", this will be something more specific like "Auto Rifle".
   * itemCategoryHashes are the preferred way of identifying types, we have retained this enum for its convenience.
   */
  itemSubType?: Maybe<Scalars["Int"]>;
  /**
   * We run a similarly weak-sauce algorithm to try and determine whether an item is restricted to a specific class. If we find it to be restricted in such a way, we set this classType property to match the class' enumeration value so that users can easily identify class restricted items.
   * If you see a mis-classed item, please inform the developers in the Bungie API forum.
   */
  classType?: Maybe<Scalars["Int"]>;
  breakerType?: Maybe<DestinyBreakerTypeDefinition>;
  /** Since we also have a breaker type definition, this is the hash for that breaker type for your convenience. Whether you use the enum or hash and look up the definition depends on what's cleanest for your code. */
  breakerTypeHash?: Maybe<Scalars["Float"]>;
  /**
   * If true, then you will be allowed to equip the item if you pass its other requirements.
   * This being false means that you cannot equip the item under any circumstances.
   */
  equippable?: Maybe<Scalars["Boolean"]>;
  /** Theoretically, an item can have many possible damage types. In *practice*, this is not true, but just in case weapons start being made that have multiple (for instance, an item where a socket has reusable plugs for every possible damage type that you can choose from freely), this field will return all of the possible damage types that are available to the weapon by default. */
  damageTypeHashes?: Maybe<Array<Maybe<Scalars["Float"]>>>;
  damageType?: Maybe<DestinyDamageTypeDefinition>;
  /**
   * This is the list of all damage types that we know ahead of time the item can take on. Unfortunately, this does not preclude the possibility of something funky happening to give the item a damage type that cannot be predicted beforehand: for example, if some designer decides to create arbitrary non-reusable plugs that cause damage type to change.
   * This damage type prediction will only use the following to determine potential damage types:
   * - Intrinsic perks
   * - Talent Node perks
   * - Known, reusable plugs for sockets
   */
  damageTypes?: Maybe<Array<Maybe<Scalars["Int"]>>>;
  defaultDamageType?: Maybe<DestinyDamageTypeDefinition>;
  /**
   * Similar to defaultDamageType, but represented as the hash identifier for a DestinyDamageTypeDefinition.
   * I will likely regret leaving in the enumeration versions of these properties, but for now they're very convenient.
   */
  defaultDamageTypeHash?: Maybe<Scalars["Float"]>;
  /** If this item is related directly to a Season of Destiny, this is the hash identifier for that season. */
  seasonHash?: Maybe<Scalars["Float"]>;
  season?: Maybe<DestinySeasonDefinition>;
  /** If true, this is a dummy vendor-wrapped item template. Items purchased from Eververse will be "wrapped" by one of these items so that we can safely provide refund capabilities before the item is "unwrapped". */
  isWrapper?: Maybe<Scalars["Boolean"]>;
  /** Traits are metadata tags applied to this item. For example: armor slot, weapon type, foundry, faction, etc. These IDs come from the game and don't map to any content, but should still be useful. */
  traitIds?: Maybe<Array<Maybe<Scalars["String"]>>>;
  /** These are the corresponding trait definition hashes for the entries in traitIds. */
  traitHashes?: Maybe<Array<Maybe<Scalars["Float"]>>>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyItemActionBlockDefinition = {
  __typename?: "DestinyItemActionBlockDefinition";
  /** Localized text for the verb of the action being performed. */
  verbName?: Maybe<Scalars["String"]>;
  /** Localized text describing the action being performed. */
  verbDescription?: Maybe<Scalars["String"]>;
  /** The content has this property, however it's not entirely clear how it is used. */
  isPositive?: Maybe<Scalars["Boolean"]>;
  /** If the action has an overlay screen associated with it, this is the name of that screen. Unfortunately, we cannot return the screen's data itself. */
  overlayScreenName?: Maybe<Scalars["String"]>;
  /** The icon associated with the overlay screen for the action, if any. */
  overlayIcon?: Maybe<Scalars["String"]>;
  /** The number of seconds to delay before allowing this action to be performed again. */
  requiredCooldownSeconds?: Maybe<Scalars["Int"]>;
  /** If the action requires other items to exist or be destroyed, this is the list of those items and requirements. */
  requiredItems?: Maybe<Array<Maybe<DestinyItemActionRequiredItemDefinition>>>;
  /** If performing this action earns you Progression, this is the list of progressions and values granted for those progressions by performing this action. */
  progressionRewards?: Maybe<Array<Maybe<DestinyProgressionRewardDefinition>>>;
  /** The internal identifier for the action. */
  actionTypeLabel?: Maybe<Scalars["String"]>;
  /** Theoretically, an item could have a localized string for a hint about the location in which the action should be performed. In practice, no items yet have this property. */
  requiredLocation?: Maybe<Scalars["String"]>;
  /** The identifier hash for the Cooldown associated with this action. We have not pulled this data yet for you to have more data to use for cooldowns. */
  requiredCooldownHash?: Maybe<Scalars["Float"]>;
  /** If true, the item is deleted when the action completes. */
  deleteOnAction?: Maybe<Scalars["Boolean"]>;
  /** If true, the entire stack is deleted when the action completes. */
  consumeEntireStack?: Maybe<Scalars["Boolean"]>;
  /** If true, this action will be performed as soon as you earn this item. Some rewards work this way, providing you a single item to pick up from a reward-granting vendor in-game and then immediately consuming itself to provide you multiple items. */
  useOnAcquire?: Maybe<Scalars["Boolean"]>;
};

export type DestinyItemActionRequiredItemDefinition = {
  __typename?: "DestinyItemActionRequiredItemDefinition";
  /** The minimum quantity of the item you have to have. */
  count?: Maybe<Scalars["Int"]>;
  /** The hash identifier of the item you need to have. Use it to look up the DestinyInventoryItemDefinition for more info. */
  itemHash?: Maybe<Scalars["Float"]>;
  item?: Maybe<DestinyInventoryItemDefinition>;
  /** If true, the item/quantity will be deleted from your inventory when the action is performed. Otherwise, you'll retain these required items after the action is complete. */
  deleteOnAction?: Maybe<Scalars["Boolean"]>;
};

export type DestinyItemCategoryDefinition = {
  __typename?: "DestinyItemCategoryDefinition";
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /** If True, this category should be visible in UI. Sometimes we make categories that we don't think are interesting externally. It's up to you if you want to skip on showing them. */
  visible?: Maybe<Scalars["Boolean"]>;
  /** If True, this category has been deprecated: it may have no items left, or there may be only legacy items that remain in it which are no longer relevant to the game. */
  deprecated?: Maybe<Scalars["Boolean"]>;
  /** A shortened version of the title. The reason why we have this is because the Armory in German had titles that were too long to display in our UI, so these were localized abbreviated versions of those categories. The property still exists today, even though the Armory doesn't exist for D2... yet. */
  shortTitle?: Maybe<Scalars["String"]>;
  /** The janky regular expression we used against the item type to try and discern whether the item belongs to this category. */
  itemTypeRegex?: Maybe<Scalars["String"]>;
  /** If the item in question has this category, it also should have this breaker type. */
  grantDestinyBreakerType?: Maybe<Scalars["Int"]>;
  /** If the item is a plug, this is the identifier we expect to find associated with it if it is in this category. */
  plugCategoryIdentifier?: Maybe<Scalars["String"]>;
  /** If the item type matches this janky regex, it does *not* belong to this category. */
  itemTypeRegexNot?: Maybe<Scalars["String"]>;
  /** If the item belongs to this bucket, it does belong to this category. */
  originBucketIdentifier?: Maybe<Scalars["String"]>;
  /** If an item belongs to this category, it will also receive this item type. This is now how DestinyItemType is populated for items: it used to be an even jankier process, but that's a story that requires more alcohol. */
  grantDestinyItemType?: Maybe<Scalars["Int"]>;
  /**
   * If an item belongs to this category, it will also receive this subtype enum value.
   * I know what you're thinking - what if it belongs to multiple categories that provide sub-types?
   * The last one processed wins, as is the case with all of these "grant" enums. Now you can see one reason why we moved away from these enums... but they're so convenient when they work, aren't they?
   */
  grantDestinySubType?: Maybe<Scalars["Int"]>;
  /**
   * If an item belongs to this category, it will also get this class restriction enum value.
   * See the other "grant"-prefixed properties on this definition for my color commentary.
   */
  grantDestinyClass?: Maybe<Scalars["Int"]>;
  /** The traitId that can be found on items that belong to this category. */
  traitId?: Maybe<Scalars["String"]>;
  /**
   * If this category is a "parent" category of other categories, those children will have their hashes listed in rendering order here, and can be looked up using these hashes against DestinyItemCategoryDefinition.
   * In this way, you can build up a visual hierarchy of item categories. That's what we did, and you can do it too. I believe in you. Yes, you, Carl.
   * (I hope someone named Carl reads this someday)
   */
  groupedCategoryHashes?: Maybe<Array<Maybe<Scalars["Float"]>>>;
  groupedCategory?: Maybe<DestinyItemCategoryDefinition>;
  /** All item category hashes of "parent" categories: categories that contain this as a child through the hierarchy of groupedCategoryHashes. It's a bit redundant, but having this child-centric list speeds up some calculations. */
  parentCategoryHashes?: Maybe<Array<Maybe<Scalars["Float"]>>>;
  /** If true, this category is only used for grouping, and should not be evaluated with its own checks. Rather, the item only has this category if it has one of its child categories. */
  groupCategoryOnly?: Maybe<Scalars["Boolean"]>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyItemCreationEntryLevelDefinition = {
  __typename?: "DestinyItemCreationEntryLevelDefinition";
  level?: Maybe<Scalars["Int"]>;
};

export type DestinyItemGearsetBlockDefinition = {
  __typename?: "DestinyItemGearsetBlockDefinition";
  /** The maximum possible number of items that can be collected. */
  trackingValueMax?: Maybe<Scalars["Int"]>;
  itemList?: Maybe<DestinyInventoryItemDefinition>;
};

export type DestinyItemIntrinsicSocketEntryDefinition = {
  __typename?: "DestinyItemIntrinsicSocketEntryDefinition";
  /** Indicates the plug that is intrinsically inserted into this socket. */
  plugItemHash?: Maybe<Scalars["Float"]>;
  plugItem?: Maybe<DestinyInventoryItemDefinition>;
  /** Indicates the type of this intrinsic socket. */
  socketTypeHash?: Maybe<Scalars["Float"]>;
  socketType?: Maybe<DestinySocketTypeDefinition>;
  /** If true, then this socket is visible in the item's "default" state. If you have an instance, you should always check the runtime state, as that can override this visibility setting: but if you're looking at the item on a conceptual level, this property can be useful for hiding data such as legacy sockets - which remain defined on items for infrastructure purposes, but can be confusing for users to see. */
  defaultVisible?: Maybe<Scalars["Boolean"]>;
};

export type DestinyItemInventoryBlockDefinition = {
  __typename?: "DestinyItemInventoryBlockDefinition";
  /** If this string is populated, you can't have more than one stack with this label in a given inventory. Note that this is different from the equipping block's unique label, which is used for equipping uniqueness. */
  stackUniqueLabel?: Maybe<Scalars["String"]>;
  /** The maximum quantity of this item that can exist in a stack. */
  maxStackSize?: Maybe<Scalars["Int"]>;
  /** The hash identifier for the DestinyInventoryBucketDefinition to which this item belongs. I should have named this "bucketHash", but too many things refer to it now. Sigh. */
  bucketTypeHash?: Maybe<Scalars["Float"]>;
  bucketType?: Maybe<DestinyInventoryBucketDefinition>;
  /** If the item is picked up by the lost loot queue, this is the hash identifier for the DestinyInventoryBucketDefinition into which it will be placed. Again, I should have named this recoveryBucketHash instead. */
  recoveryBucketTypeHash?: Maybe<Scalars["Float"]>;
  recoveryBucketType?: Maybe<DestinyInventoryBucketDefinition>;
  /** The hash identifier for the Tier Type of the item, use to look up its DestinyItemTierTypeDefinition if you need to show localized data for the item's tier. */
  tierTypeHash?: Maybe<Scalars["Float"]>;
  /** The enumeration matching the tier type of the item to known values, again for convenience sake. */
  tierType?: Maybe<Scalars["Int"]>;
  /** If TRUE, this item is instanced. Otherwise, it is a generic item that merely has a quantity in a stack (like Glimmer). */
  isInstanceItem?: Maybe<Scalars["Boolean"]>;
  /** The localized name of the tier type, which is a useful shortcut so you don't have to look up the definition every time. However, it's mostly a holdover from days before we had a DestinyItemTierTypeDefinition to refer to. */
  tierTypeName?: Maybe<Scalars["String"]>;
  /** The tooltip message to show, if any, when the item expires. */
  expirationTooltip?: Maybe<Scalars["String"]>;
  /** If the item expires while playing in an activity, we show a different message. */
  expiredInActivityMessage?: Maybe<Scalars["String"]>;
  /** If the item expires in orbit, we show a... more different message. ("Consummate V's, consummate!") */
  expiredInOrbitMessage?: Maybe<Scalars["String"]>;
  suppressExpirationWhenObjectivesComplete?: Maybe<Scalars["Boolean"]>;
};

export type DestinyItemInvestmentStatDefinition = {
  __typename?: "DestinyItemInvestmentStatDefinition";
  /** The hash identifier for the DestinyStatDefinition defining this stat. */
  statTypeHash?: Maybe<Scalars["Float"]>;
  statType?: Maybe<DestinyStatDefinition>;
  /** The raw "Investment" value for the stat, before transformations are performed to turn this raw stat into stats that are displayed in the game UI. */
  value?: Maybe<Scalars["Int"]>;
  /** If this is true, the stat will only be applied on the item in certain game state conditions, and we can't know statically whether or not this stat will be applied. Check the "live" API data instead for whether this value is being applied on a specific instance of the item in question, and you can use this to decide whether you want to show the stat on the generic view of the item, or whether you want to show some kind of caveat or warning about the stat value being conditional on game state. */
  isConditionallyActive?: Maybe<Scalars["Boolean"]>;
};

export type DestinyItemMetricBlockDefinition = {
  __typename?: "DestinyItemMetricBlockDefinition";
  /** Hash identifiers for any DestinyPresentationNodeDefinition entry that can be used to list available metrics. Any metric listed directly below these nodes, or in any of these nodes' children will be made available for selection. */
  availableMetricCategoryNodeHashes?: Maybe<Array<Maybe<Scalars["Float"]>>>;
  availableMetricCategoryNode?: Maybe<DestinyPresentationNodeDefinition>;
};

export type DestinyItemObjectiveBlockDefinition = {
  __typename?: "DestinyItemObjectiveBlockDefinition";
  /** The hashes to Objectives (DestinyObjectiveDefinition) that are part of this Quest Step, in the order that they should be rendered. */
  objectiveHashes?: Maybe<Array<Maybe<Scalars["Float"]>>>;
  objective?: Maybe<DestinyObjectiveDefinition>;
  /**
   * For every entry in objectiveHashes, there is a corresponding entry in this array at the same index. If the objective is meant to be associated with a specific DestinyActivityDefinition, there will be a valid hash at that index. Otherwise, it will be invalid (0).
   * Rendered somewhat obsolete by perObjectiveDisplayProperties, which currently has much the same information but may end up with more info in the future.
   */
  displayActivityHashes?: Maybe<Array<Maybe<Scalars["Float"]>>>;
  displayActivity?: Maybe<DestinyActivityDefinition>;
  /** If True, all objectives must be completed for the step to be completed. If False, any one objective can be completed for the step to be completed. */
  requireFullObjectiveCompletion?: Maybe<Scalars["Boolean"]>;
  /** The hash for the DestinyInventoryItemDefinition representing the Quest to which this Quest Step belongs. */
  questlineItemHash?: Maybe<Scalars["Float"]>;
  questlineItem?: Maybe<DestinyInventoryItemDefinition>;
  /** The localized string for narrative text related to this quest step, if any. */
  narrative?: Maybe<Scalars["String"]>;
  /** The localized string describing an action to be performed associated with the objectives, if any. */
  objectiveVerbName?: Maybe<Scalars["String"]>;
  /** The identifier for the type of quest being performed, if any. Not associated with any fixed definition, yet. */
  questTypeIdentifier?: Maybe<Scalars["String"]>;
  /** A hashed value for the questTypeIdentifier, because apparently I like to be redundant. */
  questTypeHash?: Maybe<Scalars["Float"]>;
  /** One entry per Objective on the item, it will have related display information. */
  perObjectiveDisplayProperties?: Maybe<
    Array<Maybe<DestinyObjectiveDisplayProperties>>
  >;
  displayAsStatTracker?: Maybe<Scalars["Boolean"]>;
};

export type DestinyItemPerkEntryDefinition = {
  __typename?: "DestinyItemPerkEntryDefinition";
  /** If this perk is not active, this is the string to show for why it's not providing its benefits. */
  requirementDisplayString?: Maybe<Scalars["String"]>;
  /** A hash identifier for the DestinySandboxPerkDefinition being provided on the item. */
  perkHash?: Maybe<Scalars["Float"]>;
  perk?: Maybe<DestinySandboxPerkDefinition>;
  /** Indicates whether this perk should be shown, or if it should be shown disabled. */
  perkVisibility?: Maybe<Scalars["Int"]>;
};

export type DestinyItemPlugDefinition = {
  __typename?: "DestinyItemPlugDefinition";
  /**
   * The rules around when this plug can be inserted into a socket, aside from the socket's individual restrictions.
   * The live data DestinyItemPlugComponent.insertFailIndexes will be an index into this array, so you can pull out the failure strings appropriate for the user.
   */
  insertionRules?: Maybe<Array<Maybe<DestinyPlugRuleDefinition>>>;
  /** The string identifier for the plug's category. Use the socket's DestinySocketTypeDefinition.plugWhitelist to determine whether this plug can be inserted into the socket. */
  plugCategoryIdentifier?: Maybe<Scalars["String"]>;
  /** The hash for the plugCategoryIdentifier. You can use this instead if you wish: I put both in the definition for debugging purposes. */
  plugCategoryHash?: Maybe<Scalars["Float"]>;
  /** If you successfully socket the item, this will determine whether or not you get "refunded" on the plug. */
  onActionRecreateSelf?: Maybe<Scalars["Boolean"]>;
  /** If inserting this plug requires materials, this is the hash identifier for looking up the DestinyMaterialRequirementSetDefinition for those requirements. */
  insertionMaterialRequirementHash?: Maybe<Scalars["Float"]>;
  insertionMaterialRequirement?: Maybe<DestinyMaterialRequirementSetDefinition>;
  /** In the game, if you're inspecting a plug item directly, this will be the item shown with the plug attached. Look up the DestinyInventoryItemDefinition for this hash for the item. */
  previewItemOverrideHash?: Maybe<Scalars["Float"]>;
  previewItemOverride?: Maybe<DestinyInventoryItemDefinition>;
  /** It's not enough for the plug to be inserted. It has to be enabled as well. For it to be enabled, it may require materials. This is the hash identifier for the DestinyMaterialRequirementSetDefinition for those requirements, if there is one. */
  enabledMaterialRequirementHash?: Maybe<Scalars["Float"]>;
  enabledMaterialRequirement?: Maybe<DestinyMaterialRequirementSetDefinition>;
  /**
   * The rules around whether the plug, once inserted, is enabled and providing its benefits.
   * The live data DestinyItemPlugComponent.enableFailIndexes will be an index into this array, so you can pull out the failure strings appropriate for the user.
   */
  enabledRules?: Maybe<Array<Maybe<DestinyPlugRuleDefinition>>>;
  /** Plugs can have arbitrary, UI-defined identifiers that the UI designers use to determine the style applied to plugs. Unfortunately, we have neither a definitive list of these labels nor advance warning of when new labels might be applied or how that relates to how they get rendered. If you want to, you can refer to known labels to change your own styles: but know that new ones can be created arbitrarily, and we have no way of associating the labels with any specific UI style guidance... you'll have to piece that together on your end. Or do what we do, and just show plugs more generically, without specialized styles. */
  uiPlugLabel?: Maybe<Scalars["String"]>;
  plugStyle?: Maybe<Scalars["Int"]>;
  /** Indicates the rules about when this plug can be used. See the PlugAvailabilityMode enumeration for more information! */
  plugAvailability?: Maybe<Scalars["Int"]>;
  /** If the plug meets certain state requirements, it may have an alternative label applied to it. This is the alternative label that will be applied in such a situation. */
  alternateUiPlugLabel?: Maybe<Scalars["String"]>;
  /** The alternate plug of the plug: only applies when the item is in states that only the server can know about and control, unfortunately. See AlternateUiPlugLabel for the related label info. */
  alternatePlugStyle?: Maybe<Scalars["Int"]>;
  /** If TRUE, this plug is used for UI display purposes only, and doesn't have any interesting effects of its own. */
  isDummyPlug?: Maybe<Scalars["Boolean"]>;
  /**
   * Do you ever get the feeling that a system has become so overburdened by edge cases that it probably should have become some other system entirely? So do I!
   * In totally unrelated news, Plugs can now override properties of their parent items. This is some of the relevant definition data for those overrides.
   * If this is populated, it will have the override data to be applied when this plug is applied to an item.
   */
  parentItemOverride?: Maybe<DestinyParentItemOverride>;
  /** IF not null, this plug provides Energy capacity to the item in which it is socketed. In Armor 2.0 for example, is implemented in a similar way to Masterworks, where visually it's a single area of the UI being clicked on to "Upgrade" to higher energy levels, but it's actually socketing new plugs. */
  energyCapacity?: Maybe<DestinyEnergyCapacityEntry>;
  /** IF not null, this plug has an energy cost. This contains the details of that cost. */
  energyCost?: Maybe<DestinyEnergyCostEntry>;
};

export type DestinyItemPreviewBlockDefinition = {
  __typename?: "DestinyItemPreviewBlockDefinition";
  /** A string that the game UI uses as a hint for which detail screen to show for the item. You, too, can leverage this for your own custom screen detail views. Note, however, that these are arbitrarily defined by designers: there's no guarantees of a fixed, known number of these - so fall back to something reasonable if you don't recognize it. */
  screenStyle?: Maybe<Scalars["String"]>;
  /** If the preview data is derived from a fake "Preview" Vendor, this will be the hash identifier for the DestinyVendorDefinition of that fake vendor. */
  previewVendorHash?: Maybe<Scalars["Float"]>;
  previewVendor?: Maybe<DestinyVendorDefinition>;
  /** If this item should show you Artifact information when you preview it, this is the hash identifier of the DestinyArtifactDefinition for the artifact whose data should be shown. */
  artifactHash?: Maybe<Scalars["Float"]>;
  artifact?: Maybe<DestinyArtifactDefinition>;
  /** If the preview has an associated action (like "Open"), this will be the localized string for that action. */
  previewActionString?: Maybe<Scalars["String"]>;
  /** This is a list of the items being previewed, categorized in the same way as they are in the preview UI. */
  derivedItemCategories?: Maybe<
    Array<Maybe<DestinyDerivedItemCategoryDefinition>>
  >;
};

export type DestinyItemQualityBlockDefinition = {
  __typename?: "DestinyItemQualityBlockDefinition";
  /**
   * The "base" defined level of an item. This is a list because, in theory, each Expansion could define its own base level for an item.
   * In practice, not only was that never done in Destiny 1, but now this isn't even populated at all. When it's not populated, the level at which it spawns has to be inferred by Reward information, of which BNet receives an imperfect view and will only be reliable on instanced data as a result.
   */
  itemLevels?: Maybe<Array<Maybe<Scalars["Int"]>>>;
  /** qualityLevel is used in combination with the item's level to calculate stats like Attack and Defense. It plays a role in that calculation, but not nearly as large as itemLevel does. */
  qualityLevel?: Maybe<Scalars["Int"]>;
  /**
   * The string identifier for this item's "infusability", if any.
   * Items that match the same infusionCategoryName are allowed to infuse with each other.
   * DEPRECATED: Items can now have multiple infusion categories. Please use infusionCategoryHashes instead.
   */
  infusionCategoryName?: Maybe<Scalars["String"]>;
  /**
   * The hash identifier for the infusion. It does not map to a Definition entity.
   * DEPRECATED: Items can now have multiple infusion categories. Please use infusionCategoryHashes instead.
   */
  infusionCategoryHash?: Maybe<Scalars["Float"]>;
  /** If any one of these hashes matches any value in another item's infusionCategoryHashes, the two can infuse with each other. */
  infusionCategoryHashes?: Maybe<Array<Maybe<Scalars["Float"]>>>;
  /** An item can refer to pre-set level requirements. They are defined in DestinyProgressionLevelRequirementDefinition, and you can use this hash to find the appropriate definition. */
  progressionLevelRequirementHash?: Maybe<Scalars["Float"]>;
  progressionLevelRequirement?: Maybe<DestinyProgressionLevelRequirementDefinition>;
  /** The latest version available for this item. */
  currentVersion?: Maybe<Scalars["Float"]>;
  /** The list of versions available for this item. */
  versions?: Maybe<Array<Maybe<DestinyItemVersionDefinition>>>;
  /** Icon overlays to denote the item version and power cap status. */
  displayVersionWatermarkIcons?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type DestinyItemQuantity = {
  __typename?: "DestinyItemQuantity";
  /** The hash identifier for the item in question. Use it to look up the item's DestinyInventoryItemDefinition. */
  itemHash?: Maybe<Scalars["Float"]>;
  item?: Maybe<DestinyInventoryItemDefinition>;
  /** If this quantity is referring to a specific instance of an item, this will have the item's instance ID. Normally, this will be null. */
  itemInstanceId?: Maybe<Scalars["Int"]>;
  /** The amount of the item needed/available depending on the context of where DestinyItemQuantity is being used. */
  quantity?: Maybe<Scalars["Int"]>;
  /** Indicates that this item quantity may be conditionally shown or hidden, based on various sources of state. For example: server flags, account state, or character progress. */
  hasConditionalVisibility?: Maybe<Scalars["Boolean"]>;
};

export type DestinyItemSackBlockDefinition = {
  __typename?: "DestinyItemSackBlockDefinition";
  /** A description of what will happen when you open the sack. As far as I can tell, this is blank currently. Unknown whether it will eventually be populated with useful info. */
  detailAction?: Maybe<Scalars["String"]>;
  /** The localized name of the action being performed when you open the sack. */
  openAction?: Maybe<Scalars["String"]>;
  selectItemCount?: Maybe<Scalars["Int"]>;
  vendorSackType?: Maybe<Scalars["String"]>;
  openOnAcquire?: Maybe<Scalars["Boolean"]>;
};

export type DestinyItemSetBlockDefinition = {
  __typename?: "DestinyItemSetBlockDefinition";
  /** A collection of hashes of set items, for items such as Quest Metadata items that possess this data. */
  itemList?: Maybe<Array<Maybe<DestinyItemSetBlockEntryDefinition>>>;
  /** If true, items in the set can only be added in increasing order, and adding an item will remove any previous item. For Quests, this is by necessity true. Only one quest step is present at a time, and previous steps are removed as you advance in the quest. */
  requireOrderedSetItemAdd?: Maybe<Scalars["Boolean"]>;
  /** If true, the UI should treat this quest as "featured" */
  setIsFeatured?: Maybe<Scalars["Boolean"]>;
  /** A string identifier we can use to attempt to identify the category of the Quest. */
  setType?: Maybe<Scalars["String"]>;
  /** The name of the quest line that this quest step is a part of. */
  questLineName?: Maybe<Scalars["String"]>;
  /** The description of the quest line that this quest step is a part of. */
  questLineDescription?: Maybe<Scalars["String"]>;
  /** An additional summary of this step in the quest line. */
  questStepSummary?: Maybe<Scalars["String"]>;
};

export type DestinyItemSetBlockEntryDefinition = {
  __typename?: "DestinyItemSetBlockEntryDefinition";
  /** Used for tracking which step a user reached. These values will be populated in the user's internal state, which we expose externally as a more usable DestinyQuestStatus object. If this item has been obtained, this value will be set in trackingUnlockValueHash. */
  trackingValue?: Maybe<Scalars["Int"]>;
  /** This is the hash identifier for a DestinyInventoryItemDefinition representing this quest step. */
  itemHash?: Maybe<Scalars["Float"]>;
  item?: Maybe<DestinyInventoryItemDefinition>;
};

export type DestinyItemSocketBlockDefinition = {
  __typename?: "DestinyItemSocketBlockDefinition";
  /** This was supposed to be a string that would give per-item details about sockets. In practice, it turns out that all this ever has is the localized word "details". ... that's lame, but perhaps it will become something cool in the future. */
  detail?: Maybe<Scalars["String"]>;
  /** Each non-intrinsic (or mutable) socket on an item is defined here. Check inside for more info. */
  socketEntries?: Maybe<Array<Maybe<DestinyItemSocketEntryDefinition>>>;
  /** Each intrinsic (or immutable/permanent) socket on an item is defined here, along with the plug that is permanently affixed to the socket. */
  intrinsicSockets?: Maybe<
    Array<Maybe<DestinyItemIntrinsicSocketEntryDefinition>>
  >;
  /** A convenience property, that refers to the sockets in the "sockets" property, pre-grouped by category and ordered in the manner that they should be grouped in the UI. You could form this yourself with the existing data, but why would you want to? Enjoy life man. */
  socketCategories?: Maybe<Array<Maybe<DestinyItemSocketCategoryDefinition>>>;
};

export type DestinyItemSocketCategoryDefinition = {
  __typename?: "DestinyItemSocketCategoryDefinition";
  /** The hash for the Socket Category: a quick way to go get the header display information for the category. Use it to look up DestinySocketCategoryDefinition info. */
  socketCategoryHash?: Maybe<Scalars["Float"]>;
  socketCategory?: Maybe<DestinySocketCategoryDefinition>;
  /** Use these indexes to look up the sockets in the "sockets.socketEntries" property on the item definition. These are the indexes under the category, in game-rendered order. */
  socketIndexes?: Maybe<Array<Maybe<Scalars["Int"]>>>;
};

export type DestinyItemSocketEntryDefinition = {
  __typename?: "DestinyItemSocketEntryDefinition";
  /** All sockets have a type, and this is the hash identifier for this particular type. Use it to look up the DestinySocketTypeDefinition: read there for more information on how socket types affect the behavior of the socket. */
  socketTypeHash?: Maybe<Scalars["Float"]>;
  socketType?: Maybe<DestinySocketTypeDefinition>;
  /** If a valid hash, this is the hash identifier for the DestinyInventoryItemDefinition representing the Plug that will be initially inserted into the item on item creation. Otherwise, this Socket will either start without a plug inserted, or will have one randomly inserted. */
  singleInitialItemHash?: Maybe<Scalars["Float"]>;
  singleInitialItem?: Maybe<DestinyInventoryItemDefinition>;
  /**
   * This is a list of pre-determined plugs that can *always* be plugged into this socket, without the character having the plug in their inventory.
   * If this list is populated, you will not be allowed to plug an arbitrary item in the socket: you will only be able to choose from one of these reusable plugs.
   */
  reusablePlugItems?: Maybe<
    Array<Maybe<DestinyItemSocketEntryPlugItemDefinition>>
  >;
  /**
   * If this is true, then the socket will not be initialized with a plug if the item is purchased from a Vendor.
   * Remember that Vendors are much more than conceptual vendors: they include "Collection Kiosks" and other entities. See DestinyVendorDefinition for more information.
   */
  preventInitializationOnVendorPurchase?: Maybe<Scalars["Boolean"]>;
  /** If this is true, the perks provided by this socket shouldn't be shown in the item's tooltip. This might be useful if it's providing a hidden bonus, or if the bonus is less important than other benefits on the item. */
  hidePerksInItemTooltip?: Maybe<Scalars["Boolean"]>;
  /** Indicates where you should go to get plugs for this socket. This will affect how you populate your UI, as well as what plugs are valid for this socket. It's an alternative to having to check for the existence of certain properties (reusablePlugItems for example) to infer where plugs should come from. */
  plugSources?: Maybe<Scalars["Int"]>;
  /**
   * If this socket's plugs come from a reusable DestinyPlugSetDefinition, this is the identifier for that set. We added this concept to reduce some major duplication that's going to come from sockets as replacements for what was once implemented as large sets of items and kiosks (like Emotes).
   *  As of Shadowkeep, these will come up much more frequently and be driven by game content rather than custom curation.
   */
  reusablePlugSetHash?: Maybe<Scalars["Float"]>;
  reusablePlugSet?: Maybe<DestinyPlugSetDefinition>;
  /**
   * This field replaces "randomizedPlugItems" as of Shadowkeep launch. If a socket has randomized plugs, this is a pointer to the set of plugs that could be used, as defined in DestinyPlugSetDefinition.
   *  If null, the item has no randomized plugs.
   */
  randomizedPlugSetHash?: Maybe<Scalars["Float"]>;
  randomizedPlugSet?: Maybe<DestinyPlugSetDefinition>;
  /** If true, then this socket is visible in the item's "default" state. If you have an instance, you should always check the runtime state, as that can override this visibility setting: but if you're looking at the item on a conceptual level, this property can be useful for hiding data such as legacy sockets - which remain defined on items for infrastructure purposes, but can be confusing for users to see. */
  defaultVisible?: Maybe<Scalars["Boolean"]>;
};

export type DestinyItemSocketEntryPlugItemDefinition = {
  __typename?: "DestinyItemSocketEntryPlugItemDefinition";
  /** The hash identifier of a DestinyInventoryItemDefinition representing the plug that can be inserted. */
  plugItemHash?: Maybe<Scalars["Float"]>;
  plugItem?: Maybe<DestinyInventoryItemDefinition>;
};

export type DestinyItemSocketEntryPlugItemRandomizedDefinition = {
  __typename?: "DestinyItemSocketEntryPlugItemRandomizedDefinition";
  /** Indicates if the plug can be rolled on the current version of the item. For example, older versions of weapons may have plug rolls that are no longer possible on the current versions. */
  currentlyCanRoll?: Maybe<Scalars["Boolean"]>;
  /** The hash identifier of a DestinyInventoryItemDefinition representing the plug that can be inserted. */
  plugItemHash?: Maybe<Scalars["Float"]>;
  plugItem?: Maybe<DestinyInventoryItemDefinition>;
};

export type DestinyItemSourceBlockDefinition = {
  __typename?: "DestinyItemSourceBlockDefinition";
  /** The list of hash identifiers for Reward Sources that hint where the item can be found (DestinyRewardSourceDefinition). */
  sourceHashes?: Maybe<Array<Maybe<Scalars["Float"]>>>;
  source?: Maybe<DestinyRewardSourceDefinition>;
  /** A collection of details about the stats that were computed for the ways we found that the item could be spawned. */
  sources?: Maybe<Array<Maybe<DestinyItemSourceDefinition>>>;
  /** If we found that this item is exclusive to a specific platform, this will be set to the BungieMembershipType enumeration that matches that platform. */
  exclusive?: Maybe<Scalars["Int"]>;
  /** A denormalized reference back to vendors that potentially sell this item. */
  vendorSources?: Maybe<Array<Maybe<DestinyItemVendorSourceReference>>>;
};

export type DestinyItemSourceDefinition = {
  __typename?: "DestinyItemSourceDefinition";
  /** The level at which the item spawns. Essentially the Primary Key for this source data: there will be multiple of these source entries per item that has source data, grouped by the level at which the item spawns. */
  level?: Maybe<Scalars["Int"]>;
  /** The minimum Quality at which the item spawns for this level. Examine DestinyInventoryItemDefinition for more information about what Quality means. Just don't ask Phaedrus about it, he'll never stop talking and you'll have to write a book about it. */
  minQuality?: Maybe<Scalars["Int"]>;
  /** The maximum quality at which the item spawns for this level. */
  maxQuality?: Maybe<Scalars["Int"]>;
  /** The minimum Character Level required for equipping the item when the item spawns at the item level defined on this DestinyItemSourceDefinition, as far as we saw in our processing. */
  minLevelRequired?: Maybe<Scalars["Int"]>;
  /** The maximum Character Level required for equipping the item when the item spawns at the item level defined on this DestinyItemSourceDefinition, as far as we saw in our processing. */
  maxLevelRequired?: Maybe<Scalars["Int"]>;
  /** The DestinyRewardSourceDefinitions found that can spawn the item at this level. */
  sourceHashes?: Maybe<Array<Maybe<Scalars["Float"]>>>;
  source?: Maybe<DestinyRewardSourceDefinition>;
};

export type DestinyItemStatBlockDefinition = {
  __typename?: "DestinyItemStatBlockDefinition";
  /**
   * If true, the game won't show the "primary" stat on this item when you inspect it.
   * NOTE: This is being manually mapped, because I happen to want it in a block that isn't going to directly create this derivative block.
   */
  disablePrimaryStatDisplay?: Maybe<Scalars["Boolean"]>;
  /**
   * If the item's stats are meant to be modified by a DestinyStatGroupDefinition, this will be the identifier for that definition.
   * If you are using live data or precomputed stats data on the DestinyInventoryItemDefinition.stats.stats property, you don't have to worry about statGroupHash and how it alters stats: the already altered stats are provided to you. But if you want to see how the sausage gets made, or perform computations yourself, this is valuable information.
   */
  statGroupHash?: Maybe<Scalars["Float"]>;
  statGroup?: Maybe<DestinyStatGroupDefinition>;
  stats?: Maybe<DestinyStatDefinition>;
  /** A quick and lazy way to determine whether any stat other than the "primary" stat is actually visible on the item. Items often have stats that we return in case people find them useful, but they're not part of the "Stat Group" and thus we wouldn't display them in our UI. If this is False, then we're not going to display any of these stats other than the primary one. */
  hasDisplayableStats?: Maybe<Scalars["Boolean"]>;
  /**
   * This stat is determined to be the "primary" stat, and can be looked up in the stats or any other stat collection related to the item.
   * Use this hash to look up the stat's value using DestinyInventoryItemDefinition.stats.stats, and the renderable data for the primary stat in the related DestinyStatDefinition.
   */
  primaryBaseStatHash?: Maybe<Scalars["Float"]>;
  primaryBaseStat?: Maybe<DestinyStatDefinition>;
};

export type DestinyItemSummaryBlockDefinition = {
  __typename?: "DestinyItemSummaryBlockDefinition";
  /** Apparently when rendering an item in a reward, this should be used as a sort priority. We're not doing it presently. */
  sortPriority?: Maybe<Scalars["Int"]>;
};

export type DestinyItemTalentGridBlockDefinition = {
  __typename?: "DestinyItemTalentGridBlockDefinition";
  /** The hash identifier of the DestinyTalentGridDefinition attached to this item. */
  talentGridHash?: Maybe<Scalars["Float"]>;
  talentGrid?: Maybe<DestinyTalentGridDefinition>;
  /** This is meant to be a subtitle for looking at the talent grid. In practice, somewhat frustratingly, this always merely says the localized word for "Details". Great. Maybe it'll have more if talent grids ever get used for more than builds and subclasses again. */
  itemDetailString?: Maybe<Scalars["String"]>;
  /** A shortcut string identifier for the "build" in question, if this talent grid has an associated build. Doesn't map to anything we can expose at the moment. */
  buildName?: Maybe<Scalars["String"]>;
  /** If the talent grid implies a damage type, this is the enum value for that damage type. */
  hudDamageType?: Maybe<Scalars["Int"]>;
  /** If the talent grid has a special icon that's shown in the game UI (like builds, funny that), this is the identifier for that icon. Sadly, we don't actually get that icon right now. I'll be looking to replace this with a path to the actual icon itself. */
  hudIcon?: Maybe<Scalars["String"]>;
};

export type DestinyItemTierTypeDefinition = {
  __typename?: "DestinyItemTierTypeDefinition";
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /** If this tier defines infusion properties, they will be contained here. */
  infusionProcess?: Maybe<DestinyItemTierTypeInfusionBlock>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyItemTierTypeInfusionBlock = {
  __typename?: "DestinyItemTierTypeInfusionBlock";
  /** The default portion of quality that will transfer from the infuser to the infusee item. (InfuserQuality - InfuseeQuality) * baseQualityTransferRatio = base quality transferred. */
  baseQualityTransferRatio?: Maybe<Scalars["Float"]>;
  /** As long as InfuserQuality > InfuseeQuality, the amount of quality bestowed is guaranteed to be at least this value, even if the transferRatio would dictate that it should be less. The total amount of quality that ends up in the Infusee cannot exceed the Infuser's quality however (for instance, if you infuse a 300 item with a 301 item and the minimum quality increment is 10, the infused item will not end up with 310 quality) */
  minimumQualityIncrement?: Maybe<Scalars["Int"]>;
};

export type DestinyItemTooltipNotification = {
  __typename?: "DestinyItemTooltipNotification";
  displayString?: Maybe<Scalars["String"]>;
  displayStyle?: Maybe<Scalars["String"]>;
};

export type DestinyItemTranslationBlockDefinition = {
  __typename?: "DestinyItemTranslationBlockDefinition";
  weaponPatternIdentifier?: Maybe<Scalars["String"]>;
  weaponPatternHash?: Maybe<Scalars["Float"]>;
  defaultDyes?: Maybe<Array<Maybe<DyeReference>>>;
  lockedDyes?: Maybe<Array<Maybe<DyeReference>>>;
  customDyes?: Maybe<Array<Maybe<DyeReference>>>;
  arrangements?: Maybe<Array<Maybe<DestinyGearArtArrangementReference>>>;
  hasGeometry?: Maybe<Scalars["Boolean"]>;
};

export type DestinyItemValueBlockDefinition = {
  __typename?: "DestinyItemValueBlockDefinition";
  /** References to the items that make up this item's "value", and the quantity. */
  itemValue?: Maybe<Array<Maybe<DestinyItemQuantity>>>;
  /** If there's a localized text description of the value provided, this will be said description. */
  valueDescription?: Maybe<Scalars["String"]>;
};

export type DestinyItemVendorSourceReference = {
  __typename?: "DestinyItemVendorSourceReference";
  /** The identifier for the vendor that may sell this item. */
  vendorHash?: Maybe<Scalars["Float"]>;
  vendor?: Maybe<DestinyVendorDefinition>;
  /** The Vendor sale item indexes that represent the sale information for this item. The same vendor may sell an item in multiple "ways", hence why this is a list. (for instance, a weapon may be "sold" as a reward in a quest, for Glimmer, and for Masterwork Cores: each of those ways would be represented by a different vendor sale item with a different index) */
  vendorItemIndexes?: Maybe<Array<Maybe<Scalars["Int"]>>>;
};

export type DestinyItemVersionDefinition = {
  __typename?: "DestinyItemVersionDefinition";
  /** A reference to the power cap for this item version. */
  powerCapHash?: Maybe<Scalars["Float"]>;
  powerCap?: Maybe<DestinyPowerCapDefinition>;
};

export type DestinyLinkedGraphDefinition = {
  __typename?: "DestinyLinkedGraphDefinition";
  description?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  unlockExpression?: Maybe<DestinyUnlockExpressionDefinition>;
  linkedGraphId?: Maybe<Scalars["Float"]>;
  linkedGraphs?: Maybe<Array<Maybe<DestinyLinkedGraphEntryDefinition>>>;
  overview?: Maybe<Scalars["String"]>;
};

export type DestinyLinkedGraphEntryDefinition = {
  __typename?: "DestinyLinkedGraphEntryDefinition";
  activityGraphHash?: Maybe<Scalars["Float"]>;
};

export type DestinyLocationDefinition = {
  __typename?: "DestinyLocationDefinition";
  /** If the location has a Vendor on it, this is the hash identifier for that Vendor. Look them up with DestinyVendorDefinition. */
  vendorHash?: Maybe<Scalars["Float"]>;
  vendor?: Maybe<DestinyVendorDefinition>;
  /** A Location may refer to different specific spots in the world based on the world's current state. This is a list of those potential spots, and the data we can use at runtime to determine which one of the spots is the currently valid one. */
  locationReleases?: Maybe<Array<Maybe<DestinyLocationReleaseDefinition>>>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyLocationReleaseDefinition = {
  __typename?: "DestinyLocationReleaseDefinition";
  /** Sadly, these don't appear to be populated anymore (ever?) */
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  smallTransparentIcon?: Maybe<Scalars["String"]>;
  mapIcon?: Maybe<Scalars["String"]>;
  largeTransparentIcon?: Maybe<Scalars["String"]>;
  /** If we had map information, this spawnPoint would be interesting. But sadly, we don't have that info. */
  spawnPoint?: Maybe<Scalars["Float"]>;
  /** The Destination being pointed to by this location. */
  destinationHash?: Maybe<Scalars["Float"]>;
  destination?: Maybe<DestinyDestinationDefinition>;
  /** The Activity being pointed to by this location. */
  activityHash?: Maybe<Scalars["Float"]>;
  activity?: Maybe<DestinyActivityDefinition>;
  /** The Activity Graph being pointed to by this location. */
  activityGraphHash?: Maybe<Scalars["Float"]>;
  /** The Activity Graph Node being pointed to by this location. (Remember that Activity Graph Node hashes are only unique within an Activity Graph: so use the combination to find the node being spoken of) */
  activityGraphNodeHash?: Maybe<Scalars["Float"]>;
  /** The Activity Bubble within the Destination. Look this up in the DestinyDestinationDefinition's bubbles and bubbleSettings properties. */
  activityBubbleName?: Maybe<Scalars["Float"]>;
  /** If we had map information, this would tell us something cool about the path this location wants you to take. I wish we had map information. */
  activityPathBundle?: Maybe<Scalars["Float"]>;
  /** If we had map information, this would tell us about path information related to destination on the map. Sad. Maybe you can do something cool with it. Go to town man. */
  activityPathDestination?: Maybe<Scalars["Float"]>;
  /** The type of Nav Point that this represents. See the enumeration for more info. */
  navPointType?: Maybe<Scalars["Int"]>;
  /** Looks like it should be the position on the map, but sadly it does not look populated... yet? */
  worldPosition?: Maybe<Array<Maybe<Scalars["Int"]>>>;
};

export type DestinyLoreDefinition = {
  __typename?: "DestinyLoreDefinition";
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  subtitle?: Maybe<Scalars["String"]>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyMaterialRequirement = {
  __typename?: "DestinyMaterialRequirement";
  /** The hash identifier of the material required. Use it to look up the material's DestinyInventoryItemDefinition. */
  itemHash?: Maybe<Scalars["Float"]>;
  item?: Maybe<DestinyInventoryItemDefinition>;
  /** If True, the material will be removed from the character's inventory when the action is performed. */
  deleteOnAction?: Maybe<Scalars["Boolean"]>;
  /** The amount of the material required. */
  count?: Maybe<Scalars["Int"]>;
  /** If True, this requirement is "silent": don't bother showing it in a material requirements display. I mean, I'm not your mom: I'm not going to tell you you *can't* show it. But we won't show it in our UI. */
  omitFromRequirements?: Maybe<Scalars["Boolean"]>;
};

export type DestinyMaterialRequirementSetDefinition = {
  __typename?: "DestinyMaterialRequirementSetDefinition";
  /** The list of all materials that are required. */
  materials?: Maybe<Array<Maybe<DestinyMaterialRequirement>>>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyMetricDefinition = {
  __typename?: "DestinyMetricDefinition";
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  trackingObjectiveHash?: Maybe<Scalars["Float"]>;
  trackingObjective?: Maybe<DestinyObjectiveDefinition>;
  lowerValueIsBetter?: Maybe<Scalars["Boolean"]>;
  presentationNodeType?: Maybe<Scalars["Int"]>;
  traitIds?: Maybe<Array<Maybe<Scalars["String"]>>>;
  traitHashes?: Maybe<Array<Maybe<Scalars["Float"]>>>;
  trait?: Maybe<DestinyTraitDefinition>;
  /** A quick reference to presentation nodes that have this node as a child. Presentation nodes can be parented under multiple parents. */
  parentNodeHashes?: Maybe<Array<Maybe<Scalars["Float"]>>>;
  parentNode?: Maybe<DestinyPresentationNodeDefinition>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyMilestoneChallengeActivityDefinition = {
  __typename?: "DestinyMilestoneChallengeActivityDefinition";
  /** The activity for which this challenge is active. */
  activityHash?: Maybe<Scalars["Float"]>;
  challenges?: Maybe<Array<Maybe<DestinyMilestoneChallengeDefinition>>>;
  /** If the activity and its challenge is visible on any of these nodes, it will be returned. */
  activityGraphNodes?: Maybe<
    Array<Maybe<DestinyMilestoneChallengeActivityGraphNodeEntry>>
  >;
  /**
   * Phases related to this activity, if there are any.
   * These will be listed in the order in which they will appear in the actual activity.
   */
  phases?: Maybe<Array<Maybe<DestinyMilestoneChallengeActivityPhase>>>;
};

export type DestinyMilestoneChallengeActivityGraphNodeEntry = {
  __typename?: "DestinyMilestoneChallengeActivityGraphNodeEntry";
  activityGraphHash?: Maybe<Scalars["Float"]>;
  activityGraphNodeHash?: Maybe<Scalars["Float"]>;
};

export type DestinyMilestoneChallengeActivityPhase = {
  __typename?: "DestinyMilestoneChallengeActivityPhase";
  /** The hash identifier of the activity's phase. */
  phaseHash?: Maybe<Scalars["Float"]>;
};

export type DestinyMilestoneChallengeDefinition = {
  __typename?: "DestinyMilestoneChallengeDefinition";
  /** The challenge related to this milestone. */
  challengeObjectiveHash?: Maybe<Scalars["Float"]>;
};

export type DestinyMilestoneDefinition = {
  __typename?: "DestinyMilestoneDefinition";
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /** A hint to the UI to indicate what to show as the display properties for this Milestone when showing "Live" milestone data. Feel free to show more than this if desired: this hint is meant to simplify our own UI, but it may prove useful to you as well. */
  displayPreference?: Maybe<Scalars["Int"]>;
  /** A custom image someone made just for the milestone. Isn't that special? */
  image?: Maybe<Scalars["String"]>;
  /** An enumeration listing one of the possible types of milestones. Check out the DestinyMilestoneType enum for more info! */
  milestoneType?: Maybe<Scalars["Int"]>;
  /** If True, then the Milestone has been integrated with BNet's recruiting feature. */
  recruitable?: Maybe<Scalars["Boolean"]>;
  /** If the milestone has a friendly identifier for association with other features - such as Recruiting - that identifier can be found here. This is "friendly" in that it looks better in a URL than whatever the identifier for the Milestone actually is. */
  friendlyName?: Maybe<Scalars["String"]>;
  /** If TRUE, this entry should be returned in the list of milestones for the "Explore Destiny" (i.e. new BNet homepage) features of Bungie.net (as long as the underlying event is active) Note that this is a property specifically used by BNet and the companion app for the "Live Events" feature of the front page/welcome view: it's not a reflection of what you see in-game. */
  showInExplorer?: Maybe<Scalars["Boolean"]>;
  /** Determines whether we'll show this Milestone in the user's personal Milestones list. */
  showInMilestones?: Maybe<Scalars["Boolean"]>;
  /** If TRUE, "Explore Destiny" (the front page of BNet and the companion app) prioritize using the activity image over any overriding Quest or Milestone image provided. This unfortunate hack is brought to you by Trials of The Nine. */
  explorePrioritizesActivityImage?: Maybe<Scalars["Boolean"]>;
  /** A shortcut for clients - and the server - to understand whether we can predict the start and end dates for this event. In practice, there are multiple ways that an event could have predictable date ranges, but not all events will be able to be predicted via any mechanism (for instance, events that are manually triggered on and off) */
  hasPredictableDates?: Maybe<Scalars["Boolean"]>;
  /** If you're going to show Vendors for the Milestone, you can use this as a localized "header" for the section where you show that vendor data. It'll provide a more context-relevant clue about what the vendor's role is in the Milestone. */
  vendorsDisplayTitle?: Maybe<Scalars["String"]>;
  /** Sometimes, milestones will have rewards provided by Vendors. This definition gives the information needed to understand which vendors are relevant, the order in which they should be returned if order matters, and the conditions under which the Vendor is relevant to the user. */
  vendors?: Maybe<Array<Maybe<DestinyMilestoneVendorDefinition>>>;
  /** Some milestones are explicit objectives that you can see and interact with in the game. Some milestones are more conceptual, built by BNet to help advise you on activities and events that happen in-game but that aren't explicitly shown in game as Milestones. If this is TRUE, you can see this as a milestone in the game. If this is FALSE, it's an event or activity you can participate in, but you won't see it as a Milestone in the game's UI. */
  isInGameMilestone?: Maybe<Scalars["Boolean"]>;
  /** A Milestone can now be represented by one or more activities directly (without a backing Quest), and that activity can have many challenges, modifiers, and related to it. */
  activities?: Maybe<Array<Maybe<DestinyMilestoneChallengeActivityDefinition>>>;
  defaultOrder?: Maybe<Scalars["Int"]>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyMilestoneVendorDefinition = {
  __typename?: "DestinyMilestoneVendorDefinition";
  /** The hash of the vendor whose wares should be shown as associated with the Milestone. */
  vendorHash?: Maybe<Scalars["Float"]>;
  vendor?: Maybe<DestinyVendorDefinition>;
};

export type DestinyNodeActivationRequirement = {
  __typename?: "DestinyNodeActivationRequirement";
  /**
   * The Progression level on the Talent Grid required to activate this node.
   * See DestinyTalentGridDefinition.progressionHash for the related Progression, and read DestinyProgressionDefinition's documentation to learn more about Progressions.
   */
  gridLevel?: Maybe<Scalars["Int"]>;
  /**
   * The list of hash identifiers for material requirement sets: materials that are required for the node to be activated. See DestinyMaterialRequirementSetDefinition for more information about material requirements.
   * In this case, only a single DestinyMaterialRequirementSetDefinition will be chosen from this list, and we won't know which one will be chosen until an instance of the item is created.
   */
  materialRequirementHashes?: Maybe<Array<Maybe<Scalars["Float"]>>>;
  materialRequirement?: Maybe<DestinyMaterialRequirementSetDefinition>;
};

export type DestinyNodeSocketReplaceResponse = {
  __typename?: "DestinyNodeSocketReplaceResponse";
  /** The hash identifier of the socket type to find amidst the item's sockets (the item to which this talent grid is attached). See DestinyInventoryItemDefinition.sockets.socketEntries to find the socket type of sockets on the item in question. */
  socketTypeHash?: Maybe<Scalars["Float"]>;
  socketType?: Maybe<DestinySocketTypeDefinition>;
  /** The hash identifier of the plug item that will be inserted into the socket found. */
  plugItemHash?: Maybe<Scalars["Float"]>;
  plugItem?: Maybe<DestinyInventoryItemDefinition>;
};

export type DestinyNodeStepDefinition = {
  __typename?: "DestinyNodeStepDefinition";
  /** These are the display properties actually used to render the Talent Node. The currently active step's displayProperties are shown. */
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /**
   * The index of this step in the list of Steps on the Talent Node.
   * Unfortunately, this is the closest thing we have to an identifier for the Step: steps are not provided a content version agnostic identifier. This means that, when you are dealing with talent nodes, you will need to first ensure that you have the latest version of content.
   */
  stepIndex?: Maybe<Scalars["Int"]>;
  /** The hash of this node step. Unfortunately, while it can be used to uniquely identify the step within a node, it is also content version dependent and should not be relied on without ensuring you have the latest vesion of content. */
  nodeStepHash?: Maybe<Scalars["Float"]>;
  /** If you can interact with this node in some way, this is the localized description of that interaction. */
  interactionDescription?: Maybe<Scalars["String"]>;
  damageType?: Maybe<DestinyDamageTypeDefinition>;
  /** If the step provides a damage type, this will be the hash identifier used to look up the damage type's DestinyDamageTypeDefinition. */
  damageTypeHash?: Maybe<Scalars["Float"]>;
  /** If the step has requirements for activation (they almost always do, if nothing else than for the Talent Grid's Progression to have reached a certain level), they will be defined here. */
  activationRequirement?: Maybe<DestinyNodeActivationRequirement>;
  /**
   * There was a time when talent nodes could be activated multiple times, and the effects of subsequent Steps would be compounded on each other, essentially "upgrading" the node. We have moved away from this, but theoretically the capability still exists.
   * I continue to return this in case it is used in the future: if true and this step is the current step in the node, you are allowed to activate the node a second time to receive the benefits of the next step in the node, which will then become the active step.
   */
  canActivateNextStep?: Maybe<Scalars["Boolean"]>;
  /**
   * The stepIndex of the next step in the talent node, or -1 if this is the last step or if the next step to be chosen is random.
   * This doesn't really matter anymore unless canActivateNextStep begins to be used again.
   */
  nextStepIndex?: Maybe<Scalars["Int"]>;
  /** If true, the next step to be chosen is random, and if you're allowed to activate the next step. (if canActivateNextStep = true) */
  isNextStepRandom?: Maybe<Scalars["Boolean"]>;
  /** The list of hash identifiers for Perks (DestinySandboxPerkDefinition) that are applied when this step is active. Perks provide a variety of benefits and modifications - examine DestinySandboxPerkDefinition to learn more. */
  perkHashes?: Maybe<Array<Maybe<Scalars["Float"]>>>;
  perk?: Maybe<DestinySandboxPerkDefinition>;
  /**
   * When the Talent Grid's progression reaches this value, the circular "progress bar" that surrounds the talent node should be shown.
   * This also indicates the lower bound of said progress bar, with the upper bound being the progress required to reach activationRequirement.gridLevel. (at some point I should precalculate the upper bound and put it in the definition to save people time)
   */
  startProgressionBarAtProgress?: Maybe<Scalars["Int"]>;
  /** When the step provides stat benefits on the item or character, this is the list of hash identifiers for stats (DestinyStatDefinition) that are provided. */
  statHashes?: Maybe<Array<Maybe<Scalars["Float"]>>>;
  stat?: Maybe<DestinyStatDefinition>;
  /** If this is true, the step affects the item's Quality in some way. See DestinyInventoryItemDefinition for more information about the meaning of Quality. I already made a joke about Zen and the Art of Motorcycle Maintenance elsewhere in the documentation, so I will avoid doing it again. Oops too late */
  affectsQuality?: Maybe<Scalars["Boolean"]>;
  /** In Destiny 1, the Armory's Perk Filtering was driven by a concept of TalentNodeStepGroups: categorizations of talent nodes based on their functionality. While the Armory isn't a BNet-facing thing for now, and the new Armory will need to account for Sockets rather than Talent Nodes, this categorization capability feels useful enough to still keep around. */
  stepGroups?: Maybe<DestinyTalentNodeStepGroups>;
  /** If true, this step can affect the level of the item. See DestinyInventoryItemDefintion for more information about item levels and their effect on stats. */
  affectsLevel?: Maybe<Scalars["Boolean"]>;
  /** If this step is activated, this will be a list of information used to replace socket items with new Plugs. See DestinyInventoryItemDefinition for more information about sockets and plugs. */
  socketReplacements?: Maybe<Array<Maybe<DestinyNodeSocketReplaceResponse>>>;
};

export type DestinyObjectiveDefinition = {
  __typename?: "DestinyObjectiveDefinition";
  /** Ideally, this should tell you what your task is. I'm not going to lie to you though. Sometimes this doesn't have useful information at all. Which sucks, but there's nothing either of us can do about it. */
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /** The value that the unlock value defined in unlockValueHash must reach in order for the objective to be considered Completed. Used in calculating progress and completion status. */
  completionValue?: Maybe<Scalars["Int"]>;
  /** A shortcut for determining the most restrictive gating that this Objective is set to use. This includes both the dynamic determination of progress and of completion values. See the DestinyGatingScope enum's documentation for more details. */
  scope?: Maybe<Scalars["Int"]>;
  /** OPTIONAL: a hash identifier for the location at which this objective must be accomplished, if there is a location defined. Look up the DestinyLocationDefinition for this hash for that additional location info. */
  locationHash?: Maybe<Scalars["Float"]>;
  location?: Maybe<DestinyLocationDefinition>;
  /** If true, the value is allowed to go negative. */
  allowNegativeValue?: Maybe<Scalars["Boolean"]>;
  /**
   * If true, you can effectively "un-complete" this objective if you lose progress after crossing the completion threshold.
   * If False, once you complete the task it will remain completed forever by locking the value.
   */
  allowValueChangeWhenCompleted?: Maybe<Scalars["Boolean"]>;
  /**
   * If true, completion means having an unlock value less than or equal to the completionValue.
   * If False, completion means having an unlock value greater than or equal to the completionValue.
   */
  isCountingDownward?: Maybe<Scalars["Boolean"]>;
  /** The UI style applied to the objective. It's an enum, take a look at DestinyUnlockValueUIStyle for details of the possible styles. Use this info as you wish to customize your UI. */
  valueStyle?: Maybe<Scalars["Int"]>;
  /** Text to describe the progress bar. */
  progressDescription?: Maybe<Scalars["String"]>;
  /** If this objective enables Perks intrinsically, the conditions for that enabling are defined here. */
  perks?: Maybe<DestinyObjectivePerkEntryDefinition>;
  /** If this objective enables modifications on a player's stats intrinsically, the conditions are defined here. */
  stats?: Maybe<DestinyObjectiveStatEntryDefinition>;
  /** If nonzero, this is the minimum value at which the objective's progression should be shown. Otherwise, don't show it yet. */
  minimumVisibilityThreshold?: Maybe<Scalars["Int"]>;
  /** If True, the progress will continue even beyond the point where the objective met its minimum completion requirements. Your UI will have to accommodate it. */
  allowOvercompletion?: Maybe<Scalars["Boolean"]>;
  /** If True, you should continue showing the progression value in the UI after it's complete. I mean, we already do that in BNet anyways, but if you want to be better behaved than us you could honor this flag. */
  showValueOnComplete?: Maybe<Scalars["Boolean"]>;
  /** The style to use when the objective is completed. */
  completedValueStyle?: Maybe<Scalars["Int"]>;
  /** The style to use when the objective is still in progress. */
  inProgressValueStyle?: Maybe<Scalars["Int"]>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyObjectiveDisplayProperties = {
  __typename?: "DestinyObjectiveDisplayProperties";
  /** The activity associated with this objective in the context of this item, if any. */
  activityHash?: Maybe<Scalars["Float"]>;
  activity?: Maybe<DestinyActivityDefinition>;
  /** If true, the game shows this objective on item preview screens. */
  displayOnItemPreviewScreen?: Maybe<Scalars["Boolean"]>;
};

export type DestinyObjectivePerkEntryDefinition = {
  __typename?: "DestinyObjectivePerkEntryDefinition";
  /** The hash identifier of the DestinySandboxPerkDefinition that will be applied to the character. */
  perkHash?: Maybe<Scalars["Float"]>;
  perk?: Maybe<DestinySandboxPerkDefinition>;
  /** An enumeration indicating whether it will be applied as long as the Objective is active, when it's completed, or until it's completed. */
  style?: Maybe<Scalars["Int"]>;
};

export type DestinyObjectiveStatEntryDefinition = {
  __typename?: "DestinyObjectiveStatEntryDefinition";
  /** The stat being modified, and the value used. */
  stat?: Maybe<DestinyItemInvestmentStatDefinition>;
  /** Whether it will be applied as long as the objective is active, when it's completed, or until it's completed. */
  style?: Maybe<Scalars["Int"]>;
};

export type DestinyParentItemOverride = {
  __typename?: "DestinyParentItemOverride";
  additionalEquipRequirementsDisplayStrings?: Maybe<
    Array<Maybe<Scalars["String"]>>
  >;
  pipIcon?: Maybe<Scalars["String"]>;
};

export type DestinyPlaceDefinition = {
  __typename?: "DestinyPlaceDefinition";
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyPlugRuleDefinition = {
  __typename?: "DestinyPlugRuleDefinition";
  /** The localized string to show if this rule fails. */
  failureMessage?: Maybe<Scalars["String"]>;
};

export type DestinyPlugSetDefinition = {
  __typename?: "DestinyPlugSetDefinition";
  /** If you want to show these plugs in isolation, these are the display properties for them. */
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /**
   * This is a list of pre-determined plugs that can be plugged into this socket, without the character having the plug in their inventory.
   * If this list is populated, you will not be allowed to plug an arbitrary item in the socket: you will only be able to choose from one of these reusable plugs.
   */
  reusablePlugItems?: Maybe<
    Array<Maybe<DestinyItemSocketEntryPlugItemRandomizedDefinition>>
  >;
  /**
   * Mostly for our debugging or reporting bugs, BNet is making "fake" plug sets in a desperate effort to reduce socket sizes.
   *  If this is true, the plug set was generated by BNet: if it looks wrong, that's a good indicator that it's bungie.net that fucked this up.
   */
  isFakePlugSet?: Maybe<Scalars["Boolean"]>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyPlugWhitelistEntryDefinition = {
  __typename?: "DestinyPlugWhitelistEntryDefinition";
  /**
   * The hash identifier of the Plug Category to compare against the plug item's plug.plugCategoryHash.
   * Note that this does NOT relate to any Definition in itself, it is only used for comparison purposes.
   */
  categoryHash?: Maybe<Scalars["Float"]>;
  /** The string identifier for the category, which is here mostly for debug purposes. */
  categoryIdentifier?: Maybe<Scalars["String"]>;
  /**
   * The list of all plug items (DestinyInventoryItemDefinition) that the socket may randomly be populated with when reinitialized.
   * Which ones you should actually show are determined by the plug being inserted into the socket, and the socket’s type.
   * When you inspect the plug that could go into a Masterwork Socket, look up the socket type of the socket being inspected and find the DestinySocketTypeDefinition.
   * Then, look at the Plugs that can fit in that socket. Find the Whitelist in the DestinySocketTypeDefinition that matches the plug item’s categoryhash.
   * That whitelist entry will potentially have a new “reinitializationPossiblePlugHashes” property.If it does, that means we know what it will roll if you try to insert this plug into this socket.
   */
  reinitializationPossiblePlugHashes?: Maybe<Array<Maybe<Scalars["Float"]>>>;
};

export type DestinyPositionDefinition = {
  __typename?: "DestinyPositionDefinition";
  x?: Maybe<Scalars["Int"]>;
  y?: Maybe<Scalars["Int"]>;
  z?: Maybe<Scalars["Int"]>;
};

export type DestinyPowerCapDefinition = {
  __typename?: "DestinyPowerCapDefinition";
  /** The raw value for a power cap. */
  powerCap?: Maybe<Scalars["Int"]>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyPresentationChildBlock = {
  __typename?: "DestinyPresentationChildBlock";
  presentationNodeType?: Maybe<Scalars["Int"]>;
  parentPresentationNodeHashes?: Maybe<Array<Maybe<Scalars["Float"]>>>;
  parentPresentationNode?: Maybe<DestinyPresentationNodeDefinition>;
  displayStyle?: Maybe<Scalars["Int"]>;
};

export type DestinyPresentationNodeChildEntry = {
  __typename?: "DestinyPresentationNodeChildEntry";
  presentationNodeHash?: Maybe<Scalars["Float"]>;
  presentationNode?: Maybe<DestinyPresentationNodeDefinition>;
};

export type DestinyPresentationNodeChildrenBlock = {
  __typename?: "DestinyPresentationNodeChildrenBlock";
  presentationNodes?: Maybe<Array<Maybe<DestinyPresentationNodeChildEntry>>>;
  collectibles?: Maybe<
    Array<Maybe<DestinyPresentationNodeCollectibleChildEntry>>
  >;
  records?: Maybe<Array<Maybe<DestinyPresentationNodeRecordChildEntry>>>;
  metrics?: Maybe<Array<Maybe<DestinyPresentationNodeMetricChildEntry>>>;
};

export type DestinyPresentationNodeCollectibleChildEntry = {
  __typename?: "DestinyPresentationNodeCollectibleChildEntry";
  collectibleHash?: Maybe<Scalars["Float"]>;
  collectible?: Maybe<DestinyCollectibleDefinition>;
};

export type DestinyPresentationNodeDefinition = {
  __typename?: "DestinyPresentationNodeDefinition";
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /** The original icon for this presentation node, before we futzed with it. */
  originalIcon?: Maybe<Scalars["String"]>;
  /** Some presentation nodes are meant to be explicitly shown on the "root" or "entry" screens for the feature to which they are related. You should use this icon when showing them on such a view, if you have a similar "entry point" view in your UI. If you don't have a UI, then I guess it doesn't matter either way does it? */
  rootViewIcon?: Maybe<Scalars["String"]>;
  nodeType?: Maybe<Scalars["Int"]>;
  /** Indicates whether this presentation node's state is determined on a per-character or on an account-wide basis. */
  scope?: Maybe<Scalars["Int"]>;
  /** If this presentation node shows a related objective (for instance, if it tracks the progress of its children), the objective being tracked is indicated here. */
  objectiveHash?: Maybe<Scalars["Float"]>;
  objective?: Maybe<DestinyObjectiveDefinition>;
  /** If this presentation node has an associated "Record" that you can accomplish for completing its children, this is the identifier of that Record. */
  completionRecordHash?: Maybe<Scalars["Float"]>;
  completionRecord?: Maybe<DestinyRecordDefinition>;
  /** The child entities contained by this presentation node. */
  children?: Maybe<DestinyPresentationNodeChildrenBlock>;
  /** A hint for how to display this presentation node when it's shown in a list. */
  displayStyle?: Maybe<Scalars["Int"]>;
  /** A hint for how to display this presentation node when it's shown in its own detail screen. */
  screenStyle?: Maybe<Scalars["Int"]>;
  /** The requirements for being able to interact with this presentation node and its children. */
  requirements?: Maybe<DestinyPresentationNodeRequirementsBlock>;
  /** If this presentation node has children, but the game doesn't let you inspect the details of those children, that is indicated here. */
  disableChildSubscreenNavigation?: Maybe<Scalars["Boolean"]>;
  maxCategoryRecordScore?: Maybe<Scalars["Int"]>;
  presentationNodeType?: Maybe<Scalars["Int"]>;
  traitIds?: Maybe<Array<Maybe<Scalars["String"]>>>;
  traitHashes?: Maybe<Array<Maybe<Scalars["Float"]>>>;
  trait?: Maybe<DestinyTraitDefinition>;
  /** A quick reference to presentation nodes that have this node as a child. Presentation nodes can be parented under multiple parents. */
  parentNodeHashes?: Maybe<Array<Maybe<Scalars["Float"]>>>;
  parentNode?: Maybe<DestinyPresentationNodeDefinition>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyPresentationNodeMetricChildEntry = {
  __typename?: "DestinyPresentationNodeMetricChildEntry";
  metricHash?: Maybe<Scalars["Float"]>;
  metric?: Maybe<DestinyMetricDefinition>;
};

export type DestinyPresentationNodeRecordChildEntry = {
  __typename?: "DestinyPresentationNodeRecordChildEntry";
  recordHash?: Maybe<Scalars["Float"]>;
  record?: Maybe<DestinyRecordDefinition>;
};

export type DestinyPresentationNodeRequirementsBlock = {
  __typename?: "DestinyPresentationNodeRequirementsBlock";
  /** If this node is not accessible due to Entitlements (for instance, you don't own the required game expansion), this is the message to show. */
  entitlementUnavailableMessage?: Maybe<Scalars["String"]>;
};

export type DestinyProgressionDefinition = {
  __typename?: "DestinyProgressionDefinition";
  displayProperties?: Maybe<DestinyProgressionDisplayPropertiesDefinition>;
  /**
   * The "Scope" of the progression indicates the source of the progression's live data.
   * See the DestinyProgressionScope enum for more info: but essentially, a Progression can either be backed by a stored value, or it can be a calculated derivative of other values.
   */
  scope?: Maybe<Scalars["Int"]>;
  /** If this is True, then the progression doesn't have a maximum level. */
  repeatLastStep?: Maybe<Scalars["Boolean"]>;
  /** If there's a description of how to earn this progression in the local config, this will be that localized description. */
  source?: Maybe<Scalars["String"]>;
  /**
   * Progressions are divided into Steps, which roughly equate to "Levels" in the traditional sense of a Progression. Notably, the last step can be repeated indefinitely if repeatLastStep is true, meaning that the calculation for your level is not as simple as comparing your current progress to the max progress of the steps.
   * These and more calculations are done for you if you grab live character progression data, such as in the DestinyCharacterProgressionComponent.
   */
  steps?: Maybe<Array<Maybe<DestinyProgressionStepDefinition>>>;
  /**
   * If true, the Progression is something worth showing to users.
   * If false, BNet isn't going to show it. But that doesn't mean you can't. We're all friends here.
   */
  visible?: Maybe<Scalars["Boolean"]>;
  /**
   * If the value exists, this is the hash identifier for the Faction that owns this Progression.
   * This is purely for convenience, if you're looking at a progression and want to know if and who it's related to in terms of Faction Reputation.
   */
  factionHash?: Maybe<Scalars["Float"]>;
  faction?: Maybe<DestinyFactionDefinition>;
  /** The #RGB string value for the color related to this progression, if there is one. */
  color?: Maybe<DestinyColor>;
  /** For progressions that have it, this is the rank icon we use in the Companion, displayed above the progressions' rank value. */
  rankIcon?: Maybe<Scalars["String"]>;
  rewardItems?: Maybe<Array<Maybe<DestinyProgressionRewardItemQuantity>>>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyProgressionDisplayPropertiesDefinition = {
  __typename?: "DestinyProgressionDisplayPropertiesDefinition";
  /** When progressions show your "experience" gained, that bar has units (i.e. "Experience", "Bad Dudes Snuffed Out", whatever). This is the localized string for that unit of measurement. */
  displayUnitsName?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  /**
   * Note that "icon" is sometimes misleading, and should be interpreted in the context of the entity. For instance, in Destiny 1 the DestinyRecordBookDefinition's icon was a big picture of a book.
   * But usually, it will be a small square image that you can use as... well, an icon.
   * They are currently represented as 96px x 96px images.
   */
  icon?: Maybe<Scalars["String"]>;
  iconSequences?: Maybe<Array<Maybe<DestinyIconSequenceDefinition>>>;
  /** If this item has a high-res icon (at least for now, many things won't), then the path to that icon will be here. */
  highResIcon?: Maybe<Scalars["String"]>;
  hasIcon?: Maybe<Scalars["Boolean"]>;
};

export type DestinyProgressionLevelRequirementDefinition = {
  __typename?: "DestinyProgressionLevelRequirementDefinition";
  /**
   * A curve of level requirements, weighted by the related progressions' level.
   * Interpolate against this curve with the character's progression level to determine what the level requirement of the generated item that is using this data will be.
   */
  requirementCurve?: Maybe<Array<Maybe<InterpolationPointFloat>>>;
  /**
   * The progression whose level should be used to determine the level requirement.
   * Look up the DestinyProgressionDefinition with this hash for more information about the progression in question.
   */
  progressionHash?: Maybe<Scalars["Float"]>;
  progression?: Maybe<DestinyProgressionDefinition>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyProgressionMappingDefinition = {
  __typename?: "DestinyProgressionMappingDefinition";
  /** Infrequently defined in practice. Defer to the individual progressions' display properties. */
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /** The localized unit of measurement for progression across the progressions defined in this mapping. Unfortunately, this is very infrequently defined. Defer to the individual progressions' display units. */
  displayUnits?: Maybe<Scalars["String"]>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyProgressionRewardDefinition = {
  __typename?: "DestinyProgressionRewardDefinition";
  /** The hash identifier of the DestinyProgressionMappingDefinition that contains the progressions for which experience should be applied. */
  progressionMappingHash?: Maybe<Scalars["Float"]>;
  progressionMapping?: Maybe<DestinyProgressionMappingDefinition>;
  /** The amount of experience to give to each of the mapped progressions. */
  amount?: Maybe<Scalars["Int"]>;
  /** If true, the game's internal mechanisms to throttle progression should be applied. */
  applyThrottles?: Maybe<Scalars["Boolean"]>;
};

export type DestinyProgressionRewardItemQuantity = {
  __typename?: "DestinyProgressionRewardItemQuantity";
  rewardedAtProgressionLevel?: Maybe<Scalars["Int"]>;
  acquisitionBehavior?: Maybe<Scalars["Int"]>;
  uiDisplayStyle?: Maybe<Scalars["String"]>;
  claimUnlockDisplayStrings?: Maybe<Array<Maybe<Scalars["String"]>>>;
  /** The hash identifier for the item in question. Use it to look up the item's DestinyInventoryItemDefinition. */
  itemHash?: Maybe<Scalars["Float"]>;
  item?: Maybe<DestinyInventoryItemDefinition>;
  /** If this quantity is referring to a specific instance of an item, this will have the item's instance ID. Normally, this will be null. */
  itemInstanceId?: Maybe<Scalars["Int"]>;
  /** The amount of the item needed/available depending on the context of where DestinyItemQuantity is being used. */
  quantity?: Maybe<Scalars["Int"]>;
  /** Indicates that this item quantity may be conditionally shown or hidden, based on various sources of state. For example: server flags, account state, or character progress. */
  hasConditionalVisibility?: Maybe<Scalars["Boolean"]>;
};

export type DestinyProgressionStepDefinition = {
  __typename?: "DestinyProgressionStepDefinition";
  /** Very rarely, Progressions will have localized text describing the Level of the progression. This will be that localized text, if it exists. Otherwise, the standard appears to be to simply show the level numerically. */
  stepName?: Maybe<Scalars["String"]>;
  /** This appears to be, when you "level up", whether a visual effect will display and on what entity. See DestinyProgressionStepDisplayEffect for slightly more info. */
  displayEffectType?: Maybe<Scalars["Int"]>;
  /** The total amount of progression points/"experience" you will need to initially reach this step. If this is the last step and the progression is repeating indefinitely (DestinyProgressionDefinition.repeatLastStep), this will also be the progress needed to level it up further by repeating this step again. */
  progressTotal?: Maybe<Scalars["Int"]>;
  /** A listing of items rewarded as a result of reaching this level. */
  rewardItems?: Maybe<Array<Maybe<DestinyItemQuantity>>>;
  /** If this progression step has a specific icon related to it, this is the icon to show. */
  icon?: Maybe<Scalars["String"]>;
};

export type DestinyRaceDefinition = {
  __typename?: "DestinyRaceDefinition";
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /** An enumeration defining the existing, known Races/Species for player characters. This value will be the enum value matching this definition. */
  raceType?: Maybe<Scalars["Int"]>;
  genderedRaceNamesByGender?: Maybe<DestinyGenderDefinition>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyRecordCompletionBlock = {
  __typename?: "DestinyRecordCompletionBlock";
  /** The number of objectives that must be completed before the objective is considered "complete" */
  partialCompletionObjectiveCountThreshold?: Maybe<Scalars["Int"]>;
  ScoreValue?: Maybe<Scalars["Int"]>;
  shouldFireToast?: Maybe<Scalars["Boolean"]>;
  toastStyle?: Maybe<Scalars["Int"]>;
};

export type DestinyRecordDefinition = {
  __typename?: "DestinyRecordDefinition";
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /** Indicates whether this Record's state is determined on a per-character or on an account-wide basis. */
  scope?: Maybe<Scalars["Int"]>;
  presentationInfo?: Maybe<DestinyPresentationChildBlock>;
  loreHash?: Maybe<Scalars["Float"]>;
  lore?: Maybe<DestinyLoreDefinition>;
  objectiveHashes?: Maybe<Array<Maybe<Scalars["Float"]>>>;
  objective?: Maybe<DestinyObjectiveDefinition>;
  recordValueStyle?: Maybe<Scalars["Int"]>;
  forTitleGilding?: Maybe<Scalars["Boolean"]>;
  titleInfo?: Maybe<DestinyRecordTitleBlock>;
  completionInfo?: Maybe<DestinyRecordCompletionBlock>;
  stateInfo?: Maybe<SchemaRecordStateBlock>;
  requirements?: Maybe<DestinyPresentationNodeRequirementsBlock>;
  expirationInfo?: Maybe<DestinyRecordExpirationBlock>;
  /** Some records have multiple 'interval' objectives, and the record may be claimed at each completed interval */
  intervalInfo?: Maybe<DestinyRecordIntervalBlock>;
  /**
   * If there is any publicly available information about rewards earned for achieving this record, this is the list of those items.
   *  However, note that some records intentionally have "hidden" rewards. These will not be returned in this list.
   */
  rewardItems?: Maybe<Array<Maybe<DestinyItemQuantity>>>;
  presentationNodeType?: Maybe<Scalars["Int"]>;
  traitIds?: Maybe<Array<Maybe<Scalars["String"]>>>;
  traitHashes?: Maybe<Array<Maybe<Scalars["Float"]>>>;
  trait?: Maybe<DestinyTraitDefinition>;
  /** A quick reference to presentation nodes that have this node as a child. Presentation nodes can be parented under multiple parents. */
  parentNodeHashes?: Maybe<Array<Maybe<Scalars["Float"]>>>;
  parentNode?: Maybe<DestinyPresentationNodeDefinition>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyRecordExpirationBlock = {
  __typename?: "DestinyRecordExpirationBlock";
  hasExpiration?: Maybe<Scalars["Boolean"]>;
  description?: Maybe<Scalars["String"]>;
  icon?: Maybe<Scalars["String"]>;
};

export type DestinyRecordIntervalBlock = {
  __typename?: "DestinyRecordIntervalBlock";
  intervalObjectives?: Maybe<Array<Maybe<DestinyRecordIntervalObjective>>>;
  intervalRewards?: Maybe<Array<Maybe<DestinyRecordIntervalRewards>>>;
  originalObjectiveArrayInsertionIndex?: Maybe<Scalars["Int"]>;
};

export type DestinyRecordIntervalObjective = {
  __typename?: "DestinyRecordIntervalObjective";
  intervalObjectiveHash?: Maybe<Scalars["Float"]>;
  intervalScoreValue?: Maybe<Scalars["Int"]>;
};

export type DestinyRecordIntervalRewards = {
  __typename?: "DestinyRecordIntervalRewards";
  intervalRewardItems?: Maybe<Array<Maybe<DestinyItemQuantity>>>;
};

export type DestinyRecordTitleBlock = {
  __typename?: "DestinyRecordTitleBlock";
  hasTitle?: Maybe<Scalars["Boolean"]>;
  titlesByGender?: Maybe<DestinyGenderDefinition>;
  gildingTrackingRecordHash?: Maybe<Scalars["Float"]>;
  gildingTrackingRecord?: Maybe<DestinyRecordDefinition>;
};

export type DestinyReportReasonCategoryDefinition = {
  __typename?: "DestinyReportReasonCategoryDefinition";
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyRewardSourceDefinition = {
  __typename?: "DestinyRewardSourceDefinition";
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /** Sources are grouped into categories: common ways that items are provided. I hope to see this expand in Destiny 2 once we have time to generate accurate reward source data. */
  category?: Maybe<Scalars["Int"]>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinySandboxPerkDefinition = {
  __typename?: "DestinySandboxPerkDefinition";
  /** These display properties are by no means guaranteed to be populated. Usually when it is, it's only because we back-filled them with the displayProperties of some Talent Node or Plug item that happened to be uniquely providing that perk. */
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /** The string identifier for the perk. */
  perkIdentifier?: Maybe<Scalars["String"]>;
  /** If true, you can actually show the perk in the UI. Otherwise, it doesn't have useful player-facing information. */
  isDisplayable?: Maybe<Scalars["Boolean"]>;
  /**
   * If this perk grants a damage type to a weapon, the damage type will be defined here.
   * Unless you have a compelling reason to use this enum value, use the damageTypeHash instead to look up the actual DestinyDamageTypeDefinition.
   */
  damageType?: Maybe<Scalars["Int"]>;
  /**
   * The hash identifier for looking up the DestinyDamageTypeDefinition, if this perk has a damage type.
   * This is preferred over using the damageType enumeration value, which has been left purely because it is occasionally convenient.
   */
  damageTypeHash?: Maybe<Scalars["Float"]>;
  /**
   * An old holdover from the original Armory, this was an attempt to group perks by functionality.
   * It is as yet unpopulated, and there will be quite a bit of work needed to restore it to its former working order.
   */
  perkGroups?: Maybe<DestinyTalentNodeStepGroups>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinySeasonDefinition = {
  __typename?: "DestinySeasonDefinition";
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  backgroundImagePath?: Maybe<Scalars["String"]>;
  seasonNumber?: Maybe<Scalars["Int"]>;
  startDate?: Maybe<Scalars["String"]>;
  endDate?: Maybe<Scalars["String"]>;
  seasonPassHash?: Maybe<Scalars["Float"]>;
  seasonPass?: Maybe<DestinySeasonPassDefinition>;
  seasonPassProgressionHash?: Maybe<Scalars["Float"]>;
  seasonPassProgression?: Maybe<DestinyProgressionDefinition>;
  artifactItemHash?: Maybe<Scalars["Float"]>;
  artifactItem?: Maybe<DestinyInventoryItemDefinition>;
  sealPresentationNodeHash?: Maybe<Scalars["Float"]>;
  sealPresentationNode?: Maybe<DestinyPresentationNodeDefinition>;
  seasonalChallengesPresentationNodeHash?: Maybe<Scalars["Float"]>;
  seasonalChallengesPresentationNode?: Maybe<DestinyPresentationNodeDefinition>;
  /** Optional - Defines the promotional text, images, and links to preview this season. */
  preview?: Maybe<DestinySeasonPreviewDefinition>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinySeasonPassDefinition = {
  __typename?: "DestinySeasonPassDefinition";
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /** This is the progression definition related to the progression for the initial levels 1-100 that provide item rewards for the Season pass. Further experience after you reach the limit is provided in the "Prestige" progression referred to by prestigeProgressionHash. */
  rewardProgressionHash?: Maybe<Scalars["Float"]>;
  rewardProgression?: Maybe<DestinyProgressionDefinition>;
  /**
   * I know what you're thinking, but I promise we're not going to duplicate and drown you. Instead, we're giving you sweet, sweet power bonuses.
   *  Prestige progression is further progression that you can make on the Season pass after you gain max ranks, that will ultimately increase your power/light level over the theoretical limit.
   */
  prestigeProgressionHash?: Maybe<Scalars["Float"]>;
  prestigeProgression?: Maybe<DestinyProgressionDefinition>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinySeasonPreviewDefinition = {
  __typename?: "DestinySeasonPreviewDefinition";
  /** A localized description of the season. */
  description?: Maybe<Scalars["String"]>;
  /** A relative path to learn more about the season. Web browsers should be automatically redirected to the user's Bungie.net locale. For example: "/SeasonOfTheChosen" will redirect to "/7/en/Seasons/SeasonOfTheChosen" for English users. */
  linkPath?: Maybe<Scalars["String"]>;
  /** An optional link to a localized video, probably YouTube. */
  videoLink?: Maybe<Scalars["String"]>;
  /** A list of images to preview the seasonal content. Should have at least three to show. */
  images?: Maybe<Array<Maybe<DestinySeasonPreviewImageDefinition>>>;
};

export type DestinySeasonPreviewImageDefinition = {
  __typename?: "DestinySeasonPreviewImageDefinition";
  /** A thumbnail icon path to preview seasonal content, probably 480x270. */
  thumbnailImage?: Maybe<Scalars["String"]>;
  /** An optional path to a high-resolution image, probably 1920x1080. */
  highResImage?: Maybe<Scalars["String"]>;
};

export type DestinySocketCategoryDefinition = {
  __typename?: "DestinySocketCategoryDefinition";
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /**
   * A string hinting to the game's UI system about how the sockets in this category should be displayed.
   * BNet doesn't use it: it's up to you to find valid values and make your own special UI if you want to honor this category style.
   */
  uiCategoryStyle?: Maybe<Scalars["Float"]>;
  /** Same as uiCategoryStyle, but in a more usable enumeration form. */
  categoryStyle?: Maybe<Scalars["Int"]>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinySocketTypeDefinition = {
  __typename?: "DestinySocketTypeDefinition";
  /** There are fields for this display data, but they appear to be unpopulated as of now. I am not sure where in the UI these would show if they even were populated, but I will continue to return this data in case it becomes useful. */
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /** Defines what happens when a plug is inserted into sockets of this type. */
  insertAction?: Maybe<DestinyInsertPlugActionDefinition>;
  /**
   * A list of Plug "Categories" that are allowed to be plugged into sockets of this type.
   * These should be compared against a given plug item's DestinyInventoryItemDefinition.plug.plugCategoryHash, which indicates the plug item's category.
   * If the plug's category matches any whitelisted plug, or if the whitelist is empty, it is allowed to be inserted.
   */
  plugWhitelist?: Maybe<Array<Maybe<DestinyPlugWhitelistEntryDefinition>>>;
  socketCategoryHash?: Maybe<Scalars["Float"]>;
  socketCategory?: Maybe<DestinySocketCategoryDefinition>;
  /** Sometimes a socket isn't visible. These are some of the conditions under which sockets of this type are not visible. Unfortunately, the truth of visibility is much, much more complex. Best to rely on the live data for whether the socket is visible and enabled. */
  visibility?: Maybe<Scalars["Int"]>;
  alwaysRandomizeSockets?: Maybe<Scalars["Boolean"]>;
  isPreviewEnabled?: Maybe<Scalars["Boolean"]>;
  hideDuplicateReusablePlugs?: Maybe<Scalars["Boolean"]>;
  /** This property indicates if the socket type determines whether Emblem icons and nameplates should be overridden by the inserted plug item's icon and nameplate. */
  overridesUiAppearance?: Maybe<Scalars["Boolean"]>;
  avoidDuplicatesOnInitialization?: Maybe<Scalars["Boolean"]>;
  currencyScalars?: Maybe<
    Array<Maybe<DestinySocketTypeScalarMaterialRequirementEntry>>
  >;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinySocketTypeScalarMaterialRequirementEntry = {
  __typename?: "DestinySocketTypeScalarMaterialRequirementEntry";
  currencyItemHash?: Maybe<Scalars["Float"]>;
  scalarValue?: Maybe<Scalars["Int"]>;
};

export type DestinyStatDefinition = {
  __typename?: "DestinyStatDefinition";
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /** Stats can exist on a character or an item, and they may potentially be aggregated in different ways. The DestinyStatAggregationType enum value indicates the way that this stat is being aggregated. */
  aggregationType?: Maybe<Scalars["Int"]>;
  /**
   * True if the stat is computed rather than being delivered as a raw value on items.
   * For instance, the Light stat in Destiny 1 was a computed stat.
   */
  hasComputedBlock?: Maybe<Scalars["Boolean"]>;
  /** The category of the stat, according to the game. */
  statCategory?: Maybe<Scalars["Int"]>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyStatDisplayDefinition = {
  __typename?: "DestinyStatDisplayDefinition";
  /**
   * The hash identifier for the stat being transformed into a Display stat.
   * Use it to look up the DestinyStatDefinition, or key into a DestinyInventoryItemDefinition's stats property.
   */
  statHash?: Maybe<Scalars["Float"]>;
  stat?: Maybe<DestinyStatDefinition>;
  /** Regardless of the output of interpolation, this is the maximum possible value that the stat can be. It should also be used as the upper bound for displaying the stat as a progress bar (the minimum always being 0) */
  maximumValue?: Maybe<Scalars["Int"]>;
  /** If this is true, the stat should be displayed as a number. Otherwise, display it as a progress bar. Or, you know, do whatever you want. There's no displayAsNumeric police. */
  displayAsNumeric?: Maybe<Scalars["Boolean"]>;
  /**
   * The interpolation table representing how the Investment Stat is transformed into a Display Stat.
   * See DestinyStatDefinition for a description of the stages of stat transformation.
   */
  displayInterpolation?: Maybe<Array<Maybe<InterpolationPoint>>>;
};

export type DestinyStatGroupDefinition = {
  __typename?: "DestinyStatGroupDefinition";
  /**
   * The maximum possible value that any stat in this group can be transformed into.
   * This is used by stats that *don't* have scaledStats entries below, but that still need to be displayed as a progress bar, in which case this is used as the upper bound for said progress bar. (the lower bound is always 0)
   */
  maximumValue?: Maybe<Scalars["Int"]>;
  /** This apparently indicates the position of the stats in the UI? I've returned it in case anyone can use it, but it's not of any use to us on BNet. Something's being lost in translation with this value. */
  uiPosition?: Maybe<Scalars["Int"]>;
  /**
   * Any stat that requires scaling to be transformed from an "Investment" stat to a "Display" stat will have an entry in this list. For more information on what those types of stats mean and the transformation process, see DestinyStatDefinition.
   * In retrospect, I wouldn't mind if this was a dictionary keyed by the stat hash instead. But I'm going to leave it be because [[After Apple Picking]].
   */
  scaledStats?: Maybe<Array<Maybe<DestinyStatDisplayDefinition>>>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyTalentGridDefinition = {
  __typename?: "DestinyTalentGridDefinition";
  /** The maximum possible level of the Talent Grid: at this level, any nodes are allowed to be activated. */
  maxGridLevel?: Maybe<Scalars["Int"]>;
  /** The meaning of this has been lost in the sands of time: it still exists as a property, but appears to be unused in the modern UI of talent grids. It used to imply that each visual "column" of talent nodes required identical progression levels in order to be activated. Returning this value in case it is still useful to someone? Perhaps it's just a bit of interesting history. */
  gridLevelPerColumn?: Maybe<Scalars["Int"]>;
  /** The hash identifier of the Progression (DestinyProgressionDefinition) that drives whether and when Talent Nodes can be activated on the Grid. Items will have instances of this Progression, and will gain experience that will eventually cause the grid to increase in level. As the grid's level increases, it will cross the threshold where nodes can be activated. See DestinyTalentGridStepDefinition's activation requirements for more information. */
  progressionHash?: Maybe<Scalars["Float"]>;
  progression?: Maybe<DestinyProgressionDefinition>;
  /** The list of Talent Nodes on the Grid (recall that Nodes themselves are really just locations in the UI to show whatever their current Step is. You will only know the current step for a node by retrieving instanced data through platform calls to the API that return DestinyItemTalentGridComponent). */
  nodes?: Maybe<Array<Maybe<DestinyTalentNodeDefinition>>>;
  /**
   * Talent Nodes can exist in "exclusive sets": these are sets of nodes in which only a single node in the set can be activated at any given time. Activating a node in this set will automatically deactivate the other nodes in the set (referred to as a "Swap").
   * If a node in the exclusive set has already been activated, the game will not charge you materials to activate another node in the set, even if you have never activated it before, because you already paid the cost to activate one node in the set.
   * Not to be confused with Exclusive Groups. (how the heck do we NOT get confused by that? Jeez) See the groups property for information about that only-tangentially-related concept.
   */
  exclusiveSets?: Maybe<Array<Maybe<DestinyTalentNodeExclusiveSetDefinition>>>;
  /** This is a quick reference to the indexes of nodes that are not part of exclusive sets. Handy for knowing which talent nodes can only be activated directly, rather than via swapping. */
  independentNodeIndexes?: Maybe<Array<Maybe<Scalars["Int"]>>>;
  /**
   * BNet wants to show talent nodes grouped by similar purpose with localized titles. This is the ordered list of those categories: if you want to show nodes by category, you can iterate over this list, render the displayProperties for the category as the title, and then iterate over the talent nodes referenced by the category to show the related nodes.
   * Note that this is different from Exclusive Groups or Sets, because these categories also incorporate "Independent" nodes that belong to neither sets nor groups. These are purely for visual grouping of nodes rather than functional grouping.
   */
  nodeCategories?: Maybe<Array<Maybe<DestinyTalentNodeCategory>>>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyTalentNodeCategory = {
  __typename?: "DestinyTalentNodeCategory";
  /** Mostly just for debug purposes, but if you find it useful you can have it. This is BNet's manually created identifier for this category. */
  identifier?: Maybe<Scalars["String"]>;
  /** If true, we found the localized content in a related DestinyLoreDefinition instead of local BNet localization files. This is mostly for ease of my own future investigations. */
  isLoreDriven?: Maybe<Scalars["Boolean"]>;
  /** Will contain at least the "name", which will be the title of the category. We will likely not have description and an icon yet, but I'm going to keep my options open. */
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /** The set of all hash identifiers for Talent Nodes (DestinyTalentNodeDefinition) in this Talent Grid that are part of this Category. */
  nodeHashes?: Maybe<Array<Maybe<Scalars["Float"]>>>;
};

export type DestinyTalentNodeDefinition = {
  __typename?: "DestinyTalentNodeDefinition";
  /** The index into the DestinyTalentGridDefinition's "nodes" property where this node is located. Used to uniquely identify the node within the Talent Grid. Note that this is content version dependent: make sure you have the latest version of content before trying to use these properties. */
  nodeIndex?: Maybe<Scalars["Int"]>;
  /**
   * The hash identifier for the node, which unfortunately is also content version dependent but can be (and ideally, should be) used instead of the nodeIndex to uniquely identify the node.
   * The two exist side-by-side for backcompat reasons due to the Great Talent Node Restructuring of Destiny 1, and I ran out of time to remove one of them and standardize on the other. Sorry!
   */
  nodeHash?: Maybe<Scalars["Float"]>;
  /** The visual "row" where the node should be shown in the UI. If negative, then the node is hidden. */
  row?: Maybe<Scalars["Int"]>;
  /** The visual "column" where the node should be shown in the UI. If negative, the node is hidden. */
  column?: Maybe<Scalars["Int"]>;
  /**
   * Indexes into the DestinyTalentGridDefinition.nodes property for any nodes that must be activated before this one is allowed to be activated.
   * I would have liked to change this to hashes for Destiny 2, but we have run out of time.
   */
  prerequisiteNodeIndexes?: Maybe<Array<Maybe<Scalars["Int"]>>>;
  /**
   * At one point, Talent Nodes supported the idea of "Binary Pairs": nodes that overlapped each other visually, and where activating one deactivated the other. They ended up not being used, mostly because Exclusive Sets are *almost* a superset of this concept, but the potential for it to be used still exists in theory.
   * If this is ever used, this will be the index into the DestinyTalentGridDefinition.nodes property for the node that is the binary pair match to this node. Activating one deactivates the other.
   */
  binaryPairNodeIndex?: Maybe<Scalars["Int"]>;
  /** If true, this node will automatically unlock when the Talent Grid's level reaches the required level of the current step of this node. */
  autoUnlocks?: Maybe<Scalars["Boolean"]>;
  /**
   * At one point, Nodes were going to be able to be activated multiple times, changing the current step and potentially piling on multiple effects from the previously activated steps. This property would indicate if the last step could be activated multiple times.
   * This is not currently used, but it isn't out of the question that this could end up being used again in a theoretical future.
   */
  lastStepRepeats?: Maybe<Scalars["Boolean"]>;
  /** If this is true, the node's step is determined randomly rather than the first step being chosen. */
  isRandom?: Maybe<Scalars["Boolean"]>;
  /**
   * At one point, you were going to be able to repurchase talent nodes that had random steps, to "re-roll" the current step of the node (and thus change the properties of your item). This was to be the activation requirement for performing that re-roll.
   * The system still exists to do this, as far as I know, so it may yet come back around!
   */
  randomActivationRequirement?: Maybe<DestinyNodeActivationRequirement>;
  /** If this is true, the node can be "re-rolled" to acquire a different random current step. This is not used, but still exists for a theoretical future of talent grids. */
  isRandomRepurchasable?: Maybe<Scalars["Boolean"]>;
  /**
   * At this point, "steps" have been obfuscated into conceptual entities, aggregating the underlying notions of "properties" and "true steps".
   * If you need to know a step as it truly exists - such as when recreating Node logic when processing Vendor data - you'll have to use the "realSteps" property below.
   */
  steps?: Maybe<Array<Maybe<DestinyNodeStepDefinition>>>;
  /**
   * The nodeHash values for nodes that are in an Exclusive Set with this node.
   * See DestinyTalentGridDefinition.exclusiveSets for more info about exclusive sets.
   * Again, note that these are nodeHashes and *not* nodeIndexes.
   */
  exclusiveWithNodeHashes?: Maybe<Array<Maybe<Scalars["Float"]>>>;
  /** If the node's step is randomly selected, this is the amount of the Talent Grid's progression experience at which the progression bar for the node should be shown. */
  randomStartProgressionBarAtProgression?: Maybe<Scalars["Int"]>;
  /** A string identifier for a custom visual layout to apply to this talent node. Unfortunately, we do not have any data for rendering these custom layouts. It will be up to you to interpret these strings and change your UI if you want to have custom UI matching these layouts. */
  layoutIdentifier?: Maybe<Scalars["String"]>;
  /**
   * As of Destiny 2, nodes can exist as part of "Exclusive Groups". These differ from exclusive sets in that, within the group, many nodes can be activated. But the act of activating any node in the group will cause "opposing" nodes (nodes in groups that are not allowed to be activated at the same time as this group) to deactivate.
   * See DestinyTalentExclusiveGroup for more information on the details. This is an identifier for this node's group, if it is part of one.
   */
  groupHash?: Maybe<Scalars["Float"]>;
  /** Talent nodes can be associated with a piece of Lore, generally rendered in a tooltip. This is the hash identifier of the lore element to show, if there is one to be show. */
  loreHash?: Maybe<Scalars["Float"]>;
  lore?: Maybe<DestinyLoreDefinition>;
  /** Comes from the talent grid node style: this identifier should be used to determine how to render the node in the UI. */
  nodeStyleIdentifier?: Maybe<Scalars["String"]>;
  /** Comes from the talent grid node style: if true, then this node should be ignored for determining whether the grid is complete. */
  ignoreForCompletion?: Maybe<Scalars["Boolean"]>;
};

export type DestinyTalentNodeExclusiveSetDefinition = {
  __typename?: "DestinyTalentNodeExclusiveSetDefinition";
  /** The list of node indexes for the exclusive set. Historically, these were indexes. I would have liked to replace this with nodeHashes for consistency, but it's way too late for that. (9:09 PM, he's right!) */
  nodeIndexes?: Maybe<Array<Maybe<Scalars["Int"]>>>;
};

export type DestinyTalentNodeStepGroups = {
  __typename?: "DestinyTalentNodeStepGroups";
  weaponPerformance?: Maybe<Scalars["Int"]>;
  impactEffects?: Maybe<Scalars["Int"]>;
  guardianAttributes?: Maybe<Scalars["Int"]>;
  lightAbilities?: Maybe<Scalars["Int"]>;
  damageTypes?: Maybe<Scalars["Int"]>;
};

export type DestinyTraitCategoryDefinition = {
  __typename?: "DestinyTraitCategoryDefinition";
  traitCategoryId?: Maybe<Scalars["String"]>;
  traitHashes?: Maybe<Array<Maybe<Scalars["Float"]>>>;
  trait?: Maybe<DestinyTraitCategoryDefinition>;
  traitIds?: Maybe<Array<Maybe<Scalars["String"]>>>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyTraitDefinition = {
  __typename?: "DestinyTraitDefinition";
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  traitCategoryId?: Maybe<Scalars["String"]>;
  traitCategoryHash?: Maybe<Scalars["Float"]>;
  traitCategory?: Maybe<DestinyTraitCategoryDefinition>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyUnlockDefinition = {
  __typename?: "DestinyUnlockDefinition";
  /** Sometimes, but not frequently, these unlock flags also have human readable information: usually when they are being directly tested for some requirement, in which case the string is a localized description of why the requirement check failed. */
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyUnlockExpressionDefinition = {
  __typename?: "DestinyUnlockExpressionDefinition";
  /** A shortcut for determining the most restrictive gating that this expression performs. See the DestinyGatingScope enum's documentation for more details. */
  scope?: Maybe<Scalars["Int"]>;
};

export type DestinyUnlockValueDefinition = {
  __typename?: "DestinyUnlockValueDefinition";
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyVendorAcceptedItemDefinition = {
  __typename?: "DestinyVendorAcceptedItemDefinition";
  /** The "source" bucket for a transfer. When a user wants to transfer an item, the appropriate DestinyVendorDefinition's acceptedItems property is evaluated, looking for an entry where acceptedInventoryBucketHash matches the bucket that the item being transferred is currently located. If it exists, the item will be transferred into whatever bucket is defined by destinationInventoryBucketHash. */
  acceptedInventoryBucketHash?: Maybe<Scalars["Float"]>;
  acceptedInventoryBucket?: Maybe<DestinyInventoryBucketDefinition>;
  /** This is the bucket where the item being transferred will be put, given that it was being transferred *from* the bucket defined in acceptedInventoryBucketHash. */
  destinationInventoryBucketHash?: Maybe<Scalars["Float"]>;
  destinationInventoryBucket?: Maybe<DestinyInventoryBucketDefinition>;
};

export type DestinyVendorActionDefinition = {
  __typename?: "DestinyVendorActionDefinition";
  description?: Maybe<Scalars["String"]>;
  executeSeconds?: Maybe<Scalars["Int"]>;
  icon?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  verb?: Maybe<Scalars["String"]>;
  isPositive?: Maybe<Scalars["Boolean"]>;
  actionId?: Maybe<Scalars["String"]>;
  actionHash?: Maybe<Scalars["Float"]>;
  autoPerformAction?: Maybe<Scalars["Boolean"]>;
};

export type DestinyVendorCategoryEntryDefinition = {
  __typename?: "DestinyVendorCategoryEntryDefinition";
  /** The index of the category in the original category definitions for the vendor. */
  categoryIndex?: Maybe<Scalars["Int"]>;
  /** Used in sorting items in vendors... but there's a lot more to it. Just go with the order provided in the itemIndexes property on the DestinyVendorCategoryComponent instead, it should be more reliable than trying to recalculate it yourself. */
  sortValue?: Maybe<Scalars["Int"]>;
  /** The hashed identifier for the category. */
  categoryHash?: Maybe<Scalars["Float"]>;
  /** The amount of items that will be available when this category is shown. */
  quantityAvailable?: Maybe<Scalars["Int"]>;
  /** If items aren't up for sale in this category, should we still show them (greyed out)? */
  showUnavailableItems?: Maybe<Scalars["Boolean"]>;
  /** If you don't have the currency required to buy items from this category, should the items be hidden? */
  hideIfNoCurrency?: Maybe<Scalars["Boolean"]>;
  /** True if this category doesn't allow purchases. */
  hideFromRegularPurchase?: Maybe<Scalars["Boolean"]>;
  /** The localized string for making purchases from this category, if it is different from the vendor's string for purchasing. */
  buyStringOverride?: Maybe<Scalars["String"]>;
  /** If the category is disabled, this is the localized description to show. */
  disabledDescription?: Maybe<Scalars["String"]>;
  /** The localized title of the category. */
  displayTitle?: Maybe<Scalars["String"]>;
  /** If this category has an overlay prompt that should appear, this contains the details of that prompt. */
  overlay?: Maybe<DestinyVendorCategoryOverlayDefinition>;
  /** A shortcut for the vendor item indexes sold under this category. Saves us from some expensive reorganization at runtime. */
  vendorItemIndexes?: Maybe<Array<Maybe<Scalars["Int"]>>>;
  /** Sometimes a category isn't actually used to sell items, but rather to preview them. This implies different UI (and manual placement of the category in the UI) in the game, and special treatment. */
  isPreview?: Maybe<Scalars["Boolean"]>;
  /** If true, this category only displays items: you can't purchase anything in them. */
  isDisplayOnly?: Maybe<Scalars["Boolean"]>;
  resetIntervalMinutesOverride?: Maybe<Scalars["Int"]>;
  resetOffsetMinutesOverride?: Maybe<Scalars["Int"]>;
};

export type DestinyVendorCategoryOverlayDefinition = {
  __typename?: "DestinyVendorCategoryOverlayDefinition";
  choiceDescription?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  icon?: Maybe<Scalars["String"]>;
  title?: Maybe<Scalars["String"]>;
  /** If this overlay has a currency item that it features, this is said featured item. */
  currencyItemHash?: Maybe<Scalars["Float"]>;
};

export type DestinyVendorDefinition = {
  __typename?: "DestinyVendorDefinition";
  displayProperties?: Maybe<DestinyVendorDisplayPropertiesDefinition>;
  /** The type of reward progression that this vendor has. Default - The original rank progression from token redemption. Ritual - Progression from ranks in ritual content. For example: Crucible (Shaxx), Gambit (Drifter), and Battlegrounds (War Table). */
  vendorProgressionType?: Maybe<Scalars["Int"]>;
  /** If the vendor has a custom localized string describing the "buy" action, that is returned here. */
  buyString?: Maybe<Scalars["String"]>;
  /** Ditto for selling. Not that you can sell items to a vendor anymore. Will it come back? Who knows. The string's still there. */
  sellString?: Maybe<Scalars["String"]>;
  /**
   * If the vendor has an item that should be displayed as the "featured" item, this is the hash identifier for that DestinyVendorItemDefinition.
   * Apparently this is usually a related currency, like a reputation token. But it need not be restricted to that.
   */
  displayItemHash?: Maybe<Scalars["Float"]>;
  displayItem?: Maybe<DestinyInventoryItemDefinition>;
  /** If this is true, you aren't allowed to buy whatever the vendor is selling. */
  inhibitBuying?: Maybe<Scalars["Boolean"]>;
  /** If this is true, you're not allowed to sell whatever the vendor is buying. */
  inhibitSelling?: Maybe<Scalars["Boolean"]>;
  /**
   * If the Vendor has a faction, this hash will be valid and point to a DestinyFactionDefinition.
   * The game UI and BNet often mine the faction definition for additional elements and details to place on the screen, such as the faction's Progression status (aka "Reputation").
   */
  factionHash?: Maybe<Scalars["Float"]>;
  faction?: Maybe<DestinyFactionDefinition>;
  /**
   * A number used for calculating the frequency of a vendor's inventory resetting/refreshing.
   * Don't worry about calculating this - we do it on the server side and send you the next refresh date with the live data.
   */
  resetIntervalMinutes?: Maybe<Scalars["Int"]>;
  /** Again, used for reset/refreshing of inventory. Don't worry too much about it. Unless you want to. */
  resetOffsetMinutes?: Maybe<Scalars["Int"]>;
  /**
   * If an item can't be purchased from the vendor, there may be many "custom"/game state specific reasons why not.
   * This is a list of localized strings with messages for those custom failures. The live BNet data will return a failureIndexes property for items that can't be purchased: using those values to index into this array, you can show the user the appropriate failure message for the item that can't be bought.
   */
  failureStrings?: Maybe<Array<Maybe<Scalars["String"]>>>;
  /** If we were able to predict the dates when this Vendor will be visible/available, this will be the list of those date ranges. Sadly, we're not able to predict this very frequently, so this will often be useless data. */
  unlockRanges?: Maybe<Array<Maybe<DateRange>>>;
  /** The internal identifier for the Vendor. A holdover from the old days of Vendors, but we don't have time to refactor it away. */
  vendorIdentifier?: Maybe<Scalars["String"]>;
  /** A portrait of the Vendor's smiling mug. Or frothing tentacles. */
  vendorPortrait?: Maybe<Scalars["String"]>;
  /** If the vendor has a custom banner image, that can be found here. */
  vendorBanner?: Maybe<Scalars["String"]>;
  /** If a vendor is not enabled, we won't even save the vendor's definition, and we won't return any items or info about them. It's as if they don't exist. */
  enabled?: Maybe<Scalars["Boolean"]>;
  /** If a vendor is not visible, we still have and will give vendor definition info, but we won't use them for things like Advisors or UI. */
  visible?: Maybe<Scalars["Boolean"]>;
  /** The identifier of the VendorCategoryDefinition for this vendor's subcategory. */
  vendorSubcategoryIdentifier?: Maybe<Scalars["String"]>;
  /** If TRUE, consolidate categories that only differ by trivial properties (such as having minor differences in name) */
  consolidateCategories?: Maybe<Scalars["Boolean"]>;
  /** Describes "actions" that can be performed on a vendor. Currently, none of these exist. But theoretically a Vendor could let you interact with it by performing actions. We'll see what these end up looking like if they ever get used. */
  actions?: Maybe<Array<Maybe<DestinyVendorActionDefinition>>>;
  /**
   * These are the headers for sections of items that the vendor is selling. When you see items organized by category in the header, it is these categories that it is showing.
   * Well, technically not *exactly* these. On BNet, it doesn't make sense to have categories be "paged" as we do in Destiny, so we run some heuristics to attempt to aggregate pages of categories together.
   * These are the categories post-concatenation, if the vendor had concatenation applied. If you want the pre-aggregated category data, use originalCategories.
   */
  categories?: Maybe<Array<Maybe<DestinyVendorCategoryEntryDefinition>>>;
  /** See the categories property for a description of categories and why originalCategories exists. */
  originalCategories?: Maybe<
    Array<Maybe<DestinyVendorCategoryEntryDefinition>>
  >;
  /**
   * Display Categories are different from "categories" in that these are specifically for visual grouping and display of categories in Vendor UI.
   * The "categories" structure is for validation of the contained items, and can be categorized entirely separately from "Display Categories", there need be and often will be no meaningful relationship between the two.
   */
  displayCategories?: Maybe<Array<Maybe<DestinyDisplayCategoryDefinition>>>;
  /** In addition to selling items, vendors can have "interactions": UI where you "talk" with the vendor and they offer you a reward, some item, or merely acknowledge via dialog that you did something cool. */
  interactions?: Maybe<Array<Maybe<DestinyVendorInteractionDefinition>>>;
  /** If the vendor shows you items from your own inventory - such as the Vault vendor does - this data describes the UI around showing those inventory buckets and which ones get shown. */
  inventoryFlyouts?: Maybe<
    Array<Maybe<DestinyVendorInventoryFlyoutDefinition>>
  >;
  /**
   * If the vendor sells items (or merely has a list of items to show like the "Sack" vendors do), this is the list of those items that the vendor can sell. From this list, only a subset will be available from the vendor at any given time, selected randomly and reset on the vendor's refresh interval.
   * Note that a vendor can sell the same item multiple ways: for instance, nothing stops a vendor from selling you some specific weapon but using two different currencies, or the same weapon at multiple "item levels".
   */
  itemList?: Maybe<Array<Maybe<DestinyVendorItemDefinition>>>;
  /** BNet doesn't use this data yet, but it appears to be an optional list of flavor text about services that the Vendor can provide. */
  services?: Maybe<Array<Maybe<DestinyVendorServiceDefinition>>>;
  /** If the Vendor is actually a vehicle for the transferring of items (like the Vault and Postmaster vendors), this defines the list of source->destination buckets for transferring. */
  acceptedItems?: Maybe<Array<Maybe<DestinyVendorAcceptedItemDefinition>>>;
  /** As many of you know, Vendor data has historically been pretty brutal on the BNet servers. In an effort to reduce this workload, only Vendors with this flag set will be returned on Vendor requests. This allows us to filter out Vendors that don't dynamic data that's particularly useful: things like "Preview/Sack" vendors, for example, that you can usually suss out the details for using just the definitions themselves. */
  returnWithVendorRequest?: Maybe<Scalars["Boolean"]>;
  /** A vendor can be at different places in the world depending on the game/character/account state. This is the list of possible locations for the vendor, along with conditions we use to determine which one is currently active. */
  locations?: Maybe<Array<Maybe<DestinyVendorLocationDefinition>>>;
  /** A vendor can be a part of 0 or 1 "groups" at a time: a group being a collection of Vendors related by either location or function/purpose. It's used for our our Companion Vendor UI. Only one of these can be active for a Vendor at a time. */
  groups?: Maybe<Array<Maybe<DestinyVendorGroupReference>>>;
  /** Some items don't make sense to return in the API, for example because they represent an action to be performed rather than an item being sold. I'd rather we not do this, but at least in the short term this is a workable workaround. */
  ignoreSaleItemHashes?: Maybe<Array<Maybe<Scalars["Float"]>>>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyVendorDisplayPropertiesDefinition = {
  __typename?: "DestinyVendorDisplayPropertiesDefinition";
  /** I regret calling this a "large icon". It's more like a medium-sized image with a picture of the vendor's mug on it, trying their best to look cool. Not what one would call an icon. */
  largeIcon?: Maybe<Scalars["String"]>;
  subtitle?: Maybe<Scalars["String"]>;
  /** If we replaced the icon with something more glitzy, this is the original icon that the vendor had according to the game's content. It may be more lame and/or have less razzle-dazzle. But who am I to tell you which icon to use. */
  originalIcon?: Maybe<Scalars["String"]>;
  /** Vendors, in addition to expected display property data, may also show some "common requirements" as statically defined definition data. This might be when a vendor accepts a single type of currency, or when the currency is unique to the vendor and the designers wanted to show that currency when you interact with the vendor. */
  requirementsDisplay?: Maybe<
    Array<Maybe<DestinyVendorRequirementDisplayEntryDefinition>>
  >;
  /** This is the icon used in parts of the game UI such as the vendor's waypoint. */
  smallTransparentIcon?: Maybe<Scalars["String"]>;
  /** This is the icon used in the map overview, when the vendor is located on the map. */
  mapIcon?: Maybe<Scalars["String"]>;
  /** This is apparently the "Watermark". I am not certain offhand where this is actually used in the Game UI, but some people may find it useful. */
  largeTransparentIcon?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  /**
   * Note that "icon" is sometimes misleading, and should be interpreted in the context of the entity. For instance, in Destiny 1 the DestinyRecordBookDefinition's icon was a big picture of a book.
   * But usually, it will be a small square image that you can use as... well, an icon.
   * They are currently represented as 96px x 96px images.
   */
  icon?: Maybe<Scalars["String"]>;
  iconSequences?: Maybe<Array<Maybe<DestinyIconSequenceDefinition>>>;
  /** If this item has a high-res icon (at least for now, many things won't), then the path to that icon will be here. */
  highResIcon?: Maybe<Scalars["String"]>;
  hasIcon?: Maybe<Scalars["Boolean"]>;
};

export type DestinyVendorGroupDefinition = {
  __typename?: "DestinyVendorGroupDefinition";
  /** The recommended order in which to render the groups, Ascending order. */
  order?: Maybe<Scalars["Int"]>;
  /** For now, a group just has a name. */
  categoryName?: Maybe<Scalars["String"]>;
  /**
   * The unique identifier for this entity. Guaranteed to be unique for the type of entity, but not globally.
   * When entities refer to each other in Destiny content, it is this hash that they are referring to.
   */
  hash?: Maybe<Scalars["Float"]>;
  /** The index of the entity as it was found in the investment tables. */
  index?: Maybe<Scalars["Int"]>;
  /** If this is true, then there is an entity with this identifier/type combination, but BNet is not yet allowed to show it. Sorry! */
  redacted?: Maybe<Scalars["Boolean"]>;
};

export type DestinyVendorGroupReference = {
  __typename?: "DestinyVendorGroupReference";
  /** The DestinyVendorGroupDefinition to which this Vendor can belong. */
  vendorGroupHash?: Maybe<Scalars["Float"]>;
  vendorGroup?: Maybe<DestinyVendorGroupDefinition>;
};

export type DestinyVendorInteractionDefinition = {
  __typename?: "DestinyVendorInteractionDefinition";
  /** The position of this interaction in its parent array. Note that this is NOT content agnostic, and should not be used as such. */
  interactionIndex?: Maybe<Scalars["Int"]>;
  /** The potential replies that the user can make to the interaction. */
  replies?: Maybe<Array<Maybe<DestinyVendorInteractionReplyDefinition>>>;
  /** If >= 0, this is the category of sale items to show along with this interaction dialog. */
  vendorCategoryIndex?: Maybe<Scalars["Int"]>;
  /** If this interaction dialog is about a quest, this is the questline related to the interaction. You can use this to show the quest overview, or even the character's status with the quest if you use it to find the character's current Quest Step by checking their inventory against this questlineItemHash's DestinyInventoryItemDefinition.setData. */
  questlineItemHash?: Maybe<Scalars["Float"]>;
  questlineItem?: Maybe<DestinyInventoryItemDefinition>;
  /** If this interaction is meant to show you sacks, this is the list of types of sacks to be shown. If empty, the interaction is not meant to show sacks. */
  sackInteractionList?: Maybe<
    Array<Maybe<DestinyVendorInteractionSackEntryDefinition>>
  >;
  /** A UI hint for the behavior of the interaction screen. This is useful to determine what type of interaction is occurring, such as a prompt to receive a rank up reward or a prompt to choose a reward for completing a quest. The hash isn't as useful as the Enum in retrospect, well what can you do. Try using interactionType instead. */
  uiInteractionType?: Maybe<Scalars["Float"]>;
  /** The enumerated version of the possible UI hints for vendor interactions, which is a little easier to grok than the hash found in uiInteractionType. */
  interactionType?: Maybe<Scalars["Int"]>;
  /** If this interaction is displaying rewards, this is the text to use for the header of the reward-displaying section of the interaction. */
  rewardBlockLabel?: Maybe<Scalars["String"]>;
  /** If the vendor's reward list is sourced from one of his categories, this is the index into the category array of items to show. */
  rewardVendorCategoryIndex?: Maybe<Scalars["Int"]>;
  /** If the vendor interaction has flavor text, this is some of it. */
  flavorLineOne?: Maybe<Scalars["String"]>;
  /** If the vendor interaction has flavor text, this is the rest of it. */
  flavorLineTwo?: Maybe<Scalars["String"]>;
  /** The header for the interaction dialog. */
  headerDisplayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /** The localized text telling the player what to do when they see this dialog. */
  instructions?: Maybe<Scalars["String"]>;
};

export type DestinyVendorInteractionReplyDefinition = {
  __typename?: "DestinyVendorInteractionReplyDefinition";
  /** The rewards granted upon responding to the vendor. */
  itemRewardsSelection?: Maybe<Scalars["Int"]>;
  /** The localized text for the reply. */
  reply?: Maybe<Scalars["String"]>;
  /** An enum indicating the type of reply being made. */
  replyType?: Maybe<Scalars["Int"]>;
};

export type DestinyVendorInteractionSackEntryDefinition = {
  __typename?: "DestinyVendorInteractionSackEntryDefinition";
  sackType?: Maybe<Scalars["Float"]>;
};

export type DestinyVendorInventoryFlyoutBucketDefinition = {
  __typename?: "DestinyVendorInventoryFlyoutBucketDefinition";
  /** If true, the inventory bucket should be able to be collapsed visually. */
  collapsible?: Maybe<Scalars["Boolean"]>;
  /** The inventory bucket whose contents should be shown. */
  inventoryBucketHash?: Maybe<Scalars["Float"]>;
  inventoryBucket?: Maybe<DestinyInventoryBucketDefinition>;
  /** The methodology to use for sorting items from the flyout. */
  sortItemsBy?: Maybe<Scalars["Int"]>;
};

export type DestinyVendorInventoryFlyoutDefinition = {
  __typename?: "DestinyVendorInventoryFlyoutDefinition";
  /** If the flyout is locked, this is the reason why. */
  lockedDescription?: Maybe<Scalars["String"]>;
  /** The title and other common properties of the flyout. */
  displayProperties?: Maybe<DestinyDisplayPropertiesDefinition>;
  /** A list of inventory buckets and other metadata to show on the screen. */
  buckets?: Maybe<Array<Maybe<DestinyVendorInventoryFlyoutBucketDefinition>>>;
  /** An identifier for the flyout, in case anything else needs to refer to them. */
  flyoutId?: Maybe<Scalars["Float"]>;
  /** If this is true, don't show any of the glistening "this is a new item" UI elements, like we show on the inventory items themselves in in-game UI. */
  suppressNewness?: Maybe<Scalars["Boolean"]>;
  /** If this flyout is meant to show you the contents of the player's equipment slot, this is the slot to show. */
  equipmentSlotHash?: Maybe<Scalars["Float"]>;
};

export type DestinyVendorItemDefinition = {
  __typename?: "DestinyVendorItemDefinition";
  /** The index into the DestinyVendorDefinition.saleList. This is what we use to refer to items being sold throughout live and definition data. */
  vendorItemIndex?: Maybe<Scalars["Int"]>;
  /**
   * The hash identifier of the item being sold (DestinyInventoryItemDefinition).
   * Note that a vendor can sell the same item in multiple ways, so don't assume that itemHash is a unique identifier for this entity.
   */
  itemHash?: Maybe<Scalars["Float"]>;
  item?: Maybe<DestinyInventoryItemDefinition>;
  /** The amount you will recieve of the item described in itemHash if you make the purchase. */
  quantity?: Maybe<Scalars["Int"]>;
  /** An list of indexes into the DestinyVendorDefinition.failureStrings array, indicating the possible failure strings that can be relevant for this item. */
  failureIndexes?: Maybe<Array<Maybe<Scalars["Int"]>>>;
  /**
   * This is a pre-compiled aggregation of item value and priceOverrideList, so that we have one place to check for what the purchaser must pay for the item. Use this instead of trying to piece together the price separately.
   * The somewhat crappy part about this is that, now that item quantity overrides have dynamic modifiers, this will not necessarily be statically true. If you were using this instead of live data, switch to using live data.
   */
  currencies?: Maybe<Array<Maybe<DestinyVendorItemQuantity>>>;
  /** If this item can be refunded, this is the policy for what will be refundd, how, and in what time period. */
  refundPolicy?: Maybe<Scalars["Int"]>;
  /** The amount of time before refundability of the newly purchased item will expire. */
  refundTimeLimit?: Maybe<Scalars["Int"]>;
  /** The Default level at which the item will spawn. Almost always driven by an adjusto these days. Ideally should be singular. It's a long story how this ended up as a list, but there is always either going to be 0:1 of these entities. */
  creationLevels?: Maybe<Array<Maybe<DestinyItemCreationEntryLevelDefinition>>>;
  /** This is an index specifically into the display category, as opposed to the server-side Categories (which do not need to match or pair with each other in any way: server side categories are really just structures for common validation. Display Category will let us more easily categorize items visually) */
  displayCategoryIndex?: Maybe<Scalars["Int"]>;
  /** The index into the DestinyVendorDefinition.categories array, so you can find the category associated with this item. */
  categoryIndex?: Maybe<Scalars["Int"]>;
  /** Same as above, but for the original category indexes. */
  originalCategoryIndex?: Maybe<Scalars["Int"]>;
  /** The minimum character level at which this item is available for sale. */
  minimumLevel?: Maybe<Scalars["Int"]>;
  /** The maximum character level at which this item is available for sale. */
  maximumLevel?: Maybe<Scalars["Int"]>;
  /** The action to be performed when purchasing the item, if it's not just "buy". */
  action?: Maybe<DestinyVendorSaleItemActionBlockDefinition>;
  /** The string identifier for the category selling this item. */
  displayCategory?: Maybe<Scalars["String"]>;
  /** The inventory bucket into which this item will be placed upon purchase. */
  inventoryBucketHash?: Maybe<Scalars["Float"]>;
  /**
   * The most restrictive scope that determines whether the item is available in the Vendor's inventory. See DestinyGatingScope's documentation for more information.
   * This can be determined by Unlock gating, or by whether or not the item has purchase level requirements (minimumLevel and maximumLevel properties).
   */
  visibilityScope?: Maybe<Scalars["Int"]>;
  /**
   * Similar to visibilityScope, it represents the most restrictive scope that determines whether the item can be purchased. It will at least be as restrictive as visibilityScope, but could be more restrictive if the item has additional purchase requirements beyond whether it is merely visible or not.
   * See DestinyGatingScope's documentation for more information.
   */
  purchasableScope?: Maybe<Scalars["Int"]>;
  /** If this item can only be purchased by a given platform, this indicates the platform to which it is restricted. */
  exclusivity?: Maybe<Scalars["Int"]>;
  /** If this sale can only be performed as the result of an offer check, this is true. */
  isOffer?: Maybe<Scalars["Boolean"]>;
  /** If this sale can only be performed as the result of receiving a CRM offer, this is true. */
  isCrm?: Maybe<Scalars["Boolean"]>;
  /** *if* the category this item is in supports non-default sorting, this value should represent the sorting value to use, pre-processed and ready to go. */
  sortValue?: Maybe<Scalars["Int"]>;
  /** If this item can expire, this is the tooltip message to show with its expiration info. */
  expirationTooltip?: Maybe<Scalars["String"]>;
  /** If this is populated, the purchase of this item should redirect to purchasing these other items instead. */
  redirectToSaleIndexes?: Maybe<Array<Maybe<Scalars["Int"]>>>;
  socketOverrides?: Maybe<Array<Maybe<DestinyVendorItemSocketOverride>>>;
  /**
   * If true, this item is some sort of dummy sale item that cannot actually be purchased. It may be a display only item, or some fluff left by a content designer for testing purposes, or something that got disabled because it was a terrible idea. You get the picture. We won't know *why* it can't be purchased, only that it can't be. Sorry.
   * This is also only whether it's unpurchasable as a static property according to game content. There are other reasons why an item may or may not be purchasable at runtime, so even if this isn't set to True you should trust the runtime value for this sale item over the static definition if this is unset.
   */
  unpurchasable?: Maybe<Scalars["Boolean"]>;
};

export type DestinyVendorItemQuantity = {
  __typename?: "DestinyVendorItemQuantity";
  /** The hash identifier for the item in question. Use it to look up the item's DestinyInventoryItemDefinition. */
  itemHash?: Maybe<Scalars["Float"]>;
  item?: Maybe<DestinyInventoryItemDefinition>;
  /** If this quantity is referring to a specific instance of an item, this will have the item's instance ID. Normally, this will be null. */
  itemInstanceId?: Maybe<Scalars["Int"]>;
  /** The amount of the item needed/available depending on the context of where DestinyItemQuantity is being used. */
  quantity?: Maybe<Scalars["Int"]>;
  /** Indicates that this item quantity may be conditionally shown or hidden, based on various sources of state. For example: server flags, account state, or character progress. */
  hasConditionalVisibility?: Maybe<Scalars["Boolean"]>;
};

export type DestinyVendorItemSocketOverride = {
  __typename?: "DestinyVendorItemSocketOverride";
  /**
   * If this is populated, the socket will be overridden with a specific plug.
   * If this isn't populated, it's being overridden by something more complicated that is only known by the Game Server and God, which means we can't tell you in advance what it'll be.
   */
  singleItemHash?: Maybe<Scalars["Float"]>;
  singleItem?: Maybe<DestinyInventoryItemDefinition>;
  /** If this is greater than -1, the number of randomized plugs on this socket will be set to this quantity instead of whatever it's set to by default. */
  randomizedOptionsCount?: Maybe<Scalars["Int"]>;
  /** This appears to be used to select which socket ultimately gets the override defined here. */
  socketTypeHash?: Maybe<Scalars["Float"]>;
  socketType?: Maybe<DestinySocketTypeDefinition>;
};

export type DestinyVendorLocationDefinition = {
  __typename?: "DestinyVendorLocationDefinition";
  /** The hash identifier for a Destination at which this vendor may be located. Each destination where a Vendor may exist will only ever have a single entry. */
  destinationHash?: Maybe<Scalars["Float"]>;
  destination?: Maybe<DestinyDestinationDefinition>;
  /** The relative path to the background image representing this Vendor at this location, for use in a banner. */
  backgroundImagePath?: Maybe<Scalars["String"]>;
};

export type DestinyVendorRequirementDisplayEntryDefinition = {
  __typename?: "DestinyVendorRequirementDisplayEntryDefinition";
  icon?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  source?: Maybe<Scalars["String"]>;
  type?: Maybe<Scalars["String"]>;
};

export type DestinyVendorSaleItemActionBlockDefinition = {
  __typename?: "DestinyVendorSaleItemActionBlockDefinition";
  executeSeconds?: Maybe<Scalars["Float"]>;
  isPositive?: Maybe<Scalars["Boolean"]>;
};

export type DestinyVendorServiceDefinition = {
  __typename?: "DestinyVendorServiceDefinition";
  /** The localized name of a service provided. */
  name?: Maybe<Scalars["String"]>;
};

export type DyeReference = {
  __typename?: "DyeReference";
  channelHash?: Maybe<Scalars["Float"]>;
  dyeHash?: Maybe<Scalars["Float"]>;
};

export type HyperlinkReference = {
  __typename?: "HyperlinkReference";
  title?: Maybe<Scalars["String"]>;
  url?: Maybe<Scalars["String"]>;
};

export type InterpolationPoint = {
  __typename?: "InterpolationPoint";
  value?: Maybe<Scalars["Int"]>;
  weight?: Maybe<Scalars["Int"]>;
};

export type InterpolationPointFloat = {
  __typename?: "InterpolationPointFloat";
  value?: Maybe<Scalars["Float"]>;
  weight?: Maybe<Scalars["Float"]>;
};

export type Query = {
  __typename?: "Query";
  DestinyProgressionDefinition?: Maybe<DestinyProgressionDefinition>;
  ManyDestinyProgressionDefinition?: Maybe<
    Array<Maybe<DestinyProgressionDefinition>>
  >;
  DestinyInventoryItemDefinition?: Maybe<DestinyInventoryItemDefinition>;
  ManyDestinyInventoryItemDefinition?: Maybe<
    Array<Maybe<DestinyInventoryItemDefinition>>
  >;
  DestinyInventoryBucketDefinition?: Maybe<DestinyInventoryBucketDefinition>;
  ManyDestinyInventoryBucketDefinition?: Maybe<
    Array<Maybe<DestinyInventoryBucketDefinition>>
  >;
  DestinyItemTierTypeDefinition?: Maybe<DestinyItemTierTypeDefinition>;
  ManyDestinyItemTierTypeDefinition?: Maybe<
    Array<Maybe<DestinyItemTierTypeDefinition>>
  >;
  DestinyStatDefinition?: Maybe<DestinyStatDefinition>;
  ManyDestinyStatDefinition?: Maybe<Array<Maybe<DestinyStatDefinition>>>;
  DestinyStatGroupDefinition?: Maybe<DestinyStatGroupDefinition>;
  ManyDestinyStatGroupDefinition?: Maybe<
    Array<Maybe<DestinyStatGroupDefinition>>
  >;
  DestinyEquipmentSlotDefinition?: Maybe<DestinyEquipmentSlotDefinition>;
  ManyDestinyEquipmentSlotDefinition?: Maybe<
    Array<Maybe<DestinyEquipmentSlotDefinition>>
  >;
  DestinyVendorDefinition?: Maybe<DestinyVendorDefinition>;
  ManyDestinyVendorDefinition?: Maybe<Array<Maybe<DestinyVendorDefinition>>>;
  DestinySocketTypeDefinition?: Maybe<DestinySocketTypeDefinition>;
  ManyDestinySocketTypeDefinition?: Maybe<
    Array<Maybe<DestinySocketTypeDefinition>>
  >;
  DestinySocketCategoryDefinition?: Maybe<DestinySocketCategoryDefinition>;
  ManyDestinySocketCategoryDefinition?: Maybe<
    Array<Maybe<DestinySocketCategoryDefinition>>
  >;
  DestinyDestinationDefinition?: Maybe<DestinyDestinationDefinition>;
  ManyDestinyDestinationDefinition?: Maybe<
    Array<Maybe<DestinyDestinationDefinition>>
  >;
  DestinyActivityGraphDefinition?: Maybe<DestinyActivityGraphDefinition>;
  ManyDestinyActivityGraphDefinition?: Maybe<
    Array<Maybe<DestinyActivityGraphDefinition>>
  >;
  DestinyActivityDefinition?: Maybe<DestinyActivityDefinition>;
  ManyDestinyActivityDefinition?: Maybe<
    Array<Maybe<DestinyActivityDefinition>>
  >;
  DestinyActivityModifierDefinition?: Maybe<DestinyActivityModifierDefinition>;
  ManyDestinyActivityModifierDefinition?: Maybe<
    Array<Maybe<DestinyActivityModifierDefinition>>
  >;
  DestinyObjectiveDefinition?: Maybe<DestinyObjectiveDefinition>;
  ManyDestinyObjectiveDefinition?: Maybe<
    Array<Maybe<DestinyObjectiveDefinition>>
  >;
  DestinySandboxPerkDefinition?: Maybe<DestinySandboxPerkDefinition>;
  ManyDestinySandboxPerkDefinition?: Maybe<
    Array<Maybe<DestinySandboxPerkDefinition>>
  >;
  DestinyLocationDefinition?: Maybe<DestinyLocationDefinition>;
  ManyDestinyLocationDefinition?: Maybe<
    Array<Maybe<DestinyLocationDefinition>>
  >;
  DestinyActivityModeDefinition?: Maybe<DestinyActivityModeDefinition>;
  ManyDestinyActivityModeDefinition?: Maybe<
    Array<Maybe<DestinyActivityModeDefinition>>
  >;
  DestinyPlaceDefinition?: Maybe<DestinyPlaceDefinition>;
  ManyDestinyPlaceDefinition?: Maybe<Array<Maybe<DestinyPlaceDefinition>>>;
  DestinyActivityTypeDefinition?: Maybe<DestinyActivityTypeDefinition>;
  ManyDestinyActivityTypeDefinition?: Maybe<
    Array<Maybe<DestinyActivityTypeDefinition>>
  >;
  DestinyVendorGroupDefinition?: Maybe<DestinyVendorGroupDefinition>;
  ManyDestinyVendorGroupDefinition?: Maybe<
    Array<Maybe<DestinyVendorGroupDefinition>>
  >;
  DestinyFactionDefinition?: Maybe<DestinyFactionDefinition>;
  ManyDestinyFactionDefinition?: Maybe<Array<Maybe<DestinyFactionDefinition>>>;
  DestinyArtifactDefinition?: Maybe<DestinyArtifactDefinition>;
  ManyDestinyArtifactDefinition?: Maybe<
    Array<Maybe<DestinyArtifactDefinition>>
  >;
  DestinyPowerCapDefinition?: Maybe<DestinyPowerCapDefinition>;
  ManyDestinyPowerCapDefinition?: Maybe<
    Array<Maybe<DestinyPowerCapDefinition>>
  >;
  DestinyProgressionLevelRequirementDefinition?: Maybe<DestinyProgressionLevelRequirementDefinition>;
  ManyDestinyProgressionLevelRequirementDefinition?: Maybe<
    Array<Maybe<DestinyProgressionLevelRequirementDefinition>>
  >;
  DestinyRewardSourceDefinition?: Maybe<DestinyRewardSourceDefinition>;
  ManyDestinyRewardSourceDefinition?: Maybe<
    Array<Maybe<DestinyRewardSourceDefinition>>
  >;
  DestinyTraitDefinition?: Maybe<DestinyTraitDefinition>;
  ManyDestinyTraitDefinition?: Maybe<Array<Maybe<DestinyTraitDefinition>>>;
  DestinyTraitCategoryDefinition?: Maybe<DestinyTraitCategoryDefinition>;
  ManyDestinyTraitCategoryDefinition?: Maybe<
    Array<Maybe<DestinyTraitCategoryDefinition>>
  >;
  DestinyPresentationNodeDefinition?: Maybe<DestinyPresentationNodeDefinition>;
  ManyDestinyPresentationNodeDefinition?: Maybe<
    Array<Maybe<DestinyPresentationNodeDefinition>>
  >;
  DestinyCollectibleDefinition?: Maybe<DestinyCollectibleDefinition>;
  ManyDestinyCollectibleDefinition?: Maybe<
    Array<Maybe<DestinyCollectibleDefinition>>
  >;
  DestinyMaterialRequirementSetDefinition?: Maybe<DestinyMaterialRequirementSetDefinition>;
  ManyDestinyMaterialRequirementSetDefinition?: Maybe<
    Array<Maybe<DestinyMaterialRequirementSetDefinition>>
  >;
  DestinyRecordDefinition?: Maybe<DestinyRecordDefinition>;
  ManyDestinyRecordDefinition?: Maybe<Array<Maybe<DestinyRecordDefinition>>>;
  DestinyGenderDefinition?: Maybe<DestinyGenderDefinition>;
  ManyDestinyGenderDefinition?: Maybe<Array<Maybe<DestinyGenderDefinition>>>;
  DestinyLoreDefinition?: Maybe<DestinyLoreDefinition>;
  ManyDestinyLoreDefinition?: Maybe<Array<Maybe<DestinyLoreDefinition>>>;
  DestinyMetricDefinition?: Maybe<DestinyMetricDefinition>;
  ManyDestinyMetricDefinition?: Maybe<Array<Maybe<DestinyMetricDefinition>>>;
  DestinyEnergyTypeDefinition?: Maybe<DestinyEnergyTypeDefinition>;
  ManyDestinyEnergyTypeDefinition?: Maybe<
    Array<Maybe<DestinyEnergyTypeDefinition>>
  >;
  DestinyPlugSetDefinition?: Maybe<DestinyPlugSetDefinition>;
  ManyDestinyPlugSetDefinition?: Maybe<Array<Maybe<DestinyPlugSetDefinition>>>;
  DestinyTalentGridDefinition?: Maybe<DestinyTalentGridDefinition>;
  ManyDestinyTalentGridDefinition?: Maybe<
    Array<Maybe<DestinyTalentGridDefinition>>
  >;
  DestinyDamageTypeDefinition?: Maybe<DestinyDamageTypeDefinition>;
  ManyDestinyDamageTypeDefinition?: Maybe<
    Array<Maybe<DestinyDamageTypeDefinition>>
  >;
  DestinyItemCategoryDefinition?: Maybe<DestinyItemCategoryDefinition>;
  ManyDestinyItemCategoryDefinition?: Maybe<
    Array<Maybe<DestinyItemCategoryDefinition>>
  >;
  DestinyBreakerTypeDefinition?: Maybe<DestinyBreakerTypeDefinition>;
  ManyDestinyBreakerTypeDefinition?: Maybe<
    Array<Maybe<DestinyBreakerTypeDefinition>>
  >;
  DestinySeasonDefinition?: Maybe<DestinySeasonDefinition>;
  ManyDestinySeasonDefinition?: Maybe<Array<Maybe<DestinySeasonDefinition>>>;
  DestinySeasonPassDefinition?: Maybe<DestinySeasonPassDefinition>;
  ManyDestinySeasonPassDefinition?: Maybe<
    Array<Maybe<DestinySeasonPassDefinition>>
  >;
  DestinyChecklistDefinition?: Maybe<DestinyChecklistDefinition>;
  ManyDestinyChecklistDefinition?: Maybe<
    Array<Maybe<DestinyChecklistDefinition>>
  >;
  DestinyRaceDefinition?: Maybe<DestinyRaceDefinition>;
  ManyDestinyRaceDefinition?: Maybe<Array<Maybe<DestinyRaceDefinition>>>;
  DestinyClassDefinition?: Maybe<DestinyClassDefinition>;
  ManyDestinyClassDefinition?: Maybe<Array<Maybe<DestinyClassDefinition>>>;
  DestinyMilestoneDefinition?: Maybe<DestinyMilestoneDefinition>;
  ManyDestinyMilestoneDefinition?: Maybe<
    Array<Maybe<DestinyMilestoneDefinition>>
  >;
  DestinyUnlockDefinition?: Maybe<DestinyUnlockDefinition>;
  ManyDestinyUnlockDefinition?: Maybe<Array<Maybe<DestinyUnlockDefinition>>>;
  DestinyReportReasonCategoryDefinition?: Maybe<DestinyReportReasonCategoryDefinition>;
  ManyDestinyReportReasonCategoryDefinition?: Maybe<
    Array<Maybe<DestinyReportReasonCategoryDefinition>>
  >;
  DestinyHistoricalStatsDefinition?: Maybe<DestinyHistoricalStatsDefinition>;
  ManyDestinyHistoricalStatsDefinition?: Maybe<
    Array<Maybe<DestinyHistoricalStatsDefinition>>
  >;
};

export type QueryDestinyProgressionDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyProgressionDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyInventoryItemDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyInventoryItemDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyInventoryBucketDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyInventoryBucketDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyItemTierTypeDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyItemTierTypeDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyStatDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyStatDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyStatGroupDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyStatGroupDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyEquipmentSlotDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyEquipmentSlotDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyVendorDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyVendorDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinySocketTypeDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinySocketTypeDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinySocketCategoryDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinySocketCategoryDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyDestinationDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyDestinationDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyActivityGraphDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyActivityGraphDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyActivityDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyActivityDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyActivityModifierDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyActivityModifierDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyObjectiveDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyObjectiveDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinySandboxPerkDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinySandboxPerkDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyLocationDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyLocationDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyActivityModeDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyActivityModeDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyPlaceDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyPlaceDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyActivityTypeDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyActivityTypeDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyVendorGroupDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyVendorGroupDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyFactionDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyFactionDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyArtifactDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyArtifactDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyPowerCapDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyPowerCapDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyProgressionLevelRequirementDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyProgressionLevelRequirementDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyRewardSourceDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyRewardSourceDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyTraitDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyTraitDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyTraitCategoryDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyTraitCategoryDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyPresentationNodeDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyPresentationNodeDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyCollectibleDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyCollectibleDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyMaterialRequirementSetDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyMaterialRequirementSetDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyRecordDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyRecordDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyGenderDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyGenderDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyLoreDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyLoreDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyMetricDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyMetricDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyEnergyTypeDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyEnergyTypeDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyPlugSetDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyPlugSetDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyTalentGridDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyTalentGridDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyDamageTypeDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyDamageTypeDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyItemCategoryDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyItemCategoryDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyBreakerTypeDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyBreakerTypeDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinySeasonDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinySeasonDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinySeasonPassDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinySeasonPassDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyChecklistDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyChecklistDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyRaceDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyRaceDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyClassDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyClassDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyMilestoneDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyMilestoneDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyUnlockDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyUnlockDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyReportReasonCategoryDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyReportReasonCategoryDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryDestinyHistoricalStatsDefinitionArgs = {
  hash?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
};

export type QueryManyDestinyHistoricalStatsDefinitionArgs = {
  hashes?: Maybe<Array<Maybe<Scalars["String"]>>>;
  version?: Maybe<Scalars["String"]>;
};

export type SchemaRecordStateBlock = {
  __typename?: "SchemaRecordStateBlock";
  featuredPriority?: Maybe<Scalars["Int"]>;
  obscuredString?: Maybe<Scalars["String"]>;
};

export type DisplayableItemFragment = {
  __typename?: "DestinyInventoryItemDefinition";
  hash?: Maybe<number>;
  itemTypeAndTierDisplayName?: Maybe<string>;
  displayProperties?: Maybe<{
    __typename?: "DestinyDisplayPropertiesDefinition";
    name?: Maybe<string>;
    icon?: Maybe<string>;
  }>;
};

export type RandomItemFragment = {
  __typename?: "DestinyInventoryItemDefinition";
} & DisplayableItemFragment;

export type ItemPageQueryVariables = Exact<{
  version?: Maybe<Scalars["String"]>;
  hash?: Maybe<Scalars["String"]>;
}>;

export type ItemPageQuery = {
  __typename?: "Query";
  item?: Maybe<
    {
      __typename?: "DestinyInventoryItemDefinition";
      collectible?: Maybe<{
        __typename?: "DestinyCollectibleDefinition";
        sourceString?: Maybe<string>;
      }>;
      sockets?: Maybe<{
        __typename?: "DestinyItemSocketBlockDefinition";
        socketEntries?: Maybe<
          Array<
            Maybe<{
              __typename?: "DestinyItemSocketEntryDefinition";
              singleInitialItem?: Maybe<{
                __typename?: "DestinyInventoryItemDefinition";
                displayProperties?: Maybe<{
                  __typename?: "DestinyDisplayPropertiesDefinition";
                  name?: Maybe<string>;
                  icon?: Maybe<string>;
                }>;
              }>;
              randomizedPlugSet?: Maybe<{
                __typename?: "DestinyPlugSetDefinition";
                reusablePlugItems?: Maybe<
                  Array<
                    Maybe<{
                      __typename?: "DestinyItemSocketEntryPlugItemRandomizedDefinition";
                      plugItem?: Maybe<
                        {
                          __typename?: "DestinyInventoryItemDefinition";
                        } & RandomItemFragment
                      >;
                    }>
                  >
                >;
              }>;
            }>
          >
        >;
      }>;
    } & DisplayableItemFragment
  >;
};
