import {
  AllDestinyManifestComponents,
  DestinyUnlockDefinition,
  DestinyDisplayPropertiesDefinition,
  DestinyPlaceDefinition,
  DestinyActivityDefinition,
  DestinyActivityTypeDefinition,
  DestinyClassDefinition,
  DestinyGenderDefinition,
  DestinyInventoryBucketDefinition,
  DestinyRaceDefinition,
  DestinyTalentGridDefinition,
  DestinyMaterialRequirementSetDefinition,
  DestinySandboxPerkDefinition,
  DestinyStatGroupDefinition,
  DestinyProgressionMappingDefinition,
  DestinyFactionDefinition,
  DestinyVendorGroupDefinition,
  DestinyRewardSourceDefinition,
  DestinyUnlockValueDefinition,
  DestinyItemCategoryDefinition,
  DestinyDamageTypeDefinition,
  DestinyActivityModeDefinition,
  DestinyActivityGraphDefinition,
  DestinyCollectibleDefinition,
  DestinyStatDefinition,
  DestinyItemTierTypeDefinition,
  DestinyMetricDefinition,
  DestinyPlugSetDefinition,
  DestinyPowerCapDefinition,
  DestinyPresentationNodeDefinition,
  DestinyRecordDefinition,
  DestinyDestinationDefinition,
  DestinyEquipmentSlotDefinition,
  DestinyInventoryItemDefinition,
  DestinyLocationDefinition,
  DestinyLoreDefinition,
  DestinyObjectiveDefinition,
  DestinyProgressionDefinition,
  DestinyProgressionLevelRequirementDefinition,
  DestinySeasonDefinition,
  DestinySeasonPassDefinition,
  DestinySocketCategoryDefinition,
  DestinySocketTypeDefinition,
  DestinyTraitDefinition,
  DestinyTraitCategoryDefinition,
  DestinyVendorDefinition,
  DestinyMilestoneDefinition,
  DestinyActivityModifierDefinition,
  DestinyReportReasonCategoryDefinition,
  DestinyArtifactDefinition,
  DestinyBreakerTypeDefinition,
  DestinyChecklistDefinition,
  DestinyEnergyTypeDefinition,
} from "bungie-api-ts/destiny2";

export interface Breadcrumb {
  label: string;
  to: string;
}

export interface PageProps extends Record<string, any> {
  breadcrumbs?: Breadcrumb[];
}

export interface ManifestVersion {
  id: string;
  version: string;
  s3Key: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DefinitionDiff {
  removed: number[];
  added: number[];
  unclassified: number[];
  reclassified: number[];
}

export type DiffGroup = Record<ItemCategory, number[]>;

export type PossiblyGroupedDiff = {
  removed: DiffGroup | number[];
  added: DiffGroup | number[];
  unclassified: DiffGroup | number[];
  reclassified: DiffGroup | number[];
};

export type AllDefinitionDiffs = {
  [name: string]: DefinitionDiff;
};

export type VersionDiffCounts = (Record<keyof DefinitionDiff, number> & {
  tableName: string;
})[];

export type DiffsByVersion = { [id: string]: AllDefinitionDiffs | undefined };

export type AnyDefinitionTable = AllDestinyManifestComponentsTagged[keyof AllDestinyManifestComponentsTagged];
export type AnyDefinition = AnyDefinitionTable[keyof AnyDefinitionTable];

export interface BareDestinyDefinition {
  hash: DestinyUnlockDefinition["hash"];
  displayProperties?: DestinyDisplayPropertiesDefinition;
}

export enum ItemCategory {
  Weapon = "Weapon",
  Armor = "Armor",
  Ghost = "Ghost",
  Quests = "Quests",
  Bounty = "Bounty",
  Emote = "Emote",
  Emblem = "Emblem",
  Vehicle = "Vehicle",
  Ornament = "Ornament",
  Finisher = "Finisher",
  Shader = "Shader",
  Mods = "Mods",
  Material = "Material",
  Consumable = "Consumable",
  Engram = "Engram",
  WeaponPerk = "Weapon Perk",
  TransmatEffect = "Transmat effect",
  GhostProjection = "Ghost Projection",
  Eververse = "Eververse",
  Other = "Other",
}

export const ItemCategoryValues: string[] = Object.values(ItemCategory);

export type BasicDefinitionTable = {
  [hash: number]: BareDestinyDefinition | null;
};

export type DestinyPlaceDefinitionTagged = DestinyPlaceDefinition & {
  __type: "DestinyPlaceDefinition";
};
export type DestinyActivityDefinitionTagged = DestinyActivityDefinition & {
  __type: "DestinyActivityDefinition";
};
export type DestinyActivityTypeDefinitionTagged = DestinyActivityTypeDefinition & {
  __type: "DestinyActivityTypeDefinition";
};
export type DestinyClassDefinitionTagged = DestinyClassDefinition & {
  __type: "DestinyClassDefinition";
};
export type DestinyGenderDefinitionTagged = DestinyGenderDefinition & {
  __type: "DestinyGenderDefinition";
};
export type DestinyInventoryBucketDefinitionTagged = DestinyInventoryBucketDefinition & {
  __type: "DestinyInventoryBucketDefinition";
};
export type DestinyRaceDefinitionTagged = DestinyRaceDefinition & {
  __type: "DestinyRaceDefinition";
};
export type DestinyTalentGridDefinitionTagged = DestinyTalentGridDefinition & {
  __type: "DestinyTalentGridDefinition";
};
export type DestinyUnlockDefinitionTagged = DestinyUnlockDefinition & {
  __type: "DestinyUnlockDefinition";
};
export type DestinyMaterialRequirementSetDefinitionTagged = DestinyMaterialRequirementSetDefinition & {
  __type: "DestinyMaterialRequirementSetDefinition";
};
export type DestinySandboxPerkDefinitionTagged = DestinySandboxPerkDefinition & {
  __type: "DestinySandboxPerkDefinition";
};
export type DestinyStatGroupDefinitionTagged = DestinyStatGroupDefinition & {
  __type: "DestinyStatGroupDefinition";
};
export type DestinyProgressionMappingDefinitionTagged = DestinyProgressionMappingDefinition & {
  __type: "DestinyProgressionMappingDefinition";
};
export type DestinyFactionDefinitionTagged = DestinyFactionDefinition & {
  __type: "DestinyFactionDefinition";
};
export type DestinyVendorGroupDefinitionTagged = DestinyVendorGroupDefinition & {
  __type: "DestinyVendorGroupDefinition";
};
export type DestinyRewardSourceDefinitionTagged = DestinyRewardSourceDefinition & {
  __type: "DestinyRewardSourceDefinition";
};
export type DestinyUnlockValueDefinitionTagged = DestinyUnlockValueDefinition & {
  __type: "DestinyUnlockValueDefinition";
};
export type DestinyItemCategoryDefinitionTagged = DestinyItemCategoryDefinition & {
  __type: "DestinyItemCategoryDefinition";
};
export type DestinyDamageTypeDefinitionTagged = DestinyDamageTypeDefinition & {
  __type: "DestinyDamageTypeDefinition";
};
export type DestinyActivityModeDefinitionTagged = DestinyActivityModeDefinition & {
  __type: "DestinyActivityModeDefinition";
};
export type DestinyActivityGraphDefinitionTagged = DestinyActivityGraphDefinition & {
  __type: "DestinyActivityGraphDefinition";
};
export type DestinyCollectibleDefinitionTagged = DestinyCollectibleDefinition & {
  __type: "DestinyCollectibleDefinition";
};
export type DestinyStatDefinitionTagged = DestinyStatDefinition & {
  __type: "DestinyStatDefinition";
};
export type DestinyItemTierTypeDefinitionTagged = DestinyItemTierTypeDefinition & {
  __type: "DestinyItemTierTypeDefinition";
};
export type DestinyMetricDefinitionTagged = DestinyMetricDefinition & {
  __type: "DestinyMetricDefinition";
};
export type DestinyPlugSetDefinitionTagged = DestinyPlugSetDefinition & {
  __type: "DestinyPlugSetDefinition";
};
export type DestinyPowerCapDefinitionTagged = DestinyPowerCapDefinition & {
  __type: "DestinyPowerCapDefinition";
};
export type DestinyPresentationNodeDefinitionTagged = DestinyPresentationNodeDefinition & {
  __type: "DestinyPresentationNodeDefinition";
};
export type DestinyRecordDefinitionTagged = DestinyRecordDefinition & {
  __type: "DestinyRecordDefinition";
};
export type DestinyDestinationDefinitionTagged = DestinyDestinationDefinition & {
  __type: "DestinyDestinationDefinition";
};
export type DestinyEquipmentSlotDefinitionTagged = DestinyEquipmentSlotDefinition & {
  __type: "DestinyEquipmentSlotDefinition";
};
export type DestinyInventoryItemDefinitionTagged = DestinyInventoryItemDefinition & {
  __type: "DestinyInventoryItemDefinition";
};
export type DestinyLocationDefinitionTagged = DestinyLocationDefinition & {
  __type: "DestinyLocationDefinition";
};
export type DestinyLoreDefinitionTagged = DestinyLoreDefinition & {
  __type: "DestinyLoreDefinition";
};
export type DestinyObjectiveDefinitionTagged = DestinyObjectiveDefinition & {
  __type: "DestinyObjectiveDefinition";
};
export type DestinyProgressionDefinitionTagged = DestinyProgressionDefinition & {
  __type: "DestinyProgressionDefinition";
};
export type DestinyProgressionLevelRequirementDefinitionTagged = DestinyProgressionLevelRequirementDefinition & {
  __type: "DestinyProgressionLevelRequirementDefinition";
};
export type DestinySeasonDefinitionTagged = DestinySeasonDefinition & {
  __type: "DestinySeasonDefinition";
};
export type DestinySeasonPassDefinitionTagged = DestinySeasonPassDefinition & {
  __type: "DestinySeasonPassDefinition";
};
export type DestinySocketCategoryDefinitionTagged = DestinySocketCategoryDefinition & {
  __type: "DestinySocketCategoryDefinition";
};
export type DestinySocketTypeDefinitionTagged = DestinySocketTypeDefinition & {
  __type: "DestinySocketTypeDefinition";
};
export type DestinyTraitDefinitionTagged = DestinyTraitDefinition & {
  __type: "DestinyTraitDefinition";
};
export type DestinyTraitCategoryDefinitionTagged = DestinyTraitCategoryDefinition & {
  __type: "DestinyTraitCategoryDefinition";
};
export type DestinyVendorDefinitionTagged = DestinyVendorDefinition & {
  __type: "DestinyVendorDefinition";
};
export type DestinyMilestoneDefinitionTagged = DestinyMilestoneDefinition & {
  __type: "DestinyMilestoneDefinition";
};
export type DestinyActivityModifierDefinitionTagged = DestinyActivityModifierDefinition & {
  __type: "DestinyActivityModifierDefinition";
};
export type DestinyReportReasonCategoryDefinitionTagged = DestinyReportReasonCategoryDefinition & {
  __type: "DestinyReportReasonCategoryDefinition";
};
export type DestinyArtifactDefinitionTagged = DestinyArtifactDefinition & {
  __type: "DestinyArtifactDefinition";
};
export type DestinyBreakerTypeDefinitionTagged = DestinyBreakerTypeDefinition & {
  __type: "DestinyBreakerTypeDefinition";
};
export type DestinyChecklistDefinitionTagged = DestinyChecklistDefinition & {
  __type: "DestinyChecklistDefinition";
};
export type DestinyEnergyTypeDefinitionTagged = DestinyEnergyTypeDefinition & {
  __type: "DestinyEnergyTypeDefinition";
};

export interface AllDestinyManifestComponentsTagged {
  DestinyPlaceDefinition: {
    [hash: string]: DestinyPlaceDefinitionTagged;
  };
  DestinyActivityDefinition: {
    [hash: string]: DestinyActivityDefinitionTagged;
  };
  DestinyActivityTypeDefinition: {
    [hash: string]: DestinyActivityTypeDefinitionTagged;
  };
  DestinyClassDefinition: {
    [hash: string]: DestinyClassDefinitionTagged;
  };
  DestinyGenderDefinition: {
    [hash: string]: DestinyGenderDefinitionTagged;
  };
  DestinyInventoryBucketDefinition: {
    [hash: string]: DestinyInventoryBucketDefinitionTagged;
  };
  DestinyRaceDefinition: {
    [hash: string]: DestinyRaceDefinitionTagged;
  };
  DestinyTalentGridDefinition: {
    [hash: string]: DestinyTalentGridDefinitionTagged;
  };
  DestinyUnlockDefinition: {
    [hash: string]: DestinyUnlockDefinitionTagged;
  };
  DestinyMaterialRequirementSetDefinition: {
    [hash: string]: DestinyMaterialRequirementSetDefinitionTagged;
  };
  DestinySandboxPerkDefinition: {
    [hash: string]: DestinySandboxPerkDefinitionTagged;
  };
  DestinyStatGroupDefinition: {
    [hash: string]: DestinyStatGroupDefinitionTagged;
  };
  DestinyProgressionMappingDefinition: {
    [hash: string]: DestinyProgressionMappingDefinitionTagged;
  };
  DestinyFactionDefinition: {
    [hash: string]: DestinyFactionDefinitionTagged;
  };
  DestinyVendorGroupDefinition: {
    [hash: string]: DestinyVendorGroupDefinitionTagged;
  };
  DestinyRewardSourceDefinition: {
    [hash: string]: DestinyRewardSourceDefinitionTagged;
  };
  DestinyUnlockValueDefinition: {
    [hash: string]: DestinyUnlockValueDefinitionTagged;
  };
  DestinyItemCategoryDefinition: {
    [hash: string]: DestinyItemCategoryDefinitionTagged;
  };
  DestinyDamageTypeDefinition: {
    [hash: string]: DestinyDamageTypeDefinitionTagged;
  };
  DestinyActivityModeDefinition: {
    [hash: string]: DestinyActivityModeDefinitionTagged;
  };
  DestinyActivityGraphDefinition: {
    [hash: string]: DestinyActivityGraphDefinitionTagged;
  };
  DestinyCollectibleDefinition: {
    [hash: string]: DestinyCollectibleDefinitionTagged;
  };
  DestinyStatDefinition: {
    [hash: string]: DestinyStatDefinitionTagged;
  };
  DestinyItemTierTypeDefinition: {
    [hash: string]: DestinyItemTierTypeDefinitionTagged;
  };
  DestinyMetricDefinition: {
    [hash: string]: DestinyMetricDefinitionTagged;
  };
  DestinyPlugSetDefinition: {
    [hash: string]: DestinyPlugSetDefinitionTagged;
  };
  DestinyPowerCapDefinition: {
    [hash: string]: DestinyPowerCapDefinitionTagged;
  };
  DestinyPresentationNodeDefinition: {
    [hash: string]: DestinyPresentationNodeDefinitionTagged;
  };
  DestinyRecordDefinition: {
    [hash: string]: DestinyRecordDefinitionTagged;
  };
  DestinyDestinationDefinition: {
    [hash: string]: DestinyDestinationDefinitionTagged;
  };
  DestinyEquipmentSlotDefinition: {
    [hash: string]: DestinyEquipmentSlotDefinitionTagged;
  };
  DestinyInventoryItemDefinition: {
    [hash: string]: DestinyInventoryItemDefinitionTagged;
  };
  DestinyLocationDefinition: {
    [hash: string]: DestinyLocationDefinitionTagged;
  };
  DestinyLoreDefinition: {
    [hash: string]: DestinyLoreDefinitionTagged;
  };
  DestinyObjectiveDefinition: {
    [hash: string]: DestinyObjectiveDefinitionTagged;
  };
  DestinyProgressionDefinition: {
    [hash: string]: DestinyProgressionDefinitionTagged;
  };
  DestinyProgressionLevelRequirementDefinition: {
    [hash: string]: DestinyProgressionLevelRequirementDefinitionTagged;
  };
  DestinySeasonDefinition: {
    [hash: string]: DestinySeasonDefinitionTagged;
  };
  DestinySeasonPassDefinition: {
    [hash: string]: DestinySeasonPassDefinitionTagged;
  };
  DestinySocketCategoryDefinition: {
    [hash: string]: DestinySocketCategoryDefinitionTagged;
  };
  DestinySocketTypeDefinition: {
    [hash: string]: DestinySocketTypeDefinitionTagged;
  };
  DestinyTraitDefinition: {
    [hash: string]: DestinyTraitDefinitionTagged;
  };
  DestinyTraitCategoryDefinition: {
    [hash: string]: DestinyTraitCategoryDefinitionTagged;
  };
  DestinyVendorDefinition: {
    [hash: string]: DestinyVendorDefinitionTagged;
  };
  DestinyMilestoneDefinition: {
    [hash: string]: DestinyMilestoneDefinitionTagged;
  };
  DestinyActivityModifierDefinition: {
    [hash: string]: DestinyActivityModifierDefinitionTagged;
  };
  DestinyReportReasonCategoryDefinition: {
    [hash: string]: DestinyReportReasonCategoryDefinitionTagged;
  };
  DestinyArtifactDefinition: {
    [hash: string]: DestinyArtifactDefinitionTagged;
  };
  DestinyBreakerTypeDefinition: {
    [hash: string]: DestinyBreakerTypeDefinitionTagged;
  };
  DestinyChecklistDefinition: {
    [hash: string]: DestinyChecklistDefinitionTagged;
  };
  DestinyEnergyTypeDefinition: {
    [hash: string]: DestinyEnergyTypeDefinitionTagged;
  };
}
